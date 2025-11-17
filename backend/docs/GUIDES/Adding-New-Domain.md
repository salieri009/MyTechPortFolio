---
title: "Adding New Domain"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md", "../PATTERNS/README.md"]
related_docs: ["Creating-Controllers.md", "Creating-Services.md", "Creating-Repositories.md"]
maintainer: "Development Team"
---

# Adding New Domain

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide provides a complete workflow for adding a new domain (entity) to the MyTechPortfolio backend application, including all layers: Domain, Repository, Service, Controller, DTOs, and Mapper.

---

## Overview

Adding a new domain involves creating components across all layers:
1. Domain Entity
2. Repository
3. DTOs (Request/Response)
4. Mapper
5. Service
6. Controller

---

## Step-by-Step Workflow

### Step 1: Create Domain Entity

**Location**: `src/main/java/com/mytechfolio/portfolio/domain/YourEntity.java`

```java
package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "yourEntities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YourEntity {
    
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    private String description;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

**Checklist**:
- [ ] Add `@Document(collection = "...")` annotation
- [ ] Add `@Id` for MongoDB ID
- [ ] Add `@Indexed` for frequently queried fields
- [ ] Add Lombok annotations (`@Data`, `@Builder`, etc.)
- [ ] Add audit fields (`@CreatedDate`, `@LastModifiedDate`)

### Step 2: Create Repository

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
    
    Optional<YourEntity> findByName(String name);
    
    List<YourEntity> findByNameContaining(String name);
    
    boolean existsByName(String name);
}
```

**Checklist**:
- [ ] Extend `MongoRepository<Entity, String>`
- [ ] Add `@Repository` annotation
- [ ] Add query methods as needed
- [ ] Use Spring Data query method naming

### Step 3: Create DTOs

#### Create Request DTO

**Location**: `src/main/java/com/mytechfolio/portfolio/dto/request/YourCreateRequest.java`

```java
package com.mytechfolio.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class YourCreateRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;
}
```

#### Update Request DTO

**Location**: `src/main/java/com/mytechfolio/portfolio/dto/request/YourUpdateRequest.java`

```java
package com.mytechfolio.portfolio.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class YourUpdateRequest {
    
    @Size(min = 3, max = 255)
    private String name;
    
    @Size(max = 1000)
    private String description;
}
```

#### Response DTOs

**Location**: `src/main/java/com/mytechfolio/portfolio/dto/response/YourDetailResponse.java`

```java
package com.mytechfolio.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class YourDetailResponse {
    private String id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**Location**: `src/main/java/com/mytechfolio/portfolio/dto/response/YourSummaryResponse.java`

```java
package com.mytechfolio.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class YourSummaryResponse {
    private String id;
    private String name;
}
```

**Checklist**:
- [ ] Create CreateRequest with validation
- [ ] Create UpdateRequest (fields can be optional)
- [ ] Create DetailResponse (all fields)
- [ ] Create SummaryResponse (essential fields only)
- [ ] Add validation annotations
- [ ] Use Lombok annotations

### Step 4: Create Mapper

**Location**: `src/main/java/com/mytechfolio/portfolio/mapper/YourMapper.java`

```java
package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.YourEntity;
import com.mytechfolio.portfolio.dto.request.YourCreateRequest;
import com.mytechfolio.portfolio.dto.request.YourUpdateRequest;
import com.mytechfolio.portfolio.dto.response.YourDetailResponse;
import com.mytechfolio.portfolio.dto.response.YourSummaryResponse;
import org.springframework.stereotype.Component;

@Component
public class YourMapper extends EntityMapper<YourEntity, YourDetailResponse, YourCreateRequest, YourUpdateRequest> {
    
    @Override
    public YourDetailResponse toResponse(YourEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return YourDetailResponse.builder()
            .id(entity.getId())
            .name(entity.getName())
            .description(entity.getDescription())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }
    
    public YourSummaryResponse toSummaryResponse(YourEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return YourSummaryResponse.builder()
            .id(entity.getId())
            .name(entity.getName())
            .build();
    }
    
    @Override
    public YourEntity toEntity(YourCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }
        
