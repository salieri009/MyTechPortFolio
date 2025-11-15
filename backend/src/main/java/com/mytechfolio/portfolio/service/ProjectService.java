package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.domain.Academic;
import com.mytechfolio.portfolio.domain.Project;
import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.dto.request.ProjectUpdateRequest;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.dto.response.ProjectDetailResponse;
import com.mytechfolio.portfolio.dto.response.ProjectSummaryResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.ProjectMapper;
import com.mytechfolio.portfolio.repository.AcademicRepository;
import com.mytechfolio.portfolio.repository.ProjectRepository;
import com.mytechfolio.portfolio.repository.TechStackRepository;
import com.mytechfolio.portfolio.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for project management operations.
 * Handles business logic for projects including CRUD operations, filtering, and pagination.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TechStackRepository techStackRepository;
    private final AcademicRepository academicRepository;
    private final ProjectMapper projectMapper;

    /**
     * Retrieves a paginated list of projects with optional filtering and sorting.
     * 
     * @param page Page number (1-based)
     * @param size Page size
     * @param sort Sort criteria (field,direction)
     * @param techStacks Comma-separated tech stack IDs for filtering
     * @param year Year filter
     * @return Paginated response with project summaries
     */
    public PageResponse<ProjectSummaryResponse> getProjects(int page, int size, String sort, String techStacks, Integer year) {
        log.debug("Fetching projects - page: {}, size: {}, sort: {}, techStacks: {}, year: {}", 
                  page, size, sort, techStacks, year);
        
        // Use reusable pagination utility with default sort field
        Sort sortBy = PaginationUtil.parseSort(sort, ApiConstants.DEFAULT_SORT_FIELD, Sort.Direction.DESC);

        // Parse tech stacks filter
        List<String> techStackList = null;
        if (techStacks != null && !techStacks.isEmpty()) {
            techStackList = Arrays.asList(techStacks.split(","));
        }

        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy);
        Page<Project> projectPage = projectRepository.findProjectsWithFilters(techStackList, year, pageable);

        // Use mapper for conversion
        return PaginationUtil.toPageResponse(projectPage, projectMapper::toSummaryResponse, page);
    }

    /**
     * Retrieves a single project by ID.
     * 
     * @param id Project ID (MongoDB ObjectId)
     * @return Project detail response
     * @throws ResourceNotFoundException if project not found
     */
    public ProjectDetailResponse getProject(String id) {
        log.debug("Fetching project with ID: {}", id);
        Project project = projectRepository.findByIdWithDetails(id)
                .orElseThrow(() -> {
                    log.warn("Project not found with ID: {}", id);
                    return new ResourceNotFoundException("Project", id);
                });
        return projectMapper.toResponse(project);
    }

    /**
     * Creates a new project.
     * 
     * @param request Project creation request
     * @return Created project detail response
     */
    @Transactional
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        log.info("Creating new project: {}", request.getTitle());
        
        // Fetch tech stacks and academics
        List<TechStack> techStacks = techStackRepository.findByIdIn(request.getTechStackIds());
        List<Academic> academics = request.getAcademicIds() != null ?
                academicRepository.findAllById(request.getAcademicIds()) :
                List.of();
        
        log.debug("Project will be associated with {} tech stacks and {} academics", 
                  techStacks.size(), academics.size());

        Project project = projectMapper.toEntity(request);
        Project savedProject = projectRepository.save(project);
        log.info("Project created successfully with ID: {}", savedProject.getId());
        return projectMapper.toResponse(savedProject);
    }

    /**
     * Updates an existing project.
     * 
     * @param id Project ID
     * @param request Project update request
     * @return Updated project detail response
     * @throws ResourceNotFoundException if project not found
     */
    @Transactional
    public ProjectDetailResponse updateProject(String id, ProjectUpdateRequest request) {
        log.info("Updating project with ID: {}", id);
        Project project = projectRepository.findByIdWithDetails(id)
                .orElseThrow(() -> {
                    log.warn("Project not found for update with ID: {}", id);
                    return new ResourceNotFoundException("Project", id);
                });

        // Update project using mapper
        projectMapper.updateEntity(project, request);

        Project savedProject = projectRepository.save(project);
        log.info("Project updated successfully with ID: {}", savedProject.getId());
        return projectMapper.toResponse(savedProject);
    }

    /**
     * Deletes a project by ID.
     * 
     * @param id Project ID
     * @throws ResourceNotFoundException if project not found
     */
    @Transactional
    public void deleteProject(String id) {
        log.info("Deleting project with ID: {}", id);
        if (!projectRepository.existsById(id)) {
            log.warn("Project not found for deletion with ID: {}", id);
            throw new ResourceNotFoundException("Project", id);
        }
        projectRepository.deleteById(id);
        log.info("Project deleted successfully with ID: {}", id);
    }
    
    /**
     * Deletes all projects.
     * WARNING: This is a destructive operation. Use with caution.
     */
    @Transactional
    public void deleteAllProjects() {
        log.warn("Deleting all projects - this is a destructive operation");
        long count = projectRepository.count();
        projectRepository.deleteAll();
        log.info("Deleted {} projects", count);
    }
}
