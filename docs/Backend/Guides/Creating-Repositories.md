---
title: "Creating Repositories"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers"]
prerequisites: ["../PATTERNS/Repository-Patterns.md", "../ARCHITECTURE/Layered-Architecture.md"]
related_docs: ["Creating-Services.md", "Adding-New-Domain.md"]
maintainer: "Development Team"
---

# Creating Repositories

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide provides step-by-step instructions for creating MongoDB repository interfaces in the MyTechPortfolio backend application.

---

## Overview

Repositories provide data access methods for MongoDB collections. Spring Data MongoDB automatically implements repository interfaces based on method names.

---

## Step-by-Step Guide

### Step 1: Create Repository Interface

**Location**: `src/main/java/com/mytechfolio/portfolio/repository/YourRepository.java`

```java
package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.YourEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface YourRepository extends MongoRepository<YourEntity, String> {
    
    // Query methods will be added here
}
```

**Key Elements**:
- Extend `MongoRepository<Entity, ID>`
- Use `String` as ID type (MongoDB ObjectId)
- Add `@Repository` annotation

### Step 2: Add Basic Query Methods

```java
@Repository
public interface YourRepository extends MongoRepository<YourEntity, String> {
    
    // Find by single field
    Optional<YourEntity> findByName(String name);
    
    // Find by field containing
    List<YourEntity> findByNameContaining(String name);
    
    // Find with pagination
    Page<YourEntity> findByNameContaining(String name, Pageable pageable);
    
    // Exists check
    boolean existsByName(String name);
    
    // Count
    long countByName(String name);
}
```

### Step 3: Add Custom Queries (if needed)

```java
@Repository
public interface YourRepository extends MongoRepository<YourEntity, String> {
    
    // Custom MongoDB query
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<YourEntity> findByNameRegex(String pattern);
    
    // Date range query
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<YourEntity> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // Complex query
    @Query("{'status': ?0, 'name': {$in: ?1}}")
    Page<YourEntity> findByStatusAndNames(Status status, List<String> names, Pageable pageable);
}
```

### Step 4: Add Default Methods (if needed)

```java
@Repository
public interface YourRepository extends MongoRepository<YourEntity, String> {
    
    // Base query methods
    Page<YourEntity> findByStatus(Status status, Pageable pageable);
    List<YourEntity> findByNameIn(List<String> names);
    
    // Default method combining queries
    default Page<YourEntity> findWithFilters(Status status, List<String> names, Pageable pageable) {
        if (status != null && names != null && !names.isEmpty()) {
            return findByStatusAndNames(status, names, pageable);
        }
        if (status != null) {
            return findByStatus(status, pageable);
        }
        if (names != null && !names.isEmpty()) {
            return findByNameIn(names, pageable);
        }
        return findAll(pageable);
    }
}
```

---

## Complete Repository Example

```java
package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.YourEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface YourRepository extends MongoRepository<YourEntity, String> {
    
    // Basic queries
    Optional<YourEntity> findByName(String name);
    List<YourEntity> findByNameContaining(String name);
    Page<YourEntity> findByNameContaining(String name, Pageable pageable);
    boolean existsByName(String name);
    long countByName(String name);
    
    // Custom queries
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<YourEntity> findByNameRegex(String pattern);
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<YourEntity> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("{'status': ?0}")
    Page<YourEntity> findByStatus(Status status, Pageable pageable);
    
    // Default method for complex filtering
    default Page<YourEntity> findWithFilters(Status status, String namePattern, Pageable pageable) {
        if (status != null && namePattern != null) {
            return findByStatusAndNamePattern(status, namePattern, pageable);
        }
        if (status != null) {
            return findByStatus(status, pageable);
        }
        if (namePattern != null) {
            return findByNameContaining(namePattern, pageable);
        }
        return findAll(pageable);
    }
}
```

---

## Query Method Naming Patterns

### Find Operations

```java
// Find by single field
findByName(String name)
findById(String id)

// Find by field containing
findByNameContaining(String name)
findByNameContainingIgnoreCase(String name)

// Find by multiple fields
findByNameAndStatus(String name, Status status)
findByNameOrStatus(String name, Status status)

// Find with pagination
findByName(String name, Pageable pageable)
findAll(Pageable pageable)
```

### Count Operations

```java
countByName(String name)
countByStatus(Status status)
count()
```

### Exists Operations

```java
existsByName(String name)
existsById(String id)
```

### Delete Operations

```java
deleteByName(String name)
deleteByStatus(Status status)
```

---

## Custom Query Examples

### Text Search

```java
@Query("{'$or': [{'name': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}")
List<YourEntity> search(String searchTerm);
```

### Date Range

```java
@Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
List<YourEntity> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
```

### Array Contains

```java
@Query("{'tags': {$in: ?0}}")
List<YourEntity> findByTagsIn(List<String> tags);
```

### Sort Query

```java
@Query(value = "{}", sort = "{'createdAt': -1}")
List<YourEntity> findRecent();
```

---

## Checklist

- [ ] Create repository interface in `repository/` package
- [ ] Extend `MongoRepository<Entity, String>`
- [ ] Add `@Repository` annotation
- [ ] Add basic query methods (findBy, existsBy, countBy)
- [ ] Add custom queries with `@Query` if needed
- [ ] Add default methods for complex filtering if needed
- [ ] Test repository methods

---

## Best Practices

1. **Use Spring Data query methods**: When possible, use method names
2. **Use `@Query` for complex queries**: When method names become too long
3. **Use default methods**: For combining multiple queries
4. **Return appropriate types**: `Optional` for single results, `List` or `Page` for multiple
5. **Use pagination**: For potentially large result sets
6. **Document complex queries**: Add comments for complex `@Query` annotations

---

## Related Documentation

- [Repository Patterns](../PATTERNS/Repository-Patterns.md) - Repository patterns
- [Creating Services](./Creating-Services.md) - Service creation
- [Adding New Domain](./Adding-New-Domain.md) - Complete workflow

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

