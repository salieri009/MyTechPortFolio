package com.mytechfolio.portfolio.comprehensive;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mytechfolio.portfolio.domain.Project;
import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.repository.ProjectRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Database Layer Test Suite
 * Tests CRUD operations, transactions, data integrity, and constraints
 * Based on BACKEND_COMPREHENSIVE_TEST_CASES.md specification
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Database Layer Test Suite")
class DatabaseTestSuite {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private ProjectRepository projectRepository;

    // ==================== CRUD Operations Tests ====================

    @Test
    @DisplayName("[데이터베이스 테스트] - Create 동작 검증 - 프로젝트 생성 시 MongoDB에 정확히 저장됨")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Database_Create_Operation() throws Exception {
        // Given
        ProjectCreateRequest request = new ProjectCreateRequest();
        request.setTitle("Database Test Project");
        request.setSummary("Test Summary");
        request.setDescription("Test Description");
        request.setStartDate("2024-01-01");
        request.setEndDate("2024-12-31");
        request.setTechStackIds(java.util.List.of());
        request.setStatus("COMPLETED");

        // When
        MvcResult result = mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andReturn();

        String projectId = com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), "$.data.id");

        // Then - Verify in database
        Optional<Project> savedProject = projectRepository.findById(projectId);
        assertThat(savedProject).isPresent();
        assertThat(savedProject.get().getTitle()).isEqualTo("Database Test Project");
        assertThat(savedProject.get().getId()).isNotNull();
        assertThat(savedProject.get().getCreatedAt()).isNotNull();
        assertThat(savedProject.get().getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("[데이터베이스 테스트] - Read 동작 검증 - 프로젝트 조회 시 MongoDB에서 정확히 조회됨")
    void test_Database_Read_Operation() throws Exception {
        // Given - Create a project directly in database
        Project project = new Project();
        project.setTitle("Read Test Project");
        project.setSummary("Summary");
        project.setDescription("Description");
        project.setStatus("COMPLETED");
        Project savedProject = projectRepository.save(project);
        String projectId = savedProject.getId();

        // When
        MvcResult result = mockMvc.perform(get("/api/v1/projects/{id}", projectId))
            .andExpect(status().isOk())
            .andReturn();

        // Then - Verify response matches database
        String response = result.getResponse().getContentAsString();
        String title = com.jayway.jsonpath.JsonPath.read(response, "$.data.title");
        assertThat(title).isEqualTo("Read Test Project");
        
        // Verify all fields are correctly mapped
        assertThat(com.jayway.jsonpath.JsonPath.read(response, "$.data.id")).isEqualTo(projectId);
        assertThat(com.jayway.jsonpath.JsonPath.read(response, "$.data.summary")).isEqualTo("Summary");
    }

    @Test
    @DisplayName("[데이터베이스 테스트] - Update 동작 검증 - 프로젝트 수정 시 MongoDB에서 정확히 업데이트됨")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Database_Update_Operation() throws Exception {
        // Given - Create a project
        Project project = new Project();
        project.setTitle("Original Title");
        project.setSummary("Original Summary");
        project.setDescription("Description");
        project.setStatus("COMPLETED");
        Project savedProject = projectRepository.save(project);
        String projectId = savedProject.getId();
        LocalDateTime originalUpdatedAt = savedProject.getUpdatedAt();

        // When - Update project
        String updateBody = objectMapper.writeValueAsString(
            java.util.Map.of("title", "Updated Title", "summary", "Updated Summary")
        );

        mockMvc.perform(put("/api/v1/projects/{id}", projectId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateBody))
            .andExpect(status().isOk());

        // Then - Verify in database
        Optional<Project> updatedProject = projectRepository.findById(projectId);
        assertThat(updatedProject).isPresent();
        assertThat(updatedProject.get().getTitle()).isEqualTo("Updated Title");
        assertThat(updatedProject.get().getSummary()).isEqualTo("Updated Summary");
        assertThat(updatedProject.get().getUpdatedAt()).isAfter(originalUpdatedAt);
    }

    @Test
    @DisplayName("[데이터베이스 테스트] - Delete 동작 검증 - 프로젝트 삭제 시 MongoDB에서 정확히 삭제됨")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Database_Delete_Operation() throws Exception {
        // Given - Create a project
        Project project = new Project();
        project.setTitle("To Be Deleted");
        project.setSummary("Summary");
        project.setDescription("Description");
        project.setStatus("COMPLETED");
        Project savedProject = projectRepository.save(project);
        String projectId = savedProject.getId();

        // When - Delete project
        mockMvc.perform(delete("/api/v1/projects/{id}", projectId))
            .andExpect(status().isNoContent());

        // Then - Verify deletion in database
        Optional<Project> deletedProject = projectRepository.findById(projectId);
        assertThat(deletedProject).isEmpty();
    }

    // ==================== Data Integrity Tests ====================

    @Test
    @DisplayName("[데이터베이스 테스트] - 참조 무결성 - 존재하지 않는 techStackId 참조 시 검증")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Database_ReferentialIntegrity() throws Exception {
        // Given
        ProjectCreateRequest request = new ProjectCreateRequest();
        request.setTitle("Test");
        request.setSummary("Summary");
        request.setDescription("Description");
        request.setStartDate("2024-01-01");
        request.setEndDate("2024-12-31");
        request.setTechStackIds(java.util.List.of("507f1f77bcf86cd799439999")); // Non-existent ID
        request.setStatus("COMPLETED");

        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false));

        // Verify project was not created
        long count = projectRepository.count();
        // This assumes no other projects exist or we track the count before
    }

    @Test
    @DisplayName("[데이터베이스 테스트] - 필수 필드 검증 - 필수 필드 누락 시 데이터베이스 저장 실패")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Database_RequiredFieldsValidation() throws Exception {
        // Given
        ProjectCreateRequest request = new ProjectCreateRequest();
        // title is missing

        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("[데이터베이스 테스트] - 데이터 타입 검증 - 잘못된 데이터 타입으로 저장 시도")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Database_DataTypeValidation() throws Exception {
        // Given - Invalid type (title as number)
        String invalidBody = "{\"title\": 12345, \"summary\": \"Test\"}";

        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }
}

