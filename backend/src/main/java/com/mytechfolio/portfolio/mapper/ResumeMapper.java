package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.Resume;
import org.springframework.stereotype.Component;

/**
 * Mapper for Resume entity conversions.
 * Resume entities are typically managed directly without separate DTOs.
 * This mapper is provided for consistency and future extensibility.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
public class ResumeMapper extends EntityMapper<Resume, Resume, Void, Void> {
    
    @Override
    public Resume toResponse(Resume resume) {
        // For resume, we return the entity directly as there's no separate response DTO
        return resume;
    }
    
    @Override
    public Resume toEntity(Void createRequest) {
        // Resume creation is handled differently (file upload)
        throw new UnsupportedOperationException("Resume creation is handled via file upload service");
    }
    
    @Override
    public void updateEntity(Resume entity, Void updateRequest) {
        // Resume updates are handled differently
        throw new UnsupportedOperationException("Resume updates are handled via file upload service");
    }
}

