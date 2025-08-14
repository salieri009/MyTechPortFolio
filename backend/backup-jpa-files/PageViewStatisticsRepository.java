package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.PageViewStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PageViewStatisticsRepository extends JpaRepository<PageViewStatistics, Long> {

    // Find statistics by page path and date
    Optional<PageViewStatistics> findByPagePathAndViewDate(String pagePath, LocalDate viewDate);

    // Find statistics by page path
    List<PageViewStatistics> findByPagePath(String pagePath);

    // Find statistics for a specific date
    List<PageViewStatistics> findByViewDate(LocalDate viewDate);

    // Find statistics within date range
    List<PageViewStatistics> findByViewDateBetween(LocalDate startDate, LocalDate endDate);

    // Get most popular pages by total views
    @Query("SELECT p FROM PageViewStatistics p WHERE p.viewDate BETWEEN :startDate AND :endDate ORDER BY p.totalViews DESC")
    List<PageViewStatistics> findMostPopularPagesByViews(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get most popular pages by unique visitors
    @Query("SELECT p FROM PageViewStatistics p WHERE p.viewDate BETWEEN :startDate AND :endDate ORDER BY p.uniqueVisitors DESC")
    List<PageViewStatistics> findMostPopularPagesByUniqueVisitors(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get pages with highest bounce rate
    @Query("SELECT p FROM PageViewStatistics p WHERE p.viewDate BETWEEN :startDate AND :endDate AND p.bounceRate IS NOT NULL ORDER BY p.bounceRate DESC")
    List<PageViewStatistics> findPagesWithHighestBounceRate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get pages with lowest bounce rate
    @Query("SELECT p FROM PageViewStatistics p WHERE p.viewDate BETWEEN :startDate AND :endDate AND p.bounceRate IS NOT NULL ORDER BY p.bounceRate ASC")
    List<PageViewStatistics> findPagesWithLowestBounceRate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get total views sum for a page across date range
    @Query("SELECT SUM(p.totalViews) FROM PageViewStatistics p WHERE p.pagePath = :pagePath AND p.viewDate BETWEEN :startDate AND :endDate")
    Long getTotalViewsForPage(@Param("pagePath") String pagePath, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get total unique visitors sum for a page across date range
    @Query("SELECT SUM(p.uniqueVisitors) FROM PageViewStatistics p WHERE p.pagePath = :pagePath AND p.viewDate BETWEEN :startDate AND :endDate")
    Long getTotalUniqueVisitorsForPage(@Param("pagePath") String pagePath, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get average bounce rate for a page across date range
    @Query("SELECT AVG(p.bounceRate) FROM PageViewStatistics p WHERE p.pagePath = :pagePath AND p.viewDate BETWEEN :startDate AND :endDate AND p.bounceRate IS NOT NULL")
    Double getAverageBounceRateForPage(@Param("pagePath") String pagePath, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get average duration for a page across date range
    @Query("SELECT AVG(p.totalDuration / p.totalViews) FROM PageViewStatistics p WHERE p.pagePath = :pagePath AND p.viewDate BETWEEN :startDate AND :endDate AND p.totalViews > 0")
    Double getAverageDurationForPage(@Param("pagePath") String pagePath, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get daily totals aggregated across all pages
    @Query("SELECT p.viewDate, SUM(p.totalViews), SUM(p.uniqueVisitors), AVG(p.bounceRate) FROM PageViewStatistics p WHERE p.viewDate BETWEEN :startDate AND :endDate GROUP BY p.viewDate ORDER BY p.viewDate")
    List<Object[]> getDailyTotals(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get page performance summary
    @Query("SELECT p.pagePath, SUM(p.totalViews) as totalViews, SUM(p.uniqueVisitors) as totalUniqueVisitors, AVG(p.bounceRate) as avgBounceRate, AVG(p.totalDuration / NULLIF(p.totalViews, 0)) as avgDuration FROM PageViewStatistics p WHERE p.viewDate BETWEEN :startDate AND :endDate GROUP BY p.pagePath ORDER BY totalViews DESC")
    List<Object[]> getPagePerformanceSummary(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get trending pages (comparing current period with previous period)
    @Query("SELECT current.pagePath, " +
           "SUM(current.totalViews) as currentViews, " +
           "COALESCE(SUM(previous.totalViews), 0) as previousViews, " +
           "CASE WHEN COALESCE(SUM(previous.totalViews), 0) = 0 THEN 100.0 " +
           "     ELSE ((SUM(current.totalViews) - COALESCE(SUM(previous.totalViews), 0)) * 100.0 / COALESCE(SUM(previous.totalViews), 1)) " +
           "END as growthRate " +
           "FROM PageViewStatistics current " +
           "LEFT JOIN PageViewStatistics previous ON current.pagePath = previous.pagePath " +
           "AND previous.viewDate BETWEEN :previousStartDate AND :previousEndDate " +
           "WHERE current.viewDate BETWEEN :currentStartDate AND :currentEndDate " +
           "GROUP BY current.pagePath " +
           "ORDER BY growthRate DESC")
    List<Object[]> getTrendingPages(@Param("currentStartDate") LocalDate currentStartDate, 
                                    @Param("currentEndDate") LocalDate currentEndDate,
                                    @Param("previousStartDate") LocalDate previousStartDate, 
                                    @Param("previousEndDate") LocalDate previousEndDate);

    // Get pages that need attention (high bounce rate and low engagement)
    @Query("SELECT p FROM PageViewStatistics p WHERE p.viewDate BETWEEN :startDate AND :endDate AND p.bounceRate > :bounceRateThreshold AND p.totalViews > :minViews ORDER BY p.bounceRate DESC")
    List<PageViewStatistics> getPagesNeedingAttention(@Param("startDate") LocalDate startDate, 
                                                       @Param("endDate") LocalDate endDate,
                                                       @Param("bounceRateThreshold") Double bounceRateThreshold,
                                                       @Param("minViews") Long minViews);

    // Clean up old statistics (for data retention)
    @Query("DELETE FROM PageViewStatistics p WHERE p.viewDate < :cutoffDate")
    void deleteOldStatistics(@Param("cutoffDate") LocalDate cutoffDate);

    // Get distinct page paths
    @Query("SELECT DISTINCT p.pagePath FROM PageViewStatistics p ORDER BY p.pagePath")
    List<String> findDistinctPagePaths();

    // Get statistics summary for dashboard
    @Query("SELECT " +
           "COUNT(DISTINCT p.pagePath) as totalPages, " +
           "SUM(p.totalViews) as totalViews, " +
           "SUM(p.uniqueVisitors) as totalUniqueVisitors, " +
           "AVG(p.bounceRate) as avgBounceRate " +
           "FROM PageViewStatistics p WHERE p.viewDate BETWEEN :startDate AND :endDate")
    Object[] getSummaryStatistics(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
