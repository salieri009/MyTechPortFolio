# Backend Design Plan

> **Version**: 2.0.0  
> **Last Updated**: 2025-12-22  
> **Status**: Production Implementation Complete

## 1. Overview

The goal is to build a stable and scalable API server that seamlessly provides data required for the frontend. We actively leverage the Java and Spring Boot ecosystem to ensure both productivity and quality.

- **Core Technology**: **Spring Boot 3.3.4**
- **Selection Reasons**:
    - **Robust Ecosystem**: Easy integration with various projects like Spring Data MongoDB, Spring Security to quickly implement required features.
    - **Standalone Executable**: Can be easily deployed and run as a single JAR file via embedded WAS (Tomcat) without separate web server configuration.
    - **High Productivity**: Automates complex configurations so developers can focus solely on business logic.
    - **MongoDB Support**: NoSQL database support via Spring Data MongoDB

## 2. Technology Stack

| Category | Technology | Version | Description |
| --- | --- | --- | --- |
| **Framework** | Spring Boot | 3.3.4 | Using core modules: `Spring Web`, `Spring Data MongoDB`, `Spring Validation`, `Spring Security` |
| **Language** | Java | 21 | LTS version for stability and modern Java syntax |
| **Database** | MongoDB | Latest | NoSQL Document Database for local dev and production |
| **ODM** | Spring Data MongoDB | 3.3.4 | Object-Document Mapping for productivity and maintainability |
| **Build Tool** | Gradle | 8.10.2 | Build automation tool with concise Groovy/Kotlin DSL |
| **API Docs** | Springdoc OpenAPI | 2.2.0 | Auto-generate API specs with test UI |
| **Utilities** | Lombok | 1.18.30 | Remove boilerplate code with `@Getter`, `@Builder` annotations |
| **Security** | Spring Security | 6.x | Authentication and authorization, JWT token-based auth |
| **JWT** | jjwt | 0.12.3 | JWT token generation and validation |
| **2FA** | TOTP | 1.7.1 | Google Authenticator compatible 2FA |
| **Testing** | Spring Boot Test | 3.3.4 | Integration and unit testing, Testcontainers support |
| **Caching** | Spring Cache | 3.3.4 | Caffeine cache implementation |

## 3. Database Schema

### MongoDB Collection Structure

### A. `academics` Collection (continued)

| Field | Data Type | Constraint | Description |
| --- | --- | --- | --- |
| `grade` | `Enum` | `Optional` | Grade received (HIGH_DISTINCTION, DISTINCTION, CREDIT, PASS) |
| `creditPoints` | `Integer` | `Optional` | Credit points (e.g., 6) |
| `marks` | `Integer` | `Optional` | Score (e.g., 92) |
| `description` | `String` | `Optional` | Brief description of the subject |
| `status` | `Enum` | `Required` | Status (COMPLETED, ENROLLED, EXEMPTION) |
| `year` | `Integer` | `Optional` | Year (e.g., 2024, 2025) |
| `semesterType` | `Enum` | `Optional` | Semester type (SPRING, AUTUMN) |
| `createdAt` | `LocalDateTime` | `Auto-generated` | Created timestamp |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | Updated timestamp |

**Indexes**:
- `subjectCode` (Indexed) - Fast query
- `semester` - Semester filtering

### B. `tech_stacks` Collection

Collection that stores tech stack information.

| Field | Data Type | Constraint | Description |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | Tech stack unique ID |
| `name` | `String` | `Unique, Indexed` | Tech name (e.g., "Spring Boot", "React") |
| `type` | `Enum` | `Required` | Tech category (FRONTEND, BACKEND, DATABASE, DEVOPS, MOBILE, TESTING, OTHER) |
| `logoUrl` | `String` | `Optional` | Tech logo image URL |
| `officialUrl` | `String` | `Optional` | Official website |
| `description` | `String` | `Optional` | Description of the technology |
| `proficiencyLevel` | `Enum` | `Default: INTERMEDIATE` | Proficiency level (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT) |
| `usageCount` | `Long` | `Default: 0` | Number of projects used in |
| `isPrimary` | `Boolean` | `Default: false` | Primary technology flag |
| `createdAt` | `LocalDateTime` | `Auto-generated` | Created timestamp |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | Updated timestamp |

