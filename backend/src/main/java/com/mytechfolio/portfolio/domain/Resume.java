package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * Resume/CV management entity.
 * Supports multiple resume versions for different purposes.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Document(collection = "resumes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resume {
    
    @Id
    private String id;
    
    @Indexed
    private String version; // "full", "software-engineer", "frontend", "backend", etc.
    
    private String title; // "Full Stack Developer Resume", "Software Engineer CV", etc.
    
    private String description; // Purpose of this resume version
    
    // File information
    private String fileName;
    private String fileUrl; // Azure Blob Storage URL
    private String fileType; // "pdf", "docx"
    private Long fileSize; // Size in bytes
    
    // Metadata
    @Builder.Default
    private Boolean isActive = true; // Primary resume to show
    
    @Builder.Default
    private Boolean isPublic = true; // Can be downloaded by visitors
    
    @Builder.Default
    private Long downloadCount = 0L;
    
    // SEO and sharing
    private String metaDescription;
    private String keywords; // Comma-separated
    
    // Version control
    private String previousVersionId; // Link to previous version
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime lastDownloadedAt;
    
    /**
     * Increments download count.
     */
    public void incrementDownloadCount() {
        this.downloadCount = (this.downloadCount == null ? 0L : this.downloadCount) + 1;
        this.lastDownloadedAt = LocalDateTime.now();
    }
    
    /**
     * Checks if resume is downloadable.
     */
    public boolean isDownloadable() {
        return isActive && isPublic && fileUrl != null && !fileUrl.isEmpty();
    }
}

