package com.mytechfolio.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mytechfolio.portfolio.dto.request.AcademicCreateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AcademicControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetAcademicsList() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/academics")
                .param("page", "1")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @WithMockUser(roles = "CONTENT_MANAGER")
    void shouldCreateAcademicWhenAuthorized() throws Exception {
        // Given
        AcademicCreateRequest request = new AcademicCreateRequest();
        request.setSemester("2024-1");
        request.setName("Software Engineering");
        request.setGrade("HD");
        
        // When/Then
        mockMvc.perform(post("/api/v1/academics")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void shouldReturn403WhenUnauthorized() throws Exception {
        // Given
        AcademicCreateRequest request = new AcademicCreateRequest();
        request.setSemester("2024-1");
        request.setName("Software Engineering");
        
        // When/Then
        mockMvc.perform(post("/api/v1/academics")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isForbidden());
    }
}

