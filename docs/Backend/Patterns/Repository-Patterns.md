---
title: "Repository Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md", "Service-Patterns.md"]
related_docs: ["Service-Patterns.md"]
maintainer: "Development Team"
---

# Repository Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for MongoDB repository implementation in the MyTechPortfolio backend application.

---

## Repository Structure

### Basic Repository Pattern

```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Query methods
    // Custom queries
}
```

### Key Elements

- **`@Repository`**: Marks as Spring repository
- **Extends `MongoRepository<Entity, ID>`**: Provides CRUD operations
- **Interface-based**: Repositories are interfaces, Spring Data provides implementation

---

## Query Method Patterns

### 1. Spring Data Query Methods

Spring Data MongoDB automatically implements query methods based on method names:

```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Find by single field
    List<Project> findByTitle(String title);
    
    // Find by field containing
    List<Project> findByTitleContaining(String title);
    
    // Find by field ignoring case
    List<Project> findByTitleContainingIgnoreCase(String title);
    
    // Find with pagination
    Page<Project> findByTitleContaining(String title, Pageable pageable);
    
    // Find by multiple fields
    List<Project> findByTitleAndStatus(String title, ProjectStatus status);
    
    // Find by date range
    List<Project> findByStartDateBetween(LocalDate start, LocalDate end);
    
    // Find by list contains
    List<Project> findByTechStackIdsContaining(String techStackId);
    
    // Count queries
    long countByStatus(ProjectStatus status);
    
    // Exists queries
    boolean existsByTitle(String title);
}
```

**Query Method Naming**:
- `findBy...`: Find operations
- `countBy...`: Count operations
- `existsBy...`: Existence checks
- `deleteBy...`: Delete operations

### 2. Custom Queries with @Query

For complex queries, use `@Query` annotation:

```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // MongoDB query
    @Query("{'techStackIds': {$in: ?0}}")
    Page<Project> findByTechStackIds(List<String> techStackIds, Pageable pageable);
    
    // Date range query
    @Query("{'startDate': {$gte: ?0, $lte: ?1}}")
    Page<Project> findByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    // Text search
    @Query("{'$or': [{'title': {$regex: ?0, $options: 'i'}}, {'summary': {$regex: ?0, $options: 'i'}}]}")
    Page<Project> findByTitleOrSummaryContainingIgnoreCase(String searchTerm, Pageable pageable);
    
    // Sort query
    @Query(value = "{}", sort = "{'viewCount': -1}")
    Page<Project> findMostViewedProjects(Pageable pageable);
    
    // Complex query with multiple conditions
    @Query("{'status': ?0, 'startDate': {$gte: ?1}, 'techStackIds': {$in: ?2}}")
    List<Project> findActiveProjectsWithTechStacks(
        ProjectStatus status, 
        LocalDate startDate, 
        List<String> techStackIds
    );
}
```

**Query Patterns**:
- Use MongoDB query syntax
- Use `?0`, `?1` for parameters
- Use `$in` for list contains
- Use `$regex` for text search
- Use `$gte`, `$lte` for date ranges

### 3. Default Methods

Use default methods for complex logic:

```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Base query methods
    Page<Project> findByTechStackIds(List<String> techStackIds, Pageable pageable);
    Page<Project> findByYear(LocalDate yearStart, LocalDate yearEnd, Pageable pageable);
    
    // Default method combining queries
    default Page<Project> findProjectsWithFilters(
        List<String> techStackIds, 
        Integer year, 
        Pageable pageable
    ) {
        if (year != null) {
            LocalDate yearStart = LocalDate.of(year, 1, 1);
            LocalDate yearEnd = LocalDate.of(year, 12, 31);
            return findByYear(yearStart, yearEnd, pageable);
        }
        if (techStackIds != null && !techStackIds.isEmpty()) {
            return findByTechStackIds(techStackIds, pageable);
        }
        return findAll(pageable);
    }
}
```

---

## Pagination Patterns

