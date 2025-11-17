---
title: "Service Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md", "Controller-Patterns.md"]
related_docs: ["Repository-Patterns.md", "Mapper-Patterns.md"]
maintainer: "Development Team"
---

# Service Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for service layer implementation in the MyTechPortfolio backend application.

---

## Service Structure

### Basic Service Pattern

```java
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    // Service methods...
}
```

### Key Annotations

- **`@Service`**: Marks as Spring service component
- **`@Slf4j`**: Lombok annotation for logging
- **`@RequiredArgsConstructor`**: Lombok annotation for constructor injection
- **`@Transactional(readOnly = true)`**: Default read-only transactions

---

## Service Method Patterns

### 1. Find All with Pagination

```java
public PageResponse<ProjectSummaryResponse> getProjects(int page, int size, String sort, String techStacks, Integer year) {
    log.debug("Fetching projects - page: {}, size: {}, sort: {}, techStacks: {}, year: {}", 
              page, size, sort, techStacks, year);
    
    // Parse and validate parameters
    Sort sortBy = PaginationUtil.parseSort(sort, ApiConstants.DEFAULT_SORT_FIELD, Sort.Direction.DESC);
    List<String> techStackList = parseTechStacks(techStacks);
    
    // Create pageable
    Pageable pageable = PaginationUtil.createPageable(page, size, sortBy);
    
    // Query repository
    Page<Project> projectPage = projectRepository.findProjectsWithFilters(techStackList, year, pageable);
    
    // Convert to DTOs using mapper
    return PaginationUtil.toPageResponse(projectPage, projectMapper::toSummaryResponse, page);
}
```

**Pattern Elements**:
- Log method entry with parameters
- Parse and validate input parameters
- Use repository for data access
- Convert entities to DTOs using mapper
- Return paginated response

### 2. Find By ID

```java
public ProjectDetailResponse getProject(String id) {
    log.debug("Fetching project with ID: {}", id);
    
    Project project = projectRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    
    return projectMapper.toResponse(project);
}
```

**Pattern Elements**:
- Use `Optional.orElseThrow()` for not found handling
- Throw `ResourceNotFoundException` for 404
- Convert entity to DTO using mapper
- Log operations

### 3. Create

```java
@Transactional
public ProjectDetailResponse createProject(ProjectCreateRequest request) {
    log.info("Creating new project: {}", request.getTitle());
    
    // Business validation
    validateProjectRequest(request);
    
    // Convert DTO to Entity
    Project project = projectMapper.toEntity(request);
    
    // Save entity
    Project savedProject = projectRepository.save(project);
    
    log.info("Project created successfully with ID: {}", savedProject.getId());
    
    // Convert Entity to DTO
    return projectMapper.toResponse(savedProject);
}
```

**Pattern Elements**:
- Use `@Transactional` for write operations
- Validate business rules before saving
- Convert DTO to entity using mapper
- Save entity
- Log success
- Return created entity as DTO

### 4. Update

```java
@Transactional
public ProjectDetailResponse updateProject(String id, ProjectUpdateRequest request) {
    log.info("Updating project with ID: {}", id);
    
    // Find existing entity
    Project project = projectRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    
    // Business validation
    validateUpdateRequest(request, project);
    
    // Update entity using mapper
    projectMapper.updateEntity(project, request);
    
    // Save updated entity
    Project updatedProject = projectRepository.save(project);
    
    log.info("Project updated successfully with ID: {}", id);
    
    return projectMapper.toResponse(updatedProject);
}
```

**Pattern Elements**:
- Find existing entity first
- Validate update request
- Update entity using mapper
- Save updated entity
- Return updated entity as DTO

### 5. Delete

```java
@Transactional
public void deleteProject(String id) {
    log.info("Deleting project with ID: {}", id);
    
    // Check if exists
    if (!projectRepository.existsById(id)) {
        throw new ResourceNotFoundException("Project not found with id: " + id);
    }
    
    // Delete entity
    projectRepository.deleteById(id);
    
    log.info("Project deleted successfully with ID: {}", id);
}
```

**Pattern Elements**:
- Check existence before delete
- Delete entity
- Log operations
- Void return type for delete operations

---

## Business Logic Patterns

### Validation Pattern

```java
private void validateProjectRequest(ProjectCreateRequest request) {
    // Business rule: End date must be after start date
    if (request.getEndDate() != null && 
        request.getStartDate().isAfter(request.getEndDate())) {
        throw new IllegalArgumentException("End date must be after start date");
    }
    
    // Business rule: Check for duplicate title
    if (projectRepository.existsByTitle(request.getTitle())) {
        throw new DuplicateResourceException("Project with title already exists: " + request.getTitle());
    }
    
    // Business rule: Validate tech stacks exist
    if (request.getTechStackIds() != null && !request.getTechStackIds().isEmpty()) {
        List<TechStack> techStacks = techStackRepository.findAllById(request.getTechStackIds());
        if (techStacks.size() != request.getTechStackIds().size()) {
            throw new IllegalArgumentException("Some tech stacks not found");
        }
    }
}
```

**Pattern Elements**:
- Private validation methods
- Throw appropriate exceptions
- Validate business rules
- Check related entities

### Complex Business Logic

