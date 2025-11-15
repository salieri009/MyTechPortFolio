package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.dto.request.TechStackCreateRequest;
import com.mytechfolio.portfolio.dto.response.TechStackResponse;
import org.springframework.stereotype.Component;

/**
 * Mapper for TechStack entity conversions.
 * Handles TechStack <-> DTO conversions following DRY principle.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
public class TechStackMapper extends EntityMapper<TechStack, TechStackResponse, TechStackCreateRequest, TechStackCreateRequest> {
    
    @Override
    public TechStackResponse toResponse(TechStack techStack) {
        if (techStack == null) {
            return null;
        }
        
        return TechStackResponse.builder()
            .id(techStack.getId())
            .name(techStack.getName())
            .type(techStack.getType() != null ? techStack.getType().name() : null)
            .proficiencyLevel(techStack.getProficiencyLevel() != null ? techStack.getProficiencyLevel().name() : null)
            .proficiencyLevelValue(techStack.getProficiencyLevel() != null ? techStack.getProficiencyLevel().getLevel() : null)
            .proficiencyDisplay(techStack.getProficiencyDisplay())
            .usageCount(techStack.getUsageCount())
            .isPrimary(techStack.getIsPrimary())
            .logoUrl(techStack.getLogoUrl())
            .officialUrl(techStack.getOfficialUrl())
            .description(techStack.getDescription())
            .build();
    }
    
    @Override
    public TechStack toEntity(TechStackCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }
        
        TechStack.TechStackBuilder builder = TechStack.builder()
            .name(createRequest.getName())
            .type(TechStack.TechType.valueOf(createRequest.getType().toUpperCase()))
            .logoUrl(createRequest.getLogoUrl())
            .officialUrl(createRequest.getOfficialUrl())
            .description(createRequest.getDescription());
        
        // Set proficiency level if provided
        if (createRequest.getProficiencyLevel() != null && !createRequest.getProficiencyLevel().isEmpty()) {
            try {
                builder.proficiencyLevel(TechStack.ProficiencyLevel.valueOf(createRequest.getProficiencyLevel().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid proficiency level, use default
                builder.proficiencyLevel(TechStack.ProficiencyLevel.INTERMEDIATE);
            }
        }
        
        return builder.build();
    }
    
    @Override
    public void updateEntity(TechStack entity, TechStackCreateRequest updateRequest) {
        if (entity == null || updateRequest == null) {
            return;
        }
        
        entity.setName(updateRequest.getName());
        if (updateRequest.getType() != null) {
            entity.setType(TechStack.TechType.valueOf(updateRequest.getType().toUpperCase()));
        }
        entity.setLogoUrl(updateRequest.getLogoUrl());
        entity.setOfficialUrl(updateRequest.getOfficialUrl());
        entity.setDescription(updateRequest.getDescription());
        
        // Update proficiency level if provided
        if (updateRequest.getProficiencyLevel() != null && !updateRequest.getProficiencyLevel().isEmpty()) {
            try {
                entity.setProficiencyLevel(TechStack.ProficiencyLevel.valueOf(updateRequest.getProficiencyLevel().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid proficiency level, keep existing
            }
        }
    }
}

