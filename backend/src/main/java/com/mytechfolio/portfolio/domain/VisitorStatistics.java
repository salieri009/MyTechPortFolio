package com.mytechfolio.portfolio.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "visitor_statistics")
@CompoundIndexes({
    @CompoundIndex(name = "idx_visitor_stats_date_type", def = "{'statisticsDate': 1, 'statisticsType': 1}"),
    @CompoundIndex(name = "idx_visitor_stats_location", def = "{'country': 1, 'city': 1}")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisitorStatistics {

    @Id
    private String id;

    @Indexed
    private LocalDate statisticsDate;

    private StatisticsType statisticsType;

    private String country;

    private String city;

    private Integer hourOfDay; // 0-23 for hourly statistics

    private Long totalVisitors;

    private Long uniqueVisitors;

    private Long totalPageViews;

    private Double averageSessionDuration; // in milliseconds

    private Double bounceRate;

    private Long newVisitors;

    @Column(name = "returning_visitors")
    private Long returningVisitors;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public enum StatisticsType {
        DAILY,
        WEEKLY,
        MONTHLY,
        YEARLY,
        HOURLY,
        COUNTRY,
        CITY
    }

    // Constructors
    public VisitorStatistics() {}

    public VisitorStatistics(LocalDate statisticsDate, StatisticsType statisticsType) {
        this.statisticsDate = statisticsDate;
        this.statisticsType = statisticsType;
        this.totalVisitors = 0L;
        this.uniqueVisitors = 0L;
        this.totalPageViews = 0L;
        this.averageSessionDuration = 0.0;
        this.bounceRate = 0.0;
        this.newVisitors = 0L;
        this.returningVisitors = 0L;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public LocalDate getStatisticsDate() { return statisticsDate; }
    public StatisticsType getStatisticsType() { return statisticsType; }
    public String getCountry() { return country; }
    public String getCity() { return city; }
    public Integer getHourOfDay() { return hourOfDay; }
    public Long getTotalVisitors() { return totalVisitors; }
    public Long getUniqueVisitors() { return uniqueVisitors; }
    public Long getTotalPageViews() { return totalPageViews; }
    public Double getAverageSessionDuration() { return averageSessionDuration; }
    public Double getBounceRate() { return bounceRate; }
    public Long getNewVisitors() { return newVisitors; }
    public Long getReturningVisitors() { return returningVisitors; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }

    // Setters
    public void setStatisticsDate(LocalDate statisticsDate) { this.statisticsDate = statisticsDate; }
    public void setStatisticsType(StatisticsType statisticsType) { this.statisticsType = statisticsType; }
    public void setCountry(String country) { this.country = country; }
    public void setCity(String city) { this.city = city; }
    public void setHourOfDay(Integer hourOfDay) { this.hourOfDay = hourOfDay; }
    public void setTotalVisitors(Long totalVisitors) { this.totalVisitors = totalVisitors; }
    public void setUniqueVisitors(Long uniqueVisitors) { this.uniqueVisitors = uniqueVisitors; }
    public void setTotalPageViews(Long totalPageViews) { this.totalPageViews = totalPageViews; }
    public void setAverageSessionDuration(Double averageSessionDuration) { this.averageSessionDuration = averageSessionDuration; }
    public void setBounceRate(Double bounceRate) { this.bounceRate = bounceRate; }
    public void setNewVisitors(Long newVisitors) { this.newVisitors = newVisitors; }
    public void setReturningVisitors(Long returningVisitors) { this.returningVisitors = returningVisitors; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    // Business methods
    public void incrementVisitors(boolean isNewVisitor) {
        this.totalVisitors++;
        if (isNewVisitor) {
            this.newVisitors++;
        } else {
            this.returningVisitors++;
        }
        this.lastUpdated = LocalDateTime.now();
    }

    public void incrementUniqueVisitors() {
        this.uniqueVisitors++;
        this.lastUpdated = LocalDateTime.now();
    }

    public void incrementPageViews(Long views) {
        this.totalPageViews += views;
        this.lastUpdated = LocalDateTime.now();
    }

    public void updateSessionDuration(Double duration) {
        if (duration != null && duration > 0) {
            // Calculate weighted average
            double currentTotal = this.averageSessionDuration * this.totalVisitors;
            this.averageSessionDuration = (currentTotal + duration) / this.totalVisitors;
            this.lastUpdated = LocalDateTime.now();
        }
    }

    public void updateBounceRate(Double bounceRate) {
        this.bounceRate = bounceRate;
        this.lastUpdated = LocalDateTime.now();
    }

    public Double getReturnVisitorRate() {
        if (totalVisitors > 0) {
            return (double) returningVisitors / totalVisitors * 100;
        }
        return 0.0;
    }

    public Double getPageViewsPerSession() {
        if (totalVisitors > 0) {
            return (double) totalPageViews / totalVisitors;
        }
        return 0.0;
    }

    // Builder pattern
    public static VisitorStatisticsBuilder builder() {
        return new VisitorStatisticsBuilder();
    }

    public static class VisitorStatisticsBuilder {
        private LocalDate statisticsDate;
        private StatisticsType statisticsType;
        private String country;
        private String city;
        private Integer hourOfDay;
        private Long totalVisitors = 0L;
        private Long uniqueVisitors = 0L;
        private Long totalPageViews = 0L;
        private Double averageSessionDuration = 0.0;
        private Double bounceRate = 0.0;
        private Long newVisitors = 0L;
        private Long returningVisitors = 0L;

        public VisitorStatisticsBuilder statisticsDate(LocalDate statisticsDate) {
            this.statisticsDate = statisticsDate;
            return this;
        }

        public VisitorStatisticsBuilder statisticsType(StatisticsType statisticsType) {
            this.statisticsType = statisticsType;
            return this;
        }

        public VisitorStatisticsBuilder country(String country) {
            this.country = country;
            return this;
        }

        public VisitorStatisticsBuilder city(String city) {
            this.city = city;
            return this;
        }

        public VisitorStatisticsBuilder hourOfDay(Integer hourOfDay) {
            this.hourOfDay = hourOfDay;
            return this;
        }

        public VisitorStatisticsBuilder totalVisitors(Long totalVisitors) {
            this.totalVisitors = totalVisitors;
            return this;
        }

        public VisitorStatisticsBuilder uniqueVisitors(Long uniqueVisitors) {
            this.uniqueVisitors = uniqueVisitors;
            return this;
        }

        public VisitorStatisticsBuilder totalPageViews(Long totalPageViews) {
            this.totalPageViews = totalPageViews;
            return this;
        }

        public VisitorStatisticsBuilder averageSessionDuration(Double averageSessionDuration) {
            this.averageSessionDuration = averageSessionDuration;
            return this;
        }

        public VisitorStatisticsBuilder bounceRate(Double bounceRate) {
            this.bounceRate = bounceRate;
            return this;
        }

        public VisitorStatisticsBuilder newVisitors(Long newVisitors) {
            this.newVisitors = newVisitors;
            return this;
        }

        public VisitorStatisticsBuilder returningVisitors(Long returningVisitors) {
            this.returningVisitors = returningVisitors;
            return this;
        }

        public VisitorStatistics build() {
            VisitorStatistics stats = new VisitorStatistics(statisticsDate, statisticsType);
            stats.setCountry(country);
            stats.setCity(city);
            stats.setHourOfDay(hourOfDay);
            stats.setTotalVisitors(totalVisitors);
            stats.setUniqueVisitors(uniqueVisitors);
            stats.setTotalPageViews(totalPageViews);
            stats.setAverageSessionDuration(averageSessionDuration);
            stats.setBounceRate(bounceRate);
            stats.setNewVisitors(newVisitors);
            stats.setReturningVisitors(returningVisitors);
            return stats;
        }
    }
}
