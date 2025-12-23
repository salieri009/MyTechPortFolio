# API Design Plan

> **Version**: 2.0.0  
> **Last Updated**: 2025-11-15  
> **Status**: Production Implementation Complete  
> **Base URL**: `/api/v1`

## 1. Overview

Defines the RESTful API specification for data communication between frontend and backend. All requests and responses use JSON format by default, with the goal of improving development efficiency through a consistent API structure.

### Core Principles

1. **Standardized Response Format**: All APIs use the `ApiResponse<T>` wrapper
2. **Error Code Standardization**: Consistent error handling through `ErrorCode` enum
3. **API Version Management**: Version management via `/api/v1` path
4. **Security First**: Input validation, XSS prevention, SQL Injection prevention
5. **Performance Optimization**: Caching, pagination, filtering support
6. **Documentation**: Automatic documentation via Swagger/OpenAPI 3.0

### Tech Stack

- **Framework**: Spring Boot 3.x
- **Database**: MongoDB
- **Validation**: Jakarta Bean Validation + Custom Validators
- **Documentation**: SpringDoc OpenAPI 3 (Swagger UI)
- **Security**: Spring Security + JWT
- **Caching**: Spring Cache (for TechStackService)

## 2. API Structure

### Base Configuration

```java
// ApiConstants.java
public static final String API_VERSION = "v1";
public static final String API_BASE_PATH = "/api/" + API_VERSION;
```

### Response Wrapper

All API responses are wrapped in `ApiResponse<T>`:

```java
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String error;
    private String errorCode;
    private Map<String, String> errors; // Validation errors
    private ResponseMetadata metadata;   // timestamp, version, requestId
}
```

**Benefits**:
- Simplified frontend processing via consistent response structure
- Structured delivery of error information
- Support for debugging and monitoring via metadata

### Pagination

All list APIs support pagination:

```java
public class PageResponse<T> {
    private int page;      // 1-based
    private int size;      // Default: 10, Max: 100
    private long total;    // Total number of items
    private List<T> items; // Current page items
}
```

**Defaults** (ApiConstants):
- `DEFAULT_PAGE_NUMBER = 1`
- `DEFAULT_PAGE_SIZE = 10`
- `MAX_PAGE_SIZE = 100`
- `DEFAULT_SORT_FIELD = "endDate"`
- `DEFAULT_SORT_DIRECTION = "DESC"`

## 3. Implemented API Endpoints

### 3.1 Projects API (`/api/v1/projects`)

CRUD API for Project Management.

#### Controller: `ProjectController`

**Base Path**: `ApiConstants.PROJECTS_ENDPOINT` = `/api/v1/projects`

#### GET `/api/v1/projects`

Retrieves a list of projects with pagination, sorting, and filtering.

**Query Parameters**:
```java
@RequestParam(defaultValue = "1") @Min(1) int page
@RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
@RequestParam(required = false, defaultValue = "endDate,DESC") String sort
@RequestParam(required = false) String techStacks  // Comma-separated
@RequestParam(required = false) Integer year
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "page": 1,
    "size": 10,
    "total": 25,
    "items": [ProjectSummaryResponse[]]
  }
}
```

**Service Method**: `ProjectService.getProjects(page, size, sort, techStacks, year)`

**Business Logic**:
- Tech stack filtering: Filter by comma-separated tech stack names
- Year filtering: Based on project start/end year
- Sorting: Default is `endDate,DESC` (newest first)

#### GET `/api/v1/projects/{id}`

Retrieves detailed information for a specific project.

**Path Variable**:
```java
@PathVariable @ValidMongoId String id
```

**Validation**: Validate MongoDB ObjectId format with `@ValidMongoId` annotation

**Response**: `200 OK`
```json
{
  "success": true,
  "data": ProjectDetailResponse
}
```

**Error Responses**:
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Project not found (throws `ResourceNotFoundException`)

#### POST `/api/v1/projects`

Creates a new project.

**Request Body**: `ProjectCreateRequest`