**Indexes**:
- `name` (Unique, Indexed) - Uniqueness and fast query
- `type` - Type filtering

**Caching**: This collection is frequently queried, so caching is applied (1 hour TTL)

### C. `users` Collection

Collection that stores user account information.

| Field | Data Type | Constraint | Description |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | User unique ID |
| `email` | `String` | `Unique, Indexed` | Email address |
| `password` | `String` | `Optional` | BCrypt hashed password (null for OAuth users) |
| `displayName` | `String` | `Optional` | Display name |
| `role` | `Enum` | `Default: USER` | Role (USER, ADMIN) |
| `enabled` | `Boolean` | `Default: true` | Account activation status |
| `isEmailVerified` | `Boolean` | `Default: false` | Email verification status |
| `oauthProvider` | `String` | `Optional` | OAuth provider (e.g., "google", "github") |
| `oauthId` | `String` | `Optional` | OAuth provider user ID |
| `twoFactorEnabled` | `Boolean` | `Default: false` | 2FA enabled status |
| `twoFactorSecret` | `String` | `Optional` | 2FA secret (encrypted) |
| `createdAt` | `LocalDateTime` | `Auto-generated` | Created timestamp |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | Updated timestamp |

**Indexes**:
- `email` (Unique, Indexed) - For authentication

### D. `contacts` Collection

Collection that stores contact form submission information.

| Field | Data Type | Constraint | Description |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | Contact unique ID |
| `email` | `String` | `Indexed` | Email address |
| `name` | `String` | `Required` | Name (2-100 chars) |
| `company` | `String` | `Optional` | Company name (max 100 chars) |
| `subject` | `String` | `Optional` | Subject (max 100 chars) |
| `message` | `String` | `Required` | Message (10-2000 chars) |
| `phoneNumber` | `String` | `Optional` | Phone number |
| `linkedInUrl` | `String` | `Optional` | LinkedIn URL |
| `jobTitle` | `String` | `Optional` | Job title |
| `referrer` | `String` | `Optional` | Referrer URL |
| `source` | `String` | `Optional` | Source ("portfolio", "project", "resume") |
| `projectId` | `String` | `Optional` | Related project ID |
| `ipAddress` | `String` | `Optional` | IP address (hashed) |
| `userAgent` | `String` | `Optional` | User Agent |
| `status` | `Enum` | `Default: NEW` | Status (NEW, READ, REPLIED, ARCHIVED, SPAM) |
| `isSpam` | `Boolean` | `Default: false` | Spam flag |
| `createdAt` | `LocalDateTime` | `Auto-generated` | Created timestamp |

**Indexes**:
- `email` (Indexed) - Duplicate check and Rate Limiting
- `createdAt` - Chronological query

### E. `resumes` Collection

Collection that stores resume management information.

| Field | Data Type | Constraint | Description |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | Resume unique ID |
| `version` | `String` | `Indexed` | Version (e.g., "full", "software-engineer") |
| `title` | `String` | `Required` | Title |
| `description` | `String` | `Optional` | Description |
| `fileName` | `String` | `Required` | File name |
| `fileUrl` | `String` | `Required` | File URL (Azure Blob Storage) |
| `fileType` | `String` | `Required` | File type ("pdf", "docx") |
| `fileSize` | `Long` | `Optional` | File size (bytes) |
| `isActive` | `Boolean` | `Default: true` | Active status |
| `isPublic` | `Boolean` | `Default: true` | Public status |
| `downloadCount` | `Long` | `Default: 0` | Download count |
| `createdAt` | `LocalDateTime` | `Auto-generated` | Created timestamp |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | Updated timestamp |

**Indexes**:
- `version` (Indexed) - Version query
- `isActive` - Primary resume query

### F. `project_engagement` Collection

Collection that stores project engagement tracking information.

