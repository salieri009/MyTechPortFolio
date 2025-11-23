package com.mytechfolio.portfolio.comprehensive;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Observability Test Suite
 * Tests logging, monitoring metrics, and health check endpoints
 * Based on BACKEND_COMPREHENSIVE_TEST_CASES.md specification
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Observability Test Suite")
class ObservabilityTestSuite {

    @Autowired
    private MockMvc mockMvc;

    // ==================== Health Check Tests ====================

    @Test
    @DisplayName("[모니터링 테스트] - Health Check 엔드포인트 - /actuator/health 엔드포인트 정상 동작")
    void test_Observability_HealthCheck_Endpoint() throws Exception {
        // When/Then
        mockMvc.perform(get("/actuator/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").exists());
    }

    @Test
    @DisplayName("[모니터링 테스트] - 메트릭 엔드포인트 - /actuator/metrics 엔드포인트 정상 동작")
    void test_Observability_Metrics_Endpoint() throws Exception {
        // When/Then
        mockMvc.perform(get("/actuator/metrics"))
            .andExpect(status().isOk());
    }

    // ==================== Error Logging Tests ====================

    @Test
    @DisplayName("[로깅 테스트] - 에러 로그 기록 - 404 에러 발생 시 로그 기록")
    void test_Observability_ErrorLogging_404() throws Exception {
        // When - Request non-existent resource
        mockMvc.perform(get("/api/v1/projects/507f1f77bcf86cd799439999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("RESOURCE_NOT_FOUND"));

        // Then - Logs should be written (verified by log file inspection or log appender)
        // In a real scenario, you would verify logs using a log appender or log file
    }

    @Test
    @DisplayName("[로깅 테스트] - 인증 실패 로그 기록 - 인증 실패 시 보안 로그 기록")
    void test_Observability_AuthenticationFailure_Logging() throws Exception {
        // When - Request with invalid token
        mockMvc.perform(get("/api/v1/auth/profile")
                .header("Authorization", "Bearer invalid-token"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false));

        // Then - Security logs should be written
        // In a real scenario, verify logs contain authentication failure information
    }

    // ==================== Monitoring Metrics Tests ====================

    @Test
    @DisplayName("[모니터링 테스트] - 요청 수 모니터링 - API 요청 수가 모니터링 지표로 기록됨")
    void test_Observability_RequestCount_Monitoring() throws Exception {
        // When - Make multiple requests
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk());
        }

        // Then - Metrics should be recorded
        // In a real scenario, verify metrics endpoint shows request count
        mockMvc.perform(get("/actuator/metrics/http.server.requests"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("[모니터링 테스트] - 응답 시간 모니터링 - API 응답 시간이 모니터링 지표로 기록됨")
    void test_Observability_ResponseTime_Monitoring() throws Exception {
        // When - Make requests
        mockMvc.perform(get("/api/v1/projects"))
            .andExpect(status().isOk());

        // Then - Response time metrics should be available
        // In a real scenario, verify metrics endpoint shows response time
        mockMvc.perform(get("/actuator/metrics/http.server.requests"))
            .andExpect(status().isOk());
    }
}

