package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.util.PerformanceMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.Collectors;

/**
 * Service for performance monitoring and metrics collection.
 * Tracks API response times, slow queries, and performance metrics.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PerformanceMonitoringService {
    
    // In-memory storage for metrics (in production, use time-series database)
    private final ConcurrentLinkedQueue<PerformanceMetrics> metricsQueue = new ConcurrentLinkedQueue<>();
    private final ConcurrentHashMap<String, Long> endpointAverageTimes = new ConcurrentHashMap<>();
    
    @Value("${app.performance.slow-query-threshold-ms:1000}")
    private long slowQueryThresholdMs;
    
    @Value("${app.performance.metrics-retention-count:1000}")
    private int metricsRetentionCount;
    
    /**
     * Records performance metrics for an API endpoint.
     * 
     * @param metrics Performance metrics
     */
    @Async
    public void recordMetrics(PerformanceMetrics metrics) {
        try {
            // Add to queue
            metricsQueue.offer(metrics);
            
            // Maintain queue size
            while (metricsQueue.size() > metricsRetentionCount) {
                metricsQueue.poll();
            }
            
            // Update average response time for endpoint
            updateAverageResponseTime(metrics);
            
            // Log slow queries
            if (metrics.isSlow(slowQueryThresholdMs)) {
                log.warn("Slow query detected: {} {} took {}ms (threshold: {}ms)", 
                    metrics.getMethod(), 
                    metrics.getEndpoint(), 
                    metrics.getResponseTimeMs(),
                    slowQueryThresholdMs);
            }
            
            log.debug("Performance metric recorded: {} {} - {}ms", 
                metrics.getMethod(), 
                metrics.getEndpoint(), 
                metrics.getResponseTimeMs());
        } catch (Exception e) {
            log.error("Failed to record performance metrics: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Gets average response time for an endpoint.
     * 
     * @param endpoint Endpoint path
     * @return Average response time in milliseconds, or null if no data
     */
    public Long getAverageResponseTime(String endpoint) {
        return endpointAverageTimes.get(endpoint);
    }
    
    /**
     * Gets slow queries (queries exceeding threshold).
     * 
     * @return List of slow query metrics
     */
    public List<PerformanceMetrics> getSlowQueries() {
        return metricsQueue.stream()
                .filter(m -> m.isSlow(slowQueryThresholdMs))
                .collect(Collectors.toList());
    }
    
    /**
     * Gets recent performance metrics.
     * 
     * @param count Number of recent metrics to return
     * @return List of recent metrics
     */
    public List<PerformanceMetrics> getRecentMetrics(int count) {
        return metricsQueue.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(count)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets performance statistics.
     * 
     * @return Performance statistics summary
     */
    public PerformanceStatistics getStatistics() {
        if (metricsQueue.isEmpty()) {
            return PerformanceStatistics.empty();
        }
        
        List<PerformanceMetrics> metrics = List.copyOf(metricsQueue);
        
        long totalRequests = metrics.size();
        long totalResponseTime = metrics.stream()
                .mapToLong(PerformanceMetrics::getResponseTimeMs)
                .sum();
        long averageResponseTime = totalResponseTime / totalRequests;
        
        long minResponseTime = metrics.stream()
                .mapToLong(PerformanceMetrics::getResponseTimeMs)
                .min()
                .orElse(0);
        
        long maxResponseTime = metrics.stream()
                .mapToLong(PerformanceMetrics::getResponseTimeMs)
                .max()
                .orElse(0);
        
        long slowQueries = metrics.stream()
                .filter(m -> m.isSlow(slowQueryThresholdMs))
                .count();
        
        return PerformanceStatistics.builder()
                .totalRequests(totalRequests)
                .averageResponseTimeMs(averageResponseTime)
                .minResponseTimeMs(minResponseTime)
                .maxResponseTimeMs(maxResponseTime)
                .slowQueriesCount(slowQueries)
                .slowQueryThresholdMs(slowQueryThresholdMs)
                .lastUpdated(LocalDateTime.now())
                .build();
    }
    
    /**
     * Updates average response time for an endpoint.
     */
    private void updateAverageResponseTime(PerformanceMetrics metrics) {
        String key = metrics.getMethod() + " " + metrics.getEndpoint();
        endpointAverageTimes.compute(key, (k, v) -> {
            if (v == null) {
                return metrics.getResponseTimeMs();
            }
            // Simple moving average (could be improved with exponential moving average)
            return (v + metrics.getResponseTimeMs()) / 2;
        });
    }
    
    /**
     * Performance statistics summary.
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class PerformanceStatistics {
        private long totalRequests;
        private long averageResponseTimeMs;
        private long minResponseTimeMs;
        private long maxResponseTimeMs;
        private long slowQueriesCount;
        private long slowQueryThresholdMs;
        private LocalDateTime lastUpdated;
        
        public static PerformanceStatistics empty() {
            return PerformanceStatistics.builder()
                    .totalRequests(0)
                    .averageResponseTimeMs(0)
                    .minResponseTimeMs(0)
                    .maxResponseTimeMs(0)
                    .slowQueriesCount(0)
                    .lastUpdated(LocalDateTime.now())
                    .build();
        }
    }
}

