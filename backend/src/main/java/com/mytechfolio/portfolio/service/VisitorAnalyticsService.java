package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.PageViewStatistics;
import com.mytechfolio.portfolio.domain.VisitorLog;
import com.mytechfolio.portfolio.domain.VisitorStatistics;
import com.mytechfolio.portfolio.domain.VisitorStatistics.StatisticsType;
import com.mytechfolio.portfolio.repository.PageViewStatisticsRepository;
import com.mytechfolio.portfolio.repository.VisitorLogRepository;
import com.mytechfolio.portfolio.repository.VisitorStatisticsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class VisitorAnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(VisitorAnalyticsService.class);

    private final VisitorLogRepository visitorLogRepository;
    private final PageViewStatisticsRepository pageViewStatisticsRepository;
    private final VisitorStatisticsRepository visitorStatisticsRepository;

    @Autowired
    public VisitorAnalyticsService(VisitorLogRepository visitorLogRepository,
                                   PageViewStatisticsRepository pageViewStatisticsRepository,
                                   VisitorStatisticsRepository visitorStatisticsRepository) {
        this.visitorLogRepository = visitorLogRepository;
        this.pageViewStatisticsRepository = pageViewStatisticsRepository;
        this.visitorStatisticsRepository = visitorStatisticsRepository;
    }

    /**
     * Get daily visitor statistics for a date range
     */
    public List<VisitorStatistics> getDailyStatistics(LocalDate startDate, LocalDate endDate) {
        return visitorStatisticsRepository.getDailyStatistics(startDate, endDate);
    }

    /**
     * Get monthly visitor statistics for a date range
     */
    public List<VisitorStatistics> getMonthlyStatistics(LocalDate startDate, LocalDate endDate) {
        return visitorStatisticsRepository.getMonthlyStatistics(startDate, endDate);
    }

    /**
     * Get visitor statistics by country
     */
    public List<VisitorStatistics> getVisitorsByCountry(LocalDate startDate, LocalDate endDate) {
        return visitorStatisticsRepository.getTopCountries(startDate, endDate);
    }

    /**
     * Get visitor statistics by city
     */
    public List<VisitorStatistics> getVisitorsByCity(LocalDate startDate, LocalDate endDate) {
        return visitorStatisticsRepository.getTopCities(startDate, endDate);
    }

    /**
     * Get hourly visitor distribution for a specific date
     */
    public List<VisitorStatistics> getHourlyDistribution(LocalDate date) {
        return visitorStatisticsRepository.getHourlyDistribution(date);
    }

    /**
     * Get most popular pages by views
     */
    public List<PageViewStatistics> getMostPopularPages(LocalDate startDate, LocalDate endDate) {
        return pageViewStatisticsRepository.findMostPopularPagesByViews(startDate, endDate);
    }

    /**
     * Get most popular pages by unique visitors
     */
    public List<PageViewStatistics> getMostPopularPagesByUniqueVisitors(LocalDate startDate, LocalDate endDate) {
        return pageViewStatisticsRepository.findMostPopularPagesByUniqueVisitors(startDate, endDate);
    }

    /**
     * Get page performance summary
     */
    public List<Map<String, Object>> getPagePerformanceSummary(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = pageViewStatisticsRepository.getPagePerformanceSummary(startDate, endDate);
        
        return results.stream().map(row -> {
            Map<String, Object> pageData = new HashMap<>();
            pageData.put("pagePath", row[0]);
            pageData.put("totalViews", row[1]);
            pageData.put("uniqueVisitors", row[2]);
            pageData.put("averageBounceRate", row[3]);
            pageData.put("averageDuration", row[4]);
            return pageData;
        }).collect(Collectors.toList());
    }

    /**
     * Get visitor growth trend
     */
    public List<Map<String, Object>> getVisitorGrowthTrend(StatisticsType type, LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = visitorStatisticsRepository.getVisitorGrowthTrend(type, startDate, endDate);
        
        return results.stream().map(row -> {
            Map<String, Object> trendData = new HashMap<>();
            trendData.put("date", row[0]);
            trendData.put("totalVisitors", row[1]);
            trendData.put("uniqueVisitors", row[2]);
            return trendData;
        }).collect(Collectors.toList());
    }

    /**
     * Get dashboard summary
     */
    public Map<String, Object> getDashboardSummary(LocalDate startDate, LocalDate endDate) {
        Object[] result = visitorStatisticsRepository.getDashboardSummary(startDate, endDate);
        
        Map<String, Object> summary = new HashMap<>();
        if (result != null && result.length >= 7) {
            summary.put("totalVisitors", result[0] != null ? result[0] : 0L);
            summary.put("uniqueVisitors", result[1] != null ? result[1] : 0L);
            summary.put("totalPageViews", result[2] != null ? result[2] : 0L);
            summary.put("averageBounceRate", result[3] != null ? result[3] : 0.0);
            summary.put("averageSessionDuration", result[4] != null ? result[4] : 0.0);
            summary.put("newVisitors", result[5] != null ? result[5] : 0L);
            summary.put("returningVisitors", result[6] != null ? result[6] : 0L);
        } else {
            // Return empty statistics if no data
            summary.put("totalVisitors", 0L);
            summary.put("uniqueVisitors", 0L);
            summary.put("totalPageViews", 0L);
            summary.put("averageBounceRate", 0.0);
            summary.put("averageSessionDuration", 0.0);
            summary.put("newVisitors", 0L);
            summary.put("returningVisitors", 0L);
        }
        
        return summary;
    }

    /**
     * Get comparison with previous period
     */
    public Map<String, Object> getComparisonWithPreviousPeriod(LocalDate currentStartDate, LocalDate currentEndDate) {
        long periodDays = ChronoUnit.DAYS.between(currentStartDate, currentEndDate);
        LocalDate previousStartDate = currentStartDate.minusDays(periodDays + 1);
        LocalDate previousEndDate = currentStartDate.minusDays(1);

        Object[] result = visitorStatisticsRepository.getComparisonWithPreviousPeriod(
            currentStartDate, currentEndDate, previousStartDate, previousEndDate);

        Map<String, Object> comparison = new HashMap<>();
        if (result != null && result.length >= 4) {
            Long currentVisitors = result[0] != null ? (Long) result[0] : 0L;
            Long previousVisitors = result[1] != null ? (Long) result[1] : 0L;
            Long currentUniqueVisitors = result[2] != null ? (Long) result[2] : 0L;
            Long previousUniqueVisitors = result[3] != null ? (Long) result[3] : 0L;

            comparison.put("currentPeriod", Map.of(
                "totalVisitors", currentVisitors,
                "uniqueVisitors", currentUniqueVisitors
            ));
            
            comparison.put("previousPeriod", Map.of(
                "totalVisitors", previousVisitors,
                "uniqueVisitors", previousUniqueVisitors
            ));

            // Calculate growth rates
            double visitorGrowthRate = previousVisitors > 0 ? 
                ((double) (currentVisitors - previousVisitors) / previousVisitors) * 100 : 
                (currentVisitors > 0 ? 100.0 : 0.0);
                
            double uniqueVisitorGrowthRate = previousUniqueVisitors > 0 ? 
                ((double) (currentUniqueVisitors - previousUniqueVisitors) / previousUniqueVisitors) * 100 : 
                (currentUniqueVisitors > 0 ? 100.0 : 0.0);

            comparison.put("growthRates", Map.of(
                "totalVisitors", visitorGrowthRate,
                "uniqueVisitors", uniqueVisitorGrowthRate
            ));
        }

        return comparison;
    }

    /**
     * Get peak hours analysis
     */
    public List<Map<String, Object>> getPeakHours(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = visitorStatisticsRepository.getPeakHours(startDate, endDate);
        
        return results.stream().map(row -> {
            Map<String, Object> hourData = new HashMap<>();
            hourData.put("hour", row[0]);
            hourData.put("totalVisitors", row[1]);
            return hourData;
        }).collect(Collectors.toList());
    }

    /**
     * Get referrer statistics
     */
    public List<Map<String, Object>> getReferrerStatistics(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<Object[]> results = visitorLogRepository.getReferrerStatistics(startDateTime, endDateTime);
        
        return results.stream().map(row -> {
            Map<String, Object> referrerData = new HashMap<>();
            referrerData.put("referrer", row[0]);
            referrerData.put("visits", row[1]);
            return referrerData;
        }).collect(Collectors.toList());
    }

    /**
     * Get user agent distribution
     */
    public List<Map<String, Object>> getUserAgentDistribution(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<Object[]> results = visitorLogRepository.getUserAgentDistribution(startDateTime, endDateTime);
        
        return results.stream().map(row -> {
            Map<String, Object> uaData = new HashMap<>();
            uaData.put("userAgent", row[0]);
            uaData.put("count", row[1]);
            return uaData;
        }).collect(Collectors.toList());
    }

    /**
     * Get countries with highest growth
     */
    public List<Map<String, Object>> getCountriesWithHighestGrowth(LocalDate currentStartDate, LocalDate currentEndDate) {
        long periodDays = ChronoUnit.DAYS.between(currentStartDate, currentEndDate);
        LocalDate previousStartDate = currentStartDate.minusDays(periodDays + 1);
        LocalDate previousEndDate = currentStartDate.minusDays(1);

        List<Object[]> results = visitorStatisticsRepository.getCountriesWithHighestGrowth(
            currentStartDate, currentEndDate, previousStartDate, previousEndDate);
        
        return results.stream().map(row -> {
            Map<String, Object> countryData = new HashMap<>();
            countryData.put("country", row[0]);
            countryData.put("currentVisitors", row[1]);
            countryData.put("previousVisitors", row[2]);
            countryData.put("growthRate", row[3]);
            return countryData;
        }).collect(Collectors.toList());
    }

    /**
     * Get trending pages
     */
    public List<Map<String, Object>> getTrendingPages(LocalDate currentStartDate, LocalDate currentEndDate) {
        long periodDays = ChronoUnit.DAYS.between(currentStartDate, currentEndDate);
        LocalDate previousStartDate = currentStartDate.minusDays(periodDays + 1);
        LocalDate previousEndDate = currentStartDate.minusDays(1);

        List<Object[]> results = pageViewStatisticsRepository.getTrendingPages(
            currentStartDate, currentEndDate, previousStartDate, previousEndDate);
        
        return results.stream().map(row -> {
            Map<String, Object> pageData = new HashMap<>();
            pageData.put("pagePath", row[0]);
            pageData.put("currentViews", row[1]);
            pageData.put("previousViews", row[2]);
            pageData.put("growthRate", row[3]);
            return pageData;
        }).collect(Collectors.toList());
    }

    /**
     * Get bounce rate analysis
     */
    public Map<String, Object> getBounceRateAnalysis(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        long totalSessions = visitorLogRepository.countTotalSessions(startDateTime, endDateTime);
        long bouncedSessions = visitorLogRepository.countBouncedSessions(startDateTime, endDateTime);
        
        double bounceRate = totalSessions > 0 ? ((double) bouncedSessions / totalSessions) * 100 : 0.0;
        
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalSessions", totalSessions);
        analysis.put("bouncedSessions", bouncedSessions);
        analysis.put("bounceRate", bounceRate);
        
        return analysis;
    }

    /**
     * Get session duration analysis
     */
    public Map<String, Object> getSessionDurationAnalysis(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        List<Object[]> sessionDurations = visitorLogRepository.getSessionDurations(startDateTime, endDateTime);
        
        List<Long> durations = new ArrayList<>();
        for (Object[] row : sessionDurations) {
            if (row[1] != null && row[2] != null) {
                LocalDateTime start = (LocalDateTime) row[1];
                LocalDateTime end = (LocalDateTime) row[2];
                long duration = ChronoUnit.SECONDS.between(start, end);
                if (duration > 0) {
                    durations.add(duration);
                }
            }
        }
        
        Map<String, Object> analysis = new HashMap<>();
        if (!durations.isEmpty()) {
            double avgDuration = durations.stream().mapToLong(Long::longValue).average().orElse(0.0);
            long maxDuration = durations.stream().mapToLong(Long::longValue).max().orElse(0L);
            long minDuration = durations.stream().mapToLong(Long::longValue).min().orElse(0L);
            
            analysis.put("averageDuration", avgDuration);
            analysis.put("maxDuration", maxDuration);
            analysis.put("minDuration", minDuration);
            analysis.put("totalSessions", durations.size());
        } else {
            analysis.put("averageDuration", 0.0);
            analysis.put("maxDuration", 0L);
            analysis.put("minDuration", 0L);
            analysis.put("totalSessions", 0);
        }
        
        return analysis;
    }

    /**
     * Get real-time statistics (last 24 hours)
     */
    public Map<String, Object> getRealTimeStatistics() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        
        return getDashboardSummary(yesterday, today);
    }

    /**
     * Get visitor retention analysis
     */
    public Map<String, Object> getVisitorRetentionAnalysis(LocalDate startDate, LocalDate endDate) {
        Object[] newVsReturning = visitorStatisticsRepository.getNewVsReturningVisitorsInPeriod(startDate, endDate);
        
        Map<String, Object> retention = new HashMap<>();
        if (newVsReturning != null && newVsReturning.length >= 2) {
            Long newVisitors = newVsReturning[0] != null ? (Long) newVsReturning[0] : 0L;
            Long returningVisitors = newVsReturning[1] != null ? (Long) newVsReturning[1] : 0L;
            Long totalVisitors = newVisitors + returningVisitors;
            
            double newVisitorRate = totalVisitors > 0 ? ((double) newVisitors / totalVisitors) * 100 : 0.0;
            double returningVisitorRate = totalVisitors > 0 ? ((double) returningVisitors / totalVisitors) * 100 : 0.0;
            
            retention.put("newVisitors", newVisitors);
            retention.put("returningVisitors", returningVisitors);
            retention.put("totalVisitors", totalVisitors);
            retention.put("newVisitorRate", newVisitorRate);
            retention.put("returningVisitorRate", returningVisitorRate);
        }
        
        return retention;
    }
}