        return YourEntity.builder()
            .name(createRequest.getName())
            .description(createRequest.getDescription())
            .build();
    }
    
    @Override
    public void updateEntity(YourEntity entity, YourUpdateRequest updateRequest) {
        if (entity == null || updateRequest == null) {
            return;
        }
        
        if (updateRequest.getName() != null) {
            entity.setName(updateRequest.getName());
        }
        if (updateRequest.getDescription() != null) {
            entity.setDescription(updateRequest.getDescription());
        }
    }
}
```

**Checklist**:
- [ ] Extend `EntityMapper`
- [ ] Add `@Component` annotation
- [ ] Implement `toResponse()` method
- [ ] Implement `toSummaryResponse()` method (if needed)
- [ ] Implement `toEntity()` method
- [ ] Implement `updateEntity()` method
- [ ] Handle null values

### Step 5: Create Service

**Location**: `src/main/java/com/mytechfolio/portfolio/service/YourService.java`

```java
package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.YourEntity;
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
        
        // Business validation
        validateCreateRequest(request);
        
        // Convert DTO to Entity
        YourEntity entity = yourMapper.toEntity(request);
        
        // Save entity
        YourEntity savedEntity = yourRepository.save(entity);
        
        log.info("Entity created successfully with ID: {}", savedEntity.getId());
        
        return yourMapper.toResponse(savedEntity);
    }
    
    @Transactional
    public YourDetailResponse update(String id, YourUpdateRequest request) {
        log.info("Updating entity with ID: {}", id);
        
        // Find existing entity
        YourEntity entity = yourRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entity not found with id: " + id));
        
        // Update entity
        yourMapper.updateEntity(entity, request);
        
        // Save updated entity
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
        // Business validation logic
        if (yourRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Entity with name already exists: " + request.getName());
        }
    }
}
```

**Checklist**:
- [ ] Add `@Service` annotation
- [ ] Add `@Transactional(readOnly = true)` as default
- [ ] Inject repository and mapper
- [ ] Implement `findAll()` with pagination
- [ ] Implement `findById()` with error handling
- [ ] Implement `create()` with `@Transactional`
- [ ] Implement `update()` with `@Transactional`
- [ ] Implement `delete()` with `@Transactional`
- [ ] Add business validation
- [ ] Add logging

### Step 6: Create Controller

**Location**: `src/main/java/com/mytechfolio/portfolio/controller/YourController.java`

See [Creating Controllers](./Creating-Controllers.md) for detailed controller creation guide.

**Checklist**:
- [ ] Create controller class
- [ ] Add endpoint constant to `ApiConstants`
- [ ] Implement CRUD endpoints
- [ ] Add Swagger documentation
- [ ] Add validation annotations

### Step 7: Add Endpoint Constant

**Location**: `src/main/java/com/mytechfolio/portfolio/constants/ApiConstants.java`

```java
public static final String YOUR_ENDPOINT = API_BASE_PATH + "/your-resources";
```

---

## Complete Checklist

### Domain Layer
- [ ] Create domain entity
- [ ] Add MongoDB annotations
- [ ] Add indexes for frequently queried fields

### Repository Layer
- [ ] Create repository interface
- [ ] Add query methods
- [ ] Add custom queries if needed

### DTO Layer
- [ ] Create CreateRequest DTO
- [ ] Create UpdateRequest DTO
- [ ] Create DetailResponse DTO
- [ ] Create SummaryResponse DTO
- [ ] Add validation annotations

### Mapper Layer
- [ ] Create mapper class
- [ ] Implement entity-to-DTO mapping
- [ ] Implement DTO-to-entity mapping
- [ ] Implement update mapping

### Service Layer
- [ ] Create service class
- [ ] Implement CRUD operations
- [ ] Add business validation
- [ ] Add logging
- [ ] Handle exceptions

### Controller Layer
- [ ] Create controller class
- [ ] Add endpoint constant
- [ ] Implement CRUD endpoints
- [ ] Add Swagger documentation
- [ ] Add validation

### Testing
- [ ] Write unit tests for service
- [ ] Write integration tests for controller
- [ ] Test all CRUD operations
- [ ] Test error scenarios

---

## Testing Your New Domain

### Unit Test Example

```java
@ExtendWith(MockitoExtension.class)
class YourServiceTest {
    
    @Mock
    private YourRepository yourRepository;
    
    @Mock
    private YourMapper yourMapper;
    
    @InjectMocks
    private YourService yourService;
    
    @Test
    void shouldCreateEntity() {
        // Test implementation
    }
}
```

### Integration Test Example

```java
@SpringBootTest
@AutoConfigureMockMvc
class YourControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldCreateEntity() throws Exception {
        // Test implementation
    }
}
```

---

## Related Documentation

- [Creating Controllers](./Creating-Controllers.md) - Controller creation
- [Creating Services](./Creating-Services.md) - Service creation
- [Creating Repositories](./Creating-Repositories.md) - Repository creation
- [Controller Patterns](../PATTERNS/Controller-Patterns.md) - Controller patterns
- [Service Patterns](../PATTERNS/Service-Patterns.md) - Service patterns

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