**Validation Rules**:
```java
@NotBlank @Size(min=3, max=255) String title
@NotBlank @Size(min=10, max=500) String summary
@NotBlank @Size(min=20, max=10000) String description
@NotNull LocalDate startDate
@NotNull LocalDate endDate
@ValidUrl(allowEmpty=true) String githubUrl
@ValidUrl(allowEmpty=true) String demoUrl
@NotNull @ValidMongoIdList(allowEmpty=false, maxSize=20) List<String> techStackIds
@ValidMongoIdList(allowEmpty=true, maxSize=10) List<String> academicIds
@ValidDateRange // Custom validator: endDate > startDate
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": ProjectDetailResponse,
  "message": "Project created successfully"
}
```

**Service Method**: `ProjectService.createProject(ProjectCreateRequest)`

**Business Logic**:
- Validation and linking of Tech stack IDs
- Validation and linking of Academic IDs (optional)
- Duplication check (by title, throws `DuplicateResourceException`)

#### PUT `/api/v1/projects/{id}`

Updates an existing project.

**Path Variable**: `@PathVariable @ValidMongoId String id`

**Request Body**: `ProjectUpdateRequest` (same structure as `ProjectCreateRequest`)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": ProjectDetailResponse,
  "message": "Project updated successfully"
}
```

**Service Method**: `ProjectService.updateProject(id, ProjectUpdateRequest)`

**Business Logic**:
- Check existence (`ResourceNotFoundException`)
- Update Tech stack and Academic relationships
- Duplicate check (when title changes)

#### DELETE `/api/v1/projects/{id}`

Deletes a project.

**Path Variable**: `@PathVariable @ValidMongoId String id`

**Response**: `204 No Content`

**Service Method**: `ProjectService.deleteProject(id)`

**Business Logic**:
- Check existence
- Auto-release related relationships (TechStack, Academic) via MongoDB cascade

### 3.2 Academics API (`/api/v1/academics`)

API for retrieving academic course information.

#### Controller: `AcademicController`

**Base Path**: `ApiConstants.ACADEMICS_ENDPOINT` = `/api/v1/academics`

#### GET `/api/v1/academics`

Retrieves academic course list with pagination and semester filtering.

**Query Parameters**:
```java
@RequestParam(defaultValue = "1") @Min(1) int page
@RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
@RequestParam(defaultValue = "") String semester
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "page": 1,
    "size": 10,
    "total": 15,
    "items": [AcademicResponse[]]
  }
}
```

**Service Method**: `AcademicService.getAcademics(page, size, semester)`

#### GET `/api/v1/academics/{id}`

Retrieves detailed information for a specific academic course and its related projects.

**Path Variable**: `@PathVariable @ValidMongoId String id`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Data Structures",
    "semester": "2nd Year 1st Semester",
    "grade": "A+",
    "description": "...",
    "relatedProjects": [
      {
        "id": "...",
        "title": "Algorithm Problem Solving Repository"
      }
    ]
  }
}
```

**Service Method**: `AcademicService.getAcademic(id)`

**Business Logic**:
- Query Academic entity
- Query and map related Project entities

### 3.3 Tech Stacks API (`/api/v1/techstacks`)

API for retrieving tech stacks.

#### Controller: `TechStackController`

**Base Path**: `ApiConstants.TECH_STACKS_ENDPOINT` = `/api/v1/techstacks`

#### GET `/api/v1/techstacks`

Retrieves the list of tech stacks. Supports filtering by type.

**Query Parameters**:
```java
@RequestParam(required = false) String type  // "FRONTEND", "BACKEND", etc.
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [TechStackResponse[]]
}
```

**Service Method**: `TechStackService.getTechStacks(type)`

**Performance Optimization**:
- Caching applied with `@Cacheable` annotation
- Performance improvement through caching for frequently accessed data

**Cache Configuration**: `CacheConfig.java`
- Cache name: `techStacks`
- TTL: Configurable (default: 1 hour)

### 3.4 Authentication API (`/api/v1/auth`)

Authentication and authorization API.

#### Controller: `AuthController`

**Base Path**: `ApiConstants.API_BASE_PATH + "/auth"` = `/api/v1/auth`

#### POST `/api/v1/auth/google`

Authenticates using Google OAuth ID token.

