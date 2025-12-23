---
title: "Exception Handling Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md", "Controller-Patterns.md"]
related_docs: ["Service-Patterns.md", "Validation-Patterns.md"]
maintainer: "Development Team"
---

# Exception Handling Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for exception handling in the MyTechPortfolio backend application.

---

## Exception Handling Strategy

The application uses a **centralized exception handling** approach with a global exception handler that:
- Catches all exceptions
- Converts them to appropriate HTTP responses
- Prevents information leakage
- Provides consistent error responses
- Logs errors appropriately

---

## Global Exception Handler

### Structure

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    // Exception handlers for different exception types
}
```

**Key Annotations**:
- **`@RestControllerAdvice`**: Global exception handler for all controllers
- **`@Slf4j`**: Lombok annotation for logging

---

## Exception Types and Handling

### 1. Validation Exceptions

#### MethodArgumentNotValidException

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
        MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach(error -> {
        String fieldName = ((FieldError) error).getField();
        String errorMessage = error.getDefaultMessage();
        errors.put(fieldName, errorMessage);
    });
    
    log.warn("Validation failed: {}", errors);
    
    ApiResponse<Map<String, String>> errorResponse = ApiResponse.error(
        ErrorCode.VALIDATION_ERROR, errors);
    return ResponseEntity.badRequest()
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `400 Bad Request` with field-level error messages

#### ConstraintViolationException

```java
@ExceptionHandler(ConstraintViolationException.class)
public ResponseEntity<ApiResponse<Map<String, String>>> handleConstraintViolationException(
        ConstraintViolationException ex) {
    Map<String, String> errors = ex.getConstraintViolations().stream()
            .collect(Collectors.toMap(
                violation -> violation.getPropertyPath().toString(),
                ConstraintViolation::getMessage
            ));
    
    log.warn("Constraint violation: {}", errors);
    
    ApiResponse<Map<String, String>> errorResponse = ApiResponse.error(
        ErrorCode.VALIDATION_ERROR, errors);
    return ResponseEntity.badRequest()
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `400 Bad Request` with constraint violation messages

### 2. Custom Business Exceptions

#### ResourceNotFoundException

```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(
        ResourceNotFoundException ex) {
    log.warn("Resource not found: {}", ex.getMessage());
    ApiResponse<Void> errorResponse = ApiResponse.error(
        ErrorCode.RESOURCE_NOT_FOUND, ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `404 Not Found`

**Usage in Service**:
```java
public ProjectDetailResponse getProject(String id) {
    Project project = projectRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    return projectMapper.toResponse(project);
}
```

#### DuplicateResourceException

```java
@ExceptionHandler(DuplicateResourceException.class)
public ResponseEntity<ApiResponse<Void>> handleDuplicateResourceException(
        DuplicateResourceException ex) {
    log.warn("Duplicate resource: {}", ex.getMessage());
    ApiResponse<Void> errorResponse = ApiResponse.error(
        ErrorCode.DUPLICATE_RESOURCE, ex.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `409 Conflict`

**Usage in Service**:
```java
private void validateProjectRequest(ProjectCreateRequest request) {
    if (projectRepository.existsByTitle(request.getTitle())) {
        throw new DuplicateResourceException(
            "Project with title already exists: " + request.getTitle());
    }
}
```

### 3. Security Exceptions

#### AccessDeniedException

```java
@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
    log.warn("Access denied: {}", ex.getMessage());
    ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.FORBIDDEN);
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `403 Forbidden`

#### BadCredentialsException

```java
@ExceptionHandler(BadCredentialsException.class)
public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
    log.warn("Authentication failed");
    ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.AUTHENTICATION_FAILED);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `401 Unauthorized`

### 4. Request Parameter Exceptions

#### MissingServletRequestParameterException

```java
@ExceptionHandler(MissingServletRequestParameterException.class)
public ResponseEntity<ApiResponse<Void>> handleMissingParams(
        MissingServletRequestParameterException ex) {
    log.warn("Missing parameter: {}", ex.getParameterName());
    ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.MISSING_PARAMETER, 
        "Missing required parameter: " + ex.getParameterName());
    return ResponseEntity.badRequest()
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `400 Bad Request`

#### MethodArgumentTypeMismatchException

```java
@ExceptionHandler(MethodArgumentTypeMismatchException.class)
public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(
        MethodArgumentTypeMismatchException ex) {
    log.warn("Type mismatch for parameter: {}", ex.getName());
    ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.INVALID_PARAMETER_TYPE, 
        "Invalid parameter type: " + ex.getName());
    return ResponseEntity.badRequest()
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `400 Bad Request`

### 5. Generic Exceptions

#### IllegalArgumentException

```java
@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(
        IllegalArgumentException ex) {
    log.warn("Invalid argument: {}", ex.getMessage());
    ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.BAD_REQUEST, 
        "Bad request: " + ex.getMessage());
    return ResponseEntity.badRequest()
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `400 Bad Request`

#### RuntimeException

```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex) {
    log.error("Runtime error occurred", ex);
    
    // Security: Don't expose internal error details
    ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    String message = errorCode.getMessage();
    
    if (ex.getMessage() != null && ex.getMessage().contains("not found")) {
        errorCode = ErrorCode.RESOURCE_NOT_FOUND;
        message = ex.getMessage(); // Safe to expose "not found" messages
    }
    
    ApiResponse<Void> errorResponse = ApiResponse.error(errorCode, message);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `500 Internal Server Error`

#### Exception (Catch-All)

```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
    log.error("Unexpected error occurred", ex);
    ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Response**: `500 Internal Server Error`

---

## Custom Exception Classes

### ResourceNotFoundException

```java
public class ResourceNotFoundException extends RuntimeException {
    
    private final String resourceName;
    private final String resourceId;
    
    public ResourceNotFoundException(String resourceName, String resourceId) {
        super(String.format("%s not found with id: %s", resourceName, resourceId));
        this.resourceName = resourceName;
        this.resourceId = resourceId;
    }
    
    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceName = null;
        this.resourceId = null;
    }
    
    // Getters...
}
```

### DuplicateResourceException

```java
public class DuplicateResourceException extends RuntimeException {
    
    public DuplicateResourceException(String message) {
        super(message);
    }
    
    public DuplicateResourceException(String resourceName, String field, String value) {
        super(String.format("%s with %s '%s' already exists", resourceName, field, value));
    }
}
```

---

## Error Response Format

### ApiResponse Structure

```java
{
    "success": false,
    "data": null,
    "message": "Error message",
    "errorCode": "RESOURCE_NOT_FOUND",
    "timestamp": "2025-11-17T10:30:00",
    "path": "/api/v1/projects/123",
    "metadata": {
        "requestId": "uuid-here",
        "version": "1.0.0"
    }
}
```

### Validation Error Response

```java
{
    "success": false,
    "data": {
        "title": "Title is required",
        "startDate": "Start date must be in the past"
    },
    "message": "Validation failed",
    "errorCode": "VALIDATION_ERROR",
    "timestamp": "2025-11-17T10:30:00"
}
```

---

## Error Codes

### ErrorCode Enum

```java
public enum ErrorCode {
    VALIDATION_ERROR("VALIDATION_ERROR", "Validation failed"),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Resource not found"),
    DUPLICATE_RESOURCE("DUPLICATE_RESOURCE", "Resource already exists"),
    BAD_REQUEST("BAD_REQUEST", "Bad request"),
    FORBIDDEN("FORBIDDEN", "Access denied"),
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "Authentication failed"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "Internal server error"),
    MISSING_PARAMETER("MISSING_PARAMETER", "Missing required parameter"),
    INVALID_PARAMETER_TYPE("INVALID_PARAMETER_TYPE", "Invalid parameter type");
    
    private final String code;
    private final String message;
    
    // Constructor, getters...
}
```

---

## Exception Handling Best Practices

### ✅ DO

1. **Use GlobalExceptionHandler**: Centralized exception handling
2. **Use custom exceptions**: For business logic errors
3. **Log exceptions**: At appropriate levels (WARN for business, ERROR for technical)
4. **Prevent information leakage**: Don't expose internal details in production
5. **Provide user-friendly messages**: Clear, actionable error messages
6. **Use error codes**: Consistent error codes across the API
7. **Enrich responses**: Add metadata (requestId, timestamp)

### ❌ DON'T

1. **Don't handle exceptions in controllers**: Let GlobalExceptionHandler handle them
2. **Don't expose stack traces**: In production responses
3. **Don't ignore exceptions**: Always handle them appropriately
4. **Don't use generic Exception**: Use specific exception types
5. **Don't skip logging**: Always log exceptions
6. **Don't return different formats**: Use consistent ApiResponse format

---

## Exception Flow

```
Controller
    ↓ (throws exception)