```java
@Transactional
public ProjectDetailResponse createProjectWithRelations(ProjectCreateRequest request) {
    log.info("Creating project with relations: {}", request.getTitle());
    
    // 1. Validate request
    validateProjectRequest(request);
    
    // 2. Create project entity
    Project project = projectMapper.toEntity(request);
    
    // 3. Handle related entities
    if (request.getTechStackIds() != null) {
        List<TechStack> techStacks = techStackRepository.findAllById(request.getTechStackIds());
        // Additional business logic for tech stacks
    }
    
    // 4. Save project
    Project savedProject = projectRepository.save(project);
    
    // 5. Update related entities if needed
    // ...
    
    return projectMapper.toResponse(savedProject);
}
```

---

## Transaction Management

### Read-Only Transactions

```java
@Service
@Transactional(readOnly = true)  // Default for all methods
public class ProjectService {
    
    // Read operations are read-only by default
    public ProjectDetailResponse getProject(String id) {
        // ...
    }
}
```

### Write Transactions

```java
@Transactional  // Override default for write operations
public ProjectDetailResponse createProject(ProjectCreateRequest request) {
    // ...
}
```

### Transaction Best Practices

1. **Use `@Transactional(readOnly = true)`** as default for services
2. **Override with `@Transactional`** for write operations
3. **Keep transactions short**: Don't do heavy processing in transactions
4. **Handle rollbacks**: Spring handles rollbacks automatically on exceptions

---

## Logging Patterns

### Log Levels

```java
// DEBUG: Detailed information for debugging
log.debug("Fetching project with ID: {}", id);

// INFO: Important business events
log.info("Project created successfully with ID: {}", id);

// WARN: Warning messages
log.warn("Project with ID {} not found, returning null", id);

// ERROR: Error messages
log.error("Failed to create project", e);
```

### Logging Best Practices

1. **Use parameterized logging**: `log.info("User {} created", userId)` not `log.info("User " + userId + " created")`
2. **Log at appropriate levels**: DEBUG for details, INFO for business events
3. **Include context**: Log IDs, parameters, results
4. **Don't log sensitive data**: Passwords, tokens, etc.

---

## Exception Handling

### Throwing Exceptions

```java
public ProjectDetailResponse getProject(String id) {
    Project project = projectRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    
    return projectMapper.toResponse(project);
}
```

### Custom Exceptions

```java
// For 404 Not Found
throw new ResourceNotFoundException("Project not found with id: " + id);

// For 409 Conflict
throw new DuplicateResourceException("Project with title already exists: " + title);

// For 400 Bad Request
throw new IllegalArgumentException("End date must be after start date");
```

**Exception Types**:
- `ResourceNotFoundException` → 404 Not Found
- `DuplicateResourceException` → 409 Conflict
- `IllegalArgumentException` → 400 Bad Request
- `IllegalStateException` → 400 Bad Request

---

## Base Service Pattern

### BaseService Interface

```java
public interface BaseService<Entity, ID, Response, CreateRequest, UpdateRequest> {
    Response create(CreateRequest request);
    Response findById(ID id);
    PageResponse<Response> findAll(int page, int size);
    Response update(ID id, UpdateRequest request);
    void delete(ID id);
}
```

### BaseServiceImpl

```java
public abstract class BaseServiceImpl<Entity, ID, Response, CreateRequest, UpdateRequest>
    implements BaseService<Entity, ID, Response, CreateRequest, UpdateRequest> {
    
    protected final MongoRepository<Entity, ID> repository;
    protected final EntityMapper<Entity, Response, CreateRequest, UpdateRequest> mapper;
    
    // Common CRUD implementation
    // Can be overridden in subclasses
}
```

### Using Base Service

```java
@Service
@RequiredArgsConstructor
public class AcademicService extends BaseServiceImpl<Academic, String, AcademicResponse, AcademicCreateRequest, AcademicUpdateRequest> {
    
    public AcademicService(AcademicRepository repository, AcademicMapper mapper) {
        super(repository, mapper);
    }
    
    // Override methods if custom logic needed
    // Add custom methods
}
```

---

## Best Practices

### ✅ DO

1. **Keep business logic in services**: Not in controllers or repositories
2. **Use transactions**: `@Transactional` for write operations
3. **Validate business rules**: Before saving entities
4. **Use mappers**: Convert between entities and DTOs
5. **Log operations**: At appropriate levels
6. **Throw appropriate exceptions**: Use custom exceptions
7. **Keep services focused**: One service per domain

### ❌ DON'T

1. **Don't put HTTP logic in services**: Keep controllers thin
2. **Don't access repositories directly from controllers**: Always use services
3. **Don't expose entities**: Always return DTOs
4. **Don't handle HTTP exceptions**: Let `GlobalExceptionHandler` handle them
5. **Don't put data access logic in services**: Use repositories
6. **Don't skip validation**: Always validate business rules

---

## Related Documentation

- [Controller Patterns](./Controller-Patterns.md) - Controller layer patterns
- [Repository Patterns](./Repository-Patterns.md) - Repository layer patterns
- [Mapper Patterns](./Mapper-Patterns.md) - Entity-DTO mapping
- [Exception Handling Patterns](./Exception-Handling-Patterns.md) - Error handling
- [Layered Architecture](../ARCHITECTURE/Layered-Architecture.md) - Architecture overview

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

