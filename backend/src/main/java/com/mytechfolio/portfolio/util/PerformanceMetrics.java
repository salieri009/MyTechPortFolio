package com.mytechfolio.portfolio.util;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Performance metrics data class.
 * Stores performance metrics for API endpoints and operations.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceMetrics {
    
    private String endpoint;
    private String method;
    private long responseTimeMs;
    private int statusCode;
    private LocalDateTime timestamp;
    private String userId; // Optional: for authenticated requests
    private String ipAddress; // Optional: client IP
    private long requestSize; // Request body size in bytes
    private long responseSize; // Response body size in bytes
    private boolean isSlowQuery; // Flag for slow queries (> threshold)
    
    /**
     * Checks if the request is considered slow.
     * 
     * @param thresholdMs Threshold in milliseconds
     * @return true if response time exceeds threshold
     */
    public boolean isSlow(long thresholdMs) {
        return responseTimeMs > thresholdMs;
    }
}