| Field | Data Type | Constraint | Description |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | Engagement unique ID |
| `projectId` | `String` | `Required` | Project ID |
| `sessionId` | `String` | `Required` | Session ID |
| `visitorId` | `String` | `Optional` | Visitor ID |
| `viewDuration` | `Long` | `Optional` | View duration (seconds) |
| `scrollDepth` | `Integer` | `Optional` | Scroll depth (0-100%) |
| `githubLinkClicked` | `Boolean` | `Optional` | GitHub link clicked flag |
| `demoLinkClicked` | `Boolean` | `Optional` | Demo link clicked flag |
| `timesViewed` | `Integer` | `Optional` | View count |
| `referrer` | `String` | `Optional` | Referrer URL |
| `source` | `String` | `Optional` | Source |
| `userAgent` | `String` | `Optional` | User Agent |
| `ipAddress` | `String` | `Optional` | IP address (hashed) |
| `viewedAt` | `LocalDateTime` | `Auto-generated` | Viewed timestamp |
| `lastInteractionAt` | `LocalDateTime` | `Optional` | Last interaction timestamp |

**Indexes**:
- `projectId` - Per-project statistics query
- `viewedAt` - Chronological query

### Relationships

- **Project ↔ TechStack**: Many-to-Many via `techStackIds` array (embedded references)
- **Project ↔ Academic**: Many-to-Many via `relatedAcademicIds` array (embedded references)
- **Project → ProjectEngagement**: One-to-Many (engagement tracking)

## 4. Package Structure

```
com.mytechfolio.portfolio
├── PortfolioApplication.java          # Main application class
│
├── config/                            # Configuration classes
│   ├── ApplicationConfig.java        # Core Bean config (PasswordEncoder etc.)
│   ├── WebConfig.java                # CORS configuration
│   ├── SwaggerConfig.java            # API documentation config
│   ├── CacheConfig.java              # Caching configuration
│   ├── LoggingConfig.java            # Logging configuration
│   ├── MongoConfig.java              # MongoDB configuration
│   ├── PerformanceConfig.java        # Performance configuration
│   └── DataInitializer.java          # Initial data loading
│
├── constants/                         # Constant definitions
│   ├── ApiConstants.java             # API related constants
│   ├── SecurityConstants.java        # Security related constants
│   └── ErrorCode.java                # Error code enum
│
├── controller/                        # API endpoint controllers
│   ├── base/                         # Base controllers
│   │   ├── BaseController.java       # Base controller interface
│   │   └── AbstractCrudController.java # CRUD controller abstract class
│   ├── ProjectController.java        # Project API
│   ├── AcademicController.java       # Academic info API
│   ├── TechStackController.java      # Tech Stack API
│   ├── AuthController.java           # Authentication API
│   ├── ContactController.java        # Contact API
│   ├── ResumeController.java         # Resume API
│   └── ProjectEngagementController.java # Engagement tracking API
│
├── domain/                           # MongoDB domain entities
│   ├── Project.java                  # Project entity
│   ├── Academic.java                 # Academic info entity
│   ├── TechStack.java                # Tech Stack entity
│   ├── User.java                     # User entity
│   ├── Contact.java                  # Contact entity
│   ├── Resume.java                   # Resume entity
│   ├── ProjectEngagement.java        # Engagement tracking entity
│   └── admin/                        # Admin related entities
│       ├── AdminUser.java
│       └── AdminRole.java
│
├── dto/                              # Data Transfer Objects
│   ├── request/                      # Request DTOs
│   │   ├── ProjectCreateRequest.java
│   │   ├── ProjectUpdateRequest.java
│   │   ├── AcademicCreateRequest.java
│   │   ├── ContactRequest.java
│   │   └── TechStackCreateRequest.java
│   ├── response/                     # Response DTOs
│   │   ├── ApiResponse.java          # Standard API response wrapper
│   │   ├── PageResponse.java         # Pagination response
│   │   ├── ProjectSummaryResponse.java
│   │   ├── ProjectDetailResponse.java
│   │   ├── AcademicResponse.java
│   │   └── TechStackResponse.java
│   └── auth/                         # Auth related DTOs
│       ├── GoogleLoginRequest.java
│       ├── LoginRequest.java
│       ├── LoginResponse.java
│       └── TwoFactorVerificationRequest.java
│
├── exception/                        # Exception handling
│   ├── GlobalExceptionHandler.java   # Global exception handler
│   ├── ResourceNotFoundException.java # Resource not found exception
│   └── DuplicateResourceException.java # Duplicate resource exception
│
├── mapper/                           # DTO-Entity mappers
│   ├── Mapper.java                   # Mapper interface
│   ├── EntityMapper.java             # Base mapper abstract class
│   ├── ProjectMapper.java            # Project mapper
│   ├── AcademicMapper.java          # Academic info mapper
│   ├── TechStackMapper.java         # Tech Stack mapper
│   ├── ContactMapper.java           # Contact mapper
│   └── ResumeMapper.java            # Resume mapper
│
├── repository/                       # Spring Data MongoDB repositories
│   ├── ProjectRepository.java
│   ├── AcademicRepository.java
│   ├── TechStackRepository.java
│   ├── UserRepository.java
│   ├── ContactRepository.java
│   ├── ResumeRepository.java
│   ├── ProjectEngagementRepository.java
│   └── admin/
│       └── AdminUserRepository.java
│
├── service/                          # Business logic services
│   ├── BaseService.java             # Base service interface
│   ├── BaseServiceImpl.java         # Base service implementation
│   ├── ProjectService.java          # Project service
│   ├── AcademicService.java         # Academic info service
│   ├── TechStackService.java        # Tech Stack service (with caching)
│   ├── AuthService.java             # Authentication service
│   ├── ContactService.java          # Contact service
│   ├── ResumeService.java           # Resume service
│   └── ProjectEngagementService.java # Engagement tracking service
│
├── security/                        # Security related
│   ├── config/
│   │   └── SecurityConfig.java      # Spring Security config
│   ├── filter/
│   │   └── JwtAuthenticationFilter.java # JWT auth filter
│   ├── util/
│   │   ├── JwtUtil.java            # JWT utility
│   │   └── TwoFactorAuthUtil.java  # 2FA utility
│   ├── service/
│   │   ├── CustomUserDetailsService.java
│   │   └── GoogleOAuthService.java
│   └── dto/
│       ├── AuthResponse.java
│       └── TwoFactorSetupRequest.java
│
├── util/                            # Utility classes
│   ├── ResponseUtil.java            # API response utility
│   ├── PaginationUtil.java          # Pagination utility
│   ├── InputSanitizer.java          # Input sanitization utility
│   ├── DateUtil.java                # Date utility
│   └── StringUtil.java              # String utility
│
└── validation/                      # Validation related
    ├── ValidationService.java        # Business rule validation service
    ├── ValidMongoId.java            # MongoDB ObjectId validation annotation
    ├── MongoIdValidator.java        # MongoDB ObjectId validator
    ├── ValidMongoIdList.java        # MongoDB ObjectId list validation
    ├── MongoIdListValidator.java    # MongoDB ObjectId list validator
    ├── ValidUrl.java                # URL validation annotation
    ├── UrlValidator.java            # URL validator
    ├── ValidDateRange.java          # Date range validation annotation
    └── DateRangeValidator.java      # Date range validator
```

