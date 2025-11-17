---
title: "Mapper Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md", "DTO-Patterns.md"]
related_docs: ["DTO-Patterns.md", "Service-Patterns.md"]
maintainer: "Development Team"
---

# Mapper Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for entity-DTO mapping in the MyTechPortfolio backend application.

---

## Mapper Structure

### Base Mapper Interface

```java
public interface EntityMapper<Entity, Response, CreateRequest, UpdateRequest> {
    Response toResponse(Entity entity);
    Entity toEntity(CreateRequest createRequest);
    void updateEntity(Entity entity, UpdateRequest updateRequest);
}
```

### Mapper Implementation

```java
@Component
@RequiredArgsConstructor
public class ProjectMapper extends EntityMapper<Project, ProjectDetailResponse, ProjectCreateRequest, ProjectUpdateRequest> {
    
    private final TechStackRepository techStackRepository;
    private final AcademicRepository academicRepository;
    
    @Override
    public ProjectDetailResponse toResponse(Project project) {
        if (project == null) {
            return null;
        }
        
        // Fetch related entities
        List<TechStack> techStacks = fetchTechStacks(project.getTechStackIds());
        List<String> academicNames = fetchAcademicNames(project.getRelatedAcademicIds());
        
        // Build response
        return ProjectDetailResponse.builder()
            .id(project.getId())
            .title(project.getTitle())
            .summary(project.getSummary())
            .description(project.getDescription())
            .startDate(project.getStartDate())
            .endDate(project.getEndDate())
            .githubUrl(project.getGithubUrl())
            .demoUrl(project.getDemoUrl())
            .techStacks(techStacks.stream().map(TechStack::getName).toList())
            .relatedAcademics(academicNames)
            .build();
    }
    
    @Override
    public Project toEntity(ProjectCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }
        
        return Project.builder()
            .title(createRequest.getTitle())
            .summary(createRequest.getSummary())
            .description(createRequest.getDescription())
            .startDate(createRequest.getStartDate())
            .endDate(createRequest.getEndDate())
            .githubUrl(createRequest.getGithubUrl())
            .demoUrl(createRequest.getDemoUrl())
            .techStackIds(createRequest.getTechStackIds())
            .relatedAcademicIds(createRequest.getAcademicIds())
            .build();
    }
    
    @Override
    public void updateEntity(Project entity, ProjectUpdateRequest updateRequest) {
        if (entity == null || updateRequest == null) {
            return;
        }
        
        entity.setTitle(updateRequest.getTitle());
        entity.setSummary(updateRequest.getSummary());
        entity.setDescription(updateRequest.getDescription());
        entity.setStartDate(updateRequest.getStartDate());
        entity.setEndDate(updateRequest.getEndDate());
        entity.setGithubUrl(updateRequest.getGithubUrl());
        entity.setDemoUrl(updateRequest.getDemoUrl());
        entity.setTechStackIds(updateRequest.getTechStackIds());
        entity.setRelatedAcademicIds(updateRequest.getAcademicIds());
    }
}
```

---

## Mapping Patterns

### 1. Entity to Response DTO

```java
@Override
public ProjectDetailResponse toResponse(Project project) {
    if (project == null) {
        return null;
    }
    
    // Handle null checks
    // Fetch related entities if needed
    // Map fields
    // Return DTO
}
```

**Pattern Elements**:
- Null check first
- Fetch related entities if needed
- Map all fields
- Use builder pattern
- Return DTO

### 2. Create Request to Entity

```java
@Override
public Project toEntity(ProjectCreateRequest createRequest) {
    if (createRequest == null) {
        return null;
    }
    
    // Map request fields to entity
    // Set default values if needed
    // Return entity
}
```

**Pattern Elements**:
- Null check first
- Map request fields
- Set default values
- Use builder pattern
- Return entity

### 3. Update Request to Entity

```java
@Override
public void updateEntity(Project entity, ProjectUpdateRequest updateRequest) {
    if (entity == null || updateRequest == null) {
        return;
    }
    
    // Update entity fields
    // Only update provided fields
}
```

**Pattern Elements**:
- Null checks for both parameters
- Update entity fields
- Handle partial updates
- Void return type

---

## Multiple Response Types

### Summary vs Detail Response

