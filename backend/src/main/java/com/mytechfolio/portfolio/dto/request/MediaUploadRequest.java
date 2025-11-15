package com.mytechfolio.portfolio.dto.request;

import com.mytechfolio.portfolio.domain.ProjectMedia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for media upload.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadRequest {
    
    @NotBlank(message = "Project ID is required")
    private String projectId;
    
    @NotNull(message = "Media type is required")
    private ProjectMedia.MediaType type;
    
    private String altText;
    private String caption;
    private String description;
    
    private Integer displayOrder;
    
    @Builder.Default
    private Boolean isPrimary = false;
}

