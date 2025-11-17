---
title: "Layered Architecture"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers", "Architects"]
prerequisites: ["README.md", "Design-Decisions.md"]
related_docs: ["../../../docs/ADR/ADR-008-Layered-Architecture.md", "Package-Organization.md"]
maintainer: "Development Team"
---

# Layered Architecture

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the layered architecture pattern used in the MyTechPortfolio backend application.

---

## Architecture Overview

The backend follows a **Layered Architecture** pattern with four main layers:

```
┌─────────────────────────────────────────┐
│         Controller Layer                 │  ← HTTP Requests/Responses
│    (REST Controllers)                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Service Layer                   │  ← Business Logic
│    (Business Services)                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Repository Layer                  │  ← Data Access
│    (MongoDB Repositories)                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Domain Layer                    │  ← Domain Entities
│    (MongoDB Documents)                   │
└─────────────────────────────────────────┘
```

---

## Layer Responsibilities

### 1. Controller Layer

**Purpose**: Handle HTTP requests and responses.

**Responsibilities**:
- Receive HTTP requests
- Validate request data
- Call service layer
- Format HTTP responses
- Handle HTTP errors
- API documentation (Swagger)

**Location**: `com.mytechfolio.portfolio.controller`

**Example**:
```java
@RestController
@RequestMapping(ApiConstants.PROJECTS_ENDPOINT)
public class ProjectController extends AbstractCrudController<Project, ...> {
    
    private final ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<PageResponse<ProjectResponse>> getAllProjects(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<ProjectResponse> response = projectService.findAll(page, size);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectCreateRequest request) {
        ProjectResponse response = projectService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

**Key Points**:
- Controllers are thin - they delegate to services
- Use DTOs for request/response, not entities
- Validate requests using `@Valid`
- Use constants for endpoint paths
- Extend base controllers when possible

### 2. Service Layer

**Purpose**: Implement business logic and orchestration.

**Responsibilities**:
- Business logic implementation
- Data transformation (Entity ↔ DTO)
- Transaction management
- Validation
- Exception handling
- Orchestrating multiple repositories

**Location**: `com.mytechfolio.portfolio.service`

**Example**:
```java
@Service
public class ProjectService implements BaseService<Project, ProjectCreateRequest, ...> {
    
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    
    @Override
    public ProjectResponse create(ProjectCreateRequest request) {
        // Validate business rules
        validateProjectRequest(request);
        
        // Transform DTO to Entity
        Project project = projectMapper.toEntity(request);
        
        // Save entity
        Project savedProject = projectRepository.save(project);
        
        // Transform Entity to DTO
        return projectMapper.toResponse(savedProject);
    }
    
    @Override
    public PageResponse<ProjectResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Project> projects = projectRepository.findAll(pageable);
        
        List<ProjectResponse> responses = projects.getContent().stream()
            .map(projectMapper::toResponse)
            .toList();
        
        return PaginationUtil.createPageResponse(responses, projects);
    }
    
    private void validateProjectRequest(ProjectCreateRequest request) {
        // Business validation logic
        if (request.getEndDate() != null && 
            request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
    }
}
```

**Key Points**:
- Services contain business logic
- Use mappers to convert between entities and DTOs
- Handle transactions when needed
- Validate business rules
- Throw appropriate exceptions

### 3. Repository Layer

**Purpose**: Data access and persistence.

**Responsibilities**:
- Database operations (CRUD)
- Custom queries
- Data retrieval
- No business logic

**Location**: `com.mytechfolio.portfolio.repository`

**Example**:
```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Spring Data query methods
    List<Project> findByTitleContaining(String title);
    
    List<Project> findByStartDateBetween(LocalDate start, LocalDate end);
    
    @Query("{ 'techStack': { $in: ?0 } }")
    List<Project> findByTechStackIn(List<String> techStacks);
    
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
}
```

**Key Points**:
- Extend `MongoRepository<Entity, ID>`
- Use Spring Data query methods
- Add custom queries with `@Query` when needed
- No business logic in repositories
- Return entities, not DTOs

### 4. Domain Layer

**Purpose**: Domain entities representing business concepts.

**Responsibilities**:
- Define data structure
- Basic business rules (if any)
- Entity relationships
- No infrastructure concerns

**Location**: `com.mytechfolio.portfolio.domain`

**Example**:
```java
@Document(collection = "projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    
    @Id
    private String id;
    
    @Indexed
    private String title;
    
    private String description;
    
    @Indexed
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    @Builder.Default
    private List<String> techStack = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Business methods (if any)
    public boolean isActive() {
        return endDate == null || endDate.isAfter(LocalDate.now());
    }
}
```

**Key Points**:
- Annotate with `@Document(collection = "...")`
- Use `@Id` for MongoDB ID
- Use `@Indexed` for frequently queried fields
- Keep entities focused on data structure
- Minimal business logic (prefer services)

---

## Data Flow

### Request Flow

```
HTTP Request
    ↓
