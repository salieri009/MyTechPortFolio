package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.Project;
import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.dto.request.ProjectUpdateRequest;
import com.mytechfolio.portfolio.dto.response.ProjectDetailResponse;
import com.mytechfolio.portfolio.dto.response.ProjectSummaryResponse;
import com.mytechfolio.portfolio.repository.AcademicRepository;
import com.mytechfolio.portfolio.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for Project entity conversions.
 * Handles Project <-> DTO conversions following DRY principle.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
@RequiredArgsConstructor
public class ProjectMapper extends EntityMapper<Project, ProjectDetailResponse, ProjectCreateRequest, ProjectUpdateRequest> {
    
    private final TechStackRepository techStackRepository;
    private final AcademicRepository academicRepository;
    
    @Override
    public ProjectDetailResponse toResponse(Project project) {
        if (project == null) {
            return null;
        }
        
        // Fetch related entities for detailed response
        List<TechStack> techStacks = project.getTechStackIds() != null && !project.getTechStackIds().isEmpty()
            ? techStackRepository.findByIdIn(project.getTechStackIds())
            : List.of();
        
        List<String> techStackNames = techStacks.stream()
            .map(TechStack::getName)
            .collect(Collectors.toList());
        
        List<String> academicNames = project.getRelatedAcademicIds() != null && !project.getRelatedAcademicIds().isEmpty()
            ? academicRepository.findAllById(project.getRelatedAcademicIds()).stream()
                .map(com.mytechfolio.portfolio.domain.Academic::getName)
                .collect(Collectors.toList())
            : List.of();
        
        return ProjectDetailResponse.builder()
            .id(project.getId())
            .title(project.getTitle())
            .summary(project.getSummary())
            .description(project.getDescription())
            .startDate(project.getStartDate())
            .endDate(project.getEndDate())
            .githubUrl(project.getGithubUrl())
            .demoUrl(project.getDemoUrl())
            .techStacks(techStackNames)
            .relatedAcademics(academicNames)
            .build();
    }
    
    /**
     * Converts Project to ProjectSummaryResponse.
     * 
     * @param project Project entity
     * @return ProjectSummaryResponse
     */
    public ProjectSummaryResponse toSummaryResponse(Project project) {
        if (project == null) {
            return null;
        }
        
        List<TechStack> techStacks = project.getTechStackIds() != null && !project.getTechStackIds().isEmpty()
            ? techStackRepository.findByIdIn(project.getTechStackIds())
            : List.of();
        
        List<String> techStackNames = techStacks.stream()
            .map(TechStack::getName)
            .collect(Collectors.toList());
        
        return ProjectSummaryResponse.builder()
            .id(project.getId())
            .title(project.getTitle())
            .summary(project.getSummary())
            .startDate(project.getStartDate())
            .endDate(project.getEndDate())
            .techStacks(techStackNames)
            .build();
    }
    
    @Override
    public Project toEntity(ProjectCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }
        
        return Project.builder()
            .title(createRequest.getTitle())
            .summary(createRequest.getSummary())
            .description(createRequest.getDescription())
            .startDate(createRequest.getStartDate())
            .endDate(createRequest.getEndDate())
            .githubUrl(createRequest.getGithubUrl())
            .demoUrl(createRequest.getDemoUrl())
            .techStackIds(createRequest.getTechStackIds())
            .relatedAcademicIds(createRequest.getAcademicIds())
            .build();
    }
    
    @Override
    public void updateEntity(Project entity, ProjectUpdateRequest updateRequest) {
        if (entity == null || updateRequest == null) {
            return;
        }
        
        entity.setTitle(updateRequest.getTitle());
        entity.setSummary(updateRequest.getSummary());
        entity.setDescription(updateRequest.getDescription());
        entity.setStartDate(updateRequest.getStartDate());
        entity.setEndDate(updateRequest.getEndDate());
        entity.setGithubUrl(updateRequest.getGithubUrl());
        entity.setDemoUrl(updateRequest.getDemoUrl());
        entity.setTechStackIds(updateRequest.getTechStackIds());
        entity.setRelatedAcademicIds(updateRequest.getAcademicIds());
    }
}

