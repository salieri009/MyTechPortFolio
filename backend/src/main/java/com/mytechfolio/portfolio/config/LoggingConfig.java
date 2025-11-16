package com.mytechfolio.portfolio.config;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

/**
 * Logging configuration for structured logging.
 * Adds request ID to MDC for correlation across log entries.
 * Also tracks response time and adds it to response headers.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Component
@Order(0) // Execute first in filter chain
public class LoggingConfig extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-ID";
    private static final String REQUEST_ID_MDC_KEY = "requestId";
    private static final String REQUEST_START_TIME_KEY = "requestStartTime";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        // Skip for static resources and actuator endpoints
        String path = request.getRequestURI();
        if (path.startsWith("/actuator") || 
            path.startsWith("/swagger-ui") || 
            path.startsWith("/v3/api-docs") ||
            path.startsWith("/uploads")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        long startTime = System.currentTimeMillis();
        
        try {
            // Generate or use existing request ID
            String requestId = extractOrGenerateRequestId(request);
            
            // Add to MDC for logging
            MDC.put(REQUEST_ID_MDC_KEY, requestId);
            MDC.put(REQUEST_START_TIME_KEY, String.valueOf(startTime));
            
            // Add to response header for frontend correlation
            response.setHeader(REQUEST_ID_HEADER, requestId);
            
            filterChain.doFilter(request, response);
        } finally {
            // Calculate and add response time header
            long responseTime = System.currentTimeMillis() - startTime;
            response.setHeader("X-Response-Time", String.valueOf(responseTime));
            
            // Clean up MDC
            MDC.remove(REQUEST_ID_MDC_KEY);
            MDC.remove(REQUEST_START_TIME_KEY);
        }
    }
    
    /**
     * Extracts request ID from header or generates a new one.
     * 
     * @param request HTTP request
     * @return Request ID
     */
    private String extractOrGenerateRequestId(HttpServletRequest request) {
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        
        if (requestId == null || requestId.isBlank()) {
            // Generate new UUID if not provided
            requestId = UUID.randomUUID().toString();
            log.debug("Generated new request ID: {}", requestId);
        } else {
            log.debug("Using provided request ID: {}", requestId);
        }
        
        return requestId;
    }
}

