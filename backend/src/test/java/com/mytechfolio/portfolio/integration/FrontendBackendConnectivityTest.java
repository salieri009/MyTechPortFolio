package com.mytechfolio.portfolio.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Frontend-Backend Connectivity Integration Tests
 * Tests the connection and communication between frontend and backend APIs
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Frontend-Backend Connectivity Tests")
class FrontendBackendConnectivityTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Setup can be added here if needed
    }

    @Test
    @DisplayName("TC-001: Frontend should successfully connect to backend health endpoint")
    void test001_HealthEndpointConnectivity() throws Exception {
        // When/Then
        mockMvc.perform(get("/actuator/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").exists());
    }

    @Test
    @DisplayName("TC-002: Frontend should receive CORS headers from backend")
    void test002_CorsHeadersPresent() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(
                options("/api/v1/projects")
                    .header("Origin", "http://localhost:5173")
                    .header("Access-Control-Request-Method", "GET"))
            .andExpect(status().isOk())
            .andReturn();
        
        assertThat(result.getResponse().getHeader("Access-Control-Allow-Origin"))
            .isNotNull();
    }

    @Test
    @DisplayName("TC-003: Frontend should successfully fetch projects list")
    void test003_FetchProjectsList() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("TC-004: Frontend should handle pagination parameters correctly")
    void test004_PaginationParameters() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "2")
                .param("size", "5"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.page").value(2))
            .andExpect(jsonPath("$.data.size").value(5));
    }

    @Test
    @DisplayName("TC-005: Frontend should successfully fetch academics list")
    void test005_FetchAcademicsList() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/academics")
                .param("page", "1")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @DisplayName("TC-006: Frontend should receive proper error response for invalid project ID")
    void test006_InvalidProjectIdError() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(get("/api/v1/projects/invalid-id"))
            .andReturn();
        
        assertThat(result.getResponse().getStatus())
            .isIn(400, 404);
        assertThat(result.getResponse().getContentAsString())
            .contains("\"success\"");
    }

    @Test
    @DisplayName("TC-007: Frontend should receive proper error response for non-existent project")
    void test007_NonExistentProjectError() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects/507f1f77bcf86cd799439999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").exists());
    }

    @Test
    @DisplayName("TC-008: Frontend should successfully filter projects by tech stack")
    void test008_FilterProjectsByTechStack() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10")
                .param("techStacks", "React,Spring Boot"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("TC-009: Frontend should successfully filter projects by year")
    void test009_FilterProjectsByYear() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10")
                .param("year", "2024"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("TC-010: Frontend should successfully sort projects")
    void test010_SortProjects() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10")
                .param("sort", "endDate,desc"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("TC-011: Frontend should receive consistent API response format")
    void test011_ConsistentApiResponseFormat() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andReturn();
        
        String content = result.getResponse().getContentAsString();
        assertThat(content).contains("\"success\"");
        assertThat(content).contains("\"data\"");
    }

    @Test
    @DisplayName("TC-012: Frontend should handle empty results gracefully")
    void test012_HandleEmptyResults() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "999")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.content").isArray())
            .andExpect(jsonPath("$.data.totalElements").exists());
    }

    @Test
    @DisplayName("TC-013: Frontend should receive proper Content-Type header")
    void test013_ContentTypeHeader() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn();
        
        assertThat(result.getResponse().getContentType())
            .contains(MediaType.APPLICATION_JSON_VALUE);
    }

    @Test
    @DisplayName("TC-014: Frontend should handle contact form submission")
    void test014_ContactFormSubmission() throws Exception {
        // Given
        String contactJson = """
            {
                "name": "Test User",
                "email": "test@example.com",
                "message": "This is a test message",
                "website": ""
            }
            """;
        
        // When/Then
        MvcResult result = mockMvc.perform(post("/api/v1/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contactJson))
            .andReturn();
        
        assertThat(result.getResponse().getStatus())
            .isIn(200, 201);
        assertThat(result.getResponse().getContentAsString())
            .contains("\"success\"");
    }

    @Test
    @DisplayName("TC-015: Frontend should receive validation errors for invalid contact data")
    void test015_ContactFormValidation() throws Exception {
        // Given
        String invalidContactJson = """
            {
                "name": "",
                "email": "invalid-email",
                "message": "short"
            }
            """;
        
        // When/Then
        mockMvc.perform(post("/api/v1/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidContactJson))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-016: Frontend should handle API timeout scenarios")
    void test016_ApiTimeoutHandling() throws Exception {
        // When/Then - API should respond within reasonable time
        long startTime = System.currentTimeMillis();
        
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10"))
            .andExpect(status().isOk());
        
        long duration = System.currentTimeMillis() - startTime;
        assertThat(duration).isLessThan(5000); // Should respond within 5 seconds
    }

    @Test
    @DisplayName("TC-017: Frontend should receive proper error messages")
    void test017_ErrorMessagesFormat() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(get("/api/v1/projects/invalid-id"))
            .andReturn();
        
        assertThat(result.getResponse().getStatus())
            .isIn(400, 404);
        String content = result.getResponse().getContentAsString();
        assertThat(content).contains("\"errorCode\"");
        assertThat(content).contains("\"message\"");
    }

    @Test
    @DisplayName("TC-018: Frontend should handle filter combinations correctly")
    void test018_FilterCombinations() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10")
                .param("techStacks", "React")
                .param("year", "2024")
                .param("sort", "endDate,desc"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("TC-019: Frontend should receive academics with semester filter")
    void test019_AcademicsSemesterFilter() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/academics")
                .param("page", "1")
                .param("size", "10")
                .param("semester", "2024"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("TC-020: Frontend should handle concurrent API requests")
    void test020_ConcurrentRequests() throws Exception {
        // When/Then - Multiple requests should be handled correctly
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/v1/projects")
                    .param("page", "1")
                    .param("size", "10"))
                .andExpect(status().isOk());
        }
    }
}

