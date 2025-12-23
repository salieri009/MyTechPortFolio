---
title: "Creating Controllers"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers"]
prerequisites: ["../PATTERNS/Controller-Patterns.md", "../ARCHITECTURE/Layered-Architecture.md"]
related_docs: ["Creating-Services.md", "Creating-Repositories.md"]
maintainer: "Development Team"
---

# Creating Controllers

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide provides step-by-step instructions for creating REST controllers in the MyTechPortfolio backend application.

---

## Overview

Controllers handle HTTP requests and responses, delegate to services, and format responses. This guide walks through creating a new controller from scratch.

---

## Step-by-Step Guide

### Step 1: Create Controller Class

Create a new file in `src/main/java/com/mytechfolio/portfolio/controller/`:

```java
package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.service.YourService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping(ApiConstants.YOUR_ENDPOINT)
@Tag(name = "YourResource", description = "Your resource management API")
@RequiredArgsConstructor
public class YourController {
    
    private final YourService yourService;
}
```

### Step 2: Add Constants

Add endpoint constant to `ApiConstants.java`:

```java
public static final String YOUR_ENDPOINT = API_BASE_PATH + "/your-resource";
```

### Step 3: Implement CRUD Endpoints

#### GET - List All

```java
@GetMapping
@Operation(summary = "Get list", description = "Retrieves list with pagination and sorting support.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(responseCode = "400", description = "Bad request")
})
public ResponseEntity<ApiResponse<PageResponse<YourSummaryResponse>>> getAll(
    @Parameter(description = "Page number", example = "1")
    @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_NUMBER) 
    @Min(1) int page,
    
    @Parameter(description = "Page size", example = "10")
    @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_SIZE) 
    @Min(1) @Max(ApiConstants.MAX_PAGE_SIZE) int size,
    
    @Parameter(description = "Sort criteria", example = "createdAt,desc")
    @RequestParam(required = false, defaultValue = ApiConstants.DEFAULT_SORT_FIELD + "," + ApiConstants.DEFAULT_SORT_DIRECTION) 
    String sort
) {
    PageResponse<YourSummaryResponse> response = yourService.findAll(page, size, sort);
    return ResponseUtil.ok(response);
}
```

#### GET - Get By ID

```java
@GetMapping("/{id}")
@Operation(summary = "Get details", description = "Retrieves details by ID.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(responseCode = "404", description = "Resource not found")
})
public ResponseEntity<ApiResponse<YourDetailResponse>> getById(
    @Parameter(description = "Resource ID", required = true)
    @PathVariable 
    @ValidMongoId(message = "Invalid ID format")
    String id
) {
    YourDetailResponse response = yourService.findById(id);
    return ResponseUtil.ok(response);
}
```

#### POST - Create

```java
@PostMapping
@Operation(summary = "Create", description = "Creates a new resource.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "201", description = "Created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid request data")
})
public ResponseEntity<ApiResponse<YourDetailResponse>> create(
    @Parameter(description = "Create request", required = true)
    @Valid @RequestBody YourCreateRequest request
) {
    YourDetailResponse response = yourService.create(request);
    return ResponseUtil.created(response);
}
```

#### PUT - Update

```java
@PutMapping("/{id}")
@Operation(summary = "Update", description = "Updates an existing resource.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Updated successfully"),
    @ApiResponse(responseCode = "404", description = "Resource not found")
})
public ResponseEntity<ApiResponse<YourDetailResponse>> update(
    @Parameter(description = "Resource ID", required = true)
    @PathVariable @ValidMongoId String id,
    
    @Parameter(description = "Update request", required = true)
    @Valid @RequestBody YourUpdateRequest request
) {
    YourDetailResponse response = yourService.update(id, request);
    return ResponseUtil.ok(response);
}
```

#### DELETE - Delete

