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

| `grade` | `Enum` | `Optional` | 받은 성적 (HIGH_DISTINCTION, DISTINCTION, CREDIT, PASS) |
| `creditPoints` | `Integer` | `Optional` | 학점 (예: 6) |
| `marks` | `Integer` | `Optional` | 점수 (예: 92) |
| `description` | `String` | `Optional` | 과목에 대한 간략한 설명 |
| `status` | `Enum` | `Required` | 상태 (COMPLETED, ENROLLED, EXEMPTION) |
| `year` | `Integer` | `Optional` | 연도 (예: 2024, 2025) |
| `semesterType` | `Enum` | `Optional` | 학기 타입 (SPRING, AUTUMN) |
| `createdAt` | `LocalDateTime` | `Auto-generated` | 생성 일시 |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | 수정 일시 |

**인덱스**:
- `subjectCode` (Indexed) - 빠른 조회
- `semester` - 학기 필터링

### 다. `tech_stacks` 컬렉션

기술 스택 정보를 저장하는 컬렉션입니다.

| 필드명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | 기술 스택 고유 ID |
| `name` | `String` | `Unique, Indexed` | 기술 이름 (예: "Spring Boot", "React") |
| `type` | `Enum` | `Required` | 기술 분류 (FRONTEND, BACKEND, DATABASE, DEVOPS, MOBILE, TESTING, OTHER) |
| `logoUrl` | `String` | `Optional` | 기술 로고 이미지 주소 |
| `officialUrl` | `String` | `Optional` | 공식 웹사이트 |
| `description` | `String` | `Optional` | 기술에 대한 설명 |
| `proficiencyLevel` | `Enum` | `Default: INTERMEDIATE` | 숙련도 (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT) |
| `usageCount` | `Long` | `Default: 0` | 사용된 프로젝트 수 |
| `isPrimary` | `Boolean` | `Default: false` | 주력 기술 여부 |
| `createdAt` | `LocalDateTime` | `Auto-generated` | 생성 일시 |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | 수정 일시 |

**인덱스**:
- `name` (Unique, Indexed) - 유일성 보장 및 빠른 조회
- `type` - 타입별 필터링

**캐싱**: 이 컬렉션은 자주 조회되므로 캐싱 적용 (1시간 TTL)

### 라. `users` 컬렉션

사용자 계정 정보를 저장하는 컬렉션입니다.

| 필드명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | 사용자 고유 ID |
| `email` | `String` | `Unique, Indexed` | 이메일 주소 |
| `password` | `String` | `Optional` | BCrypt 해시된 비밀번호 (OAuth 사용자는 null) |
| `displayName` | `String` | `Optional` | 표시 이름 |
| `role` | `Enum` | `Default: USER` | 역할 (USER, ADMIN) |
| `enabled` | `Boolean` | `Default: true` | 계정 활성화 여부 |
| `isEmailVerified` | `Boolean` | `Default: false` | 이메일 인증 여부 |
| `oauthProvider` | `String` | `Optional` | OAuth 제공자 (예: "google", "github") |
| `oauthId` | `String` | `Optional` | OAuth 제공자 사용자 ID |
| `twoFactorEnabled` | `Boolean` | `Default: false` | 2FA 활성화 여부 |
| `twoFactorSecret` | `String` | `Optional` | 2FA 시크릿 (암호화됨) |
| `createdAt` | `LocalDateTime` | `Auto-generated` | 생성 일시 |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | 수정 일시 |

**인덱스**:
- `email` (Unique, Indexed) - 인증용

### 마. `contacts` 컬렉션

연락처 폼 제출 정보를 저장하는 컬렉션입니다.

| 필드명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | 연락처 고유 ID |
| `email` | `String` | `Indexed` | 이메일 주소 |
| `name` | `String` | `Required` | 이름 (2-100 chars) |
| `company` | `String` | `Optional` | 회사명 (max 100 chars) |
| `subject` | `String` | `Optional` | 제목 (max 100 chars) |
| `message` | `String` | `Required` | 메시지 (10-2000 chars) |
| `phoneNumber` | `String` | `Optional` | 전화번호 |
| `linkedInUrl` | `String` | `Optional` | LinkedIn URL |
| `jobTitle` | `String` | `Optional` | 직책 |
| `referrer` | `String` | `Optional` | 참조 URL |
| `source` | `String` | `Optional` | 소스 ("portfolio", "project", "resume") |
| `projectId` | `String` | `Optional` | 관련 프로젝트 ID |
| `ipAddress` | `String` | `Optional` | IP 주소 (해싱됨) |
| `userAgent` | `String` | `Optional` | User Agent |
| `status` | `Enum` | `Default: NEW` | 상태 (NEW, READ, REPLIED, ARCHIVED, SPAM) |
| `isSpam` | `Boolean` | `Default: false` | 스팸 여부 |
| `createdAt` | `LocalDateTime` | `Auto-generated` | 생성 일시 |

**인덱스**:
- `email` (Indexed) - 중복 검사 및 Rate Limiting
- `createdAt` - 시간순 조회

### 바. `resumes` 컬렉션

이력서 관리 정보를 저장하는 컬렉션입니다.

| 필드명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | 이력서 고유 ID |
| `version` | `String` | `Indexed` | 버전 (예: "full", "software-engineer") |
| `title` | `String` | `Required` | 제목 |
| `description` | `String` | `Optional` | 설명 |
| `fileName` | `String` | `Required` | 파일명 |
| `fileUrl` | `String` | `Required` | 파일 URL (Azure Blob Storage) |
| `fileType` | `String` | `Required` | 파일 타입 ("pdf", "docx") |
| `fileSize` | `Long` | `Optional` | 파일 크기 (bytes) |
| `isActive` | `Boolean` | `Default: true` | 활성 여부 |
| `isPublic` | `Boolean` | `Default: true` | 공개 여부 |
| `downloadCount` | `Long` | `Default: 0` | 다운로드 횟수 |
| `createdAt` | `LocalDateTime` | `Auto-generated` | 생성 일시 |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | 수정 일시 |

