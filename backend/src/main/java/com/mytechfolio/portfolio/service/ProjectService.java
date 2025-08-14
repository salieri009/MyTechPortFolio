package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Academic;
import com.mytechfolio.portfolio.domain.Project;
import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.dto.request.ProjectUpdateRequest;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.dto.response.ProjectDetailResponse;
import com.mytechfolio.portfolio.dto.response.ProjectSummaryResponse;
import com.mytechfolio.portfolio.repository.AcademicRepository;
import com.mytechfolio.portfolio.repository.ProjectRepository;
import com.mytechfolio.portfolio.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TechStackRepository techStackRepository;
    private final AcademicRepository academicRepository;

    public PageResponse<ProjectSummaryResponse> getProjects(int page, int size, String sort, String techStacks, Integer year) {
        // Parse sorting parameter
        Sort sortBy = Sort.by(Sort.Direction.DESC, "endDate"); // default
        if (sort != null && !sort.isEmpty()) {
            String[] sortParts = sort.split(",");
            if (sortParts.length == 2) {
                String field = sortParts[0];
                String direction = sortParts[1];
                sortBy = Sort.by(
                        direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,
                        field
                );
            }
        }

        // Parse tech stacks filter
        List<String> techStackList = null;
        if (techStacks != null && !techStacks.isEmpty()) {
            techStackList = Arrays.asList(techStacks.split(","));
        }

        Pageable pageable = PageRequest.of(page - 1, size, sortBy);
        Page<Project> projectPage = projectRepository.findProjectsWithFilters(techStackList, year, pageable);

        List<ProjectSummaryResponse> projects = projectPage.getContent().stream()
                .map(ProjectSummaryResponse::from)
                .collect(Collectors.toList());

        return PageResponse.<ProjectSummaryResponse>builder()
                .page(page)
                .size(size)
                .total(projectPage.getTotalElements())
                .items(projects)
                .build();
    }

    public ProjectDetailResponse getProject(String id) {
        Project project = projectRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return ProjectDetailResponse.from(project);
    }

    @Transactional
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        // Fetch tech stacks and academics
        List<TechStack> techStacks = techStackRepository.findByIdIn(request.getTechStackIds());
        List<Academic> academics = request.getAcademicIds() != null ?
                academicRepository.findAllById(request.getAcademicIds()) :
                List.of();

        Project project = Project.builder()
                .title(request.getTitle())
                .summary(request.getSummary())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .techStackIds(request.getTechStackIds())
                .relatedAcademicIds(request.getAcademicIds())
                .build();

        Project savedProject = projectRepository.save(project);
        return ProjectDetailResponse.from(savedProject);
    }

    @Transactional
    public ProjectDetailResponse updateProject(String id, ProjectUpdateRequest request) {
        Project project = projectRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        // Fetch new tech stacks and academics
        List<TechStack> techStacks = techStackRepository.findByIdIn(request.getTechStackIds());
        List<Academic> academics = request.getAcademicIds() != null ?
                academicRepository.findAllById(request.getAcademicIds()) :
                List.of();

        // Update project fields
        project.setTitle(request.getTitle());
        project.setSummary(request.getSummary());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setGithubUrl(request.getGithubUrl());
        project.setDemoUrl(request.getDemoUrl());
        project.setTechStacks(techStacks);
        project.setAcademics(academics);

        Project savedProject = projectRepository.save(project);
        return ProjectDetailResponse.from(savedProject);
    }

    @Transactional
    public void deleteProject(String id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
    
    @Transactional
    public void deleteAllProjects() {
        projectRepository.deleteAll();
    }
}