```java
@DeleteMapping("/{id}")
@Operation(summary = "Delete", description = "Deletes a resource.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "204", description = "Deleted successfully"),
    @ApiResponse(responseCode = "404", description = "Resource not found")
})
public ResponseEntity<Void> delete(
    @Parameter(description = "Resource ID", required = true)
    @PathVariable @ValidMongoId String id
) {
    yourService.delete(id);
    return ResponseUtil.noContent();
}
```

### Step 4: Using AbstractCrudController (Optional)

For standard CRUD operations, extend `AbstractCrudController`:

```java
@RestController
@RequestMapping(ApiConstants.YOUR_ENDPOINT)
@Tag(name = "YourResource", description = "Your resource management API")
public class YourController extends AbstractCrudController<
    YourEntity, 
    String, 
    YourDetailResponse, 
    YourCreateRequest, 
    YourUpdateRequest
> {
    
    public YourController(YourService yourService) {
        super(yourService);
    }
    
    @Override
    protected String getResourceName() {
        return "YourResource";
    }
    
    // Add custom endpoints here if needed
}
```

---

## Complete Example

```java
package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.request.YourCreateRequest;
import com.mytechfolio.portfolio.dto.request.YourUpdateRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.dto.response.YourDetailResponse;
import com.mytechfolio.portfolio.dto.response.YourSummaryResponse;
import com.mytechfolio.portfolio.service.YourService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import com.mytechfolio.portfolio.validation.ValidMongoId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiConstants.YOUR_ENDPOINT)
@Tag(name = "YourResource", description = "Your resource management API")
@RequiredArgsConstructor
public class YourController {
    
    private final YourService yourService;
    
    @GetMapping
    @Operation(summary = "Get list")
    public ResponseEntity<ApiResponse<PageResponse<YourSummaryResponse>>> getAll(
        @RequestParam(defaultValue = "1") @Min(1) int page,
        @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return ResponseUtil.ok(yourService.findAll(page, size));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get details")
    public ResponseEntity<ApiResponse<YourDetailResponse>> getById(
        @PathVariable @ValidMongoId String id
    ) {
        return ResponseUtil.ok(yourService.findById(id));
    }
    
    @PostMapping
    @Operation(summary = "Create")
    public ResponseEntity<ApiResponse<YourDetailResponse>> create(
        @Valid @RequestBody YourCreateRequest request
    ) {
        return ResponseUtil.created(yourService.create(request));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update")
    public ResponseEntity<ApiResponse<YourDetailResponse>> update(
        @PathVariable @ValidMongoId String id,
        @Valid @RequestBody YourUpdateRequest request
    ) {
        return ResponseUtil.ok(yourService.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete")
    public ResponseEntity<Void> delete(@PathVariable @ValidMongoId String id) {
        yourService.delete(id);
        return ResponseUtil.noContent();
    }
}
```

---

## Checklist

- [ ] Create controller class in `controller/` package
- [ ] Add endpoint constant to `ApiConstants`
- [ ] Add `@RestController` and `@RequestMapping` annotations
- [ ] Add Swagger `@Tag` annotation
- [ ] Inject service dependency
- [ ] Implement GET endpoints (list, get by ID)
- [ ] Implement POST endpoint (create)
- [ ] Implement PUT endpoint (update)
- [ ] Implement DELETE endpoint (delete)
- [ ] Add validation annotations (`@Valid`, `@ValidMongoId`)
- [ ] Add Swagger documentation (`@Operation`, `@ApiResponses`)
- [ ] Use `ResponseUtil` for responses
- [ ] Test endpoints

---

## Best Practices

1. **Keep controllers thin**: Delegate to services
2. **Use constants**: For endpoint paths
3. **Validate inputs**: Use `@Valid` and validation annotations
4. **Document APIs**: Use Swagger annotations
5. **Use ResponseUtil**: For consistent responses
6. **Handle errors globally**: Let `GlobalExceptionHandler` handle exceptions

---

## Related Documentation

- [Controller Patterns](../PATTERNS/Controller-Patterns.md) - Controller patterns
- [Creating Services](./Creating-Services.md) - Service creation guide
- [Adding New Domain](./Adding-New-Domain.md) - Complete workflow

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

