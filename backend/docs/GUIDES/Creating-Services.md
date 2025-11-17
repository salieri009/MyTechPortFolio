---
title: "Creating Services"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers"]
prerequisites: ["../PATTERNS/Service-Patterns.md", "../ARCHITECTURE/Layered-Architecture.md"]
related_docs: ["Creating-Controllers.md", "Creating-Repositories.md"]
maintainer: "Development Team"
---

# Creating Services

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide provides step-by-step instructions for creating service layer components in the MyTechPortfolio backend application.

---

## Overview

Services contain business logic, orchestrate data access, and transform between entities and DTOs. This guide walks through creating a new service from scratch.

---

## Step-by-Step Guide

### Step 1: Create Service Interface (Optional)

For complex services, create an interface first:

```java
package com.mytechfolio.portfolio.service;

public interface YourService {
    YourDetailResponse findById(String id);
    PageResponse<YourSummaryResponse> findAll(int page, int size);
    YourDetailResponse create(YourCreateRequest request);
    YourDetailResponse update(String id, YourUpdateRequest request);
    void delete(String id);
}
```

### Step 2: Create Service Implementation

**Location**: `src/main/java/com/mytechfolio/portfolio/service/YourService.java`

```java
package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.dto.request.YourCreateRequest;
import com.mytechfolio.portfolio.dto.request.YourUpdateRequest;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.dto.response.YourDetailResponse;
import com.mytechfolio.portfolio.dto.response.YourSummaryResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.YourMapper;
import com.mytechfolio.portfolio.repository.YourRepository;
import com.mytechfolio.portfolio.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class YourService {
    
    private final YourRepository yourRepository;
    private final YourMapper yourMapper;
    
    // Service methods...
}
```

**Key Annotations**:
- `@Service`: Marks as Spring service
- `@Slf4j`: Lombok logging
- `@RequiredArgsConstructor`: Constructor injection
- `@Transactional(readOnly = true)`: Default read-only transactions

### Step 3: Implement Find All Method

```java
public PageResponse<YourSummaryResponse> findAll(int page, int size) {
    log.debug("Fetching all entities - page: {}, size: {}", page, size);
    
    Pageable pageable = PaginationUtil.createPageable(page, size);
    Page<YourEntity> entityPage = yourRepository.findAll(pageable);
    
    return PaginationUtil.toPageResponse(entityPage, yourMapper::toSummaryResponse, page);
}
```

### Step 4: Implement Find By ID Method

```java
public YourDetailResponse findById(String id) {
    log.debug("Fetching entity with ID: {}", id);
    
    YourEntity entity = yourRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Entity not found with id: " + id));
    
    return yourMapper.toResponse(entity);
}
```

### Step 5: Implement Create Method

```java
@Transactional
public YourDetailResponse create(YourCreateRequest request) {
    log.info("Creating new entity: {}", request.getName());
    
    // Business validation
    validateCreateRequest(request);
    
    // Convert DTO to Entity
    YourEntity entity = yourMapper.toEntity(request);
    
    // Save entity
    YourEntity savedEntity = yourRepository.save(entity);
    
    log.info("Entity created successfully with ID: {}", savedEntity.getId());
    
    return yourMapper.toResponse(savedEntity);
}
```

### Step 6: Implement Update Method

```java
@Transactional
public YourDetailResponse update(String id, YourUpdateRequest request) {
    log.info("Updating entity with ID: {}", id);
    
    // Find existing entity
    YourEntity entity = yourRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Entity not found with id: " + id));
    
    // Business validation
    validateUpdateRequest(request, entity);
    
    // Update entity
    yourMapper.updateEntity(entity, request);
    
    // Save updated entity
    YourEntity updatedEntity = yourRepository.save(entity);
    
    log.info("Entity updated successfully with ID: {}", id);
    
    return yourMapper.toResponse(updatedEntity);
}
```

### Step 7: Implement Delete Method

```java
@Transactional
public void delete(String id) {
    log.info("Deleting entity with ID: {}", id);
    
    if (!yourRepository.existsById(id)) {
        throw new ResourceNotFoundException("Entity not found with id: " + id);
    }
    
    yourRepository.deleteById(id);
    
    log.info("Entity deleted successfully with ID: {}", id);
}
```

### Step 8: Add Business Validation

```java
private void validateCreateRequest(YourCreateRequest request) {
    // Business rule: Check for duplicates
    if (yourRepository.existsByName(request.getName())) {
        throw new DuplicateResourceException(
            "Entity with name already exists: " + request.getName());
    }
    
    // Business rule: Validate related entities
    if (request.getRelatedIds() != null && !request.getRelatedIds().isEmpty()) {
        // Validate related entities exist
    }
}

private void validateUpdateRequest(YourUpdateRequest request, YourEntity entity) {
    // Business validation for updates
    if (request.getName() != null && 
        !request.getName().equals(entity.getName()) &&
        yourRepository.existsByName(request.getName())) {
        throw new DuplicateResourceException("Name already exists");
    }
}
```

