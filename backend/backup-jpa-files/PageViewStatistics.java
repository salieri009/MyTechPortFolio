package com.mytechfolio.portfolio.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "page_view_statistics", indexes = {
    @Index(name = "idx_page_stats_path_date", columnList = "pagePath, viewDate"),
    @Index(name = "idx_page_stats_date", columnList = "viewDate"),
    @Index(name = "idx_page_stats_views", columnList = "totalViews")
})
public class PageViewStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_path", nullable = false, length = 255)
    private String pagePath;

    @Column(name = "page_title", length = 255)
    private String pageTitle;

    @Column(name = "view_date", nullable = false)
    private LocalDate viewDate;

    @Column(name = "total_views", nullable = false)
    private Long totalViews;

    @Column(name = "unique_visitors", nullable = false)
    private Long uniqueVisitors;

    @Column(name = "total_duration")
    private Long totalDuration; // milliseconds

    @Column(name = "bounce_rate")
    private Double bounceRate;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    // Constructors
    public PageViewStatistics() {}

    public PageViewStatistics(String pagePath, String pageTitle, LocalDate viewDate) {
        this.pagePath = pagePath;
        this.pageTitle = pageTitle;
        this.viewDate = viewDate;
        this.totalViews = 0L;
        this.uniqueVisitors = 0L;
        this.totalDuration = 0L;
        this.bounceRate = 0.0;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getPagePath() { return pagePath; }
    public String getPageTitle() { return pageTitle; }
    public LocalDate getViewDate() { return viewDate; }
    public Long getTotalViews() { return totalViews; }
    public Long getUniqueVisitors() { return uniqueVisitors; }
    public Long getTotalDuration() { return totalDuration; }
    public Double getBounceRate() { return bounceRate; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }

    // Setters
    public void setPagePath(String pagePath) { this.pagePath = pagePath; }
    public void setPageTitle(String pageTitle) { this.pageTitle = pageTitle; }
    public void setViewDate(LocalDate viewDate) { this.viewDate = viewDate; }
    public void setTotalViews(Long totalViews) { this.totalViews = totalViews; }
    public void setUniqueVisitors(Long uniqueVisitors) { this.uniqueVisitors = uniqueVisitors; }
    public void setTotalDuration(Long totalDuration) { this.totalDuration = totalDuration; }
    public void setBounceRate(Double bounceRate) { this.bounceRate = bounceRate; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    // Business methods
    public void incrementViews() {
        this.totalViews++;
        this.lastUpdated = LocalDateTime.now();
    }

    public void addUniqueVisitor() {
        this.uniqueVisitors++;
        this.lastUpdated = LocalDateTime.now();
    }

    public void addDuration(Long duration) {
        if (duration != null && duration > 0) {
            this.totalDuration += duration;
            this.lastUpdated = LocalDateTime.now();
        }
    }

    public Double getAverageDuration() {
        if (totalViews > 0 && totalDuration > 0) {
            return (double) totalDuration / totalViews;
        }
        return 0.0;
    }

    public void updateBounceRate(Double bounceRate) {
        this.bounceRate = bounceRate;
        this.lastUpdated = LocalDateTime.now();
    }

    // Builder pattern
    public static PageViewStatisticsBuilder builder() {
        return new PageViewStatisticsBuilder();
    }

    public static class PageViewStatisticsBuilder {
        private String pagePath;
        private String pageTitle;
        private LocalDate viewDate;
        private Long totalViews = 0L;
        private Long uniqueVisitors = 0L;
        private Long totalDuration = 0L;
        private Double bounceRate = 0.0;

        public PageViewStatisticsBuilder pagePath(String pagePath) {
            this.pagePath = pagePath;
            return this;
        }

        public PageViewStatisticsBuilder pageTitle(String pageTitle) {
            this.pageTitle = pageTitle;
            return this;
        }

        public PageViewStatisticsBuilder viewDate(LocalDate viewDate) {
            this.viewDate = viewDate;
            return this;
        }

        public PageViewStatisticsBuilder totalViews(Long totalViews) {
            this.totalViews = totalViews;
            return this;
        }

        public PageViewStatisticsBuilder uniqueVisitors(Long uniqueVisitors) {
            this.uniqueVisitors = uniqueVisitors;
            return this;
        }

        public PageViewStatisticsBuilder totalDuration(Long totalDuration) {
            this.totalDuration = totalDuration;
            return this;
        }

        public PageViewStatisticsBuilder bounceRate(Double bounceRate) {
            this.bounceRate = bounceRate;
            return this;
        }

        public PageViewStatistics build() {
            PageViewStatistics stats = new PageViewStatistics(pagePath, pageTitle, viewDate);
            stats.setTotalViews(totalViews);
            stats.setUniqueVisitors(uniqueVisitors);
            stats.setTotalDuration(totalDuration);
            stats.setBounceRate(bounceRate);
            return stats;
        }
    }
}
