package com.mytechfolio.portfolio.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_log", indexes = {
    @Index(name = "idx_visitor_log_timestamp", columnList = "visitTime"),
    @Index(name = "idx_visitor_log_page", columnList = "pagePath"),
    @Index(name = "idx_visitor_log_ip", columnList = "ipAddress"),
    @Index(name = "idx_visitor_log_date", columnList = "visitDate")
})
public class VisitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "page_path", nullable = false, length = 255)
    private String pagePath;

    @Column(name = "page_title", length = 255)
    private String pageTitle;

    @Column(name = "visit_time", nullable = false)
    private LocalDateTime visitTime;

    @Column(name = "visit_date", nullable = false)
    private java.time.LocalDate visitDate;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "referrer", length = 500)
    private String referrer;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "country_code", length = 3)
    private String countryCode;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "region", length = 100)
    private String region;

    @Column(name = "timezone", length = 50)
    private String timezone;

    @Column(name = "browser", length = 100)
    private String browser;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "is_mobile")
    private Boolean isMobile;

    @Column(name = "screen_resolution", length = 20)
    private String screenResolution;

    @Column(name = "visit_duration")
    private Long visitDuration; // milliseconds

    // Constructors
    public VisitorLog() {}

    public VisitorLog(String ipAddress, String userAgent, String pagePath, String pageTitle, 
                     LocalDateTime visitTime, String sessionId, String referrer) {
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.pagePath = pagePath;
        this.pageTitle = pageTitle;
        this.visitTime = visitTime;
        this.visitDate = visitTime.toLocalDate();
        this.sessionId = sessionId;
        this.referrer = referrer;
    }

    // Getters
    public Long getId() { return id; }
    public String getIpAddress() { return ipAddress; }
    public String getUserAgent() { return userAgent; }
    public String getPagePath() { return pagePath; }
    public String getPageTitle() { return pageTitle; }
    public LocalDateTime getVisitTime() { return visitTime; }
    public java.time.LocalDate getVisitDate() { return visitDate; }
    public String getSessionId() { return sessionId; }
    public String getReferrer() { return referrer; }
    public String getCountry() { return country; }
    public String getCountryCode() { return countryCode; }
    public String getCity() { return city; }
    public String getRegion() { return region; }
    public String getTimezone() { return timezone; }
    public String getBrowser() { return browser; }
    public String getOperatingSystem() { return operatingSystem; }
    public String getDeviceType() { return deviceType; }
    public Boolean getIsMobile() { return isMobile; }
    public String getScreenResolution() { return screenResolution; }
    public Long getVisitDuration() { return visitDuration; }

    // Setters
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public void setPagePath(String pagePath) { this.pagePath = pagePath; }
    public void setPageTitle(String pageTitle) { this.pageTitle = pageTitle; }
    public void setVisitTime(LocalDateTime visitTime) { 
        this.visitTime = visitTime;
        this.visitDate = visitTime.toLocalDate();
    }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public void setReferrer(String referrer) { this.referrer = referrer; }
    public void setCountry(String country) { this.country = country; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    public void setCity(String city) { this.city = city; }
    public void setRegion(String region) { this.region = region; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    public void setBrowser(String browser) { this.browser = browser; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    public void setIsMobile(Boolean isMobile) { this.isMobile = isMobile; }
    public void setScreenResolution(String screenResolution) { this.screenResolution = screenResolution; }
    public void setVisitDuration(Long visitDuration) { this.visitDuration = visitDuration; }

    // Convenience methods for compatibility
    public void setVisitedPage(String visitedPage) { this.pagePath = visitedPage; }
    public String getVisitedPage() { return this.pagePath; }

    // Builder pattern
    public static VisitorLogBuilder builder() {
        return new VisitorLogBuilder();
    }

    public static class VisitorLogBuilder {
        private String ipAddress;
        private String userAgent;
        private String pagePath;
        private String pageTitle;
        private LocalDateTime visitTime;
        private String sessionId;
        private String referrer;
        private String country;
        private String countryCode;
        private String city;
        private String region;
        private String timezone;
        private String browser;
        private String operatingSystem;
        private String deviceType;
        private Boolean isMobile;
        private String screenResolution;
        private Long visitDuration;

        public VisitorLogBuilder ipAddress(String ipAddress) {
            this.ipAddress = ipAddress;
            return this;
        }

        public VisitorLogBuilder userAgent(String userAgent) {
            this.userAgent = userAgent;
            return this;
        }

        public VisitorLogBuilder pagePath(String pagePath) {
            this.pagePath = pagePath;
            return this;
        }

        public VisitorLogBuilder pageTitle(String pageTitle) {
            this.pageTitle = pageTitle;
            return this;
        }

        public VisitorLogBuilder visitTime(LocalDateTime visitTime) {
            this.visitTime = visitTime;
            return this;
        }

        public VisitorLogBuilder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public VisitorLogBuilder referrer(String referrer) {
            this.referrer = referrer;
            return this;
        }

        public VisitorLogBuilder country(String country) {
            this.country = country;
            return this;
        }

        public VisitorLogBuilder countryCode(String countryCode) {
            this.countryCode = countryCode;
            return this;
        }

        public VisitorLogBuilder city(String city) {
            this.city = city;
            return this;
        }

        public VisitorLogBuilder region(String region) {
            this.region = region;
            return this;
        }

        public VisitorLogBuilder timezone(String timezone) {
            this.timezone = timezone;
            return this;
        }

        public VisitorLogBuilder browser(String browser) {
            this.browser = browser;
            return this;
        }

        public VisitorLogBuilder operatingSystem(String operatingSystem) {
            this.operatingSystem = operatingSystem;
            return this;
        }

        public VisitorLogBuilder deviceType(String deviceType) {
            this.deviceType = deviceType;
            return this;
        }

        public VisitorLogBuilder isMobile(Boolean isMobile) {
            this.isMobile = isMobile;
            return this;
        }

        public VisitorLogBuilder screenResolution(String screenResolution) {
            this.screenResolution = screenResolution;
            return this;
        }

        public VisitorLogBuilder visitDuration(Long visitDuration) {
            this.visitDuration = visitDuration;
            return this;
        }

        public VisitorLog build() {
            VisitorLog visitorLog = new VisitorLog(ipAddress, userAgent, pagePath, pageTitle, visitTime, sessionId, referrer);
            visitorLog.setCountry(country);
            visitorLog.setCountryCode(countryCode);
            visitorLog.setCity(city);
            visitorLog.setRegion(region);
            visitorLog.setTimezone(timezone);
            visitorLog.setBrowser(browser);
            visitorLog.setOperatingSystem(operatingSystem);
            visitorLog.setDeviceType(deviceType);
            visitorLog.setIsMobile(isMobile);
            visitorLog.setScreenResolution(screenResolution);
            visitorLog.setVisitDuration(visitDuration);
            return visitorLog;
        }
    }
}
