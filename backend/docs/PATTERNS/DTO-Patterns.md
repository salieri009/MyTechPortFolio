---
title: "DTO Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md"]
related_docs: ["Mapper-Patterns.md", "Controller-Patterns.md"]
maintainer: "Development Team"
---

# DTO Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for Data Transfer Objects (DTOs) in the MyTechPortfolio backend application.

---

## DTO Structure

DTOs are organized into three categories:

```
dto/
├── request/           # Request DTOs (Create, Update)
├── response/          # Response DTOs
└── auth/              # Authentication DTOs
```

---

## Request DTO Patterns

### Create Request DTO

```java
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ValidDateRange(message = "End date must be after start date")
public class ProjectCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Summary is required")
    @Size(min = 10, max = 500, message = "Summary must be between 10 and 500 characters")
    private String summary;

    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 10000, message = "Description must be between 20 and 10000 characters")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @ValidUrl(message = "Invalid GitHub URL format", allowEmpty = true)
    private String githubUrl;

    @ValidUrl(message = "Invalid demo URL format", allowEmpty = true)
    private String demoUrl;

    @NotNull(message = "Tech stack IDs are required")
    @ValidMongoIdList(message = "Invalid tech stack IDs", allowEmpty = false, maxSize = 20)
    private List<String> techStackIds;

    @ValidMongoIdList(message = "Invalid academic IDs", allowEmpty = true, maxSize = 10)
    private List<String> academicIds;
}
```

**Pattern Elements**:
- Use Lombok annotations (`@Getter`, `@NoArgsConstructor`, `@AllArgsConstructor`)
- Use validation annotations (`@NotBlank`, `@NotNull`, `@Size`)
- Use custom validators (`@ValidUrl`, `@ValidMongoIdList`, `@ValidDateRange`)
- Provide clear error messages
- Use appropriate data types

### Update Request DTO

```java
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ValidDateRange(message = "End date must be after start date")
public class ProjectUpdateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255)
    private String title;

    @NotBlank(message = "Summary is required")
    @Size(min = 10, max = 500)
    private String summary;

    // All fields are optional for updates, but validated if provided
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String githubUrl;
    private String demoUrl;
    private List<String> techStackIds;
    private List<String> academicIds;
}
```

**Pattern Elements**:
- Similar structure to Create DTO
- Fields can be optional (nullable)
- Still validate if provided
- Use same validation rules

---

## Response DTO Patterns

### Summary Response DTO

```java
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSummaryResponse {
    private String id;
    private String title;
    private String summary;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> techStacks;
}
```

**Pattern Elements**:
- Use `@Builder` for object construction
- Include only essential fields
- Use DTOs, not entities
- Include related data as needed (e.g., tech stack names)

### Detail Response DTO

```java
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDetailResponse {
    private String id;
    private String title;
    private String summary;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String githubUrl;
    private String demoUrl;
    private List<String> techStacks;
    private List<String> relatedAcademics;
}
```

**Pattern Elements**:
- Include all relevant fields
- Include related entities (as names/IDs)
- Use builder pattern for construction

### Paginated Response DTO

```java
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;
}
```

**Pattern Elements**:
- Generic type for content
- Include pagination metadata
- Include navigation flags

### API Response Wrapper

```java
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private LocalDateTime timestamp;
    private String path;
}
```

**Pattern Elements**:
- Generic type for data
- Include success flag
- Include optional message
- Include timestamp and path for debugging

---

## Validation Patterns

### Bean Validation Annotations

```java
// Required fields
@NotBlank(message = "Title is required")
@NotNull(message = "Start date is required")

// Size constraints
@Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")

// Email validation
@Email(message = "Invalid email format")

// URL validation (custom)
@ValidUrl(message = "Invalid URL format", allowEmpty = true)

// MongoDB ID validation (custom)
@ValidMongoId(message = "Invalid MongoDB ID format")
@ValidMongoIdList(message = "Invalid MongoDB IDs", allowEmpty = false, maxSize = 20)

// Date range validation (custom)
@ValidDateRange(message = "End date must be after start date")
```

### Custom Validators

#### URL Validator

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
```

#### MongoDB ID Validator

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MongoIdValidator.class)
public @interface ValidMongoId {
    String message() default "Invalid MongoDB ID format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

---

## DTO Naming Conventions

### Request DTOs
- **Create**: `{Entity}CreateRequest` (e.g., `ProjectCreateRequest`)
- **Update**: `{Entity}UpdateRequest` (e.g., `ProjectUpdateRequest`)
- **Query**: `{Entity}QueryRequest` (e.g., `ProjectQueryRequest`)

### Response DTOs
- **Summary**: `{Entity}SummaryResponse` (e.g., `ProjectSummaryResponse`)
- **Detail**: `{Entity}DetailResponse` (e.g., `ProjectDetailResponse`)
- **List**: `{Entity}Response` (e.g., `ProjectResponse`)

### Authentication DTOs
- **Login**: `LoginRequest`, `LoginResponse`
- **Register**: `RegisterRequest`, `RegisterResponse`
- **Token**: `TokenResponse`

---

## DTO Best Practices

### ✅ DO

1. **Separate request and response DTOs**: Different structures for different purposes
2. **Use validation annotations**: Validate at the DTO level
3. **Use builder pattern**: For complex DTOs
4. **Include only necessary fields**: Don't expose internal structure
5. **Use meaningful names**: Clear, descriptive field names
6. **Document DTOs**: Add JavaDoc for complex DTOs
7. **Use Lombok**: Reduce boilerplate code

### ❌ DON'T

1. **Don't expose entities directly**: Always use DTOs
2. **Don't include sensitive data**: Passwords, tokens, etc.
3. **Don't skip validation**: Always validate inputs
4. **Don't use entities as DTOs**: Separate concerns
5. **Don't include internal IDs**: Unless necessary for the API
6. **Don't use mutable DTOs**: Prefer immutable when possible

---

## DTO Organization

### Package Structure

```
dto/
├── request/
│   ├── ProjectCreateRequest.java
│   ├── ProjectUpdateRequest.java
│   ├── AcademicCreateRequest.java
│   └── ...
├── response/
│   ├── ProjectSummaryResponse.java
│   ├── ProjectDetailResponse.java
│   ├── AcademicResponse.java
│   ├── ApiResponse.java
│   ├── PageResponse.java
│   └── ...
└── auth/
    ├── LoginRequest.java
    ├── LoginResponse.java
    └── ...
```

### Grouping Strategy

- **By type**: Request vs Response
- **By feature**: Auth DTOs separate
- **By entity**: Related DTOs together

---

## Related Documentation

- [Mapper Patterns](./Mapper-Patterns.md) - Entity-DTO mapping
- [Validation Patterns](./Validation-Patterns.md) - Input validation
- [Controller Patterns](./Controller-Patterns.md) - DTO usage in controllers
- [Service Patterns](./Service-Patterns.md) - DTO usage in services

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

