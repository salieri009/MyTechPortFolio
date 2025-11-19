package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Academic;
import com.mytechfolio.portfolio.dto.request.AcademicCreateRequest;
import com.mytechfolio.portfolio.dto.request.AcademicUpdateRequest;
import com.mytechfolio.portfolio.dto.response.AcademicResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.AcademicMapper;
import com.mytechfolio.portfolio.repository.AcademicRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AcademicServiceTest {

    @Mock
    private AcademicRepository academicRepository;
    
    @Mock
    private AcademicMapper academicMapper;
    
    @InjectMocks
    private AcademicService academicService;

    @Test
    void shouldCreateAcademicWhenValidRequest() {
        // Given
        AcademicCreateRequest request = new AcademicCreateRequest();
        request.setSemester("2024-1");
        request.setName("Software Engineering");
        request.setGrade("HD");
        
        Academic entity = Academic.builder()
            .id("academic-123")
            .semester("2024-1")
            .grade(Academic.AcademicGrade.HIGH_DISTINCTION)
            .build();
        
        AcademicResponse response = AcademicResponse.builder()
            .id("academic-123")
            .semester("2024-1")
            .build();
        
        when(academicMapper.toEntity(any())).thenReturn(entity);
        when(academicRepository.save(any())).thenReturn(entity);
        when(academicMapper.toResponse(any())).thenReturn(response);
        
        // When
        AcademicResponse result = academicService.createAcademic(request);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getSemester()).isEqualTo("2024-1");
        verify(academicRepository).save(any(Academic.class));
    }

    @Test
    void shouldUpdateAcademicWhenValidRequest() {
        // Given
        String id = "academic-123";
        AcademicUpdateRequest request = new AcademicUpdateRequest();
        request.setGrade("D");
        
        Academic existing = Academic.builder()
            .id(id)
            .semester("2024-1")
            .grade(Academic.AcademicGrade.HIGH_DISTINCTION)
            .build();
        
        AcademicResponse response = AcademicResponse.builder()
            .id(id)
            .build();
        
        when(academicRepository.findById(id)).thenReturn(Optional.of(existing));
        when(academicRepository.save(any())).thenReturn(existing);
        when(academicMapper.toResponse(any())).thenReturn(response);
        
        // When
        AcademicResponse result = academicService.updateAcademic(id, request);
        
        // Then
        assertThat(result).isNotNull();
        verify(academicMapper).updateEntity(existing, request);
        verify(academicRepository).save(existing);
    }

    @Test
    void shouldThrowExceptionWhenAcademicNotFound() {
        // Given
        String id = "non-existent-id";
        when(academicRepository.findByIdWithProjects(id)).thenReturn(Optional.empty());
        
        // When/Then
        assertThatThrownBy(() -> academicService.getAcademic(id))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Academic not found");
    }

    @Test
    void shouldDeleteAcademicWhenExists() {
        // Given
        String id = "academic-123";
        when(academicRepository.existsById(id)).thenReturn(true);
        doNothing().when(academicRepository).deleteById(id);
        
        // When
        academicService.deleteAcademic(id);
        
        // Then
        verify(academicRepository).deleteById(id);
    }
}

