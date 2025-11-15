package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Tracks detailed engagement metrics for projects.
 * Helps understand which projects resonate with visitors/recruiters.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Document(collection = "project_engagement")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectEngagement {
    
    @Id
    private String id;
    
    private String projectId;
    
    private String sessionId;
    
    private String visitorId; // Anonymous or authenticated user
    
    // Engagement metrics
    private Long viewDuration; // Time spent viewing in seconds
    private Integer scrollDepth; // Percentage scrolled (0-100)
    private Boolean githubLinkClicked; // Whether GitHub link was clicked
    private Boolean demoLinkClicked; // Whether demo link was clicked
    private Integer timesViewed; // Number of times viewed in this session
    
    // Referrer information
    private String referrer; // Where visitor came from
    private String source; // "direct", "search", "social", "referral"
    
    // Device information
    private String userAgent;
    private String deviceType; // "mobile", "tablet", "desktop"
    private String browser;
    
    // Geographic information
    private String country;
    private String city;
    private String ipAddress; // Hashed for privacy
    
    // Timestamp
    @CreatedDate
    private LocalDateTime viewedAt;
    
    private LocalDateTime lastInteractionAt;
    
    /**
     * Calculates engagement score (0-100).
     * Higher score = more engaged visitor.
     */
    public int calculateEngagementScore() {
        int score = 0;
        
        // View duration (max 40 points)
        if (viewDuration != null) {
            score += Math.min(40, (int) (viewDuration / 10)); // 10 seconds = 1 point, max 400 seconds
        }
        
        // Scroll depth (max 30 points)
        if (scrollDepth != null) {
            score += (scrollDepth * 30) / 100;
        }
        
        // Link clicks (max 30 points)
        if (Boolean.TRUE.equals(githubLinkClicked)) {
            score += 15;
        }
        if (Boolean.TRUE.equals(demoLinkClicked)) {
            score += 15;
        }
        
        return Math.min(100, score);
    }
    
    /**
     * Determines if this is a high-value engagement (likely recruiter).
     */
    public boolean isHighValueEngagement() {
        return calculateEngagementScore() >= 50;
    }
}

