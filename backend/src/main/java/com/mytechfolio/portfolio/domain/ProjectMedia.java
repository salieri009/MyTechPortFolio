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
 * Project media entity.
 * Stores images, videos, and other media files for projects.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Document(collection = "project_media")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMedia {
    
    @Id
    private String id;
    
    @Indexed
    private String projectId; // Reference to Project
    
    private String fileName; // Original file name
    private String fileUrl; // Full URL to the media file (Azure Blob Storage or local)
    private String thumbnailUrl; // Thumbnail URL for images
    private String fileType; // "image", "video", "document"
    private String mimeType; // "image/png", "video/mp4", etc.
    private Long fileSize; // Size in bytes
    
    private MediaType type; // SCREENSHOT, LOGO, VIDEO, DOCUMENT, OTHER
    private Integer displayOrder; // Order in gallery (0-based)
    
    private String altText; // For accessibility
    private String caption; // Optional caption
    private String description; // Optional description
    
    // Metadata
    private Integer width; // Image/video width in pixels
    private Integer height; // Image/video height in pixels
    private Integer duration; // Video duration in seconds
    
    // Storage information
    private String storageProvider; // "azure", "local", "s3", etc.
    private String storagePath; // Path in storage (e.g., "projects/{projectId}/{fileName}")
    
    @Builder.Default
    private Boolean isActive = true; // Active/visible in gallery
    @Builder.Default
    private Boolean isPrimary = false; // Primary/featured image
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum MediaType {
        SCREENSHOT,  // Project screenshots
        LOGO,        // Project logo
        VIDEO,       // Demo videos
        DOCUMENT,    // PDFs, documents
        DIAGRAM,     // Architecture diagrams
        OTHER        // Other media types
    }
    
    /**
     * Checks if media is an image.
     */
    public boolean isImage() {
        return fileType != null && fileType.startsWith("image/");
    }
    
    /**
     * Checks if media is a video.
     */
    public boolean isVideo() {
        return fileType != null && fileType.startsWith("video/");
    }
}

