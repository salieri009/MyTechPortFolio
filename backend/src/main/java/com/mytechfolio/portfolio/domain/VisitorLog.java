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

import java.time.LocalDateTime;

@Document(collection = "visitor_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndexes({
    @CompoundIndex(name = "idx_visitor_log_timestamp", def = "{'visitTime': 1}"),
    @CompoundIndex(name = "idx_visitor_log_page", def = "{'pagePath': 1}"),
    @CompoundIndex(name = "idx_visitor_log_ip", def = "{'ipAddress': 1}"),
    @CompoundIndex(name = "idx_visitor_log_date", def = "{'visitDate': 1}")
})
public class VisitorLog {

    @Id
    private String id;

    @Indexed
    private String ipAddress;

    private String userAgent;

    @Indexed
    private String pagePath;

    private String pageTitle;

    @Indexed
    private LocalDateTime visitTime;

    private java.time.LocalDate visitDate;

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

    private Long visitDuration; // milliseconds

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