**Request Body**: `GoogleLoginRequest`
```java
@NotBlank @Size(min=100, max=5000) 
@Pattern(regexp="^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]*$")
String googleIdToken

@Size(min=6, max=6) @Pattern(regexp="^[0-9]{6}$")
String twoFactorCode  // Optional
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "requiresTwoFactor": false,
    "sessionId": "session_abc123",
    "userInfo": {
      "id": 1,
      "email": "user@example.com",
      "displayName": "John Doe",
      "profileImageUrl": "https://...",
      "role": "USER",
      "twoFactorEnabled": false
    }
  },
  "message": "Login successful"
}
```

**Service Method**: `AuthService.authenticateWithGoogle(googleIdToken)`

**Business Logic**:
1. Verify Google ID token
2. Extract user info or create new user
3. Generate JWT tokens (access token + refresh token)
4. Check 2FA (if required)

#### POST `/api/v1/auth/refresh`

Issues a new access token using the refresh token.

**Headers**:
```
Authorization: Bearer {refreshToken}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": LoginResponse,
  "message": "Token refresh successful"
}
```

**Service Method**: `AuthService.refreshToken(refreshToken)`

**Business Logic**:
- Verify refresh token
- Issue new access token
- Refresh token renewal (optional)

#### POST `/api/v1/auth/logout`

Logs out the user and invalidates tokens.

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

**Service Method**: `AuthService.logout(token)`

#### GET `/api/v1/auth/profile`

Retrieves the profile information of the currently authenticated user.

**Headers**:
```
Authorization: Bearer {accessToken}  // Optional
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": UserInfo
}
```

**Error Responses**:
- `401 Unauthorized`: Token missing or invalid

**Service Method**: `AuthService.getUserProfile(token)`

### 3.5 Contact API (`/api/v1/contact`)

Contact form submission API.

#### Controller: `ContactController`

**Base Path**: `ApiConstants.API_BASE_PATH + "/contact"` = `/api/v1/contact`

#### POST `/api/v1/contact`

Submits a contact form. Spam prevention and Rate Limiting are applied.

**Request Body**: `ContactRequest`
```java
@NotBlank @Size(min=2, max=100) String name
@NotBlank @Email @Size(max=255) String email
@Size(max=100) String company
@Size(max=100) String subject
@NotBlank @Size(min=10, max=2000) String message
String phoneNumber  // Optional
String linkedInUrl  // Optional
String jobTitle     // Optional
String website      // Honeypot field (should be empty)
String referrer     // Optional, tracking
String source      // Optional, "portfolio", "project", "resume"
String projectId    // Optional
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": null,
  "message": "Thank you for your message. I'll get back to you soon!"
}
```

**Service Method**: `ContactService.submitContact(ContactRequest, ipAddress, userAgent)`

**Security Features**:
1. **Honeypot Field**: If `website` field is not empty, it's considered spam
2. **Rate Limiting**: Request limit per IP address (implementation needed)
3. **Input Sanitization**: Input sanitization via `InputSanitizer`
4. **Spam Detection**: Spam detection via `ValidationService`
5. **IP Hashing**: IP address hashing for privacy protection

**Business Logic**:
- Sanitize input data (XSS prevention)
- Spam check
- Rate limiting verification
- Save Contact entity
- Email notification (optional, not implemented)

### 3.6 Resumes API (`/api/v1/resumes`)

Resume management API.

#### Controller: `ResumeController`

**Base Path**: `ApiConstants.API_BASE_PATH + "/resumes"` = `/api/v1/resumes`

#### GET `/api/v1/resumes`

Retrieves all available resume version list.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [Resume[]]
}
```

**Service Method**: `ResumeService.getAllResumes()`

#### GET `/api/v1/resumes/primary`

Retrieves the primary (active) resume.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": Resume  // Resume with isActive=true
}
```

**Error Responses**:
- `404 Not Found`: No active resume found

**Service Method**: `ResumeService.getPrimaryResume()`

#### GET `/api/v1/resumes/{id}/download`

Downloads a resume file and tracks the download count.

**Path Variable**: `@PathVariable String id`