## 5. Architecture Patterns

### 5.1 Layered Architecture

```
Controller Layer (API Endpoints)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Domain Layer (Entities)
```

### 5.2 DRY Principle (Don't Repeat Yourself)

#### BaseService & BaseServiceImpl

Abstracts common CRUD operations to eliminate code duplication.

```java
public interface BaseService<T, ID, R, C, U> {
    PageResponse<R> findAll(int page, int size, String sort);
    R findById(ID id);
    R create(C createRequest);
    R update(ID id, U updateRequest);
    void delete(ID id);
}
```

#### AbstractCrudController

Abstracts common REST controller patterns.

```java
public abstract class AbstractCrudController<T, ID, R, C, U> 
    implements BaseController<R, C, U, ID> {
    // Common CRUD endpoint implementation
}
```

#### Mapper Layer

Centralizes DTO-Entity conversion.

```java
public interface Mapper<T, R, C, U> {
    R toResponse(T entity);
    T toEntity(C createRequest);
    void updateEntity(T entity, U updateRequest);
}
```

### 5.3 Separation of Concerns

- **Controller**: Only handles HTTP request/response
- **Service**: Business logic processing
- **Repository**: Only handles data access
- **Mapper**: DTO-Entity conversion
- **Validation**: Separated validation logic

### 5.4 Validation Service

Centralizes complex business rule validation.

