package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.Academic;
import com.mytechfolio.portfolio.dto.request.AcademicCreateRequest;
import com.mytechfolio.portfolio.dto.request.AcademicUpdateRequest;
import com.mytechfolio.portfolio.dto.response.AcademicResponse;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * Mapper for Academic entity conversions.
 * Handles Academic <-> DTO conversions following DRY principle.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
public class AcademicMapper extends EntityMapper<Academic, AcademicResponse, AcademicCreateRequest, AcademicUpdateRequest> {
    
    @Override
    public AcademicResponse toResponse(Academic academic) {
        if (academic == null) {
            return null;
        }
        
        return AcademicResponse.builder()
            .id(academic.getId())
            .name(academic.getName())
            .semester(academic.getSemester())
            .grade(academic.getGrade() != null ? academic.getGrade().name() : null)
            .description(academic.getDescription())
            .relatedProjects(academic.getProjects().stream()
                .map(project -> AcademicResponse.RelatedProject.builder()
                    .id(project.getId())
                    .title(project.getTitle())
                    .build())
                .collect(Collectors.toList()))
            .build();
    }
    
    @Override
    public Academic toEntity(AcademicCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }
        
        Academic.AcademicGrade grade = convertStringToGrade(createRequest.getGrade());
        
        return Academic.builder()
            .name(createRequest.getName())
            .semester(createRequest.getSemester())
            .grade(grade)
            .description(createRequest.getDescription())
            .build();
    }
    
    @Override
    public void updateEntity(Academic entity, AcademicUpdateRequest updateRequest) {
        if (entity == null || updateRequest == null) {
            return;
        }
        
        entity.setName(updateRequest.getName());
        entity.setSemester(updateRequest.getSemester());
        entity.setDescription(updateRequest.getDescription());
        
        if (updateRequest.getGrade() != null && !updateRequest.getGrade().trim().isEmpty()) {
            Academic.AcademicGrade grade = convertStringToGrade(updateRequest.getGrade());
            entity.setGrade(grade);
        }
    }
    
    /**
     * Converts String to AcademicGrade enum.
     * 
     * @param gradeStr Grade string
     * @return AcademicGrade or null
     */
    private Academic.AcademicGrade convertStringToGrade(String gradeStr) {
        if (gradeStr == null || gradeStr.trim().isEmpty()) {
            return null;
        }
        try {
            return Academic.AcademicGrade.valueOf(gradeStr.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}

