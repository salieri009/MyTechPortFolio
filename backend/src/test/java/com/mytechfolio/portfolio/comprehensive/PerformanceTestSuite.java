package com.mytechfolio.portfolio.comprehensive;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Performance Test Suite
 * Tests concurrent request handling, bulk data operations, and SLA compliance
 * Based on BACKEND_COMPREHENSIVE_TEST_CASES.md specification
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Performance Test Suite")
class PerformanceTestSuite {

    @Autowired
    private MockMvc mockMvc;

    // ==================== Concurrent Request Tests ====================

    @Test
    @DisplayName("[성능 테스트] - 동시 요청 처리 (읽기) - 100개의 동시 GET 요청 처리")
    void test_Performance_ConcurrentReadRequests() throws Exception {
        // Given
        int numberOfRequests = 100;
        ExecutorService executor = Executors.newFixedThreadPool(20);
        List<CompletableFuture<Long>> futures = new ArrayList<>();

        // When
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < numberOfRequests; i++) {
            CompletableFuture<Long> future = CompletableFuture.supplyAsync(() -> {
                try {
                    long requestStart = System.currentTimeMillis();
                    mockMvc.perform(get("/api/v1/projects")
                            .param("page", "1")
                            .param("size", "10"))
                        .andExpect(status().isOk());
                    return System.currentTimeMillis() - requestStart;
                } catch (Exception e) {
                    return -1L; // Error indicator
                }
            }, executor);
            futures.add(future);
        }

        // Wait for all requests to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[numberOfRequests])).join();

        // Then
        List<Long> responseTimes = futures.stream()
            .map(CompletableFuture::join)
            .filter(time -> time > 0)
            .toList();

        assertThat(responseTimes.size()).isEqualTo(numberOfRequests);
        
        double avgResponseTime = responseTimes.stream()
            .mapToLong(Long::longValue)
            .average()
            .orElse(0.0);
        
        // Verify SLA: average < 1 second
        assertThat(avgResponseTime).isLessThan(1000);
        
        // Verify 95th percentile < 2 seconds
        responseTimes.sort(Long::compareTo);
        int percentile95Index = (int) (responseTimes.size() * 0.95);
        long percentile95 = responseTimes.get(percentile95Index);
        assertThat(percentile95).isLessThan(2000);

        executor.shutdown();
    }

    @Test
    @DisplayName("[성능 테스트] - 응답 시간 SLA (읽기) - GET 요청 응답 시간 < 500ms")
    void test_Performance_ResponseTimeSLA_Read() throws Exception {
        // Given
        int numberOfRequests = 100;
        List<Long> responseTimes = new ArrayList<>();

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            long startTime = System.currentTimeMillis();
            mockMvc.perform(get("/api/v1/projects")
                    .param("page", "1")
                    .param("size", "10"))
                .andExpect(status().isOk());
            long responseTime = System.currentTimeMillis() - startTime;
            responseTimes.add(responseTime);
        }

        // Then
        double avgResponseTime = responseTimes.stream()
            .mapToLong(Long::longValue)
            .average()
            .orElse(0.0);
        
        assertThat(avgResponseTime).isLessThan(500);

        // Verify 95th percentile < 800ms
        responseTimes.sort(Long::compareTo);
        int percentile95Index = (int) (responseTimes.size() * 0.95);
        long percentile95 = responseTimes.get(percentile95Index);
        assertThat(percentile95).isLessThan(800);

        // Verify 99th percentile < 1 second
        int percentile99Index = (int) (responseTimes.size() * 0.99);
        long percentile99 = responseTimes.get(percentile99Index);
        assertThat(percentile99).isLessThan(1000);
    }

    @Test
    @DisplayName("[성능 테스트] - 응답 시간 SLA (복잡한 쿼리) - 필터링 및 정렬 포함 조회 < 1초")
    void test_Performance_ResponseTimeSLA_ComplexQuery() throws Exception {
        // Given
        int numberOfRequests = 50;
        List<Long> responseTimes = new ArrayList<>();

        // When
        for (int i = 0; i < numberOfRequests; i++) {
            long startTime = System.currentTimeMillis();
            mockMvc.perform(get("/api/v1/projects")
                    .param("techStacks", "675aa6818b8e5d32789d5801")
                    .param("year", "2024")
                    .param("sort", "endDate,DESC"))
                .andExpect(status().isOk());
            long responseTime = System.currentTimeMillis() - startTime;
            responseTimes.add(responseTime);
        }

        // Then
        double avgResponseTime = responseTimes.stream()
            .mapToLong(Long::longValue)
            .average()
            .orElse(0.0);
        
        assertThat(avgResponseTime).isLessThan(1000);

        // Verify 95th percentile < 1.5 seconds
        responseTimes.sort(Long::compareTo);
        int percentile95Index = (int) (responseTimes.size() * 0.95);
        long percentile95 = responseTimes.get(percentile95Index);
        assertThat(percentile95).isLessThan(1500);
    }

    @Test
    @DisplayName("[성능 테스트] - 대량 데이터 조회 - 10000개 프로젝트 중 페이징 조회")
    void test_Performance_BulkDataRetrieval() throws Exception {
        // Given - Assuming 10000+ projects exist in test database
        // When
        long startTime = System.currentTimeMillis();
        
        // Test multiple pages
        for (int page = 1; page <= 10; page++) {
            mockMvc.perform(get("/api/v1/projects")
                    .param("page", String.valueOf(page))
                    .param("size", "10"))
                .andExpect(status().isOk());
        }
        
        long totalTime = System.currentTimeMillis() - startTime;
        double avgTimePerPage = totalTime / 10.0;

        // Then - Verify response time < 500ms per page
        assertThat(avgTimePerPage).isLessThan(500);
    }
}

