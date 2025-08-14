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
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StatisticsAggregationService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticsAggregationService.class);

    private final VisitorLogRepository visitorLogRepository;
    private final PageViewStatisticsRepository pageViewStatisticsRepository;
    private final VisitorStatisticsRepository visitorStatisticsRepository;

    @Autowired
    public StatisticsAggregationService(VisitorLogRepository visitorLogRepository,
                                        PageViewStatisticsRepository pageViewStatisticsRepository,
                                        VisitorStatisticsRepository visitorStatisticsRepository) {
        this.visitorLogRepository = visitorLogRepository;
        this.pageViewStatisticsRepository = pageViewStatisticsRepository;
        this.visitorStatisticsRepository = visitorStatisticsRepository;
    }

    /**
     * Aggregate daily statistics for a specific date
     */
    @Async
    public void aggregateDailyStatistics(LocalDate date) {
        logger.info("Starting daily statistics aggregation for date: {}", date);
        
        try {
            // Aggregate page view statistics
            aggregatePageViewStatistics(date);
            
            // Aggregate visitor statistics
            aggregateVisitorStatistics(date);
            
            // Aggregate hourly statistics
            aggregateHourlyStatistics(date);
            
            // Aggregate country statistics
            aggregateCountryStatistics(date);
            
            // Aggregate city statistics
            aggregateCityStatistics(date);
            
            logger.info("Successfully completed daily statistics aggregation for date: {}", date);
        } catch (Exception e) {
            logger.error("Failed to aggregate daily statistics for date: {}", date, e);
            throw new RuntimeException("Failed to aggregate daily statistics", e);
        }
    }

    /**
     * Aggregate page view statistics for a specific date
     */
    private void aggregatePageViewStatistics(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        // Get distinct pages visited on this date
        List<Object[]> pageViews = visitorLogRepository.getMostPopularPages(startOfDay, endOfDay);
        List<Object[]> uniqueVisitors = visitorLogRepository.getMostPopularPagesByUniqueVisitors(startOfDay, endOfDay);

        // Create a map for unique visitors lookup
        Map<String, Long> uniqueVisitorsMap = uniqueVisitors.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (Long) row[1]
            ));

        for (Object[] pageViewData : pageViews) {
            String pagePath = (String) pageViewData[0];
            Long totalViews = (Long) pageViewData[1];
            Long uniqueVisitorsCount = uniqueVisitorsMap.getOrDefault(pagePath, 0L);

            // Find or create page view statistics
            Optional<PageViewStatistics> existingStats = 
                pageViewStatisticsRepository.findByPagePathAndViewDate(pagePath, date);

            PageViewStatistics stats;
            if (existingStats.isPresent()) {
                stats = existingStats.get();
            } else {
                stats = new PageViewStatistics(pagePath, extractPageTitle(pagePath), date);
            }

            // Update statistics
            stats.setTotalViews(totalViews);
            stats.setUniqueVisitors(uniqueVisitorsCount);
            
            // Calculate bounce rate for this page
            double bounceRate = calculatePageBounceRate(pagePath, startOfDay, endOfDay);
            stats.setBounceRate(bounceRate);

            // Calculate average duration (placeholder - would need session tracking)
            stats.setTotalDuration(0L); // TODO: Implement actual duration tracking

            pageViewStatisticsRepository.save(stats);
            logger.debug("Updated page view statistics for {}: {} views, {} unique visitors", 
                         pagePath, totalViews, uniqueVisitorsCount);
        }
    }

    /**
     * Aggregate daily visitor statistics
     */
    private void aggregateVisitorStatistics(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        // Get total visitors and unique visitors
        long totalVisitors = visitorLogRepository.findByVisitTimeBetween(startOfDay, endOfDay).size();
        long uniqueVisitors = visitorLogRepository.countUniqueVisitorsByDateRange(startOfDay, endOfDay);
        long totalPageViews = visitorLogRepository.findByVisitTimeBetween(startOfDay, endOfDay).size();

        // Calculate bounce rate
        long totalSessions = visitorLogRepository.countTotalSessions(startOfDay, endOfDay);
        long bouncedSessions = visitorLogRepository.countBouncedSessions(startOfDay, endOfDay);
        double bounceRate = totalSessions > 0 ? ((double) bouncedSessions / totalSessions) * 100 : 0.0;

        // Calculate new vs returning visitors
        List<VisitorLog> visitors = visitorLogRepository.findByVisitTimeBetween(startOfDay, endOfDay);
        long newVisitors = 0;
        long returningVisitors = 0;

        for (VisitorLog visitor : visitors) {
            Optional<LocalDateTime> firstVisit = visitorLogRepository.findFirstVisitByIpAddress(visitor.getIpAddress());
            if (firstVisit.isPresent() && firstVisit.get().toLocalDate().equals(date)) {
                newVisitors++;
            } else {
                returningVisitors++;
            }
        }

        // Find or create daily statistics
        Optional<VisitorStatistics> existingStats = 
            visitorStatisticsRepository.findByStatisticsDateAndStatisticsType(date, StatisticsType.DAILY);

        VisitorStatistics stats;
        if (existingStats.isPresent()) {
            stats = existingStats.get();
        } else {
            stats = new VisitorStatistics(date, StatisticsType.DAILY);
        }

        // Update statistics
        stats.setTotalVisitors(totalVisitors);
        stats.setUniqueVisitors(uniqueVisitors);
        stats.setTotalPageViews(totalPageViews);
        stats.setBounceRate(bounceRate);
        stats.setNewVisitors(newVisitors);
        stats.setReturningVisitors(returningVisitors);

        visitorStatisticsRepository.save(stats);
        logger.debug("Updated daily visitor statistics for {}: {} total, {} unique visitors", 
                     date, totalVisitors, uniqueVisitors);
    }

    /**
     * Aggregate hourly statistics for a specific date
     */
    private void aggregateHourlyStatistics(LocalDate date) {
        List<Object[]> hourlyData = visitorLogRepository.getHourlyVisitorDistribution(
            date.atStartOfDay(), date.atTime(23, 59, 59));

        for (Object[] hourData : hourlyData) {
            Integer hour = (Integer) hourData[0];
            Long visitors = (Long) hourData[1];

            // Find or create hourly statistics
            Optional<VisitorStatistics> existingStats = 
                visitorStatisticsRepository.findByStatisticsDateAndStatisticsTypeAndHourOfDay(
                    date, StatisticsType.HOURLY, hour);

            VisitorStatistics stats;
            if (existingStats.isPresent()) {
                stats = existingStats.get();
            } else {
                stats = new VisitorStatistics(date, StatisticsType.HOURLY);
                stats.setHourOfDay(hour);
            }

            stats.setUniqueVisitors(visitors);
            stats.setTotalVisitors(visitors); // For hourly stats, we use unique visitors

            visitorStatisticsRepository.save(stats);
        }
    }

    /**
     * Aggregate country statistics for a specific date
     */
    private void aggregateCountryStatistics(LocalDate date) {
        List<Object[]> countryData = visitorLogRepository.getVisitorCountByCountry(
            date.atStartOfDay(), date.atTime(23, 59, 59));

        for (Object[] countryInfo : countryData) {
            String country = (String) countryInfo[0];
            Long visitors = (Long) countryInfo[1];

            // Find or create country statistics
            Optional<VisitorStatistics> existingStats = 
                visitorStatisticsRepository.findByStatisticsDateAndStatisticsTypeAndCountry(
                    date, StatisticsType.COUNTRY, country);

            VisitorStatistics stats;
            if (existingStats.isPresent()) {
                stats = existingStats.get();
            } else {
                stats = new VisitorStatistics(date, StatisticsType.COUNTRY);
                stats.setCountry(country);
            }

            stats.setUniqueVisitors(visitors);
            stats.setTotalVisitors(visitors);

            visitorStatisticsRepository.save(stats);
        }
    }

    /**
     * Aggregate city statistics for a specific date
     */
    private void aggregateCityStatistics(LocalDate date) {
        List<Object[]> cityData = visitorLogRepository.getVisitorCountByCity(
            date.atStartOfDay(), date.atTime(23, 59, 59));

        for (Object[] cityInfo : cityData) {
            String city = (String) cityInfo[0];
            Long visitors = (Long) cityInfo[1];

            // Find or create city statistics
            Optional<VisitorStatistics> existingStats = 
                visitorStatisticsRepository.findByStatisticsDateAndStatisticsTypeAndCity(
                    date, StatisticsType.CITY, city);

            VisitorStatistics stats;
            if (existingStats.isPresent()) {
                stats = existingStats.get();
            } else {
                stats = new VisitorStatistics(date, StatisticsType.CITY);
                stats.setCity(city);
            }

            stats.setUniqueVisitors(visitors);
            stats.setTotalVisitors(visitors);

            visitorStatisticsRepository.save(stats);
        }
    }

    /**
     * Calculate bounce rate for a specific page
     */
    private double calculatePageBounceRate(String pagePath, LocalDateTime startTime, LocalDateTime endTime) {
        // Get all sessions that visited this page
        List<VisitorLog> pageVisits = visitorLogRepository.findByPagePath(pagePath);
        
        if (pageVisits.isEmpty()) {
            return 0.0;
        }

        long bouncedSessions = 0;
        long totalSessions = 0;

        // Group by session ID
        Map<String, List<VisitorLog>> sessionGroups = pageVisits.stream()
            .filter(visit -> visit.getVisitTime().isAfter(startTime) && visit.getVisitTime().isBefore(endTime))
            .collect(Collectors.groupingBy(VisitorLog::getSessionId));

        for (Map.Entry<String, List<VisitorLog>> entry : sessionGroups.entrySet()) {
            totalSessions++;
            
            // Check if this session only has one page view
            long sessionPageViews = visitorLogRepository.countBySessionId(entry.getKey());
            if (sessionPageViews == 1) {
                bouncedSessions++;
            }
        }

        return totalSessions > 0 ? ((double) bouncedSessions / totalSessions) * 100 : 0.0;
    }

    /**
     * Extract page title from path (placeholder implementation)
     */
    private String extractPageTitle(String pagePath) {
        if (pagePath == null || pagePath.isEmpty()) {
            return "Unknown";
        }

        // Simple mapping - extend as needed
        switch (pagePath) {
            case "/": return "Home";
            case "/about": return "About";
            case "/projects": return "Projects";
            case "/skills": return "Skills";
            case "/contact": return "Contact";
            case "/academics": return "Academic Background";
            default:
                // Extract from path
                String[] parts = pagePath.split("/");
                if (parts.length > 1) {
                    String lastPart = parts[parts.length - 1];
                    return lastPart.substring(0, 1).toUpperCase() + lastPart.substring(1);
                }
                return "Unknown";
        }
    }

    /**
     * Scheduled task to aggregate yesterday's statistics
     * Runs daily at 1 AM
     */
    @Scheduled(cron = "0 0 1 * * *")
    public void scheduledDailyAggregation() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        aggregateDailyStatistics(yesterday);
    }

    /**
     * Aggregate monthly statistics
     */
    @Async
    public void aggregateMonthlyStatistics(LocalDate month) {
        logger.info("Starting monthly statistics aggregation for month: {}", month);

        LocalDate startOfMonth = month.withDayOfMonth(1);
        LocalDate endOfMonth = month.withDayOfMonth(month.lengthOfMonth());

        // Get aggregated data from daily statistics
        Long totalVisitors = visitorStatisticsRepository.getTotalVisitorsInPeriod(startOfMonth, endOfMonth);
        Long uniqueVisitors = visitorStatisticsRepository.getUniqueVisitorsInPeriod(startOfMonth, endOfMonth);
        Long totalPageViews = visitorStatisticsRepository.getTotalPageViewsInPeriod(startOfMonth, endOfMonth);
        Double averageBounceRate = visitorStatisticsRepository.getAverageBounceRateInPeriod(startOfMonth, endOfMonth);

        Object[] newVsReturning = visitorStatisticsRepository.getNewVsReturningVisitorsInPeriod(startOfMonth, endOfMonth);

        // Find or create monthly statistics
        Optional<VisitorStatistics> existingStats = 
            visitorStatisticsRepository.findByStatisticsDateAndStatisticsType(startOfMonth, StatisticsType.MONTHLY);

        VisitorStatistics stats;
        if (existingStats.isPresent()) {
            stats = existingStats.get();
        } else {
            stats = new VisitorStatistics(startOfMonth, StatisticsType.MONTHLY);
        }

        // Update statistics
        stats.setTotalVisitors(totalVisitors != null ? totalVisitors : 0L);
        stats.setUniqueVisitors(uniqueVisitors != null ? uniqueVisitors : 0L);
        stats.setTotalPageViews(totalPageViews != null ? totalPageViews : 0L);
        stats.setBounceRate(averageBounceRate != null ? averageBounceRate : 0.0);

        if (newVsReturning != null && newVsReturning.length >= 2) {
            stats.setNewVisitors(newVsReturning[0] != null ? (Long) newVsReturning[0] : 0L);
            stats.setReturningVisitors(newVsReturning[1] != null ? (Long) newVsReturning[1] : 0L);
        }

        visitorStatisticsRepository.save(stats);
        logger.info("Successfully completed monthly statistics aggregation for month: {}", month);
    }

    /**
     * Scheduled task to aggregate last month's statistics
     * Runs monthly on the 1st at 2 AM
     */
    @Scheduled(cron = "0 0 2 1 * *")
    public void scheduledMonthlyAggregation() {
        LocalDate lastMonth = LocalDate.now().minusMonths(1);
        aggregateMonthlyStatistics(lastMonth);
    }

    /**
     * Clean up old raw logs and keep only aggregated statistics
     * Runs weekly on Sunday at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * SUN")
    public void cleanupOldData() {
        try {
            // Keep raw logs for 30 days, aggregated statistics for 2 years
            LocalDateTime logCutoff = LocalDateTime.now().minusDays(30);
            LocalDate statsCutoff = LocalDate.now().minusYears(2);

            visitorLogRepository.deleteOldLogs(logCutoff);
            pageViewStatisticsRepository.deleteOldStatistics(statsCutoff);
            visitorStatisticsRepository.deleteOldStatistics(statsCutoff);

            logger.info("Successfully cleaned up old data. Removed logs older than {} and stats older than {}", 
                       logCutoff, statsCutoff);
        } catch (Exception e) {
            logger.error("Failed to cleanup old data", e);
        }
    }

    /**
     * Force aggregation for a date range (for initialization or backfill)
     */
    public void forceAggregation(LocalDate startDate, LocalDate endDate) {
        logger.info("Starting forced aggregation from {} to {}", startDate, endDate);

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            aggregateDailyStatistics(currentDate);
            currentDate = currentDate.plusDays(1);
        }

        logger.info("Completed forced aggregation from {} to {}", startDate, endDate);
    }
}
