# 백엔드 기획안 (Backend Design Plan)

> **Version**: 2.0.0  
> **Last Updated**: 2025-11-15  
> **Status**: Production Implementation Complete

## 1. 개요 (Overview)

안정적이고 확장 가능한 API 서버를 구축하여 프론트엔드에 필요한 데이터를 원활하게 제공하는 것을 목표로 합니다. Java와 Spring Boot 생태계를 적극 활용하여 생산성과 품질을 모두 확보합니다.

- **핵심 기술**: **Spring Boot 3.3.4**
- **선택 이유**:
    - **강력한 생태계**: Spring Data MongoDB, Spring Security 등 다양한 프로젝트와 쉽게 통합하여 필요한 기능을 빠르게 구현할 수 있습니다.
    - **독립 실행 가능**: 내장 WAS(Tomcat)를 통해 별도의 웹 서버 설정 없이 단일 JAR 파일로 간편하게 배포하고 실행할 수 있습니다.
    - **높은 생산성**: 복잡한 설정을 자동화하여 개발자가 비즈니스 로직에만 집중할 수 있도록 지원합니다.
    - **MongoDB 지원**: Spring Data MongoDB를 통한 NoSQL 데이터베이스 지원

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 | 버전 | 내용 |
| --- | --- | --- | --- |
| **Framework** | Spring Boot | 3.3.4 | `Spring Web`, `Spring Data MongoDB`, `Spring Validation`, `Spring Security` 등 핵심 모듈 사용 |
| **Language** | Java | 21 | LTS 버전으로 안정성 확보 및 최신 Java 문법 활용 |
| **Database** | MongoDB | Latest | NoSQL Document Database, 로컬 개발 및 프로덕션 사용 |
| **ODM** | Spring Data MongoDB | 3.3.4 | 객체-문서 매핑으로 생산성 및 유지보수성 향상 |
| **Build Tool** | Gradle | 8.10.2 | 간결한 Groovy/Kotlin DSL 기반의 빌드 자동화 도구 |
| **API Docs** | Springdoc OpenAPI | 2.2.0 | API 명세를 자동으로 생성하고 UI를 통해 테스트 환경 제공 |
| **Utilities** | Lombok | 1.18.30 | `@Getter`, `@Builder` 등 어노테이션으로 Boilerplate 코드 제거 |
| **Security** | Spring Security | 6.x | 인증 및 인가, JWT 토큰 기반 인증 |
| **JWT** | jjwt | 0.12.3 | JWT 토큰 생성 및 검증 |
| **2FA** | TOTP | 1.7.1 | Google Authenticator 호환 2단계 인증 |
| **Testing** | Spring Boot Test | 3.3.4 | 통합 테스트 및 단위 테스트, Testcontainers 지원 |
| **Caching** | Spring Cache | 3.3.4 | Caffeine 캐시 구현 |

## 3. 데이터베이스 설계 (Database Schema)

### MongoDB 컬렉션 구조

프로젝트는 MongoDB를 사용하며, Spring Data MongoDB를 통해 객체-문서 매핑을 수행합니다.

### 가. `projects` 컬렉션

프로젝트 정보를 저장하는 컬렉션입니다.

| 필드명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | 프로젝트 고유 ID (MongoDB 자동 생성) |
| `title` | `String` | `Required` | 프로젝트 제목 (3-255 chars) |
| `summary` | `String` | `Required` | 한 줄 요약 (10-500 chars) |
| `description` | `String` | `Required` | 상세 설명 (20-10000 chars, 마크다운 형식 지원) |
| `startDate` | `LocalDate` | `Required` | 개발 시작일 |
| `endDate` | `LocalDate` | `Required` | 개발 종료일 (startDate 이후) |
| `githubUrl` | `String` | `Optional` | GitHub 저장소 주소 (Valid URL) |
| `demoUrl` | `String` | `Optional` | 라이브 데모 주소 (Valid URL) |
| `repositoryName` | `String` | `Optional` | GitHub 레포 이름 |
| `isFeatured` | `Boolean` | `Default: false` | 메인 페이지 노출 여부 |
| `status` | `Enum` | `Default: COMPLETED` | 프로젝트 상태 (PLANNING, IN_PROGRESS, COMPLETED, ARCHIVED) |
| `viewCount` | `Long` | `Default: 0` | 조회수 |
| `techStackIds` | `List<String>` | `Required` | 기술 스택 ID 목록 (1-20개) |
| `relatedAcademicIds` | `List<String>` | `Optional` | 관련 학업 ID 목록 (0-10개) |
| `createdAt` | `LocalDateTime` | `Auto-generated` | 생성 일시 |
| `updatedAt` | `LocalDateTime` | `Auto-updated` | 수정 일시 |

