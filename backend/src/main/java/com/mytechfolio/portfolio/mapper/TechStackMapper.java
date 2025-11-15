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
            .type(techStack.getType().name())
            .build();
    }
    
    @Override
    public TechStack toEntity(TechStackCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }
        
        return TechStack.builder()
            .name(createRequest.getName())
            .type(TechStack.TechType.valueOf(createRequest.getType().toUpperCase()))
            .logoUrl(createRequest.getLogoUrl())
            .build();
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
    }
}

