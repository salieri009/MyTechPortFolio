---
title: "Controller Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md"]
related_docs: ["Service-Patterns.md", "DTO-Patterns.md"]
maintainer: "Development Team"
---

# Controller Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for REST controllers in the MyTechPortfolio backend application.

---

## Controller Structure

### Basic Controller Pattern

```java
@RestController
@RequestMapping(ApiConstants.PROJECTS_ENDPOINT)
@Tag(name = "Projects", description = "프로젝트 관리 API")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Endpoint methods...
}
```

### Key Annotations

- **`@RestController`**: Marks as REST controller (combines `@Controller` + `@ResponseBody`)
- **`@RequestMapping`**: Base path for all endpoints (use constants from `ApiConstants`)
- **`@Tag`**: Swagger/OpenAPI documentation tag

---

## Endpoint Patterns

### 1. GET - List with Pagination

```java
@GetMapping
@Operation(summary = "프로젝트 목록 조회", description = "페이징, 정렬, 필터링을 지원하는 프로젝트 목록을 조회합니다.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "성공"),
    @ApiResponse(responseCode = "400", description = "잘못된 요청")
})
public ResponseEntity<ApiResponse<PageResponse<ProjectSummaryResponse>>> getProjects(
    @Parameter(description = "페이지 번호 (1부터 시작)", example = "1")
    @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_NUMBER) 
    @Min(1) int page,
    
    @Parameter(description = "페이지 크기", example = "10")
    @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_SIZE) 
    @Min(1) @Max(ApiConstants.MAX_PAGE_SIZE) int size,
    
    @Parameter(description = "정렬 기준 (field,direction)", example = "endDate,desc")
    @RequestParam(required = false, defaultValue = ApiConstants.DEFAULT_SORT_FIELD + "," + ApiConstants.DEFAULT_SORT_DIRECTION) 
    String sort
) {
    PageResponse<ProjectSummaryResponse> response = projectService.getProjects(page, size, sort, null, null);
    return ResponseUtil.ok(response);
}
```

**Pattern Elements**:
- Use `@GetMapping` for read operations
- Use `@Operation` for Swagger documentation
- Use `@ApiResponses` to document possible responses
- Use `@Parameter` to document parameters
- Use validation annotations (`@Min`, `@Max`)
- Use constants for default values
- Return `ResponseEntity<ApiResponse<T>>`
- Use `ResponseUtil.ok()` for success responses

### 2. GET - Single Resource

```java
@GetMapping("/{id}")
@Operation(summary = "프로젝트 상세 조회", description = "프로젝트 ID로 상세 정보를 조회합니다.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "성공"),
    @ApiResponse(responseCode = "400", description = "잘못된 ID 형식"),
    @ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음")
})
public ResponseEntity<ApiResponse<ProjectDetailResponse>> getProject(
    @Parameter(description = "프로젝트 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
    @PathVariable 
    @ValidMongoId(message = "Invalid project ID format")
    String id
) {
    ProjectDetailResponse response = projectService.getProject(id);
    return ResponseUtil.ok(response);
}
```

**Pattern Elements**:
- Use `@PathVariable` for path parameters
- Use custom validators (`@ValidMongoId`) for ID validation
- Document all possible response codes
- Return detailed response DTOs

### 3. POST - Create Resource

```java
@PostMapping
@Operation(summary = "프로젝트 생성", description = "새로운 프로젝트를 생성합니다.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "201", description = "생성 성공"),
    @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
    @ApiResponse(responseCode = "409", description = "중복된 리소스")
})
public ResponseEntity<ApiResponse<ProjectDetailResponse>> createProject(
    @Parameter(description = "프로젝트 생성 요청", required = true)
    @Valid @RequestBody ProjectCreateRequest request
) {
    ProjectDetailResponse response = projectService.createProject(request);
    return ResponseUtil.created(response);
}
```

**Pattern Elements**:
- Use `@PostMapping` for create operations
- Use `@Valid` for request validation
- Use `@RequestBody` for JSON request body
- Return `201 Created` status
- Use `ResponseUtil.created()` for creation responses

### 4. PUT - Update Resource

```java
@PutMapping("/{id}")
@Operation(summary = "프로젝트 수정", description = "기존 프로젝트를 수정합니다.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "수정 성공"),
    @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
    @ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음")
})
public ResponseEntity<ApiResponse<ProjectDetailResponse>> updateProject(
    @Parameter(description = "프로젝트 ID", required = true)
    @PathVariable @ValidMongoId String id,
    
    @Parameter(description = "프로젝트 수정 요청", required = true)
    @Valid @RequestBody ProjectUpdateRequest request
) {
    ProjectDetailResponse response = projectService.updateProject(id, request);
    return ResponseUtil.ok(response);
}
```

**Pattern Elements**:
- Use `@PutMapping` for full updates
- Validate both ID and request body
- Return updated resource

### 5. DELETE - Delete Resource

```java
@DeleteMapping("/{id}")
@Operation(summary = "프로젝트 삭제", description = "프로젝트를 삭제합니다.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "204", description = "삭제 성공"),
    @ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음")
})
public ResponseEntity<Void> deleteProject(
    @Parameter(description = "프로젝트 ID", required = true)
    @PathVariable @ValidMongoId String id
) {
    projectService.deleteProject(id);
    return ResponseUtil.noContent();
}
```

**Pattern Elements**:
- Use `@DeleteMapping` for delete operations
- Return `204 No Content` for successful deletion
- Use `ResponseUtil.noContent()` for empty responses

---

## Base Controller Pattern

### AbstractCrudController

For standard CRUD operations, extend `AbstractCrudController`:

```java
@RestController
@RequestMapping(ApiConstants.ACADEMICS_ENDPOINT)
@Tag(name = "Academics", description = "학력 관리 API")
public class AcademicController extends AbstractCrudController<Academic, String, AcademicResponse, AcademicCreateRequest, AcademicUpdateRequest> {
    
    public AcademicController(AcademicService academicService) {
        super(academicService);
    }
    
    @Override
    protected String getResourceName() {
        return "Academic";
    }
    
    // Custom endpoints can be added here
}
```

**Benefits**:
- Reduces boilerplate code
- Consistent CRUD endpoints
- Standardized error handling
- Built-in Swagger documentation

**When to Use**:
- Standard CRUD operations
- No complex business logic in controller
- Standard pagination and sorting

**When NOT to Use**:
- Complex endpoints with custom logic
- Non-standard response formats
- Special authentication requirements

---

## Response Patterns

### Using ResponseUtil

Always use `ResponseUtil` for consistent responses:

```java
// Success (200 OK)
return ResponseUtil.ok(data);

// Created (201 Created)
return ResponseUtil.created(data);

// No Content (204 No Content)
return ResponseUtil.noContent();

// Error responses are handled by GlobalExceptionHandler
```

### Response Wrapper

All responses are wrapped in `ApiResponse<T>`:

```java
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private LocalDateTime timestamp;
    // ...
}
```

---

## Validation Patterns

### Request Validation

1. **Use `@Valid`** on request DTOs:
```java
@PostMapping
public ResponseEntity<...> create(@Valid @RequestBody ProjectCreateRequest request) {
    // ...
}
```

2. **Use validation annotations** in DTOs:
```java
@NotBlank(message = "Title is required")
@Size(min = 3, max = 255)
private String title;
```

3. **Use custom validators** for complex validation:
```java
@ValidMongoId(message = "Invalid project ID format")
@PathVariable String id;
```

### Path Parameter Validation

Always validate path parameters:
```java
@GetMapping("/{id}")
public ResponseEntity<...> getById(
    @PathVariable 
    @ValidMongoId(message = "Invalid ID format")
    String id
) {
    // ...
}
```

---

## Error Handling

### Controller-Level Errors

Controllers should **NOT** handle errors directly. Let `GlobalExceptionHandler` handle them:

```java
// ❌ DON'T: Handle exceptions in controller
@GetMapping("/{id}")
public ResponseEntity<...> getById(@PathVariable String id) {
    try {
        return ResponseUtil.ok(service.findById(id));
    } catch (ResourceNotFoundException e) {
        return ResponseUtil.notFound();
    }
}

// ✅ DO: Let service throw exceptions, GlobalExceptionHandler handles them
@GetMapping("/{id}")
public ResponseEntity<...> getById(@PathVariable String id) {
    return ResponseUtil.ok(service.findById(id));
}
```

### Validation Errors

Validation errors are automatically handled by Spring:
- `@Valid` failures → `400 Bad Request`
- Custom validator failures → `400 Bad Request`
- Handled by `GlobalExceptionHandler`

---

## API Documentation (Swagger)

### Controller-Level Documentation

```java
@Tag(name = "Projects", description = "프로젝트 관리 API")
public class ProjectController {
    // ...
}
```

### Method-Level Documentation

```java
@Operation(
    summary = "프로젝트 목록 조회",
    description = "페이징, 정렬, 필터링을 지원하는 프로젝트 목록을 조회합니다."
)
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "성공"),
    @ApiResponse(responseCode = "400", description = "잘못된 요청")
})
public ResponseEntity<...> getProjects(...) {
    // ...
}
```

### Parameter Documentation

```java
@Parameter(
    description = "페이지 번호 (1부터 시작)",
    example = "1"
)
@RequestParam(defaultValue = "1") int page
```

---

## Best Practices

### ✅ DO

1. **Keep controllers thin**: Delegate to services
2. **Use constants**: For endpoint paths and default values
3. **Validate inputs**: Use `@Valid` and validation annotations
4. **Document APIs**: Use Swagger annotations
5. **Use ResponseUtil**: For consistent responses
6. **Handle errors globally**: Let `GlobalExceptionHandler` handle exceptions
7. **Use DTOs**: Never expose entities directly

### ❌ DON'T

1. **Don't put business logic in controllers**: Use services
2. **Don't handle exceptions in controllers**: Use `GlobalExceptionHandler`
3. **Don't expose entities**: Always use DTOs
4. **Don't use magic numbers**: Use constants
5. **Don't skip validation**: Always validate inputs
6. **Don't return raw entities**: Always wrap in DTOs

---

## Common Patterns

### Filtering and Sorting

```java
@GetMapping
public ResponseEntity<...> getProjects(
    @RequestParam(required = false) String techStacks,
    @RequestParam(required = false) Integer year,
    @RequestParam(required = false) String sort
) {
    // Parse and validate filters
    // Delegate to service
    return ResponseUtil.ok(service.getProjects(page, size, sort, techStacks, year));
}
```

### Custom Endpoints

```java
@GetMapping("/{id}/related")
@Operation(summary = "관련 프로젝트 조회")
public ResponseEntity<...> getRelatedProjects(@PathVariable @ValidMongoId String id) {
    return ResponseUtil.ok(service.getRelatedProjects(id));
}
```

---

## Related Documentation

- [Service Patterns](./Service-Patterns.md) - Service layer patterns
- [DTO Patterns](./DTO-Patterns.md) - Data Transfer Object patterns
- [Exception Handling Patterns](./Exception-Handling-Patterns.md) - Error handling
- [Layered Architecture](../ARCHITECTURE/Layered-Architecture.md) - Architecture overview

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