```java
@Component
@RequiredArgsConstructor
public class ProjectMapper extends EntityMapper<...> {
    
    // Detail response (full data)
    @Override
    public ProjectDetailResponse toResponse(Project project) {
        // Full mapping with all fields
    }
    
    // Summary response (minimal data)
    public ProjectSummaryResponse toSummaryResponse(Project project) {
        if (project == null) {
            return null;
        }
        
        List<TechStack> techStacks = fetchTechStacks(project.getTechStackIds());
        
        return ProjectSummaryResponse.builder()
            .id(project.getId())
            .title(project.getTitle())
            .summary(project.getSummary())
            .startDate(project.getStartDate())
            .endDate(project.getEndDate())
            .techStacks(techStacks.stream().map(TechStack::getName).toList())
            .build();
    }
}
```

**Pattern Elements**:
- Implement base `toResponse()` for detail
- Add `toSummaryResponse()` for summary
- Include only necessary fields in summary
- Reuse helper methods

---

## Handling Related Entities

### Fetching Related Entities

```java
private List<TechStack> fetchTechStacks(List<String> techStackIds) {
    if (techStackIds == null || techStackIds.isEmpty()) {
        return List.of();
    }
    return techStackRepository.findByIdIn(techStackIds);
}

private List<String> fetchAcademicNames(List<String> academicIds) {
    if (academicIds == null || academicIds.isEmpty()) {
        return List.of();
    }
    return academicRepository.findAllById(academicIds).stream()
        .map(Academic::getName)
        .toList();
}
```

**Pattern Elements**:
- Private helper methods
- Null/empty checks
- Fetch from repository
- Transform as needed
- Return appropriate type

### Mapping Related Entities

```java
// In toResponse method
List<TechStack> techStacks = fetchTechStacks(project.getTechStackIds());
List<String> techStackNames = techStacks.stream()
    .map(TechStack::getName)
    .toList();

return ProjectDetailResponse.builder()
    .techStacks(techStackNames)
    .build();
```

**Pattern Elements**:
- Fetch related entities
- Transform to DTO format
- Include in response

---

## Null Handling

### Null-Safe Mapping

```java
@Override
public ProjectDetailResponse toResponse(Project project) {
    if (project == null) {
        return null;  // Return null if entity is null
    }
    
    // Safe mapping
    return ProjectDetailResponse.builder()
        .id(project.getId())
        .title(project.getTitle() != null ? project.getTitle() : "")
        .build();
}
```

### Optional Mapping

```java
public Optional<ProjectDetailResponse> toResponseOptional(Project project) {
    return Optional.ofNullable(project)
        .map(this::toResponse);
}
```

---

## Collection Mapping

### List Mapping

```java
public List<ProjectSummaryResponse> toSummaryResponseList(List<Project> projects) {
    if (projects == null) {
        return List.of();
    }
    return projects.stream()
        .map(this::toSummaryResponse)
        .filter(Objects::nonNull)
        .toList();
}
```

### Page Mapping

```java
public PageResponse<ProjectSummaryResponse> toPageResponse(Page<Project> projectPage, int page) {
    List<ProjectSummaryResponse> content = projectPage.getContent().stream()
        .map(this::toSummaryResponse)
        .filter(Objects::nonNull)
        .toList();
    
    return PaginationUtil.createPageResponse(content, projectPage);
}
```

---

## Best Practices

### ✅ DO

1. **Use mappers for all conversions**: Never map manually in services
2. **Handle null values**: Always check for null
3. **Fetch related entities**: In mapper, not in service
4. **Use builder pattern**: For complex DTOs
5. **Create helper methods**: For reusable mapping logic
6. **Support multiple response types**: Summary and detail
7. **Document complex mappings**: Add comments for complex logic

### ❌ DON'T

1. **Don't map in services**: Use mappers
2. **Don't expose entities**: Always convert to DTOs
3. **Don't skip null checks**: Always handle null
4. **Don't fetch in service**: Fetch in mapper if needed
5. **Don't duplicate mapping logic**: Use helper methods
6. **Don't ignore related entities**: Fetch and include them

---

## Mapper Organization

### Package Structure

```
mapper/
├── EntityMapper.java          # Base interface
├── Mapper.java                # Base mapper interface
├── ProjectMapper.java
├── AcademicMapper.java
└── ...
```

### Naming Conventions

- **Mapper classes**: `{Entity}Mapper` (e.g., `ProjectMapper`)
- **Methods**: `toResponse()`, `toEntity()`, `updateEntity()`
- **Helper methods**: `fetch{Entity}()`, `map{Field}()`

---

## Related Documentation

- [DTO Patterns](./DTO-Patterns.md) - DTO structure
- [Service Patterns](./Service-Patterns.md) - Mapper usage in services
- [Layered Architecture](../ARCHITECTURE/Layered-Architecture.md) - Architecture overview

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