**인덱스**:
- `endDate` (DESC) - 정렬용
- `isFeatured` - Featured 프로젝트 조회용
- `status` - 상태 필터링용

### 나. `academics` 컬렉션

수강 과목 정보를 저장하는 컬렉션입니다.

| 필드명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | `PK` | 과목 고유 ID |
| `subjectCode` | `String` | `Indexed` | 과목 코드 (예: "31264", "41025") |
| `name` | `String` | `Required` | 과목명 (예: "Computer Graphics") |
| `semester` | `String` | `Required` | 수강 학기 (예: "2025 AUT") |
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

## 4. 패키지 구조 (Package Structure)

```
com.mytechfolio.portfolio
├── PortfolioApplication.java          # 메인 애플리케이션 클래스
│
├── config/                            # 설정 클래스
│   ├── ApplicationConfig.java        # 핵심 Bean 설정 (PasswordEncoder 등)
│   ├── WebConfig.java                # CORS 설정
│   ├── SwaggerConfig.java            # API 문서화 설정
│   ├── CacheConfig.java              # 캐싱 설정
│   ├── LoggingConfig.java            # 로깅 설정
│   ├── MongoConfig.java              # MongoDB 설정
│   ├── PerformanceConfig.java        # 성능 설정
│   └── DataInitializer.java          # 초기 데이터 로딩
│
├── constants/                         # 상수 정의
│   ├── ApiConstants.java             # API 관련 상수
│   ├── SecurityConstants.java        # 보안 관련 상수
│   └── ErrorCode.java                # 에러 코드 enum
│
├── controller/                        # API 엔드포인트 컨트롤러
│   ├── base/                         # 기본 컨트롤러
│   │   ├── BaseController.java       # 기본 컨트롤러 인터페이스
│   │   └── AbstractCrudController.java # CRUD 컨트롤러 추상 클래스
│   ├── ProjectController.java        # 프로젝트 API
│   ├── AcademicController.java       # 학업 정보 API
│   ├── TechStackController.java      # 기술 스택 API
│   ├── AuthController.java           # 인증 API
│   ├── ContactController.java        # 연락처 API
│   ├── ResumeController.java         # 이력서 API
│   └── ProjectEngagementController.java # 참여도 추적 API
│
├── domain/                           # MongoDB 도메인 엔티티
│   ├── Project.java                  # 프로젝트 엔티티
│   ├── Academic.java                 # 학업 정보 엔티티
│   ├── TechStack.java                # 기술 스택 엔티티
│   ├── User.java                     # 사용자 엔티티
│   ├── Contact.java                  # 연락처 엔티티
│   ├── Resume.java                   # 이력서 엔티티
│   ├── ProjectEngagement.java        # 참여도 추적 엔티티
│   └── admin/                        # 관리자 관련 엔티티
│       ├── AdminUser.java
│       └── AdminRole.java
│
├── dto/                              # 데이터 전송 객체
│   ├── request/                      # 요청 DTO
│   │   ├── ProjectCreateRequest.java
│   │   ├── ProjectUpdateRequest.java
│   │   ├── AcademicCreateRequest.java
│   │   ├── ContactRequest.java
│   │   └── TechStackCreateRequest.java
│   ├── response/                     # 응답 DTO
│   │   ├── ApiResponse.java          # 표준 API 응답 래퍼
│   │   ├── PageResponse.java         # 페이지네이션 응답
│   │   ├── ProjectSummaryResponse.java
│   │   ├── ProjectDetailResponse.java
│   │   ├── AcademicResponse.java
│   │   └── TechStackResponse.java
│   └── auth/                         # 인증 관련 DTO
│       ├── GoogleLoginRequest.java
│       ├── LoginRequest.java
│       ├── LoginResponse.java
│       └── TwoFactorVerificationRequest.java
│
├── exception/                        # 예외 처리
│   ├── GlobalExceptionHandler.java   # 전역 예외 처리
│   ├── ResourceNotFoundException.java # 리소스 없음 예외
│   └── DuplicateResourceException.java # 중복 리소스 예외
│
├── mapper/                           # DTO-Entity 매퍼
│   ├── Mapper.java                   # 매퍼 인터페이스
│   ├── EntityMapper.java             # 기본 매퍼 추상 클래스
│   ├── ProjectMapper.java            # 프로젝트 매퍼
│   ├── AcademicMapper.java          # 학업 정보 매퍼
│   ├── TechStackMapper.java         # 기술 스택 매퍼
│   ├── ContactMapper.java           # 연락처 매퍼
│   └── ResumeMapper.java            # 이력서 매퍼
│
├── repository/                       # Spring Data MongoDB 리포지토리
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
├── service/                          # 비즈니스 로직 서비스
│   ├── BaseService.java             # 기본 서비스 인터페이스
│   ├── BaseServiceImpl.java         # 기본 서비스 구현
│   ├── ProjectService.java          # 프로젝트 서비스
│   ├── AcademicService.java         # 학업 정보 서비스
│   ├── TechStackService.java        # 기술 스택 서비스 (캐싱 적용)
│   ├── AuthService.java             # 인증 서비스
│   ├── ContactService.java          # 연락처 서비스
│   ├── ResumeService.java           # 이력서 서비스
│   └── ProjectEngagementService.java # 참여도 추적 서비스
│
├── security/                        # 보안 관련
│   ├── config/
│   │   └── SecurityConfig.java      # Spring Security 설정
│   ├── filter/
│   │   └── JwtAuthenticationFilter.java # JWT 인증 필터
│   ├── util/
│   │   ├── JwtUtil.java            # JWT 유틸리티
│   │   └── TwoFactorAuthUtil.java  # 2FA 유틸리티
│   ├── service/
│   │   ├── CustomUserDetailsService.java
│   │   └── GoogleOAuthService.java
│   └── dto/
│       ├── AuthResponse.java
│       └── TwoFactorSetupRequest.java
│
├── util/                            # 유틸리티 클래스
│   ├── ResponseUtil.java            # API 응답 유틸리티
│   ├── PaginationUtil.java          # 페이지네이션 유틸리티
│   ├── InputSanitizer.java          # 입력 정제 유틸리티
│   ├── DateUtil.java                # 날짜 유틸리티
│   └── StringUtil.java              # 문자열 유틸리티
│
└── validation/                      # 검증 관련
    ├── ValidationService.java        # 비즈니스 규칙 검증 서비스
    ├── ValidMongoId.java            # MongoDB ObjectId 검증 어노테이션
    ├── MongoIdValidator.java        # MongoDB ObjectId 검증기
    ├── ValidMongoIdList.java        # MongoDB ObjectId 리스트 검증
    ├── MongoIdListValidator.java    # MongoDB ObjectId 리스트 검증기
    ├── ValidUrl.java                # URL 검증 어노테이션
    ├── UrlValidator.java            # URL 검증기
    ├── ValidDateRange.java          # 날짜 범위 검증 어노테이션
    └── DateRangeValidator.java      # 날짜 범위 검증기
```

