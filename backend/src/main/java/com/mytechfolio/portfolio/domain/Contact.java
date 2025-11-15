package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * Contact form submission entity.
 * Stores lead information for follow-up.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Document(collection = "contacts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    
    @Id
    private String id;
    
    @Indexed
    private String email;
    
    private String name;
    private String company;
    private String subject;
    private String message;
    private String phoneNumber;
    private String linkedInUrl;
    private String jobTitle;
    
    // Tracking information
    private String referrer;
    private String source;
    private String projectId; // If related to specific project
    private String ipAddress; // Hashed for privacy
    private String userAgent;
    
    // Status tracking
    @Builder.Default
    private ContactStatus status = ContactStatus.NEW;
    
    @Builder.Default
    private Boolean isSpam = false;
    
    @Builder.Default
    private Boolean isRead = false;
    
    @Builder.Default
    private Boolean isReplied = false;
    
    // Notes for internal use
    private String internalNotes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime readAt;
    private LocalDateTime repliedAt;
    
    public enum ContactStatus {
        NEW,           // Newly submitted
        READ,          // Read by portfolio owner
        REPLIED,       // Replied to
        ARCHIVED,      // Archived
        SPAM           // Marked as spam
    }
    
    /**
     * Marks contact as read.
     */
    public void markAsRead() {
        this.isRead = true;
        this.status = ContactStatus.READ;
        this.readAt = LocalDateTime.now();
    }
    
    /**
     * Marks contact as replied.
     */
    public void markAsReplied() {
        this.isReplied = true;
        this.status = ContactStatus.REPLIED;
        this.repliedAt = LocalDateTime.now();
    }
    
    /**
     * Marks contact as spam.
     */
    public void markAsSpam() {
        this.isSpam = true;
        this.status = ContactStatus.SPAM;
    }
}

