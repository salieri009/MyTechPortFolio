package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.VisitorStatistics;
import com.mytechfolio.portfolio.domain.VisitorStatistics.StatisticsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VisitorStatisticsRepository extends JpaRepository<VisitorStatistics, Long> {

    // Find statistics by date and type
    Optional<VisitorStatistics> findByStatisticsDateAndStatisticsType(LocalDate statisticsDate, StatisticsType statisticsType);

    // Find statistics by type within date range
    List<VisitorStatistics> findByStatisticsTypeAndStatisticsDateBetween(StatisticsType statisticsType, LocalDate startDate, LocalDate endDate);

    // Find statistics by date
    List<VisitorStatistics> findByStatisticsDate(LocalDate statisticsDate);

    // Find statistics within date range
    List<VisitorStatistics> findByStatisticsDateBetween(LocalDate startDate, LocalDate endDate);

    // Find country statistics for a date range
    List<VisitorStatistics> findByStatisticsTypeAndCountryNotNullAndStatisticsDateBetween(StatisticsType statisticsType, LocalDate startDate, LocalDate endDate);

    // Find city statistics for a date range
    List<VisitorStatistics> findByStatisticsTypeAndCityNotNullAndStatisticsDateBetween(StatisticsType statisticsType, LocalDate startDate, LocalDate endDate);

    // Find hourly statistics for a specific date
    List<VisitorStatistics> findByStatisticsTypeAndStatisticsDateAndHourOfDayNotNull(StatisticsType statisticsType, LocalDate date);

    // Find statistics by country
    Optional<VisitorStatistics> findByStatisticsDateAndStatisticsTypeAndCountry(LocalDate statisticsDate, StatisticsType statisticsType, String country);

    // Find statistics by city
    Optional<VisitorStatistics> findByStatisticsDateAndStatisticsTypeAndCity(LocalDate statisticsDate, StatisticsType statisticsType, String city);

    // Find hourly statistics
    Optional<VisitorStatistics> findByStatisticsDateAndStatisticsTypeAndHourOfDay(LocalDate statisticsDate, StatisticsType statisticsType, Integer hourOfDay);

    // Get daily statistics summary
    @Query("SELECT v FROM VisitorStatistics v WHERE v.statisticsType = 'DAILY' AND v.statisticsDate BETWEEN :startDate AND :endDate ORDER BY v.statisticsDate DESC")
    List<VisitorStatistics> getDailyStatistics(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get monthly statistics summary
    @Query("SELECT v FROM VisitorStatistics v WHERE v.statisticsType = 'MONTHLY' AND v.statisticsDate BETWEEN :startDate AND :endDate ORDER BY v.statisticsDate DESC")
    List<VisitorStatistics> getMonthlyStatistics(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get top countries by visitor count
    @Query("SELECT v FROM VisitorStatistics v WHERE v.statisticsType = 'COUNTRY' AND v.statisticsDate BETWEEN :startDate AND :endDate AND v.country IS NOT NULL ORDER BY v.totalVisitors DESC")
    List<VisitorStatistics> getTopCountries(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get top cities by visitor count
    @Query("SELECT v FROM VisitorStatistics v WHERE v.statisticsType = 'CITY' AND v.statisticsDate BETWEEN :startDate AND :endDate AND v.city IS NOT NULL ORDER BY v.totalVisitors DESC")
    List<VisitorStatistics> getTopCities(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get hourly distribution for a specific date
    @Query("SELECT v FROM VisitorStatistics v WHERE v.statisticsType = 'HOURLY' AND v.statisticsDate = :date AND v.hourOfDay IS NOT NULL ORDER BY v.hourOfDay")
    List<VisitorStatistics> getHourlyDistribution(@Param("date") LocalDate date);

    // Get visitor growth trend
    @Query("SELECT v.statisticsDate, v.totalVisitors, v.uniqueVisitors FROM VisitorStatistics v WHERE v.statisticsType = :type AND v.statisticsDate BETWEEN :startDate AND :endDate ORDER BY v.statisticsDate")
    List<Object[]> getVisitorGrowthTrend(@Param("type") StatisticsType type, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get total visitors sum for date range
    @Query("SELECT SUM(v.totalVisitors) FROM VisitorStatistics v WHERE v.statisticsType = 'DAILY' AND v.statisticsDate BETWEEN :startDate AND :endDate")
    Long getTotalVisitorsInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get unique visitors sum for date range
    @Query("SELECT SUM(v.uniqueVisitors) FROM VisitorStatistics v WHERE v.statisticsType = 'DAILY' AND v.statisticsDate BETWEEN :startDate AND :endDate")
    Long getUniqueVisitorsInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get page views sum for date range
    @Query("SELECT SUM(v.totalPageViews) FROM VisitorStatistics v WHERE v.statisticsType = 'DAILY' AND v.statisticsDate BETWEEN :startDate AND :endDate")
    Long getTotalPageViewsInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get average bounce rate for date range
    @Query("SELECT AVG(v.bounceRate) FROM VisitorStatistics v WHERE v.statisticsType = 'DAILY' AND v.statisticsDate BETWEEN :startDate AND :endDate AND v.bounceRate IS NOT NULL")
    Double getAverageBounceRateInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get average session duration for date range
    @Query("SELECT AVG(v.averageSessionDuration) FROM VisitorStatistics v WHERE v.statisticsType = 'DAILY' AND v.statisticsDate BETWEEN :startDate AND :endDate AND v.averageSessionDuration IS NOT NULL")
    Double getAverageSessionDurationInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get new vs returning visitor ratio
    @Query("SELECT SUM(v.newVisitors), SUM(v.returningVisitors) FROM VisitorStatistics v WHERE v.statisticsType = 'DAILY' AND v.statisticsDate BETWEEN :startDate AND :endDate")
    Object[] getNewVsReturningVisitorsInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get peak hour
    @Query("SELECT v.hourOfDay, SUM(v.totalVisitors) as totalVisitors FROM VisitorStatistics v WHERE v.statisticsType = 'HOURLY' AND v.statisticsDate BETWEEN :startDate AND :endDate AND v.hourOfDay IS NOT NULL GROUP BY v.hourOfDay ORDER BY totalVisitors DESC")
    List<Object[]> getPeakHours(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get comparison with previous period
    @Query("SELECT " +
           "COALESCE(SUM(current.totalVisitors), 0) as currentVisitors, " +
           "COALESCE(SUM(previous.totalVisitors), 0) as previousVisitors, " +
           "COALESCE(SUM(current.uniqueVisitors), 0) as currentUniqueVisitors, " +
           "COALESCE(SUM(previous.uniqueVisitors), 0) as previousUniqueVisitors " +
           "FROM VisitorStatistics current " +
           "LEFT JOIN VisitorStatistics previous ON previous.statisticsType = current.statisticsType " +
           "AND previous.statisticsDate BETWEEN :previousStartDate AND :previousEndDate " +
           "WHERE current.statisticsType = 'DAILY' " +
           "AND current.statisticsDate BETWEEN :currentStartDate AND :currentEndDate")
    Object[] getComparisonWithPreviousPeriod(@Param("currentStartDate") LocalDate currentStartDate,
                                             @Param("currentEndDate") LocalDate currentEndDate,
                                             @Param("previousStartDate") LocalDate previousStartDate,
                                             @Param("previousEndDate") LocalDate previousEndDate);

    // Get dashboard summary
    @Query("SELECT " +
           "SUM(v.totalVisitors) as totalVisitors, " +
           "SUM(v.uniqueVisitors) as uniqueVisitors, " +
           "SUM(v.totalPageViews) as totalPageViews, " +
           "AVG(v.bounceRate) as avgBounceRate, " +
           "AVG(v.averageSessionDuration) as avgSessionDuration, " +
           "SUM(v.newVisitors) as newVisitors, " +
           "SUM(v.returningVisitors) as returningVisitors " +
           "FROM VisitorStatistics v WHERE v.statisticsType = 'DAILY' AND v.statisticsDate BETWEEN :startDate AND :endDate")
    Object[] getDashboardSummary(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Clean up old statistics
    @Query("DELETE FROM VisitorStatistics v WHERE v.statisticsDate < :cutoffDate")
    void deleteOldStatistics(@Param("cutoffDate") LocalDate cutoffDate);

    // Get countries with highest growth
    @Query("SELECT current.country, " +
           "SUM(current.totalVisitors) as currentVisitors, " +
           "COALESCE(SUM(previous.totalVisitors), 0) as previousVisitors, " +
           "CASE WHEN COALESCE(SUM(previous.totalVisitors), 0) = 0 THEN 100.0 " +
           "     ELSE ((SUM(current.totalVisitors) - COALESCE(SUM(previous.totalVisitors), 0)) * 100.0 / COALESCE(SUM(previous.totalVisitors), 1)) " +
           "END as growthRate " +
           "FROM VisitorStatistics current " +
           "LEFT JOIN VisitorStatistics previous ON current.country = previous.country " +
           "AND previous.statisticsType = 'COUNTRY' " +
           "AND previous.statisticsDate BETWEEN :previousStartDate AND :previousEndDate " +
           "WHERE current.statisticsType = 'COUNTRY' " +
           "AND current.statisticsDate BETWEEN :currentStartDate AND :currentEndDate " +
           "AND current.country IS NOT NULL " +
           "GROUP BY current.country " +
           "ORDER BY growthRate DESC")
    List<Object[]> getCountriesWithHighestGrowth(@Param("currentStartDate") LocalDate currentStartDate,
                                                  @Param("currentEndDate") LocalDate currentEndDate,
                                                  @Param("previousStartDate") LocalDate previousStartDate,
                                                  @Param("previousEndDate") LocalDate previousEndDate);
}