Controller (validates request, converts to DTO)
    ↓
Service (business logic, converts DTO to Entity)
    ↓
Repository (saves Entity to database)
    ↓
MongoDB
```

### Response Flow

```
MongoDB
    ↓
Repository (retrieves Entity)
    ↓
Service (converts Entity to DTO, applies business logic)
    ↓
Controller (formats DTO as HTTP response)
    ↓
HTTP Response
```

---

## DTO Pattern

### Why DTOs?

DTOs (Data Transfer Objects) are used to:
- **Decouple layers**: Controllers don't depend on entities
- **Control exposure**: Only expose necessary fields
- **Version APIs**: Change DTOs without changing entities
- **Security**: Avoid exposing internal structure

### DTO Structure

```
dto/
├── request/           # Request DTOs
│   ├── ProjectCreateRequest.java
│   └── ProjectUpdateRequest.java
└── response/          # Response DTOs
    └── ProjectResponse.java
```

### Mapping Pattern

Use mappers to convert between entities and DTOs:

```java
public interface ProjectMapper {
    ProjectResponse toResponse(Project project);
    Project toEntity(ProjectCreateRequest request);
    void updateEntity(ProjectUpdateRequest request, Project project);
}
```

---

## Base Classes

### AbstractCrudController

Base controller with common CRUD operations:

```java
public abstract class AbstractCrudController<Entity, CreateRequest, UpdateRequest, Response> {
    // Common CRUD endpoints
    // GET, POST, PUT, DELETE
}
```

### BaseService

Base service interface:

```java
public interface BaseService<Entity, CreateRequest, UpdateRequest, Response> {
    Response create(CreateRequest request);
    Response findById(String id);
    PageResponse<Response> findAll(int page, int size);
    Response update(String id, UpdateRequest request);
    void delete(String id);
}
```

### BaseServiceImpl

Base service implementation:

```java
public abstract class BaseServiceImpl<Entity, CreateRequest, UpdateRequest, Response>
    implements BaseService<Entity, CreateRequest, UpdateRequest, Response> {
    // Common CRUD implementation
}
```

---

## Best Practices

### 1. Layer Boundaries

✅ **DO**:
- Controllers call services
- Services call repositories
- Repositories return entities
- Services return DTOs

❌ **DON'T**:
- Controllers call repositories directly
- Services depend on controllers
- Repositories contain business logic
- Entities depend on DTOs

### 2. Dependency Flow

```
Controller → Service → Repository → Domain
     ↓          ↓          ↓
   DTOs      DTOs      Entities
```

### 3. Exception Handling

- **Controllers**: Handle HTTP exceptions
- **Services**: Throw business exceptions
- **Repositories**: Throw data access exceptions
- **Global Handler**: Convert to HTTP responses

### 4. Transaction Management

- Use `@Transactional` in service layer
- Keep transactions short
- Read-only transactions for queries

### 5. Validation

- **Request Validation**: In controllers with `@Valid`
- **Business Validation**: In services
- **Data Validation**: In domain entities (if needed)

---

## Anti-Patterns to Avoid

### 1. Anemic Domain Models

❌ **Don't**: Put all logic in services, leaving entities as data containers
✅ **Do**: Use entities for basic business rules, services for complex logic

### 2. Layer Skipping

❌ **Don't**: Call repository from controller
✅ **Do**: Always go through service layer

### 3. Business Logic in Controllers

❌ **Don't**: Put business logic in controllers
✅ **Do**: Keep controllers thin, delegate to services

### 4. Data Access in Services

❌ **Don't**: Write MongoDB queries in services
✅ **Do**: Use repositories for all data access

### 5. Tight Coupling

❌ **Don't**: Depend on concrete classes
✅ **Do**: Use interfaces and dependency injection

---

## Related Documentation

- [ADR-008: Layered Architecture](../../../docs/ADR/ADR-008-Layered-Architecture.md) - Architecture decision
- [Package Organization](./Package-Organization.md) - Package structure
- [Design Decisions](./Design-Decisions.md) - Architectural decisions
- [Backend Refactoring Summary](../../../docs/Architecture/Backend-Refactoring.md) - Refactoring details

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

