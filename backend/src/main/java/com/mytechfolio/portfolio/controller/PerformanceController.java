package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.service.PerformanceMonitoringService;
import com.mytechfolio.portfolio.util.PerformanceMetrics;
import com.mytechfolio.portfolio.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for performance monitoring.
 * Provides endpoints for viewing performance metrics and statistics.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH + "/performance")
@Tag(name = "Performance", description = "Performance monitoring and metrics API")
@RequiredArgsConstructor
public class PerformanceController {
    
    private final PerformanceMonitoringService performanceMonitoringService;
    
    /**
     * Gets performance statistics.
     * 
     * @return Performance statistics
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get performance statistics", 
               description = "Returns overall performance statistics including average response times and slow queries")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<PerformanceMonitoringService.PerformanceStatistics>> getStatistics() {
        PerformanceMonitoringService.PerformanceStatistics statistics = 
                performanceMonitoringService.getStatistics();
        return ResponseUtil.ok(statistics);
    }
    
    /**
     * Gets average response time for an endpoint.
     * 
     * @param endpoint Endpoint path
     * @return Average response time in milliseconds
     */
    @GetMapping("/endpoint/{endpoint}/average-time")
    @Operation(summary = "Get average response time for endpoint", 
               description = "Returns average response time for a specific endpoint")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<Long>> getAverageResponseTime(
            @Parameter(description = "Endpoint path", required = true, example = "/api/v1/projects")
            @PathVariable String endpoint) {
        Long averageTime = performanceMonitoringService.getAverageResponseTime(endpoint);
        return ResponseUtil.ok(averageTime != null ? averageTime : 0L);
    }
    
    /**
     * Gets slow queries.
     * 
     * @return List of slow query metrics
     */
    @GetMapping("/slow-queries")
    @Operation(summary = "Get slow queries", 
               description = "Returns list of queries that exceeded the performance threshold")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<List<PerformanceMetrics>>> getSlowQueries() {
        List<PerformanceMetrics> slowQueries = performanceMonitoringService.getSlowQueries();
        return ResponseUtil.ok(slowQueries);
    }
    
    /**
     * Gets recent performance metrics.
     * 
     * @param count Number of recent metrics to return (default: 50)
     * @return List of recent metrics
     */
    @GetMapping("/recent")
    @Operation(summary = "Get recent performance metrics", 
               description = "Returns recent performance metrics for monitoring")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<List<PerformanceMetrics>>> getRecentMetrics(
            @Parameter(description = "Number of recent metrics to return", example = "50")
            @RequestParam(defaultValue = "50") int count) {
        List<PerformanceMetrics> metrics = performanceMonitoringService.getRecentMetrics(count);
        return ResponseUtil.ok(metrics);
    }
}