**인덱스**:
- `version` (Indexed) - 버전 조회
- `isActive` - 주요 이력서 조회

### 사. `project_engagement` 컬렉션

프로젝트 참여도 추적 정보를 저장하는 컬렉션입니다.

| 필드명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | 참여도 고유 ID |
| `projectId` | `String` | `Required` | 프로젝트 ID |
| `sessionId` | `String` | `Required` | 세션 ID |
| `visitorId` | `String` | `Optional` | 방문자 ID |
| `viewDuration` | `Long` | `Optional` | 조회 시간 (초) |
| `scrollDepth` | `Integer` | `Optional` | 스크롤 깊이 (0-100%) |
| `githubLinkClicked` | `Boolean` | `Optional` | GitHub 링크 클릭 여부 |
| `demoLinkClicked` | `Boolean` | `Optional` | Demo 링크 클릭 여부 |
| `timesViewed` | `Integer` | `Optional` | 조회 횟수 |
| `referrer` | `String` | `Optional` | 참조 URL |
| `source` | `String` | `Optional` | 소스 |
| `userAgent` | `String` | `Optional` | User Agent |
| `ipAddress` | `String` | `Optional` | IP 주소 (해싱됨) |
| `viewedAt` | `LocalDateTime` | `Auto-generated` | 조회 일시 |
| `lastInteractionAt` | `LocalDateTime` | `Optional` | 마지막 상호작용 일시 |

**인덱스**:
- `projectId` - 프로젝트별 통계 조회
- `viewedAt` - 시간순 조회

### 관계 설명

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
- **버전 상수**: `ApiConstants.API_BASE_PATH = "/api/v1"`
- **향후 확장**: `/api/v2` 등으로 버전 업그레이드 가능

### 6.3 표준화된 응답

모든 API 응답은 `ApiResponse<T>` 래퍼로 감싸집니다:

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

### 6.4 페이지네이션

모든 목록 API는 페이지네이션을 지원합니다:

- **기본값**: page=1, size=10
- **최대값**: size=100
- **응답**: `PageResponse<T>` with `page`, `size`, `total`, `items[]`

## 7. 보안 구현

### 7.1 인증 및 인가

- **JWT Authentication**: Access Token + Refresh Token
- **Google OAuth**: Social login 지원
- **2FA**: TOTP 기반 2단계 인증
- **Role-Based Access**: USER, ADMIN 역할

### 7.2 보안 헤더

- **HSTS**: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `strict-origin-when-cross-origin`

### 7.3 입력 검증

- **Bean Validation**: Jakarta Bean Validation
- **Custom Validators**: `@ValidMongoId`, `@ValidUrl`, `@ValidDateRange`
- **Input Sanitization**: `InputSanitizer`를 통한 XSS 방지

### 7.4 CORS 설정

- **허용된 오리진**: 환경 변수 또는 기본값
- **허용된 메서드**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **허용된 헤더**: Content-Type, Authorization, X-Requested-With

## 8. 성능 최적화

### 8.1 캐싱

- **TechStackService**: Caffeine 캐시 (1시간 TTL)
- **CacheConfig**: 캐시 매니저 설정

### 8.2 데이터베이스 최적화

- **인덱스**: 자주 조회되는 필드에 인덱스 설정
- **Connection Pooling**: MongoDB connection pool 설정
- **쿼리 최적화**: Projection을 통한 필드 선택

### 8.3 API 최적화

- **페이지네이션**: 모든 목록 API에 적용
- **DTO Projection**: 필요한 필드만 반환
- **ResponseUtil**: 표준화된 응답 생성

## 9. 에러 처리

### 9.1 GlobalExceptionHandler

모든 예외를 중앙에서 처리합니다:

- **ValidationException**: 400 Bad Request
- **ResourceNotFoundException**: 404 Not Found
- **DuplicateResourceException**: 409 Conflict
- **Generic Exception**: 500 Internal Server Error

### 9.2 ErrorCode Enum

표준화된 에러 코드:

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

## 10. 테스트 전략

### 10.1 단위 테스트

- **Service Layer**: 비즈니스 로직 테스트
- **Repository Layer**: 데이터 접근 테스트
- **Validation**: 검증 로직 테스트

### 10.2 통합 테스트

- **Controller**: API 엔드포인트 테스트
- **Testcontainers**: MongoDB 통합 테스트
- **Security**: 인증/인가 테스트

## 11. 배포 및 운영

### 11.1 빌드

```bash
./gradlew clean build
```

### 11.2 실행

```bash
./gradlew bootRun
# 또는
java -jar build/libs/portfolio-0.0.1-SNAPSHOT.jar
```

### 11.3 환경 변수

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

## 12. 향후 개선 사항

1. **Rate Limiting**: 모든 API 엔드포인트에 Rate Limiting 적용
2. **Caching**: 추가적인 캐싱 전략 (Redis)
3. **Monitoring**: Application Insights 또는 CloudWatch 연동
4. **API Versioning**: v2 API 설계
5. **GraphQL**: 복잡한 쿼리를 위한 GraphQL 엔드포인트 검토

---

**Document Version**: 2.0.0  
**Last Updated**: 2025-11-15  
**Maintained By**: Development Team
