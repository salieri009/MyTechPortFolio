package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.VisitorLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VisitorLogRepository extends MongoRepository<VisitorLog, String> {

    // Find visitor logs by IP address
    List<VisitorLog> findByIpAddress(String ipAddress);

    // Find visitor logs by session ID
    List<VisitorLog> findBySessionId(String sessionId);

    // Find visitor logs for a specific page
    List<VisitorLog> findByPagePath(String pagePath);

    // Find visitor logs by country
    List<VisitorLog> findByCountry(String country);

    // Find visitor logs within date range
    List<VisitorLog> findByVisitTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    // Check if IP has visited within time period (for unique visitor tracking)
    @Query("SELECT COUNT(v) > 0 FROM VisitorLog v WHERE v.ipAddress = :ipAddress AND v.visitTime >= :since")
    boolean existsByIpAddressAndVisitTimeAfter(@Param("ipAddress") String ipAddress, @Param("since") LocalDateTime since);

    // Check if session exists for bounce rate calculation
    @Query("SELECT COUNT(v) FROM VisitorLog v WHERE v.sessionId = :sessionId")
    long countBySessionId(@Param("sessionId") String sessionId);

    // Get unique visitors count for a date range
    @Query("SELECT COUNT(DISTINCT v.ipAddress) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime")
    long countUniqueVisitorsByDateRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get total page views for a specific page in date range
    @Query("SELECT COUNT(v) FROM VisitorLog v WHERE v.pagePath = :page AND v.visitTime BETWEEN :startTime AND :endTime")
    long countPageViewsByPageAndDateRange(@Param("page") String page, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get unique visitors for a specific page in date range
    @Query("SELECT COUNT(DISTINCT v.ipAddress) FROM VisitorLog v WHERE v.pagePath = :page AND v.visitTime BETWEEN :startTime AND :endTime")
    long countUniqueVisitorsByPageAndDateRange(@Param("page") String page, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get visitor count by country in date range
    @Query("SELECT v.country, COUNT(DISTINCT v.ipAddress) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime AND v.country IS NOT NULL GROUP BY v.country ORDER BY COUNT(DISTINCT v.ipAddress) DESC")
    List<Object[]> getVisitorCountByCountry(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get visitor count by city in date range
    @Query("SELECT v.city, COUNT(DISTINCT v.ipAddress) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime AND v.city IS NOT NULL GROUP BY v.city ORDER BY COUNT(DISTINCT v.ipAddress) DESC")
    List<Object[]> getVisitorCountByCity(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get hourly visitor distribution
    @Query("SELECT HOUR(v.visitTime), COUNT(DISTINCT v.ipAddress) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime GROUP BY HOUR(v.visitTime) ORDER BY HOUR(v.visitTime)")
    List<Object[]> getHourlyVisitorDistribution(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get most popular pages by view count
    @Query("SELECT v.pagePath, COUNT(v) as viewCount FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime GROUP BY v.pagePath ORDER BY viewCount DESC")
    List<Object[]> getMostPopularPages(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get most popular pages by unique visitors
    @Query("SELECT v.pagePath, COUNT(DISTINCT v.ipAddress) as uniqueVisitors FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime GROUP BY v.pagePath ORDER BY uniqueVisitors DESC")
    List<Object[]> getMostPopularPagesByUniqueVisitors(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get referrer statistics
    @Query("SELECT v.referrer, COUNT(v) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime AND v.referrer IS NOT NULL AND v.referrer != '' GROUP BY v.referrer ORDER BY COUNT(v) DESC")
    List<Object[]> getReferrerStatistics(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get daily visitor counts
    @Query("SELECT DATE(v.visitTime), COUNT(DISTINCT v.ipAddress) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime GROUP BY DATE(v.visitTime) ORDER BY DATE(v.visitTime)")
    List<Object[]> getDailyVisitorCounts(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get sessions that bounced (only one page view)
    @Query("SELECT COUNT(DISTINCT v.sessionId) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime AND v.sessionId IN (SELECT v2.sessionId FROM VisitorLog v2 WHERE v2.visitTime BETWEEN :startTime AND :endTime GROUP BY v2.sessionId HAVING COUNT(v2.sessionId) = 1)")
    long countBouncedSessions(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get total sessions count
    @Query("SELECT COUNT(DISTINCT v.sessionId) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime")
    long countTotalSessions(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Get average session duration (placeholder - actual implementation would need session end time)
    @Query("SELECT v.sessionId, MIN(v.visitTime), MAX(v.visitTime) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime GROUP BY v.sessionId")
    List<Object[]> getSessionDurations(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Find first visit for IP (for new vs returning visitor analysis)
    @Query("SELECT MIN(v.visitTime) FROM VisitorLog v WHERE v.ipAddress = :ipAddress")
    Optional<LocalDateTime> findFirstVisitByIpAddress(@Param("ipAddress") String ipAddress);

    // Get user agents distribution
    @Query("SELECT v.userAgent, COUNT(v) FROM VisitorLog v WHERE v.visitTime BETWEEN :startTime AND :endTime GROUP BY v.userAgent ORDER BY COUNT(v) DESC")
    List<Object[]> getUserAgentDistribution(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Delete old logs (for data retention)
    @Query("DELETE FROM VisitorLog v WHERE v.visitTime < :cutoffDate")
    void deleteOldLogs(@Param("cutoffDate") LocalDateTime cutoffDate);
}
