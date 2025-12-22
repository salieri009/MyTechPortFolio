---
title: "Testing Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers", "QA Engineers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md", "Service-Patterns.md"]
related_docs: ["Service-Patterns.md", "Repository-Patterns.md", "Controller-Patterns.md"]
maintainer: "Development Team"
---

# Testing Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for testing in the MyTechPortfolio backend application, with a focus on TDD (Test-Driven Development) context.

---

## Testing Strategy

The application follows a **testing pyramid** approach:

```
        /\
       /  \      E2E Tests (Few)
      /____\     
     /      \    Integration Tests (Some)
    /________\   
   /          \  Unit Tests (Many)
  /____________\
```

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete workflows

---

## TDD Workflow

### Red-Green-Refactor Cycle

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Example TDD Workflow

```java
// 1. RED: Write failing test
@Test
void shouldCreateProject() {
    ProjectCreateRequest request = new ProjectCreateRequest();
    request.setTitle("Test Project");
    
    ProjectDetailResponse response = projectService.createProject(request);
    
    assertThat(response).isNotNull();
    assertThat(response.getTitle()).isEqualTo("Test Project");
}

// 2. GREEN: Write minimal implementation
@Service
public class ProjectService {
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        Project project = Project.builder()
            .title(request.getTitle())
            .build();
        Project saved = projectRepository.save(project);
        return projectMapper.toResponse(saved);
    }
}

// 3. REFACTOR: Improve implementation
// Add validation, error handling, etc.
```

---

## Unit Testing Patterns

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

**Pattern Elements**:
- Use `@ExtendWith(MockitoExtension.class)`
- Mock dependencies with `@Mock`
- Inject mocks with `@InjectMocks`
- Use Given-When-Then structure
- Verify interactions with `verify()`

### Repository Unit Tests

```java
@DataMongoTest
class ProjectRepositoryTest {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Test
    void shouldFindByTitle() {
        // Given
        Project project = Project.builder()
            .title("Test Project")
            .build();
        projectRepository.save(project);
        
        // When
        List<Project> result = projectRepository.findByTitle("Test Project");
        
        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Project");
    }
}
```

**Pattern Elements**:
- Use `@DataMongoTest` for MongoDB tests
- Use embedded MongoDB or Testcontainers
- Test query methods
- Verify results

---

## Integration Testing Patterns

### Controller Integration Tests

```java
@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void shouldCreateProject() throws Exception {
        // Given
        ProjectCreateRequest request = ProjectCreateRequest.builder()
            .title("Test Project")
            .summary("Test Summary")
            .description("Test Description")
            .startDate(LocalDate.now())
            .endDate(LocalDate.now().plusDays(30))
            .techStackIds(List.of("tech1", "tech2"))
            .build();
        
        // When/Then
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.title").value("Test Project"));
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

**Pattern Elements**:
- Use `@SpringBootTest` for full context
- Use `@AutoConfigureMockMvc` for MockMvc
- Test HTTP requests/responses
- Verify status codes and JSON responses

### Service Integration Tests

```java
@SpringBootTest
@Transactional
class ProjectServiceIntegrationTest {
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Test
    void shouldCreateAndRetrieveProject() {
        // Given
        ProjectCreateRequest request = ProjectCreateRequest.builder()
            .title("Integration Test Project")
            .summary("Test Summary")
            .build();
        
        // When
        ProjectDetailResponse created = projectService.createProject(request);
        ProjectDetailResponse retrieved = projectService.getProject(created.getId());
        
        // Then
        assertThat(retrieved).isNotNull();
        assertThat(retrieved.getTitle()).isEqualTo("Integration Test Project");
    }
}
```

**Pattern Elements**:
- Use `@SpringBootTest` for full Spring context
- Use `@Transactional` for test isolation
- Test real database interactions
- Clean up after tests

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

### Test Fixtures

```java
@BeforeEach
void setUp() {
    // Create test data
    projectRepository.save(Project.builder()
        .title("Fixture Project")
        .build());
}

@AfterEach
void tearDown() {
    // Clean up test data
    projectRepository.deleteAll();
}
```

---

## Testing Best Practices

### ✅ DO

1. **Write tests first (TDD)**: Red-Green-Refactor cycle
2. **Test behavior, not implementation**: Test what, not how
3. **Use descriptive test names**: `shouldCreateProjectWhenValidRequest()`
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
7. **Don't use production data**: Use test data only

---

## Test Naming Conventions

### Test Method Names

```java
// Pattern: should{ExpectedBehavior}When{Condition}
@Test
void shouldCreateProjectWhenValidRequest() { }

@Test
void shouldThrowExceptionWhenProjectNotFound() { }

@Test
void shouldReturnEmptyListWhenNoProjectsExist() { }
```

---

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Main user flows covered

---

## Related Documentation

- [Service Patterns](./Service-Patterns.md) - Service testing
- [Repository Patterns](./Repository-Patterns.md) - Repository testing
- [Controller Patterns](./Controller-Patterns.md) - Controller testing
- [Testing Guide](../GUIDES/Testing-Guide.md) - Comprehensive testing guide

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

