---
title: "API Versioning"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers", "Architects"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md", "../PATTERNS/Controller-Patterns.md"]
related_docs: ["Creating-Controllers.md"]
maintainer: "Development Team"
---

# API Versioning

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide describes the API versioning strategy and implementation for the MyTechPortfolio backend application.

---

## Versioning Strategy

The application uses **URL path versioning** with the pattern `/api/v{version}/...`

### Current Version

- **Current Version**: `v1`
- **Base Path**: `/api/v1/`
- **Example**: `/api/v1/projects`

---

## Implementation

### ApiConstants

All API paths are defined in `ApiConstants.java`:

```java
public final class ApiConstants {
    
    // API Versioning
    public static final String API_VERSION = "v1";
    public static final String API_BASE_PATH = "/api/" + API_VERSION;
    
    // API Endpoints
    public static final String PROJECTS_ENDPOINT = API_BASE_PATH + "/projects";
    public static final String ACADEMICS_ENDPOINT = API_BASE_PATH + "/academics";
    // ...
}
```

### Controller Implementation

Controllers use constants for base paths:

```java
@RestController
@RequestMapping(ApiConstants.PROJECTS_ENDPOINT)
public class ProjectController {
    // Endpoints automatically use /api/v1/projects
}
```

---

## Versioning Approaches

### 1. URL Path Versioning (Current)

**Pattern**: `/api/v1/projects`, `/api/v2/projects`

**Pros**:
- Clear and explicit
- Easy to understand
- Can run multiple versions simultaneously

**Cons**:
- URL changes with version
- More routing complexity

**Implementation**:
```java
@RestController
@RequestMapping("/api/v1/projects")
public class ProjectControllerV1 { }

@RestController
@RequestMapping("/api/v2/projects")
public class ProjectControllerV2 { }
```

### 2. Header Versioning (Alternative)

**Pattern**: `Accept: application/vnd.api.v1+json`

**Pros**:
- Clean URLs
- No URL changes

**Cons**:
- Less discoverable
- Requires custom handling

### 3. Query Parameter Versioning (Not Recommended)

**Pattern**: `/api/projects?version=1`

**Pros**:
- Simple URLs

**Cons**:
- Not RESTful
- Caching issues

---

## Creating a New Version

### Step 1: Update ApiConstants

```java
public final class ApiConstants {
    
    // Current version
    public static final String API_VERSION = "v2";
    public static final String API_BASE_PATH = "/api/" + API_VERSION;
    
    // Keep old version for backward compatibility
    public static final String API_VERSION_V1 = "v1";
    public static final String API_BASE_PATH_V1 = "/api/" + API_VERSION_V1;
}
```

### Step 2: Create New Version Controller

```java
@RestController
@RequestMapping(ApiConstants.PROJECTS_ENDPOINT)  // Uses v2
public class ProjectControllerV2 {
    // New implementation
}
```

### Step 3: Keep Old Version (Optional)

```java
@RestController
@RequestMapping(ApiConstants.PROJECTS_ENDPOINT_V1)  // Uses v1
public class ProjectControllerV1 {
    // Old implementation - deprecated
}
```

---

## Migration Strategy

### Gradual Migration

1. **Create new version**: Implement v2 alongside v1
2. **Update clients**: Migrate clients to v2
3. **Deprecate old version**: Mark v1 as deprecated
4. **Remove old version**: After deprecation period

### Deprecation Notice

```java
@RestController
@RequestMapping(ApiConstants.PROJECTS_ENDPOINT_V1)
@Deprecated
public class ProjectControllerV1 {
    
    @GetMapping
    @Deprecated
    @Operation(summary = "Deprecated: Use /api/v2/projects instead")
    public ResponseEntity<...> getAll() {
        // Return deprecation warning in response
    }
}
```

---

## Versioning Best Practices

### ✅ DO

1. **Use URL path versioning**: Clear and explicit
2. **Use constants**: Centralize version management
3. **Document breaking changes**: In changelog
4. **Support multiple versions**: During migration period
5. **Deprecate gracefully**: Give clients time to migrate
6. **Version DTOs**: Different DTOs for different versions

### ❌ DON'T

1. **Don't version frequently**: Only for breaking changes
2. **Don't remove versions immediately**: Support during migration
3. **Don't break backward compatibility**: Within same version
4. **Don't version for non-breaking changes**: Use feature flags

---

## Breaking Changes

### When to Create New Version

Create a new version when:
- Removing fields from responses
- Changing field types
- Removing endpoints
- Changing authentication/authorization
- Changing response structure

### When NOT to Create New Version

Don't create a new version for:
- Adding new fields (backward compatible)
- Adding new endpoints
- Bug fixes
- Performance improvements

---

## Related Documentation

- [Controller Patterns](../PATTERNS/Controller-Patterns.md) - Controller implementation
- [Creating Controllers](./Creating-Controllers.md) - Controller creation
- [API Specification](../../../docs/Specifications/API-Specification.md) - API documentation

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

