package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Project;
import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.dto.request.ProjectUpdateRequest;
import com.mytechfolio.portfolio.dto.response.ProjectDetailResponse;
import com.mytechfolio.portfolio.dto.response.ProjectSummaryResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.ProjectMapper;
import com.mytechfolio.portfolio.repository.AcademicRepository;
import com.mytechfolio.portfolio.repository.ProjectRepository;
import com.mytechfolio.portfolio.repository.TechStackRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;
    
    @Mock
    private TechStackRepository techStackRepository;
    
    @Mock
    private AcademicRepository academicRepository;
    
    @Mock
    private ProjectMapper projectMapper;
    
    @InjectMocks
    private ProjectService projectService;

    @Test
    void shouldCreateProjectWhenValidRequest() {
        // Given
        ProjectCreateRequest request = new ProjectCreateRequest(
            "Test Project",
            "Test Summary",
            "Test Description",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            null,
            null,
            List.of("tech1", "tech2"),
            null
        );
        
        Project entity = Project.builder()
            .id("123")
            .title("Test Project")
            .build();
        
        ProjectDetailResponse response = ProjectDetailResponse.builder()
            .id("123")
            .title("Test Project")
            .build();
        
        when(techStackRepository.findByIdIn(any())).thenReturn(List.of(new TechStack()));
        when(academicRepository.findAllById(any())).thenReturn(List.of());
        when(projectMapper.toEntity(any())).thenReturn(entity);
        when(projectRepository.save(any())).thenReturn(entity);
        lenient().when(projectMapper.toResponse(any())).thenReturn(response);
        
        // When
        ProjectDetailResponse result = projectService.createProject(request);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Project");
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void shouldThrowExceptionWhenProjectNotFound() {
        // Given
        String id = "non-existent-id";
        when(projectRepository.findByIdWithDetails(id)).thenReturn(Optional.empty());
        
        // When/Then
        assertThatThrownBy(() -> projectService.getProject(id))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Project not found");
    }

    @Test
    void shouldGetProjectsWithTechStackFilter() {
        // Given
        int page = 1;
        int size = 10;
        String sort = "endDate,desc";
        String techStacks = "tech1,tech2";
        Integer year = 2024;
        
        Page<Project> projectPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);
        
        when(projectRepository.findProjectsWithFilters(any(), eq(year), any()))
            .thenReturn(projectPage);
        
        // When
        var result = projectService.getProjects(page, size, sort, techStacks, year);
        
        // Then
        assertThat(result).isNotNull();
        verify(projectRepository).findProjectsWithFilters(any(), eq(year), any());
    }

    @Test
    void shouldUpdateProjectWhenValidRequest() {
        // Given
        String id = "project-123";
        ProjectUpdateRequest request = new ProjectUpdateRequest(
            "Updated Title",
            "Updated Summary",
            "Updated Description",
            LocalDate.now(),
            LocalDate.now().plusDays(30),
            null,
            null,
            List.of("tech1"),
            null
        );
        
        Project existing = Project.builder()
            .id(id)
            .title("Original Title")
            .build();
        
        ProjectDetailResponse response = ProjectDetailResponse.builder()
            .id(id)
            .title("Updated Title")
            .build();
        
        when(projectRepository.findByIdWithDetails(id)).thenReturn(Optional.of(existing));
        when(projectRepository.save(any())).thenReturn(existing);
        when(projectMapper.toResponse(any())).thenReturn(response);
        
        // When
        ProjectDetailResponse result = projectService.updateProject(id, request);
        
        // Then
        assertThat(result).isNotNull();
        verify(projectMapper).updateEntity(existing, request);
        verify(projectRepository).save(existing);
    }

    @Test
    void shouldDeleteProjectWhenExists() {
        // Given
        String id = "project-123";
        when(projectRepository.existsById(id)).thenReturn(true);
        doNothing().when(projectRepository).deleteById(id);
        
        // When
        projectService.deleteProject(id);
        
        // Then
        verify(projectRepository).deleteById(id);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistentProject() {
        // Given
        String id = "non-existent-id";
        when(projectRepository.existsById(id)).thenReturn(false);
        
        // When/Then
        assertThatThrownBy(() -> projectService.deleteProject(id))
            .isInstanceOf(ResourceNotFoundException.class);
    }
}

