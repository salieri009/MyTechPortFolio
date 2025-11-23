package com.mytechfolio.portfolio.comprehensive;

import com.mytechfolio.portfolio.domain.Project;
import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.repository.ProjectRepository;
import com.mytechfolio.portfolio.repository.TechStackRepository;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test Data Helper
 * Provides utility methods for creating test data dynamically
 * Eliminates hardcoded IDs and makes tests more maintainable
 * 
 * Note: This is a utility class that should be used within @SpringBootTest classes.
 * The repositories and MockMvc should be injected in the test class and passed to helper methods,
 * or this class should be used as a @TestConfiguration component.
 */
public class TestDataHelper {
    
    private final MockMvc mockMvc;
    private final ProjectRepository projectRepository;
    private final TechStackRepository techStackRepository;
    
    public TestDataHelper(MockMvc mockMvc, ProjectRepository projectRepository, TechStackRepository techStackRepository) {
        this.mockMvc = mockMvc;
        this.projectRepository = projectRepository;
        this.techStackRepository = techStackRepository;
    }

    /**
     * Creates a test project via API and returns its ID
     * Note: Requires @WithMockUser annotation on the calling test method
     * 
     * @param title Project title
     * @param summary Project summary
     * @return Project ID
     */
    public String createTestProject(String title, String summary) throws Exception {
        String requestBody = String.format("""
            {
              "title": "%s",
              "summary": "%s",
              "description": "Test Description for %s",
              "startDate": "2024-01-01",
              "endDate": "2024-12-31",
              "techStackIds": []
            }
            """, title, summary, title);

        MvcResult result = mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated())
            .andReturn();

        return com.jayway.jsonpath.JsonPath.read(
            result.getResponse().getContentAsString(), 
            "$.data.id"
        );
    }

    /**
     * Creates a test project with default values
     * Note: Requires @WithMockUser annotation on the calling test method
     * 
     * @return Project ID
     */
    public String createTestProject() throws Exception {
        return createTestProject("Test Project", "Test Summary");
    }

    /**
     * Creates a test project directly in the database (faster for unit tests)
     * 
     * @param title Project title
     * @return Created Project entity
     */
    public Project createTestProjectInDb(String title) {
        Project project = Project.builder()
            .title(title)
            .summary("Test Summary")
            .description("Test Description")
            .startDate(LocalDate.of(2024, 1, 1))
            .endDate(LocalDate.of(2024, 12, 31))
            .status(Project.ProjectStatus.COMPLETED)
            .build();
        
        return projectRepository.save(project);
    }

    /**
     * Creates a test tech stack and returns its ID
     * 
     * @param name Tech stack name
     * @param type Tech stack type
     * @return Tech stack ID
     */
    public String createTestTechStack(String name, String type) {
        TechStack techStack = TechStack.builder()
            .name(name)
            .type(TechStack.TechType.valueOf(type))
            .build();
        
        TechStack saved = techStackRepository.save(techStack);
        return saved.getId();
    }

    /**
     * Creates a test project with tech stacks
     * Note: Requires @WithMockUser annotation on the calling test method
     * 
     * @param title Project title
     * @param techStackIds List of tech stack IDs
     * @return Project ID
     */
    public String createTestProjectWithTechStacks(String title, List<String> techStackIds) throws Exception {
        String techStackIdsJson = techStackIds.isEmpty() ? "[]" : 
            "[\"" + String.join("\",\"", techStackIds) + "\"]";
        
        String requestBody = String.format("""
            {
              "title": "%s",
              "summary": "Test Summary",
              "description": "Test Description",
              "startDate": "2024-01-01",
              "endDate": "2024-12-31",
              "techStackIds": %s
            }
            """, title, techStackIdsJson);

        MvcResult result = mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated())
            .andReturn();

        return com.jayway.jsonpath.JsonPath.read(
            result.getResponse().getContentAsString(), 
            "$.data.id"
        );
    }

    /**
     * Finds or creates a tech stack by name
     * 
     * @param name Tech stack name
     * @return Tech stack ID
     */
    public String findOrCreateTechStack(String name) {
        Optional<TechStack> existing = techStackRepository.findByName(name);
        if (existing.isPresent()) {
            return existing.get().getId();
        }
        
        TechStack techStack = TechStack.builder()
            .name(name)
            .type(TechStack.TechType.FRONTEND)
            .build();
        
        return techStackRepository.save(techStack).getId();
    }

    /**
     * Cleans up test data (can be called in @AfterEach)
     * 
     * @param projectId Project ID to delete
     */
    public void deleteTestProject(String projectId) {
        projectRepository.deleteById(projectId);
    }

    /**
     * Cleans up all test projects (use with caution)
     */
    public void deleteAllTestProjects() {
        projectRepository.deleteAll();
    }
}

