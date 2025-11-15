package com.mytechfolio.portfolio.filter;

import com.mytechfolio.portfolio.service.PerformanceMonitoringService;
import com.mytechfolio.portfolio.util.PerformanceMetrics;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Filter for monitoring API performance.
 * Tracks response times and collects performance metrics.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Component
@Order(1) // Execute early in filter chain
@RequiredArgsConstructor
public class PerformanceMonitoringFilter implements Filter {
    
    private final PerformanceMonitoringService performanceMonitoringService;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (!(request instanceof HttpServletRequest) || !(response instanceof HttpServletResponse)) {
            chain.doFilter(request, response);
            return;
        }
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Skip monitoring for static resources and actuator endpoints
        String path = httpRequest.getRequestURI();
        if (path.startsWith("/actuator") || 
            path.startsWith("/swagger-ui") || 
            path.startsWith("/v3/api-docs") ||
            path.startsWith("/uploads")) {
            chain.doFilter(request, response);
            return;
        }
        
        long startTime = System.currentTimeMillis();
        
        try {
            chain.doFilter(request, response);
        } finally {
            long endTime = System.currentTimeMillis();
            long responseTime = endTime - startTime;
            
            // Record metrics asynchronously
            PerformanceMetrics metrics = PerformanceMetrics.builder()
                    .endpoint(path)
                    .method(httpRequest.getMethod())
                    .responseTimeMs(responseTime)
                    .statusCode(httpResponse.getStatus())
                    .timestamp(LocalDateTime.now())
                    .ipAddress(getClientIpAddress(httpRequest))
                    .build();
            
            performanceMonitoringService.recordMetrics(metrics);
        }
    }
    
    /**
     * Gets client IP address from request.
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}