**Response**: `200 OK`
- Content-Type: `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Content-Disposition: `attachment; filename="{fileName}"`
- Body: Binary file content

**Service Method**: `ResumeService.recordDownload(id)`

**Business Logic**:
1. Query Resume entity
2. Increment download count (`incrementDownloadCount()`)
3. Load resource from file URL
4. Return file stream

**File Storage**:
- Development: Local file system
- Production: Azure Blob Storage (implementation needed)

#### GET `/api/v1/resumes/statistics`

Retrieves download statistics for all resumes.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "full": 150,
    "software-engineer": 75,
    "frontend": 30,
    ...
  }
}
```

**Service Method**: `ResumeService.getDownloadStatistics()`

### 3.7 Project Engagement API (`/api/v1/engagement`)

Project engagement tracking API.

#### Controller: `ProjectEngagementController`

**Base Path**: `ApiConstants.API_BASE_PATH + "/engagement"` = `/api/v1/engagement`

#### POST `/api/v1/engagement/track`

Records project engagement metrics.

**Request Body**: `ProjectEngagement` (partial)
```json
{
  "projectId": "507f1f77bcf86cd799439011",
  "sessionId": "session_abc123",
  "visitorId": "visitor_xyz",
  "referrer": "https://google.com",
  "source": "search"
}
```

**Server Enrichment**:
- IP address (hashed)
- User Agent
- Device Type
- Browser
- Geographic info (optional)

**Response**: `201 Created`
```json
{
  "success": true,
  "data": ProjectEngagement  // Enriched with server data
}
```

**Service Method**: `ProjectEngagementService.recordEngagement(ProjectEngagement)`

#### PATCH `/api/v1/engagement/{engagementId}`

Updates engagement info with interaction data.

**Path Variable**: `@PathVariable String engagementId`

**Query Parameters**:
```java
@RequestParam(required = false) Long viewDuration
@RequestParam(required = false) Integer scrollDepth
@RequestParam(required = false) Boolean githubLinkClicked
@RequestParam(required = false) Boolean demoLinkClicked
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": null
}
```

**Service Method**: `ProjectEngagementService.updateEngagement(engagementId, ...)`

**Business Logic**:
- Query Engagement entity
- Update interaction data
- Recalculate engagement score (`calculateEngagementScore()`)

#### GET `/api/v1/engagement/projects/{projectId}/stats`

Retrieves engagement statistics for a specific project.

**Path Variable**: `@PathVariable String projectId`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "totalViews": 150,
    "averageViewDuration": 45,
    "averageScrollDepth": 75,
    "githubClicks": 30,
    "demoClicks": 25,
    "highValueEngagements": 12
  }
}
```

**Service Method**: `ProjectEngagementService.getProjectEngagementStats(projectId)`

#### GET `/api/v1/engagement/projects/most-engaged`

Retrieves the list of most engaged projects.

**Query Parameters**:
```java
@RequestParam(defaultValue = "10") int limit
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "projectId": "507f1f77bcf86cd799439011",
      "projectTitle": "My Tech Portfolio",
      "engagementScore": 85,
      "totalViews": 200,
      "averageViewDuration": 60
    },
    ...
  ]
}
```

**Service Method**: `ProjectEngagementService.getMostEngagedProjects(limit)`

**Business Logic**:
- Calculate engagement score for all projects
- Sort by score
- Return top N projects

**Engagement Score Calculation** (`calculateEngagementScore()`):
- View Duration: Max 40 points (1 point per 10 seconds, max 400 seconds)
- Scroll Depth: Max 30 points (percent * 0.3)
- GitHub Link Click: 15 points
- Demo Link Click: 15 points
- Total: Max 100 points

## 4. Data Models

### 4.1 Request DTOs

#### ProjectCreateRequest / ProjectUpdateRequest

```java
@ValidDateRange
public class ProjectCreateRequest {
    @NotBlank @Size(min=3, max=255) String title;
    @NotBlank @Size(min=10, max=500) String summary;
    @NotBlank @Size(min=20, max=10000) String description;
    @NotNull LocalDate startDate;
    @NotNull LocalDate endDate;
    @ValidUrl(allowEmpty=true) String githubUrl;
    @ValidUrl(allowEmpty=true) String demoUrl;
    @NotNull @ValidMongoIdList(allowEmpty=false, maxSize=20) List<String> techStackIds;
    @ValidMongoIdList(allowEmpty=true, maxSize=10) List<String> academicIds;
}
```

#### ContactRequest

```java
public class ContactRequest {
    @NotBlank @Size(min=2, max=100) String name;
    @NotBlank @Email @Size(max=255) String email;
    @Size(max=100) String company;
    @Size(max=100) String subject;
    @NotBlank @Size(min=10, max=2000) String message;
    String phoneNumber;      // Optional
    String linkedInUrl;       // Optional
    String jobTitle;          // Optional
    String website;           // Honeypot
    String referrer;          // Optional
    String source;            // Optional
    String projectId;         // Optional
}
```

#### GoogleLoginRequest

```java
public class GoogleLoginRequest {
    @NotBlank @Size(min=100, max=5000)
    @Pattern(regexp="^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]*$")
    String googleIdToken;
    
