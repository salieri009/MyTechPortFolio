package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.ProjectMedia;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for project media.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMediaResponse {
    
    private String id;
    private String projectId;
    private String fileName;
    private String fileUrl;
    private String thumbnailUrl;
    private String fileType;
    private String mimeType;
    private Long fileSize;
    private ProjectMedia.MediaType type;
    private Integer displayOrder;
    private String altText;
    private String caption;
    private String description;
    private Integer width;
    private Integer height;
    private Integer duration;
    private Boolean isActive;
    private Boolean isPrimary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