### Using Pageable

```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Pagination with Pageable
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
    
    // Pagination with Sort
    Page<Project> findByTitleContaining(String title, Pageable pageable);
}
```

### Creating Pageable in Service

```java
// In Service
Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
Pageable pageable = PageRequest.of(page - 1, size, sort);
Page<Project> projectPage = projectRepository.findByStatus(status, pageable);
```

---

## Sorting Patterns

### Method Name Sorting

```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Sort by field
    List<Project> findByStatusOrderByCreatedAtDesc(ProjectStatus status);
    List<Project> findByStatusOrderByTitleAsc(ProjectStatus status);
    
    // Multiple sort fields
    List<Project> findByStatusOrderByCreatedAtDescTitleAsc(ProjectStatus status);
}
```

### @Query Sorting

```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Sort in query
    @Query(value = "{}", sort = "{'viewCount': -1}")
    Page<Project> findMostViewedProjects(Pageable pageable);
    
    @Query(value = "{}", sort = "{'createdAt': -1}")
    Page<Project> findRecentProjects(Pageable pageable);
}
```

### Pageable Sorting

```java
// In Service
Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
Pageable pageable = PageRequest.of(page - 1, size, sort);
Page<Project> projects = projectRepository.findAll(pageable);
```

---

## Common Query Patterns

### Find by ID

```java
Optional<Project> findById(String id);
```

### Find All

```java
List<Project> findAll();
Page<Project> findAll(Pageable pageable);
```

### Find by Field

```java
List<Project> findByTitle(String title);
Optional<Project> findByRepositoryName(String repositoryName);
```

### Find by List Contains

```java
@Query("{'techStackIds': {$in: ?0}}")
List<Project> findByTechStackIds(List<String> techStackIds);
```

### Find by Date Range

```java
@Query("{'startDate': {$gte: ?0, $lte: ?1}}")
List<Project> findByDateRange(LocalDate startDate, LocalDate endDate);
```

### Text Search

```java
@Query("{'$or': [{'title': {$regex: ?0, $options: 'i'}}, {'summary': {$regex: ?0, $options: 'i'}}]}")
List<Project> findByTitleOrSummaryContainingIgnoreCase(String searchTerm);
```

### Count Queries

```java
long countByStatus(ProjectStatus status);
long count();
```

### Exists Queries

```java
boolean existsByTitle(String title);
boolean existsById(String id);
```

---

## Best Practices

### ✅ DO

1. **Use Spring Data query methods**: When possible, use method names
2. **Use `@Query` for complex queries**: When method names become too long
3. **Use default methods**: For combining multiple queries
4. **Return appropriate types**: `Optional` for single results, `List` or `Page` for multiple
5. **Use pagination**: For large result sets
6. **Document complex queries**: Add comments for complex `@Query` annotations

### ❌ DON'T

1. **Don't put business logic in repositories**: Keep repositories focused on data access
2. **Don't return entities directly**: Services should convert to DTOs
3. **Don't use repositories in controllers**: Always use services
4. **Don't create too many query methods**: Use default methods to combine queries
5. **Don't skip pagination**: For potentially large result sets

---

## Performance Considerations

### Indexing

Ensure frequently queried fields are indexed:

```java
@Document(collection = "projects")
public class Project {
    @Indexed
    private String title;
    
    @Indexed
    private LocalDate startDate;
    
    @Indexed
    private ProjectStatus status;
}
```

### Query Optimization

1. **Use projections**: Return only needed fields
2. **Limit result size**: Use pagination
3. **Use indexes**: Index frequently queried fields
4. **Avoid N+1 queries**: Use `@Query` with joins when needed

---

## Related Documentation

- [Service Patterns](./Service-Patterns.md) - Service layer patterns
- [Layered Architecture](../ARCHITECTURE/Layered-Architecture.md) - Architecture overview
- [Database Architecture](../ARCHITECTURE/Database-Architecture.md) - MongoDB schema design

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