    @Size(min=6, max=6) @Pattern(regexp="^[0-9]{6}$")
    String twoFactorCode;  // Optional
}
```

### 4.2 Response DTOs

#### ProjectSummaryResponse

```java
public class ProjectSummaryResponse {
    private String id;
    private String title;
    private String summary;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> techStacks;  // Tech stack names
}
```

#### ProjectDetailResponse

```java
public class ProjectDetailResponse {
    private String id;
    private String title;
    private String summary;
    private String description;        // Markdown supported
    private LocalDate startDate;
    private LocalDate endDate;
    private String githubUrl;
    private String demoUrl;
    private List<String> techStacks;
    private List<String> relatedAcademics;  // Academic course names
}
```

#### AcademicResponse

```java
public class AcademicResponse {
    private String id;
    private String name;
    private String semester;
    private String grade;
    private String description;
    private List<RelatedProject> relatedProjects;  // Only in detail
    
    public static class RelatedProject {
        private String id;
        private String title;
    }
}
```

#### TechStackResponse

```java
public class TechStackResponse {
    private String id;
    private String name;
    private String type;  // "FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "OTHER"
}
```

#### LoginResponse

```java
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private boolean requiresTwoFactor;
    private String sessionId;
    private UserInfo userInfo;
    
    public static class UserInfo {
        private Long id;
        private String email;
        private String displayName;
        private String profileImageUrl;
        private String role;
        private boolean twoFactorEnabled;
    }
}
```

## 5. Validation

### 5.1 Custom Validators

#### @ValidMongoId

Validates MongoDB ObjectId format.

```java
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MongoIdValidator.class)
public @interface ValidMongoId {
    String message() default "Invalid MongoDB ObjectId format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

**Validation Rules**:
- 24-character hexadecimal string
- Regex: `^[0-9a-fA-F]{24}$`

#### @ValidMongoIdList

Validates MongoDB ObjectId arrays.

```java
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MongoIdListValidator.class)
public @interface ValidMongoIdList {
    String message() default "Invalid MongoDB ObjectId list";
    boolean allowEmpty() default false;
    int maxSize() default 100;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

**Validation Rules**:
- Each element must be a valid MongoDB ObjectId
- `allowEmpty`: Whether to allow empty arrays
- `maxSize`: Maximum array size

#### @ValidUrl

Validates URL format.

```java
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UrlValidator.class)
public @interface ValidUrl {
    String message() default "Invalid URL format";
    boolean allowEmpty() default true;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

**Validation Rules**:
- Valid URI format (using Java `URI` class)
- `allowEmpty`: Whether to allow empty strings

#### @ValidDateRange

Validates date ranges.

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRangeValidator.class)
public @interface ValidDateRange {
    String message() default "End date must be after start date";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

**Validation Rules**:
- `endDate` must be after `startDate`
- Class-level validation (comparing two fields)

### 5.2 Bean Validation

Using standard Jakarta Bean Validation annotations:

- `@NotBlank`: Disallows null, empty strings, or whitespace-only strings
- `@NotNull`: Disallows null
- `@Size(min, max)`: Limits string/collection size
- `@Email`: Validates email format
- `@Min / @Max`: Limits numeric value range
- `@Pattern`: Validates against regex pattern

## 6. Error Handling

### 6.1 ErrorCode Enum

Defines standardized error codes:

```java
public enum ErrorCode {
    // 4xx Client Errors
    VALIDATION_ERROR("VALIDATION_ERROR", "Input validation failed"),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Requested resource not found"),
    DUPLICATE_RESOURCE("DUPLICATE_RESOURCE", "Resource already exists"),
    UNAUTHORIZED("UNAUTHORIZED", "Authentication required"),
    FORBIDDEN("FORBIDDEN", "Access denied"),
    BAD_REQUEST("BAD_REQUEST", "Invalid request"),
    INVALID_ID_FORMAT("INVALID_ID_FORMAT", "Invalid ID format"),
    MISSING_PARAMETER("MISSING_PARAMETER", "Required parameter is missing"),
    INVALID_PARAMETER_TYPE("INVALID_PARAMETER_TYPE", "Invalid parameter type"),
    
    // 5xx Server Errors
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "Internal server error occurred"),
    DATABASE_ERROR("DATABASE_ERROR", "Database error occurred"),
    EXTERNAL_SERVICE_ERROR("EXTERNAL_SERVICE_ERROR", "External service error occurred"),
    
    // Authentication & Authorization
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "Authentication failed"),
    TOKEN_EXPIRED("TOKEN_EXPIRED", "Token has expired"),
    TOKEN_INVALID("TOKEN_INVALID", "Invalid token"),
    INSUFFICIENT_PERMISSIONS("INSUFFICIENT_PERMISSIONS", "Insufficient permissions");
}
```

### 6.2 GlobalExceptionHandler

Centrally handles all exceptions:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(...) {
        // Validation errors → 400 Bad Request
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(...) {
        // Resource not found → 404 Not Found
    }
    
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<?>> handleDuplicateResource(...) {
        // Duplicate resource → 409 Conflict
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGenericException(...) {
        // Generic errors → 500 Internal Server Error
    }
}
```

### 6.3 Custom Exceptions

#### ResourceNotFoundException

```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue));
    }
}
```

#### DuplicateResourceException

```java
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s already exists with %s: %s", resourceName, fieldName, fieldValue));
    }
}
```

### 6.4 HTTP Status Code Mapping

| ErrorCode | HTTP Status | Description |
|-----------|-------------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| RESOURCE_NOT_FOUND | 404 | Resource not found |
| DUPLICATE_RESOURCE | 409 | Duplicate resource |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Access denied |
| BAD_REQUEST | 400 | Invalid request |
| INTERNAL_SERVER_ERROR | 500 | Server error |
| DATABASE_ERROR | 500 | Database error |
| AUTHENTICATION_FAILED | 401 | Authentication failed |
| TOKEN_EXPIRED | 401 | Token expired |
| TOKEN_INVALID | 401 | Invalid token |

## 7. Security

### 7.1 CORS Configuration

CORS configuration in `WebConfig.java`:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping(ApiConstants.API_BASE_PATH + "/**")
                .allowedOriginPatterns(allowedOrigins)
                .allowedMethods(allowedMethods)
                .allowedHeaders(allowedHeaders)
                .allowCredentials(allowCredentials)
                .maxAge(CORS_MAX_AGE);
    }
}
```

