package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.VisitorLog;
import com.mytechfolio.portfolio.repository.VisitorLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class VisitorTrackingService {

    private static final Logger logger = LoggerFactory.getLogger(VisitorTrackingService.class);

    private final VisitorLogRepository visitorLogRepository;
    private final GeolocationService geolocationService;

    @Autowired
    public VisitorTrackingService(VisitorLogRepository visitorLogRepository, 
                                  GeolocationService geolocationService) {
        this.visitorLogRepository = visitorLogRepository;
        this.geolocationService = geolocationService;
    }

    /**
     * Track a visitor's page visit
     */
    public VisitorLog trackVisit(HttpServletRequest request, String visitedPage) {
        try {
            String ipAddress = extractIpAddress(request);
            String userAgent = extractUserAgent(request);
            String referrer = extractReferrer(request);
            String sessionId = extractOrCreateSessionId(request);

            VisitorLog visitorLog = new VisitorLog();
            visitorLog.setIpAddress(ipAddress);
            visitorLog.setUserAgent(userAgent);
            visitorLog.setVisitedPage(visitedPage);
            visitorLog.setVisitTime(LocalDateTime.now());
            visitorLog.setReferrer(referrer);
            visitorLog.setSessionId(sessionId);

            // Add geolocation information
            try {
                GeolocationService.LocationInfo locationInfo = geolocationService.getLocationInfo(ipAddress);
                if (locationInfo != null) {
                    visitorLog.setCountry(locationInfo.getCountry());
                    visitorLog.setCity(locationInfo.getCity());
                }
            } catch (Exception e) {
                logger.warn("Failed to get geolocation for IP: {}", ipAddress, e);
                // Continue without geolocation data
            }

            VisitorLog savedLog = visitorLogRepository.save(visitorLog);
            logger.debug("Tracked visit: {} from {} to {}", sessionId, ipAddress, visitedPage);
            
            return savedLog;
        } catch (Exception e) {
            logger.error("Failed to track visitor", e);
            throw new RuntimeException("Failed to track visitor", e);
        }
    }

    /**
     * Track a visitor with custom session information
     */
    public VisitorLog trackVisitWithSession(String ipAddress, String userAgent, String visitedPage, 
                                            String sessionId, String referrer) {
        try {
            VisitorLog visitorLog = new VisitorLog();
            visitorLog.setIpAddress(ipAddress);
            visitorLog.setUserAgent(userAgent);
            visitorLog.setVisitedPage(visitedPage);
            visitorLog.setVisitTime(LocalDateTime.now());
            visitorLog.setReferrer(referrer);
            visitorLog.setSessionId(sessionId);

            // Add geolocation information
            try {
                GeolocationService.LocationInfo locationInfo = geolocationService.getLocationInfo(ipAddress);
                if (locationInfo != null) {
                    visitorLog.setCountry(locationInfo.getCountry());
                    visitorLog.setCity(locationInfo.getCity());
                }
            } catch (Exception e) {
                logger.warn("Failed to get geolocation for IP: {}", ipAddress, e);
            }

            return visitorLogRepository.save(visitorLog);
        } catch (Exception e) {
            logger.error("Failed to track visitor with session", e);
            throw new RuntimeException("Failed to track visitor with session", e);
        }
    }

    /**
     * Check if visitor is unique within the specified time period
     */
    public boolean isUniqueVisitor(String ipAddress, LocalDateTime since) {
        return !visitorLogRepository.existsByIpAddressAndVisitTimeAfter(ipAddress, since);
    }

    /**
     * Check if this is a new visitor (first time visiting)
     */
    public boolean isNewVisitor(String ipAddress) {
        return visitorLogRepository.findFirstVisitByIpAddress(ipAddress).isEmpty();
    }

    /**
     * Get session page count for bounce rate calculation
     */
    public long getSessionPageCount(String sessionId) {
        return visitorLogRepository.countBySessionId(sessionId);
    }

    /**
     * Extract IP address from request, handling proxies and load balancers
     */
    private String extractIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take the first IP in the chain
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp.trim();
        }

        String cfConnectingIp = request.getHeader("CF-Connecting-IP");
        if (cfConnectingIp != null && !cfConnectingIp.isEmpty()) {
            return cfConnectingIp.trim();
        }

        return request.getRemoteAddr();
    }

    /**
     * Extract User-Agent from request
     */
    private String extractUserAgent(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null || userAgent.length() > 500) {
            return userAgent != null ? userAgent.substring(0, 500) : "Unknown";
        }
        return userAgent;
    }

    /**
     * Extract referrer from request
     */
    private String extractReferrer(HttpServletRequest request) {
        String referrer = request.getHeader("Referer");
        if (referrer != null && referrer.length() > 255) {
            return referrer.substring(0, 255);
        }
        return referrer;
    }

    /**
     * Extract or create session ID
     */
    private String extractOrCreateSessionId(HttpServletRequest request) {
        // Try to get session ID from request
        if (request.getSession(false) != null) {
            return request.getSession().getId();
        }

        // Try to get from custom header
        String sessionId = request.getHeader("X-Session-ID");
        if (sessionId != null && !sessionId.isEmpty()) {
            return sessionId;
        }

        // Generate new session ID
        return UUID.randomUUID().toString();
    }

    /**
     * Track API endpoint visits (for SPA routing)
     */
    public VisitorLog trackApiVisit(HttpServletRequest request, String endpoint) {
        return trackVisit(request, "/api" + endpoint);
    }

    /**
     * Bulk track visits (for batch processing)
     */
    public void trackVisits(java.util.List<VisitorLog> visitorLogs) {
        try {
            visitorLogRepository.saveAll(visitorLogs);
            logger.debug("Bulk tracked {} visits", visitorLogs.size());
        } catch (Exception e) {
            logger.error("Failed to bulk track visits", e);
            throw new RuntimeException("Failed to bulk track visits", e);
        }
    }

    /**
     * Clean up old visitor logs based on retention policy
     */
    public void cleanupOldLogs(LocalDateTime cutoffDate) {
        try {
            visitorLogRepository.deleteOldLogs(cutoffDate);
            logger.info("Cleaned up visitor logs older than {}", cutoffDate);
        } catch (Exception e) {
            logger.error("Failed to cleanup old logs", e);
            throw new RuntimeException("Failed to cleanup old logs", e);
        }
    }

    /**
     * Get visitor statistics for a specific IP
     */
    public java.util.List<VisitorLog> getVisitorHistory(String ipAddress) {
        return visitorLogRepository.findByIpAddress(ipAddress);
    }

    /**
     * Get session history
     */
    public java.util.List<VisitorLog> getSessionHistory(String sessionId) {
        return visitorLogRepository.findBySessionId(sessionId);
    }
}