## 5. 아키텍처 패턴 (Architecture Patterns)

### 5.1 계층 구조 (Layered Architecture)

```
Controller Layer (API Endpoints)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Domain Layer (Entities)
```

### 5.2 DRY 원칙 (Don't Repeat Yourself)

#### BaseService & BaseServiceImpl

공통 CRUD 작업을 추상화하여 코드 중복을 제거합니다.

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

공통 REST 컨트롤러 패턴을 추상화합니다.

```java
public abstract class AbstractCrudController<T, ID, R, C, U> 
    implements BaseController<R, C, U, ID> {
    // 공통 CRUD 엔드포인트 구현
}
```

#### Mapper Layer

DTO-Entity 변환을 중앙화합니다.

```java
public interface Mapper<T, R, C, U> {
    R toResponse(T entity);
    T toEntity(C createRequest);
    void updateEntity(T entity, U updateRequest);
}
```

### 5.3 관심사 분리 (Separation of Concerns)

- **Controller**: HTTP 요청/응답 처리만 담당
- **Service**: 비즈니스 로직 처리
- **Repository**: 데이터 접근만 담당
- **Mapper**: DTO-Entity 변환
- **Validation**: 검증 로직 분리

### 5.4 Validation Service

복잡한 비즈니스 규칙 검증을 중앙화합니다.

```java
@Service
public class ValidationService {
    void validateContactSubmission(...); // 스팸 방지, Rate Limiting
    void validateResourceNotExists(...); // 중복 검사
}
```

## 6. API 설계 원칙

### 6.1 RESTful API

- **리소스 중심**: `/api/v1/projects`, `/api/v1/academics`
- **HTTP 메서드**: GET (조회), POST (생성), PUT (수정), DELETE (삭제)
- **상태 코드**: 200 (성공), 201 (생성), 204 (삭제), 400 (잘못된 요청), 404 (없음), 500 (서버 오류)

### 6.2 API 버전 관리

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