**Configuration Values** (environment variables or defaults):
- `cors.allowed-origins`: Allowed origin list
  - Default: `http://localhost:5173`, `http://localhost:3000`, `https://salieri009.studio`
- `cors.allowed-methods`: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`
- `cors.allowed-headers`: `Content-Type`, `Authorization`, `X-Requested-With`
- `cors.max-age`: 3600 seconds (1 hour)
- `cors.allow-credentials`: false (default)

### 7.2 Security Headers

Security header configuration in `SecurityConfig.java`:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.headers()
            .httpStrictTransportSecurity(hsts -> hsts
                .maxAgeInSeconds(31536000)
                .includeSubdomains(true))
            .frameOptions().deny()
            .contentTypeOptions().and()
            .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN);
        return http.build();
    }
}
```

**Configured Headers**:
- `Strict-Transport-Security`: HSTS enabled
- `X-Frame-Options: DENY`: Clickjacking prevention
- `X-Content-Type-Options: nosniff`: MIME type sniffing prevention
- `Referrer-Policy`: Referrer information restriction

### 7.3 Input Sanitization

Input sanitization through `InputSanitizer` utility:

```java
@Component
public class InputSanitizer {
    public String sanitizeText(String input) {
        // Remove HTML tags
        // Escape special characters
        // XSS prevention
    }
}
```

