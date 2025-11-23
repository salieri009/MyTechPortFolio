package com.mytechfolio.portfolio.comprehensive;

import com.fasterxml.jackson.databind.ObjectMapper;
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
 * API Layer Test Suite
 * Tests API request/response structure, authentication/authorization, CORS, and error handling
 * Based on BACKEND_COMPREHENSIVE_TEST_CASES.md specification
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("API Layer Test Suite")
class ApiLayerTestSuite {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;

    // ==================== Request/Response Structure Tests ====================

    @Test
    @DisplayName("[API 테스트] - 응답 구조 검증 (성공) - 모든 성공 응답이 표준 ApiResponse 형식 준수")
    void test_ApiResponse_Structure_Success() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(get("/api/v1/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.timestamp").exists())
            .andReturn();

        // Verify timestamp is ISO 8601 format
        String timestamp = com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), "$.timestamp");
        assertThat(timestamp).matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.*");
    }

    @Test
    @DisplayName("[API 테스트] - 응답 구조 검증 (에러) - 모든 에러 응답이 표준 ApiResponse 형식 준수")
    void test_ApiResponse_Structure_Error() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects/507f1f77bcf86cd799439999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").exists())
            .andExpect(jsonPath("$.error.message").exists())
            .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    @DisplayName("[API 테스트] - 페이징 응답 구조 검증 - 페이징된 응답이 PageResponse 형식 준수")
    void test_Pagination_Response_Structure() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "2")
                .param("size", "5"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.content").isArray())
            .andExpect(jsonPath("$.data.page").value(2))
            .andExpect(jsonPath("$.data.size").value(5))
            .andExpect(jsonPath("$.data.totalElements").exists())
            .andExpect(jsonPath("$.data.totalPages").exists())
            .andExpect(jsonPath("$.data.hasNext").exists())
            .andExpect(jsonPath("$.data.hasPrevious").exists());
    }

    @Test
    @DisplayName("[API 테스트] - Content-Type 검증 - 모든 응답이 application/json 반환")
    void test_ContentType_IsJson() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(get("/api/v1/projects"))
            .andExpect(status().isOk())
            .andReturn();

        assertThat(result.getResponse().getContentType())
            .isEqualTo(MediaType.APPLICATION_JSON_VALUE);
    }

    // ==================== Authentication/Authorization Tests ====================

    @Test
    @DisplayName("[API 테스트] - 인증 (정상) - 유효한 JWT 토큰으로 보호된 엔드포인트 접근")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Authentication_WithValidToken() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/auth/profile"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("[API 테스트] - 인증 (실패) - 토큰 없이 보호된 엔드포인트 접근")
    void test_Authentication_WithoutToken() throws Exception {
        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("[API 테스트] - 인증 (실패) - 유효하지 않은 JWT 토큰으로 접근")
    void test_Authentication_WithInvalidToken() throws Exception {
        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .header("Authorization", "Bearer invalid-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("AUTHENTICATION_FAILED"));
    }

    @Test
    @DisplayName("[API 테스트] - 인가 (정상) - CONTENT_MANAGER 권한으로 관리 엔드포인트 접근")
    @WithMockUser(roles = "CONTENT_MANAGER")
    void test_Authorization_WithContentManagerRole() throws Exception {
        // Given
        String requestBody = objectMapper.writeValueAsString(
            java.util.Map.of("title", "Test", "summary", "Test Summary")
        );

        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("[API 테스트] - 인가 (실패) - 권한 없는 사용자가 관리 엔드포인트 접근")
    @WithMockUser(roles = "USER")
    void test_Authorization_WithoutRequiredRole() throws Exception {
        // Given
        String requestBody = objectMapper.writeValueAsString(
            java.util.Map.of("title", "Test", "summary", "Test Summary")
        );

        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("FORBIDDEN"));
    }

    @Test
    @DisplayName("[API 테스트] - Public 엔드포인트 접근 - 인증 없이 Public 엔드포인트 접근")
    void test_PublicEndpoint_AccessWithoutAuth() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").exists());
    }

    // ==================== Error Code and CORS Tests ====================

    @Test
    @DisplayName("[API 테스트] - 에러 코드 일관성 - 동일한 에러 상황에서 일관된 에러 코드 반환")
    void test_ErrorCode_Consistency() throws Exception {
        // When/Then - Multiple requests for non-existent resource
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(get("/api/v1/projects/507f1f77bcf86cd799439999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("RESOURCE_NOT_FOUND"));
        }
    }

    @Test
    @DisplayName("[API 테스트] - 에러 메시지 보안 - 에러 메시지에 내부 시스템 정보 노출되지 않음")
    void test_ErrorMessage_Security() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(get("/api/v1/projects/invalid-id"))
            .andExpect(status().isBadRequest())
            .andReturn();

        String response = result.getResponse().getContentAsString();
        // Verify no internal system information is exposed
        assertThat(response).doesNotContain("at ");
        assertThat(response).doesNotContain("Exception");
        assertThat(response).doesNotContain("StackTrace");
    }

    @Test
    @DisplayName("[API 테스트] - CORS 헤더 검증 - OPTIONS 요청에 올바른 CORS 헤더 반환")
    void test_CORS_Headers() throws Exception {
        // When/Then
        MvcResult result = mockMvc.perform(options("/api/v1/projects")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "GET"))
            .andExpect(status().isOk())
            .andReturn();

        assertThat(result.getResponse().getHeader("Access-Control-Allow-Origin"))
            .isNotNull();
        assertThat(result.getResponse().getHeader("Access-Control-Allow-Methods"))
            .isNotNull();
        assertThat(result.getResponse().getHeader("Access-Control-Allow-Headers"))
            .isNotNull();
    }
}

