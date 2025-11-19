package com.mytechfolio.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProjectControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetProjectsList() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").exists());
    }

    @Test
    void shouldReturn404WhenProjectNotFound() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects/507f1f77bcf86cd799439999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void shouldGetProjectsWithFilters() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10")
                .param("year", "2024"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }
}

