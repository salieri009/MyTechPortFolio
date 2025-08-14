package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.domain.PageViewStatistics;
import com.mytechfolio.portfolio.domain.VisitorStatistics;
import com.mytechfolio.portfolio.domain.VisitorStatistics.StatisticsType;
import com.mytechfolio.portfolio.service.StatisticsAggregationService;
import com.mytechfolio.portfolio.service.VisitorAnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);

    private final VisitorAnalyticsService analyticsService;
    private final StatisticsAggregationService aggregationService;

    @Autowired
    public AnalyticsController(VisitorAnalyticsService analyticsService,
                               StatisticsAggregationService aggregationService) {
        this.analyticsService = analyticsService;
        this.aggregationService = aggregationService;
    }

    /**
     * Get dashboard overview with key metrics
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            // Default to last 30 days if no dates provided
            if (endDate == null) endDate = LocalDate.now();
            if (startDate == null) startDate = endDate.minusDays(30);

            Map<String, Object> dashboard = new HashMap<>();
            
            // Basic statistics
            Map<String, Object> summary = analyticsService.getDashboardSummary(startDate, endDate);
            dashboard.put("summary", summary);
            
            // Period comparison
            Map<String, Object> comparison = analyticsService.getComparisonWithPreviousPeriod(startDate, endDate);
            dashboard.put("comparison", comparison);
            
            // Most popular pages (top 5)
            List<PageViewStatistics> popularPages = analyticsService.getMostPopularPages(startDate, endDate);
            dashboard.put("popularPages", popularPages.stream().limit(5).toList());
            
            // Top countries (top 5)
            List<VisitorStatistics> topCountries = analyticsService.getVisitorsByCountry(startDate, endDate);
            dashboard.put("topCountries", topCountries.stream().limit(5).toList());
            
            // Recent trend (last 7 days)
            List<Map<String, Object>> weeklyTrend = analyticsService.getVisitorGrowthTrend(
                StatisticsType.DAILY, endDate.minusDays(7), endDate);
            dashboard.put("weeklyTrend", weeklyTrend);
            
            // Bounce rate analysis
            Map<String, Object> bounceRateAnalysis = analyticsService.getBounceRateAnalysis(startDate, endDate);
            dashboard.put("bounceRateAnalysis", bounceRateAnalysis);
            
            dashboard.put("period", Map.of("startDate", startDate, "endDate", endDate));
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            logger.error("Failed to get dashboard data", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get daily visitor statistics
     */
    @GetMapping("/visitors/daily")
    public ResponseEntity<List<VisitorStatistics>> getDailyVisitors(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            List<VisitorStatistics> dailyStats = analyticsService.getDailyStatistics(startDate, endDate);
            return ResponseEntity.ok(dailyStats);
        } catch (Exception e) {
            logger.error("Failed to get daily visitor statistics", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get monthly visitor statistics
     */
    @GetMapping("/visitors/monthly")
    public ResponseEntity<List<VisitorStatistics>> getMonthlyVisitors(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            List<VisitorStatistics> monthlyStats = analyticsService.getMonthlyStatistics(startDate, endDate);
            return ResponseEntity.ok(monthlyStats);
        } catch (Exception e) {
            logger.error("Failed to get monthly visitor statistics", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get visitor statistics by country
     */
    @GetMapping("/visitors/countries")
    public ResponseEntity<List<VisitorStatistics>> getVisitorsByCountry(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "10") int limit) {

        try {
            List<VisitorStatistics> countryStats = analyticsService.getVisitorsByCountry(startDate, endDate);
            return ResponseEntity.ok(countryStats.stream().limit(limit).toList());
        } catch (Exception e) {
            logger.error("Failed to get visitor statistics by country", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get visitor statistics by city
     */
    @GetMapping("/visitors/cities")
    public ResponseEntity<List<VisitorStatistics>> getVisitorsByCity(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "10") int limit) {

        try {
            List<VisitorStatistics> cityStats = analyticsService.getVisitorsByCity(startDate, endDate);
            return ResponseEntity.ok(cityStats.stream().limit(limit).toList());
        } catch (Exception e) {
            logger.error("Failed to get visitor statistics by city", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get hourly visitor distribution
     */
    @GetMapping("/visitors/hourly")
    public ResponseEntity<List<VisitorStatistics>> getHourlyDistribution(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            List<VisitorStatistics> hourlyStats = analyticsService.getHourlyDistribution(date);
            return ResponseEntity.ok(hourlyStats);
        } catch (Exception e) {
            logger.error("Failed to get hourly visitor distribution", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get most popular pages
     */
    @GetMapping("/pages/popular")
    public ResponseEntity<List<PageViewStatistics>> getPopularPages(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "views") String orderBy,
            @RequestParam(required = false, defaultValue = "10") int limit) {

        try {
            List<PageViewStatistics> popularPages;
            
            if ("uniqueVisitors".equals(orderBy)) {
                popularPages = analyticsService.getMostPopularPagesByUniqueVisitors(startDate, endDate);
            } else {
                popularPages = analyticsService.getMostPopularPages(startDate, endDate);
            }
            
            return ResponseEntity.ok(popularPages.stream().limit(limit).toList());
        } catch (Exception e) {
            logger.error("Failed to get popular pages", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get page performance summary
     */
    @GetMapping("/pages/performance")
    public ResponseEntity<List<Map<String, Object>>> getPagePerformance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            List<Map<String, Object>> performance = analyticsService.getPagePerformanceSummary(startDate, endDate);
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            logger.error("Failed to get page performance", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get trending pages
     */
    @GetMapping("/pages/trending")
    public ResponseEntity<List<Map<String, Object>>> getTrendingPages(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "10") int limit) {

        try {
            List<Map<String, Object>> trendingPages = analyticsService.getTrendingPages(startDate, endDate);
            return ResponseEntity.ok(trendingPages.stream().limit(limit).toList());
        } catch (Exception e) {
            logger.error("Failed to get trending pages", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get visitor growth trend
     */
    @GetMapping("/growth")
    public ResponseEntity<List<Map<String, Object>>> getGrowthTrend(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "DAILY") StatisticsType type) {

        try {
            List<Map<String, Object>> growth = analyticsService.getVisitorGrowthTrend(type, startDate, endDate);
            return ResponseEntity.ok(growth);
        } catch (Exception e) {
            logger.error("Failed to get growth trend", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get peak hours analysis
     */
    @GetMapping("/peak-hours")
    public ResponseEntity<List<Map<String, Object>>> getPeakHours(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            List<Map<String, Object>> peakHours = analyticsService.getPeakHours(startDate, endDate);
            return ResponseEntity.ok(peakHours);
        } catch (Exception e) {
            logger.error("Failed to get peak hours", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get referrer statistics
     */
    @GetMapping("/referrers")
    public ResponseEntity<List<Map<String, Object>>> getReferrerStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "10") int limit) {

        try {
            List<Map<String, Object>> referrers = analyticsService.getReferrerStatistics(startDate, endDate);
            return ResponseEntity.ok(referrers.stream().limit(limit).toList());
        } catch (Exception e) {
            logger.error("Failed to get referrer statistics", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get user agent distribution
     */
    @GetMapping("/user-agents")
    public ResponseEntity<List<Map<String, Object>>> getUserAgentStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "10") int limit) {

        try {
            List<Map<String, Object>> userAgents = analyticsService.getUserAgentDistribution(startDate, endDate);
            return ResponseEntity.ok(userAgents.stream().limit(limit).toList());
        } catch (Exception e) {
            logger.error("Failed to get user agent statistics", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get bounce rate analysis
     */
    @GetMapping("/bounce-rate")
    public ResponseEntity<Map<String, Object>> getBounceRateAnalysis(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            Map<String, Object> bounceRate = analyticsService.getBounceRateAnalysis(startDate, endDate);
            return ResponseEntity.ok(bounceRate);
        } catch (Exception e) {
            logger.error("Failed to get bounce rate analysis", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get session duration analysis
     */
    @GetMapping("/session-duration")
    public ResponseEntity<Map<String, Object>> getSessionDurationAnalysis(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            Map<String, Object> sessionDuration = analyticsService.getSessionDurationAnalysis(startDate, endDate);
            return ResponseEntity.ok(sessionDuration);
        } catch (Exception e) {
            logger.error("Failed to get session duration analysis", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get visitor retention analysis
     */
    @GetMapping("/retention")
    public ResponseEntity<Map<String, Object>> getRetentionAnalysis(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            Map<String, Object> retention = analyticsService.getVisitorRetentionAnalysis(startDate, endDate);
            return ResponseEntity.ok(retention);
        } catch (Exception e) {
            logger.error("Failed to get retention analysis", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get countries with highest growth
     */
    @GetMapping("/countries/growth")
    public ResponseEntity<List<Map<String, Object>>> getCountryGrowth(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "10") int limit) {

        try {
            List<Map<String, Object>> countryGrowth = analyticsService.getCountriesWithHighestGrowth(startDate, endDate);
            return ResponseEntity.ok(countryGrowth.stream().limit(limit).toList());
        } catch (Exception e) {
            logger.error("Failed to get country growth", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get real-time statistics (last 24 hours)
     */
    @GetMapping("/realtime")
    public ResponseEntity<Map<String, Object>> getRealTimeStats() {
        try {
            Map<String, Object> realTimeStats = analyticsService.getRealTimeStatistics();
            return ResponseEntity.ok(realTimeStats);
        } catch (Exception e) {
            logger.error("Failed to get real-time statistics", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Force statistics aggregation for a date range (admin function)
     */
    @PostMapping("/admin/aggregate")
    public ResponseEntity<Map<String, Object>> forceAggregation(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            aggregationService.forceAggregation(startDate, endDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statistics aggregated successfully");
            response.put("period", Map.of("startDate", startDate, "endDate", endDate));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to force aggregation", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to aggregate statistics");
            
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get analytics health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "analytics");
        response.put("timestamp", java.time.LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
}