Service
    ↓ (throws exception)
Repository
    ↓ (throws exception)
GlobalExceptionHandler
    ↓ (catches exception)
    ↓ (logs exception)
    ↓ (creates ApiResponse)
    ↓ (returns ResponseEntity)
HTTP Response
```

---

## Logging Patterns

### Log Levels

```java
// WARN: Business logic errors (expected)
log.warn("Resource not found: {}", ex.getMessage());

// ERROR: Technical errors (unexpected)
log.error("Unexpected error occurred", ex);

// DEBUG: Detailed information (development only)
log.debug("Exception details: {}", ex);
```

### Logging Best Practices

1. **Log at appropriate levels**: WARN for business, ERROR for technical
2. **Include context**: Log IDs, parameters, user info
3. **Don't log sensitive data**: Passwords, tokens, etc.
4. **Use structured logging**: Include request ID, user ID, etc.

---

## Security Considerations

### Information Leakage Prevention

```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
    log.error("Unexpected error occurred", ex);  // Log full details
    
    // Don't expose internal details in response
    ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ResponseUtil.enrichWithMetadata(errorResponse));
}
```

**Security Rules**:
- Log full exception details (for debugging)
- Return generic error messages (for users)
- Don't expose stack traces
- Don't expose internal paths
- Don't expose database errors

---

## Related Documentation

- [Controller Patterns](./Controller-Patterns.md) - Exception handling in controllers
- [Service Patterns](./Service-Patterns.md) - Throwing exceptions in services
- [Validation Patterns](./Validation-Patterns.md) - Validation error handling

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