---

## Complete Service Example

```java
package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.dto.request.YourCreateRequest;
import com.mytechfolio.portfolio.dto.request.YourUpdateRequest;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.dto.response.YourDetailResponse;
import com.mytechfolio.portfolio.dto.response.YourSummaryResponse;
import com.mytechfolio.portfolio.exception.DuplicateResourceException;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.YourMapper;
import com.mytechfolio.portfolio.repository.YourRepository;
import com.mytechfolio.portfolio.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class YourService {
    
    private final YourRepository yourRepository;
    private final YourMapper yourMapper;
    
    public PageResponse<YourSummaryResponse> findAll(int page, int size) {
        log.debug("Fetching all entities - page: {}, size: {}", page, size);
        Pageable pageable = PaginationUtil.createPageable(page, size);
        Page<YourEntity> entityPage = yourRepository.findAll(pageable);
        return PaginationUtil.toPageResponse(entityPage, yourMapper::toSummaryResponse, page);
    }
    
    public YourDetailResponse findById(String id) {
        log.debug("Fetching entity with ID: {}", id);
        YourEntity entity = yourRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entity not found with id: " + id));
        return yourMapper.toResponse(entity);
    }
    
    @Transactional
    public YourDetailResponse create(YourCreateRequest request) {
        log.info("Creating new entity: {}", request.getName());
        validateCreateRequest(request);
        YourEntity entity = yourMapper.toEntity(request);
        YourEntity savedEntity = yourRepository.save(entity);
        log.info("Entity created successfully with ID: {}", savedEntity.getId());
        return yourMapper.toResponse(savedEntity);
    }
    
    @Transactional
    public YourDetailResponse update(String id, YourUpdateRequest request) {
        log.info("Updating entity with ID: {}", id);
        YourEntity entity = yourRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entity not found with id: " + id));
        validateUpdateRequest(request, entity);
        yourMapper.updateEntity(entity, request);
        YourEntity updatedEntity = yourRepository.save(entity);
        log.info("Entity updated successfully with ID: {}", id);
        return yourMapper.toResponse(updatedEntity);
    }
    
    @Transactional
    public void delete(String id) {
        log.info("Deleting entity with ID: {}", id);
        if (!yourRepository.existsById(id)) {
            throw new ResourceNotFoundException("Entity not found with id: " + id);
        }
        yourRepository.deleteById(id);
        log.info("Entity deleted successfully with ID: {}", id);
    }
    
    private void validateCreateRequest(YourCreateRequest request) {
        if (yourRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Entity with name already exists: " + request.getName());
        }
    }
    
    private void validateUpdateRequest(YourUpdateRequest request, YourEntity entity) {
        if (request.getName() != null && 
            !request.getName().equals(entity.getName()) &&
            yourRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Name already exists");
        }
    }
}
```

---

## Using Base Service (Optional)

For standard CRUD operations, extend `BaseServiceImpl`:

```java
@Service
@RequiredArgsConstructor
public class YourService extends BaseServiceImpl<
    YourEntity, 
    String, 
    YourDetailResponse, 
    YourCreateRequest, 
    YourUpdateRequest
> {
    
    public YourService(YourRepository repository, YourMapper mapper) {
        super(repository, mapper);
    }
    
    // Override methods if custom logic needed
    // Add custom methods
}
```

---

## Checklist

- [ ] Create service class in `service/` package
- [ ] Add `@Service` annotation
- [ ] Add `@Transactional(readOnly = true)` as default
- [ ] Inject repository and mapper dependencies
- [ ] Implement `findAll()` with pagination
- [ ] Implement `findById()` with error handling
- [ ] Implement `create()` with `@Transactional`
- [ ] Implement `update()` with `@Transactional`
- [ ] Implement `delete()` with `@Transactional`
- [ ] Add business validation methods
- [ ] Add logging at appropriate levels
- [ ] Handle exceptions appropriately
- [ ] Write unit tests

---

## Best Practices

1. **Keep business logic in services**: Not in controllers or repositories
2. **Use transactions**: `@Transactional` for write operations
3. **Validate business rules**: Before saving entities
4. **Use mappers**: Convert between entities and DTOs
5. **Log operations**: At appropriate levels
6. **Throw appropriate exceptions**: Use custom exceptions
7. **Keep services focused**: One service per domain

---

## Related Documentation

- [Service Patterns](../PATTERNS/Service-Patterns.md) - Service patterns
- [Creating Controllers](./Creating-Controllers.md) - Controller creation
- [Creating Repositories](./Creating-Repositories.md) - Repository creation
- [Adding New Domain](./Adding-New-Domain.md) - Complete workflow

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

