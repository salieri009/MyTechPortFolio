package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.domain.VisitorLog;
import com.mytechfolio.portfolio.service.VisitorTrackingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visitor")
@CrossOrigin(origins = "*")
public class VisitorController {

    private static final Logger logger = LoggerFactory.getLogger(VisitorController.class);

    private final VisitorTrackingService visitorTrackingService;

    @Autowired
    public VisitorController(VisitorTrackingService visitorTrackingService) {
        this.visitorTrackingService = visitorTrackingService;
    }

    /**
     * Track a page visit
     */
    @PostMapping("/track")
    public ResponseEntity<Map<String, Object>> trackVisit(
            @RequestBody TrackVisitRequest request,
            HttpServletRequest httpRequest) {
        
        try {
            VisitorLog visitLog = visitorTrackingService.trackVisit(httpRequest, request.getPagePath());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("visitId", visitLog.getId());
            response.put("sessionId", visitLog.getSessionId());
            response.put("message", "Visit tracked successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to track visit for page: {}", request.getPagePath(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to track visit");
            
            return ResponseEntity.ok(response); // Return 200 to not disrupt user experience
        }
    }

    /**
     * Track multiple page visits (for SPA navigation)
     */
    @PostMapping("/track/batch")
    public ResponseEntity<Map<String, Object>> trackBatchVisits(
            @RequestBody BatchTrackRequest request,
            HttpServletRequest httpRequest) {
        
        try {
            List<VisitorLog> visitLogs = request.getVisits().stream()
                .map(visit -> visitorTrackingService.trackVisitWithSession(
                    extractIpAddress(httpRequest),
                    extractUserAgent(httpRequest),
                    visit.getPagePath(),
                    visit.getSessionId(),
                    visit.getReferrer()
                ))
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("trackedVisits", visitLogs.size());
            response.put("message", "Batch visits tracked successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to track batch visits", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to track batch visits");
            
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Get visitor session information
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, Object>> getSessionInfo(@PathVariable String sessionId) {
        try {
            List<VisitorLog> sessionHistory = visitorTrackingService.getSessionHistory(sessionId);
            long pageCount = visitorTrackingService.getSessionPageCount(sessionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", sessionId);
            response.put("pageCount", pageCount);
            response.put("visits", sessionHistory);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to get session info for: {}", sessionId, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get visitor history by IP
     */
    @GetMapping("/history/{ipAddress}")
    public ResponseEntity<Map<String, Object>> getVisitorHistory(@PathVariable String ipAddress) {
        try {
            List<VisitorLog> history = visitorTrackingService.getVisitorHistory(ipAddress);
            boolean isNewVisitor = visitorTrackingService.isNewVisitor(ipAddress);
            
            Map<String, Object> response = new HashMap<>();
            response.put("ipAddress", ipAddress);
            response.put("isNewVisitor", isNewVisitor);
            response.put("totalVisits", history.size());
            response.put("visits", history);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to get visitor history for: {}", ipAddress, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Check if visitor is unique
     */
    @GetMapping("/unique")
    public ResponseEntity<Map<String, Object>> checkUniqueVisitor(
            @RequestParam(required = false, defaultValue = "24") int hours,
            HttpServletRequest request) {
        
        try {
            String ipAddress = extractIpAddress(request);
            java.time.LocalDateTime since = java.time.LocalDateTime.now().minusHours(hours);
            boolean isUnique = visitorTrackingService.isUniqueVisitor(ipAddress, since);
            boolean isNew = visitorTrackingService.isNewVisitor(ipAddress);
            
            Map<String, Object> response = new HashMap<>();
            response.put("ipAddress", ipAddress);
            response.put("isUnique", isUnique);
            response.put("isNewVisitor", isNew);
            response.put("checkPeriodHours", hours);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to check unique visitor", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isUnique", false);
            response.put("isNewVisitor", false);
            
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Health check endpoint for visitor tracking
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "visitor-tracking");
        response.put("timestamp", java.time.LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Extract IP address from request
     */
    private String extractIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp.trim();
        }

        return request.getRemoteAddr();
    }

    /**
     * Extract User-Agent from request
     */
    private String extractUserAgent(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        return userAgent != null ? userAgent : "Unknown";
    }

    // DTOs for request bodies
    public static class TrackVisitRequest {
        private String pagePath;
        private String pageTitle;
        private String referrer;
        private Long duration;

        // Getters and setters
        public String getPagePath() { return pagePath; }
        public void setPagePath(String pagePath) { this.pagePath = pagePath; }
        public String getPageTitle() { return pageTitle; }
        public void setPageTitle(String pageTitle) { this.pageTitle = pageTitle; }
        public String getReferrer() { return referrer; }
        public void setReferrer(String referrer) { this.referrer = referrer; }
        public Long getDuration() { return duration; }
        public void setDuration(Long duration) { this.duration = duration; }
    }

    public static class BatchTrackRequest {
        private List<VisitData> visits;

        public List<VisitData> getVisits() { return visits; }
        public void setVisits(List<VisitData> visits) { this.visits = visits; }

        public static class VisitData {
            private String pagePath;
            private String pageTitle;
            private String sessionId;
            private String referrer;
            private Long timestamp;

            // Getters and setters
            public String getPagePath() { return pagePath; }
            public void setPagePath(String pagePath) { this.pagePath = pagePath; }
            public String getPageTitle() { return pageTitle; }
            public void setPageTitle(String pageTitle) { this.pageTitle = pageTitle; }
            public String getSessionId() { return sessionId; }
            public void setSessionId(String sessionId) { this.sessionId = sessionId; }
            public String getReferrer() { return referrer; }
            public void setReferrer(String referrer) { this.referrer = referrer; }
            public Long getTimestamp() { return timestamp; }
            public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
        }
    }
}
