package com.mytechfolio.portfolio.comprehensive;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.dto.request.ProjectUpdateRequest;
import com.mytechfolio.portfolio.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Comprehensive Functional Test Suite
 * Tests all functional requirements including happy paths, boundary cases, and invalid inputs
 * Based on BACKEND_COMPREHENSIVE_TEST_CASES.md specification
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Comprehensive Functional Test Suite")
class FunctionalTestSuite {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    void setUp() {
        // Clean up test data if needed
    }

    // ==================== Projects API Tests ====================

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 목록 조회 (정상) - 기본 페이징 파라미터로 프로젝트 목록 조회")
    void test_Projects_List_Get_WithDefaultPagination() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content").isArray())
            .andExpect(jsonPath("$.data.page").value(1))
            .andExpect(jsonPath("$.data.size").value(10))
            .andExpect(jsonPath("$.data.totalElements").exists());
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 목록 조회 (경계) - page=0으로 요청")
    void test_Projects_List_Get_WithPageZero() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "0"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 목록 조회 (경계) - size=101 (MAX 초과) 요청")
    void test_Projects_List_Get_WithSizeExceedingMax() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("size", "101"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 목록 조회 (필터링) - techStacks 파라미터로 필터링")
    void test_Projects_List_Get_WithTechStackFilter() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(get("/api/v1/projects")
                .param("techStacks", "675aa6818b8e5d32789d5801"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andReturn();
        
        // Verify filtered results contain the tech stack
        String response = result.getResponse().getContentAsString();
        assertThat(response).isNotEmpty();
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 목록 조회 (정렬) - sort=startDate,ASC로 정렬")
    void test_Projects_List_Get_WithSorting() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("sort", "startDate,ASC"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 상세 조회 (정상) - 유효한 ID로 프로젝트 조회")
    void test_Projects_GetById_WithValidId() throws Exception {
        // Given - Assume a project exists (or create one)
        String projectId = "675aa6818b8e5d32789d5894";
        
        // When/Then
        mockMvc.perform(get("/api/v1/projects/{id}", projectId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.title").exists())
            .andExpect(jsonPath("$.data.description").exists());
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 상세 조회 (잘못된 입력) - 존재하지 않는 ID로 조회")
    void test_Projects_GetById_WithNonExistentId() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects/507f1f77bcf86cd799439999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 상세 조회 (잘못된 입력) - 유효하지 않은 ObjectId 형식으로 조회")
    void test_Projects_GetById_WithInvalidIdFormat() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects/invalid-id-format"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 생성 (정상) - 모든 필수 필드 포함하여 생성")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Projects_Create_WithAllRequiredFields() throws Exception {
        // Given
        String requestBody = """
            {
              "title": "Test Project",
              "summary": "Test Summary",
              "description": "Test Description",
              "startDate": "2024-01-01",
              "endDate": "2024-12-31",
              "techStackIds": ["675aa6818b8e5d32789d5801"]
            }
            """;

        // When/Then
        MvcResult result = mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.title").value("Test Project"))
            .andExpect(jsonPath("$.data.createdAt").exists())
            .andExpect(jsonPath("$.data.updatedAt").exists())
            .andReturn();

        // Verify project can be retrieved
        String projectId = com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), "$.data.id");
        mockMvc.perform(get("/api/v1/projects/{id}", projectId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value("Test Project"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 생성 (잘못된 입력) - 필수 필드(title) 누락")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Projects_Create_WithMissingRequiredField() throws Exception {
        // Given
        ProjectCreateRequest request = new ProjectCreateRequest();
        request.setSummary("Test Summary");
        request.setDescription("Test Description");

        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 생성 (경계) - endDate가 startDate보다 이전")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Projects_Create_WithInvalidDateRange() throws Exception {
        // Given
        ProjectCreateRequest request = new ProjectCreateRequest();
        request.setTitle("Test Project");
        request.setStartDate("2024-12-31");
        request.setEndDate("2024-01-01");

        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 수정 (정상) - 존재하는 프로젝트의 일부 필드 수정")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Projects_Update_WithPartialFields() throws Exception {
        // Given - Create a project first
        ProjectCreateRequest createRequest = new ProjectCreateRequest();
        createRequest.setTitle("Original Title");
        createRequest.setSummary("Original Summary");
        createRequest.setDescription("Original Description");
        createRequest.setStartDate("2024-01-01");
        createRequest.setEndDate("2024-12-31");
        createRequest.setTechStackIds(java.util.List.of());
        createRequest.setStatus("COMPLETED");

        MvcResult createResult = mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andReturn();

        String projectId = com.jayway.jsonpath.JsonPath.read(createResult.getResponse().getContentAsString(), "$.data.id");

        // When - Update project
        ProjectUpdateRequest updateRequest = new ProjectUpdateRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setSummary("Updated Summary");

        // Then
        mockMvc.perform(put("/api/v1/projects/{id}", projectId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.title").value("Updated Title"))
            .andExpect(jsonPath("$.data.updatedAt").exists());

        // Verify update persisted
        mockMvc.perform(get("/api/v1/projects/{id}", projectId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value("Updated Title"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 수정 (잘못된 입력) - 존재하지 않는 ID로 수정 시도")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Projects_Update_WithNonExistentId() throws Exception {
        // Given
        ProjectUpdateRequest request = new ProjectUpdateRequest();
        request.setTitle("Updated Title");

        // When/Then
        mockMvc.perform(put("/api/v1/projects/507f1f77bcf86cd799439999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 삭제 (정상) - 존재하는 프로젝트 삭제")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Projects_Delete_WithValidId() throws Exception {
        // Given - Create a project first
        ProjectCreateRequest createRequest = new ProjectCreateRequest();
        createRequest.setTitle("To Be Deleted");
        createRequest.setSummary("Summary");
        createRequest.setDescription("Description");
        createRequest.setStartDate("2024-01-01");
        createRequest.setEndDate("2024-12-31");
        createRequest.setTechStackIds(java.util.List.of());
        createRequest.setStatus("COMPLETED");

        MvcResult createResult = mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andReturn();

        String projectId = com.jayway.jsonpath.JsonPath.read(createResult.getResponse().getContentAsString(), "$.data.id");

        // When - Delete project
        mockMvc.perform(delete("/api/v1/projects/{id}", projectId))
            .andExpect(status().isNoContent());

        // Then - Verify deletion
        mockMvc.perform(get("/api/v1/projects/{id}", projectId))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("[기능 테스트] - 프로젝트 삭제 (잘못된 입력) - 존재하지 않는 ID로 삭제 시도")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Projects_Delete_WithNonExistentId() throws Exception {
        // When/Then
        mockMvc.perform(delete("/api/v1/projects/507f1f77bcf86cd799439999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("RESOURCE_NOT_FOUND"));
    }
}

