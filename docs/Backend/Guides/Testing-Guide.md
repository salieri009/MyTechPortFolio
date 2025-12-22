---
title: "Testing Guide"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers", "QA Engineers"]
prerequisites: ["../PATTERNS/Testing-Patterns.md"]
related_docs: ["../PATTERNS/Testing-Patterns.md", "../TESTING/README.md"]
maintainer: "Development Team"
---

# Testing Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide provides a comprehensive testing strategy for the MyTechPortfolio backend application, with a focus on TDD (Test-Driven Development) workflow.

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /____\     
     /      \    Integration Tests (Some)
    /________\   
   /          \  Unit Tests (Many)
  /____________\
```

- **Unit Tests**: Test individual components in isolation (80%+ coverage)
- **Integration Tests**: Test component interactions (critical paths)
- **E2E Tests**: Test complete workflows (main user flows)

---

## TDD Workflow

### Red-Green-Refactor Cycle

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Example: Creating a Service Method

#### Step 1: Red - Write Failing Test

```java
@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    
    @Mock
    private ProjectRepository projectRepository;
    
    @Mock
    private ProjectMapper projectMapper;
    
    @InjectMocks
    private ProjectService projectService;
    
    @Test
    void shouldCreateProjectWhenValidRequest() {
        // Given
        ProjectCreateRequest request = ProjectCreateRequest.builder()
            .title("Test Project")
            .summary("Test Summary")
            .build();
        
        Project entity = Project.builder()
            .id("123")
            .title("Test Project")
            .build();
        
        ProjectDetailResponse response = ProjectDetailResponse.builder()
            .id("123")
            .title("Test Project")
            .build();
        
        when(projectMapper.toEntity(request)).thenReturn(entity);
        when(projectRepository.save(entity)).thenReturn(entity);
        when(projectMapper.toResponse(entity)).thenReturn(response);
        
        // When
        ProjectDetailResponse result = projectService.createProject(request);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Project");
        verify(projectRepository).save(entity);
    }
}
```

**Run test**: ❌ Test fails (method doesn't exist)

#### Step 2: Green - Write Minimal Implementation

```java
@Service
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        Project project = projectMapper.toEntity(request);
        Project saved = projectRepository.save(project);
        return projectMapper.toResponse(saved);
    }
}
```

**Run test**: ✅ Test passes

#### Step 3: Refactor - Improve Implementation

```java
@Service
@Transactional
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        // Validate business rules
        validateProjectRequest(request);
        
        // Convert and save
        Project project = projectMapper.toEntity(request);
        Project saved = projectRepository.save(project);
        
        // Log success
        log.info("Project created with ID: {}", saved.getId());
        
        return projectMapper.toResponse(saved);
    }
    
    private void validateProjectRequest(ProjectCreateRequest request) {
        if (projectRepository.existsByTitle(request.getTitle())) {
            throw new DuplicateResourceException("Project with title already exists");
        }
    }
}
```

**Run test**: ✅ Test still passes

---

## Unit Testing

### Service Layer Unit Tests

```java
@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    
    @Mock
    private ProjectRepository projectRepository;
    
    @Mock
    private ProjectMapper projectMapper;
    
    @InjectMocks
    private ProjectService projectService;
    
    @Test
    void shouldCreateProject() {
        // Given
        ProjectCreateRequest request = createTestRequest();
        Project entity = createTestEntity();
        ProjectDetailResponse response = createTestResponse();
        
        when(projectMapper.toEntity(request)).thenReturn(entity);
        when(projectRepository.save(entity)).thenReturn(entity);
        when(projectMapper.toResponse(entity)).thenReturn(response);
        
        // When
        ProjectDetailResponse result = projectService.createProject(request);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Project");
        verify(projectRepository).save(entity);
    }
    
    @Test
    void shouldThrowExceptionWhenProjectNotFound() {
        // Given
        String id = "non-existent-id";
        when(projectRepository.findById(id)).thenReturn(Optional.empty());
        
        // When/Then
        assertThatThrownBy(() -> projectService.getProject(id))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("not found");
    }
}
```

**Key Points**:
- Use `@ExtendWith(MockitoExtension.class)`
- Mock dependencies with `@Mock`
- Use Given-When-Then structure
- Verify interactions with `verify()`

---

## Integration Testing

### Controller Integration Tests

```java
@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @AfterEach
    void tearDown() {
        projectRepository.deleteAll();
    }
    
    @Test
    void shouldCreateProject() throws Exception {
        // Given
        ProjectCreateRequest request = ProjectCreateRequest.builder()
            .title("Integration Test Project")
            .summary("Test Summary")
            .description("Test Description")
            .startDate(LocalDate.now())
            .endDate(LocalDate.now().plusDays(30))
            .techStackIds(List.of("tech1"))
            .build();
        
        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.title").value("Integration Test Project"));
    }
    
    @Test
    void shouldReturn404WhenProjectNotFound() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/projects/non-existent-id"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("RESOURCE_NOT_FOUND"));
    }
}
```

**Key Points**:
- Use `@SpringBootTest` for full Spring context
- Use `@AutoConfigureMockMvc` for MockMvc
- Clean up test data with `@AfterEach`
- Test HTTP requests/responses

---

## Test Data Management

### Test Data Builders

```java
public class ProjectTestDataBuilder {
    
    public static ProjectCreateRequest.ProjectCreateRequestBuilder createRequest() {
        return ProjectCreateRequest.builder()
            .title("Test Project")
            .summary("Test Summary")
            .description("Test Description")
            .startDate(LocalDate.now())
            .endDate(LocalDate.now().plusDays(30))
            .techStackIds(List.of("tech1"));
    }
    
    public static Project.ProjectBuilder createEntity() {
        return Project.builder()
            .id("test-id")
            .title("Test Project")
            .summary("Test Summary");
    }
}

// Usage
ProjectCreateRequest request = ProjectTestDataBuilder.createRequest()
    .title("Custom Title")
    .build();
```

---

## Testing Best Practices

### ✅ DO

1. **Write tests first (TDD)**: Red-Green-Refactor
2. **Test behavior, not implementation**: Test what, not how
3. **Use descriptive names**: `shouldCreateProjectWhenValidRequest()`
4. **Follow Given-When-Then**: Clear test structure
5. **Mock external dependencies**: Isolate unit under test
6. **Test edge cases**: Null, empty, invalid inputs
7. **Test error scenarios**: Exception handling
8. **Keep tests independent**: No test dependencies
9. **Use test data builders**: Reusable test data
10. **Clean up test data**: Use `@Transactional` or manual cleanup

### ❌ DON'T

1. **Don't test framework code**: Test your code, not Spring
2. **Don't test private methods**: Test public interface
3. **Don't skip edge cases**: Test null, empty, invalid
4. **Don't write fragile tests**: Don't depend on implementation details
5. **Don't ignore failing tests**: Fix or remove them
6. **Don't test multiple things**: One assertion per test concept

---

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Main user flows covered

---

## Running Tests

### Run All Tests

```bash
./gradlew test
```

### Run Specific Test Class

```bash
./gradlew test --tests ProjectServiceTest
```

### Run with Coverage

```bash
./gradlew test jacocoTestReport
```

---

## Related Documentation

- [Testing Patterns](../PATTERNS/Testing-Patterns.md) - Testing patterns
- [Service Patterns](../PATTERNS/Service-Patterns.md) - Service testing
- [Controller Patterns](../PATTERNS/Controller-Patterns.md) - Controller testing

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