```java
@Service
public class ValidationService {
    void validateContactSubmission(...); // Spam prevention, Rate Limiting
    void validateResourceNotExists(...); // Duplicate check
}
```

## 6. API Design Principles

### 6.1 RESTful API

- **Resource-Centric**: `/api/v1/projects`, `/api/v1/academics`
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: 200 (success), 201 (created), 204 (deleted), 400 (bad request), 404 (not found), 500 (server error)

### 6.2 API Version Management

- **Base Path**: `/api/v1`
- **Version Constant**: `ApiConstants.API_BASE_PATH = "/api/v1"`
- **Future Extension**: Can upgrade to `/api/v2` etc.

### 6.3 Standardized Response

All API responses are wrapped in `ApiResponse<T>`:

```java
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "error": null,
  "errorCode": null,
  "metadata": {
    "timestamp": "2025-11-15T10:30:00Z",
    "version": "v1"
  }
}
```

### 6.4 Pagination

All list APIs support pagination:

- **Defaults**: page=1, size=10
- **Maximum**: size=100
- **Response**: `PageResponse<T>` with `page`, `size`, `total`, `items[]`

## 7. Security Implementation

### 7.1 Authentication & Authorization

- **JWT Authentication**: Access Token + Refresh Token
- **Google OAuth**: Social login support
- **2FA**: TOTP-based two-factor authentication
- **Role-Based Access**: USER, ADMIN roles

### 7.2 Security Headers

- **HSTS**: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `strict-origin-when-cross-origin`

### 7.3 Input Validation

- **Bean Validation**: Jakarta Bean Validation
- **Custom Validators**: `@ValidMongoId`, `@ValidUrl`, `@ValidDateRange`
- **Input Sanitization**: XSS prevention via `InputSanitizer`

### 7.4 CORS Configuration

- **Allowed Origins**: Environment variable or defaults
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Allowed Headers**: Content-Type, Authorization, X-Requested-With

## 8. Performance Optimization

### 8.1 Caching

- **TechStackService**: Caffeine cache (1 hour TTL)
- **CacheConfig**: Cache manager configuration

### 8.2 Database Optimization

- **Indexes**: Index frequently queried fields
- **Connection Pooling**: MongoDB connection pool configuration
- **Query Optimization**: Field selection via Projection

### 8.3 API Optimization

- **Pagination**: Applied to all list APIs
- **DTO Projection**: Return only required fields
- **ResponseUtil**: Standardized response generation

## 9. Error Handling

### 9.1 GlobalExceptionHandler

Handles all exceptions centrally:

- **ValidationException**: 400 Bad Request
- **ResourceNotFoundException**: 404 Not Found
- **DuplicateResourceException**: 409 Conflict
- **Generic Exception**: 500 Internal Server Error

### 9.2 ErrorCode Enum

Standardized error codes:

```java
public enum ErrorCode {
    VALIDATION_ERROR,
    RESOURCE_NOT_FOUND,
    DUPLICATE_RESOURCE,
    UNAUTHORIZED,
    FORBIDDEN,
    // ...
}
```

## 10. Testing Strategy

### 10.1 Unit Testing

- **Service Layer**: Business logic testing
- **Repository Layer**: Data access testing
- **Validation**: Validation logic testing

### 10.2 Integration Testing

- **Controller**: API endpoint testing
- **Testcontainers**: MongoDB integration testing
- **Security**: Authentication/authorization testing

## 11. Deployment & Operations

### 11.1 Build

```bash
./gradlew clean build
```

### 11.2 Run

```bash
./gradlew bootRun
# or
java -jar build/libs/portfolio-0.0.1-SNAPSHOT.jar
```

### 11.3 Environment Variables

```properties
# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT
JWT_SECRET=your-secret-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://salieri009.studio

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 12. Future Improvements

1. **Rate Limiting**: Apply Rate Limiting to all API endpoints
2. **Caching**: Additional caching strategy (Redis)
3. **Monitoring**: Application Insights or CloudWatch integration
4. **API Versioning**: v2 API design
5. **GraphQL**: Consider GraphQL endpoint for complex queries

---

**Document Version**: 2.0.0  
**Last Updated**: 2025-12-22  
**Maintained By**: Development Team