**Applied To**:
- `ContactService`: Contact form input sanitization
- All user input data

### 7.4 Rate Limiting

Rate Limiting applied to Contact API (implementation needed):

- Request limit per IP address
- Maximum requests per hour limit
- `429 Too Many Requests` response

### 7.5 JWT Authentication

Spring Security + JWT token-based authentication:

- Access Token: Short-lived token (default 1 hour)
- Refresh Token: Long-lived token (default 7 days)
- Token Validation: `JwtTokenProvider`
- Token Storage: Client-side (localStorage)

## 8. Performance Optimization

### 8.1 Caching

Caching applied to TechStackService:

```java
@Service
public class TechStackService {
    @Cacheable(value = "techStacks", key = "#type ?: 'all'")
    public List<TechStackResponse> getTechStacks(String type) {
        // ...
    }
    
    @CacheEvict(value = "techStacks", allEntries = true)
    public TechStackResponse createTechStack(TechStackCreateRequest request) {
        // ...
    }
}
```

**Cache Configuration** (`CacheConfig.java`):
- Cache Manager: Caffeine
- TTL: Configurable (default 1 hour)

### 8.2 Pagination

All list APIs support pagination:

- Default page size: 10
- Maximum page size: 100
- Includes total count (`total`)

### 8.3 Database Indexing

MongoDB index configuration:

- `Project`: `endDate` (for sorting), `techStackIds` (for filtering)
- `Academic`: `semester` (for filtering)
- `Resume`: `isActive` (for primary resume lookup)
- `ProjectEngagement`: `projectId`, `viewedAt` (for statistics)

## 9. Documentation

### 9.1 Swagger/OpenAPI

Auto-generated documentation using SpringDoc OpenAPI 3.0:

- **UI Path**: `/swagger-ui.html`
- **API Docs Path**: `/v3/api-docs`
- **Annotations**: `@Operation`, `@ApiResponses`, `@Tag`, `@Parameter`

### 9.2 JavaDoc

JavaDoc comments for all Controllers, Services, and DTOs:

```java
/**
 * REST controller for project management operations.
 * Provides CRUD operations for projects with pagination, filtering, and sorting.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.PROJECTS_ENDPOINT)
public class ProjectController {
    // ...
}
```

## 10. Testing

### 10.1 Unit Tests

- Service layer unit tests
- Validation logic tests
- Mapper conversion tests

### 10.2 Integration Tests

- Controller integration tests
- Database integration tests
- Security configuration tests

### 10.3 API Tests

- Postman Collection
- Manual testing via Swagger UI
- Automated API tests (not implemented)

## 11. Deployment & Operations

### 11.1 Environment Variables

Required environment variables:

```properties
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio_dev

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://salieri009.studio

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 11.2 Health Check

Health check via Spring Boot Actuator:

- **Endpoint**: `/actuator/health`
- **Response**: `{"status": "UP"}`

### 11.3 Logging

Structured logging (SLF4J + Logback):

- Request/Response logging
- Error logging
- Performance metrics logging

## 12. Future Improvements

1. **Rate Limiting**: Apply Rate Limiting to all public endpoints
2. **API Monitoring**: Monitor API usage and performance
3. **Request ID Tracking**: Assign unique ID to all requests
4. **Circuit Breaker**: Apply Circuit Breaker pattern for external service calls
5. **API Versioning**: Design v2 API and migration strategy
6. **GraphQL**: Consider adding GraphQL endpoint for complex queries
7. **WebSocket**: Support WebSocket for real-time notifications
8. **File Upload**: Add project image upload API

## 13. References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Jakarta Bean Validation](https://beanvalidation.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [REST API Design Best Practices](https://restfulapi.net/)

---

**Document Version**: 2.0.0  
**Last Updated**: 2025-12-22  
**Author**: MyTechPortfolio Team
