package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.ProjectMedia;
import com.mytechfolio.portfolio.dto.response.ProjectMediaResponse;
import org.springframework.stereotype.Component;

/**
 * Mapper for ProjectMedia entity conversions.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
public class ProjectMediaMapper {
    
    /**
     * Converts ProjectMedia to ProjectMediaResponse.
     * 
     * @param media ProjectMedia entity
     * @return ProjectMediaResponse
     */
    public ProjectMediaResponse toResponse(ProjectMedia media) {
        if (media == null) {
            return null;
        }
        
        return ProjectMediaResponse.builder()
                .id(media.getId())
                .projectId(media.getProjectId())
                .fileName(media.getFileName())
                .fileUrl(media.getFileUrl())
                .thumbnailUrl(media.getThumbnailUrl())
                .fileType(media.getFileType())
                .mimeType(media.getMimeType())
                .fileSize(media.getFileSize())
                .type(media.getType())
                .displayOrder(media.getDisplayOrder())
                .altText(media.getAltText())
                .caption(media.getCaption())
                .description(media.getDescription())
                .width(media.getWidth())
                .height(media.getHeight())
                .duration(media.getDuration())
                .isActive(media.getIsActive())
                .isPrimary(media.getIsPrimary())
                .createdAt(media.getCreatedAt())
                .updatedAt(media.getUpdatedAt())
                .build();
    }
}

