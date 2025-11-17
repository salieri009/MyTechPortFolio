---
title: "Validation Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers"]
prerequisites: ["DTO-Patterns.md"]
related_docs: ["Controller-Patterns.md", "Service-Patterns.md"]
maintainer: "Development Team"
---

# Validation Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for input validation in the MyTechPortfolio backend application.

---

## Validation Layers

Validation occurs at multiple layers:

1. **DTO Level**: Bean validation annotations
2. **Controller Level**: `@Valid` annotation
3. **Service Level**: Business rule validation
4. **Custom Validators**: Complex validation logic

---

## Bean Validation Annotations

### Standard Annotations

```java
public class ProjectCreateRequest {
    
    // Required fields
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    // Size constraints
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;
    
    @Size(min = 10, max = 500, message = "Summary must be between 10 and 500 characters")
    private String summary;
    
    // Email validation
    @Email(message = "Invalid email format")
    private String email;
    
    // Pattern validation
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "Only alphanumeric characters allowed")
    private String code;
    
    // Min/Max values
    @Min(value = 1, message = "Value must be at least 1")
    @Max(value = 100, message = "Value must be at most 100")
    private Integer priority;
    
    // Past/Future dates
    @Past(message = "Date must be in the past")
    private LocalDate birthDate;
    
    @Future(message = "Date must be in the future")
    private LocalDate expirationDate;
}
```

### Validation Groups

```java
public interface CreateGroup {}
public interface UpdateGroup {}

public class ProjectCreateRequest {
    @NotBlank(groups = CreateGroup.class)
    private String title;
    
    @NotBlank(groups = {CreateGroup.class, UpdateGroup.class})
    private String summary;
}
```

---

## Custom Validators

### MongoDB ID Validator

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MongoIdValidator.class)
public @interface ValidMongoId {
    String message() default "Invalid MongoDB ID format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class MongoIdValidator implements ConstraintValidator<ValidMongoId, String> {
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true; // Use @NotNull for required fields
        }
        return ObjectId.isValid(value);
    }
}
```

**Usage**:
```java
@GetMapping("/{id}")
public ResponseEntity<...> getById(
    @PathVariable 
    @ValidMongoId(message = "Invalid project ID format")
    String id
) {
    // ...
}
```

### MongoDB ID List Validator

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MongoIdListValidator.class)
public @interface ValidMongoIdList {
    String message() default "Invalid MongoDB ID format";
    boolean allowEmpty() default true;
    int maxSize() default Integer.MAX_VALUE;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class MongoIdListValidator implements ConstraintValidator<ValidMongoIdList, List<String>> {
    
    private boolean allowEmpty;
    private int maxSize;
    
    @Override
    public void initialize(ValidMongoIdList constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
        this.maxSize = constraintAnnotation.maxSize();
    }
    
    @Override
    public boolean isValid(List<String> value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Use @NotNull for required fields
        }
        
        if (value.isEmpty()) {
            return allowEmpty;
        }
        
        if (value.size() > maxSize) {
            return false;
        }
        
        return value.stream().allMatch(ObjectId::isValid);
    }
}
```

**Usage**:
```java
@NotNull(message = "Tech stack IDs are required")
@ValidMongoIdList(message = "Invalid tech stack IDs", allowEmpty = false, maxSize = 20)
private List<String> techStackIds;
```

### URL Validator

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UrlValidator.class)
public @interface ValidUrl {
    String message() default "Invalid URL format";
    boolean allowEmpty() default false;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class UrlValidator implements ConstraintValidator<ValidUrl, String> {
    
    private boolean allowEmpty;
    private static final String URL_PATTERN = 
        "^https?://(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$";
    
    @Override
    public void initialize(ValidUrl constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
    }
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return allowEmpty;
        }
        return Pattern.matches(URL_PATTERN, value);
    }
}
```

**Usage**:
```java
@ValidUrl(message = "Invalid GitHub URL format", allowEmpty = true)
private String githubUrl;
```

### Date Range Validator

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRangeValidator.class)
public @interface ValidDateRange {
    String message() default "End date must be after start date";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {
    
    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        
        try {
            Method getStartDate = value.getClass().getMethod("getStartDate");
            Method getEndDate = value.getClass().getMethod("getEndDate");
            
            LocalDate startDate = (LocalDate) getStartDate.invoke(value);
            LocalDate endDate = (LocalDate) getEndDate.invoke(value);
            
            if (startDate == null || endDate == null) {
                return true; // Let @NotNull handle null checks
            }
            
            return !endDate.isBefore(startDate);
        } catch (Exception e) {
            return false;
        }
    }
}
```

**Usage**:
```java
@ValidDateRange(message = "End date must be after start date")
public class ProjectCreateRequest {
    @NotNull
    private LocalDate startDate;
    
    @NotNull
    private LocalDate endDate;
}
```

---

## Controller-Level Validation

### Using @Valid

```java
@PostMapping
public ResponseEntity<...> create(
    @Valid @RequestBody ProjectCreateRequest request
) {
    // Validation happens automatically
    // If validation fails, 400 Bad Request is returned
    return ResponseUtil.ok(service.create(request));
}
```

### Path Parameter Validation

```java
@GetMapping("/{id}")
public ResponseEntity<...> getById(
    @PathVariable 
    @ValidMongoId(message = "Invalid project ID format")
    String id
) {
    // Custom validator runs automatically
    return ResponseUtil.ok(service.findById(id));
}
```

---

## Service-Level Validation

### Business Rule Validation

```java
@Service
public class ProjectService {
    
    @Transactional
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        // Business validation
        validateProjectRequest(request);
        
        // Create project
        // ...
    }
    
    private void validateProjectRequest(ProjectCreateRequest request) {
        // Business rule: Check for duplicate title
        if (projectRepository.existsByTitle(request.getTitle())) {
            throw new DuplicateResourceException("Project with title already exists: " + request.getTitle());
        }
        
        // Business rule: Validate tech stacks exist
        if (request.getTechStackIds() != null && !request.getTechStackIds().isEmpty()) {
            List<TechStack> techStacks = techStackRepository.findAllById(request.getTechStackIds());
            if (techStacks.size() != request.getTechStackIds().size()) {
                throw new IllegalArgumentException("Some tech stacks not found");
            }
        }
    }
}
```

---

## Validation Error Handling

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseUtil.badRequest(errors);
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleConstraintViolation(
        ConstraintViolationException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> 
            errors.put(violation.getPropertyPath().toString(), violation.getMessage())
        );
        return ResponseUtil.badRequest(errors);
    }
}
```

---

## Best Practices

### ✅ DO

1. **Validate at DTO level**: Use bean validation annotations
2. **Use custom validators**: For complex validation logic
3. **Provide clear messages**: Error messages should be user-friendly
4. **Validate in service**: Business rules in service layer
5. **Handle validation errors**: Use GlobalExceptionHandler
6. **Use validation groups**: For different validation scenarios

### ❌ DON'T

1. **Don't skip validation**: Always validate inputs
2. **Don't validate in repositories**: Use services for business validation
3. **Don't expose internal errors**: Return user-friendly messages
4. **Don't duplicate validation**: Use reusable validators
5. **Don't ignore validation errors**: Always handle them properly

---

## Related Documentation

- [DTO Patterns](./DTO-Patterns.md) - DTO structure with validation
- [Controller Patterns](./Controller-Patterns.md) - Validation in controllers
- [Service Patterns](./Service-Patterns.md) - Business validation
- [Exception Handling Patterns](./Exception-Handling-Patterns.md) - Error handling

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

