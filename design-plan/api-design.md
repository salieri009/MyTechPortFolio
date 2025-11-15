# API 기획안 (API Design Plan)

> **Version**: 2.0.0  
> **Last Updated**: 2025-11-15  
> **Status**: Production Implementation Complete  
> **Base URL**: `/api/v1`

## 1. 개요 (Overview)

프론트엔드와 백엔드 간의 데이터 통신을 위한 RESTful API 명세를 정의합니다. 모든 요청과 응답은 JSON 형식을 기본으로 사용하며, 일관성 있는 API 구조를 통해 개발 효율성을 높이는 것을 목표로 합니다.

### 핵심 원칙

1. **표준화된 응답 형식**: 모든 API는 `ApiResponse<T>` 래퍼를 사용
2. **에러 코드 표준화**: `ErrorCode` enum을 통한 일관된 에러 처리
3. **API 버전 관리**: `/api/v1` 경로를 통한 버전 관리
4. **보안 우선**: 입력 검증, XSS 방지, SQL Injection 방지
5. **성능 최적화**: 캐싱, 페이지네이션, 필터링 지원
6. **문서화**: Swagger/OpenAPI 3.0을 통한 자동 문서 생성

### 기술 스택

- **Framework**: Spring Boot 3.x
- **Database**: MongoDB
- **Validation**: Jakarta Bean Validation + Custom Validators
- **Documentation**: SpringDoc OpenAPI 3 (Swagger UI)
- **Security**: Spring Security + JWT
- **Caching**: Spring Cache (for TechStackService)

## 2. API 구조 (API Structure)

### Base Configuration

```java
// ApiConstants.java
public static final String API_VERSION = "v1";
public static final String API_BASE_PATH = "/api/" + API_VERSION;
```

### Response Wrapper

모든 API 응답은 `ApiResponse<T>` 래퍼로 감싸집니다:

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

**장점**:
- 일관된 응답 구조로 프론트엔드 처리 단순화
- 에러 정보의 구조화된 전달
- 메타데이터를 통한 디버깅 및 모니터링 지원

### Pagination

모든 목록 API는 페이지네이션을 지원합니다:

```java
public class PageResponse<T> {
    private int page;      // 1-based
    private int size;      // Default: 10, Max: 100
    private long total;    // Total number of items
    private List<T> items; // Current page items
}
```

**기본값** (ApiConstants):
- `DEFAULT_PAGE_NUMBER = 1`
- `DEFAULT_PAGE_SIZE = 10`
- `MAX_PAGE_SIZE = 100`
- `DEFAULT_SORT_FIELD = "endDate"`
- `DEFAULT_SORT_DIRECTION = "DESC"`

## 3. 구현된 API 엔드포인트

### 3.1 Projects API (`/api/v1/projects`)

프로젝트 관리 CRUD API입니다.

#### Controller: `ProjectController`

**Base Path**: `ApiConstants.PROJECTS_ENDPOINT` = `/api/v1/projects`

#### GET `/api/v1/projects`

프로젝트 목록을 페이징, 정렬, 필터링하여 조회합니다.

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

**비즈니스 로직**:
- Tech stack 필터링: 쉼표로 구분된 기술 스택 이름으로 필터링
- 연도 필터링: 프로젝트 시작/종료 연도 기준
- 정렬: 기본값은 `endDate,DESC` (최신순)

#### GET `/api/v1/projects/{id}`

특정 프로젝트의 상세 정보를 조회합니다.

**Path Variable**:
```java
@PathVariable @ValidMongoId String id
```

**Validation**: `@ValidMongoId` 어노테이션으로 MongoDB ObjectId 형식 검증

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

새로운 프로젝트를 생성합니다.

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
  "message": "프로젝트가 성공적으로 생성되었습니다"
}
```

**Service Method**: `ProjectService.createProject(ProjectCreateRequest)`

**비즈니스 로직**:
- Tech stack IDs 검증 및 연결
- Academic IDs 검증 및 연결 (optional)
- 중복 체크 (제목 기준, `DuplicateResourceException`)

#### PUT `/api/v1/projects/{id}`

기존 프로젝트를 수정합니다.

**Path Variable**: `@PathVariable @ValidMongoId String id`

**Request Body**: `ProjectUpdateRequest` (same structure as `ProjectCreateRequest`)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": ProjectDetailResponse,
  "message": "프로젝트가 성공적으로 수정되었습니다"
}
```

**Service Method**: `ProjectService.updateProject(id, ProjectUpdateRequest)`

**비즈니스 로직**:
- 존재 여부 확인 (`ResourceNotFoundException`)
- Tech stack 및 Academic 관계 업데이트
- 중복 체크 (제목 변경 시)

#### DELETE `/api/v1/projects/{id}`

프로젝트를 삭제합니다.

**Path Variable**: `@PathVariable @ValidMongoId String id`

**Response**: `204 No Content`

**Service Method**: `ProjectService.deleteProject(id)`

**비즈니스 로직**:
- 존재 여부 확인
- 관련 관계 (TechStack, Academic) 자동 해제 (MongoDB cascade)

### 3.2 Academics API (`/api/v1/academics`)

학업 과정 정보 조회 API입니다.

#### Controller: `AcademicController`

**Base Path**: `ApiConstants.ACADEMICS_ENDPOINT` = `/api/v1/academics`

#### GET `/api/v1/academics`

학업 과정 목록을 페이징 및 학기 필터링하여 조회합니다.

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

특정 학업 과정의 상세 정보와 연관된 프로젝트를 조회합니다.

**Path Variable**: `@PathVariable @ValidMongoId String id`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "자료구조",
    "semester": "2학년 1학기",
    "grade": "A+",
    "description": "...",
    "relatedProjects": [
      {
        "id": "...",
        "title": "알고리즘 문제 풀이 저장소"
      }
    ]
  }
}
```

**Service Method**: `AcademicService.getAcademic(id)`

**비즈니스 로직**:
- Academic 엔티티 조회
- 연관된 Project 엔티티 조회 및 매핑

### 3.3 Tech Stacks API (`/api/v1/techstacks`)

기술 스택 조회 API입니다.

#### Controller: `TechStackController`

**Base Path**: `ApiConstants.TECH_STACKS_ENDPOINT` = `/api/v1/techstacks`

#### GET `/api/v1/techstacks`

기술 스택 목록을 조회합니다. 타입별 필터링 지원.

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

**성능 최적화**:
- `@Cacheable` 어노테이션으로 캐싱 적용
- 자주 조회되는 데이터이므로 캐시로 성능 향상

**Cache Configuration**: `CacheConfig.java`
- Cache name: `techStacks`
- TTL: Configurable (default: 1 hour)

### 3.4 Authentication API (`/api/v1/auth`)

인증 및 인가 API입니다.

#### Controller: `AuthController`

**Base Path**: `ApiConstants.API_BASE_PATH + "/auth"` = `/api/v1/auth`

#### POST `/api/v1/auth/google`

Google OAuth ID 토큰을 사용하여 인증합니다.

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
  "message": "로그인 성공"
}
```

**Service Method**: `AuthService.authenticateWithGoogle(googleIdToken)`

**비즈니스 로직**:
1. Google ID 토큰 검증
2. 사용자 정보 추출 또는 신규 사용자 생성
3. JWT 토큰 생성 (access token + refresh token)
4. 2FA 확인 (필요시)

#### POST `/api/v1/auth/refresh`

리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다.

**Headers**:
```
Authorization: Bearer {refreshToken}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": LoginResponse,
  "message": "토큰 갱신 성공"
}
```

**Service Method**: `AuthService.refreshToken(refreshToken)`

**비즈니스 로직**:
- 리프레시 토큰 검증
- 새 액세스 토큰 발급
- 리프레시 토큰 갱신 (선택적)

#### POST `/api/v1/auth/logout`

사용자를 로그아웃하고 토큰을 무효화합니다.

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": null,
  "message": "로그아웃 성공"
}
```

**Service Method**: `AuthService.logout(token)`

#### GET `/api/v1/auth/profile`

현재 인증된 사용자의 프로필 정보를 조회합니다.

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

연락처 폼 제출 API입니다.

#### Controller: `ContactController`

**Base Path**: `ApiConstants.API_BASE_PATH + "/contact"` = `/api/v1/contact`

#### POST `/api/v1/contact`

연락처 폼을 제출합니다. 스팸 방지 및 Rate Limiting이 적용됩니다.

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

**보안 기능**:
1. **Honeypot Field**: `website` 필드가 비어있지 않으면 스팸으로 간주
2. **Rate Limiting**: IP 주소별 요청 제한 (구현 필요)
3. **Input Sanitization**: `InputSanitizer`를 통한 입력 정제
4. **Spam Detection**: `ValidationService`를 통한 스팸 검사
5. **IP Hashing**: 개인정보 보호를 위한 IP 주소 해싱

**비즈니스 로직**:
- 입력 데이터 정제 (XSS 방지)
- 스팸 검사
- Rate limiting 확인
- Contact 엔티티 저장
- 이메일 알림 (선택적, 미구현)

### 3.6 Resumes API (`/api/v1/resumes`)

이력서 관리 API입니다.

#### Controller: `ResumeController`

**Base Path**: `ApiConstants.API_BASE_PATH + "/resumes"` = `/api/v1/resumes`

#### GET `/api/v1/resumes`

모든 사용 가능한 이력서 버전 목록을 조회합니다.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [Resume[]]
}
```

**Service Method**: `ResumeService.getAllResumes()`

#### GET `/api/v1/resumes/primary`

주요(활성) 이력서를 조회합니다.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": Resume  // isActive=true인 이력서
}
```

**Error Responses**:
- `404 Not Found`: 활성 이력서가 없음

**Service Method**: `ResumeService.getPrimaryResume()`

#### GET `/api/v1/resumes/{id}/download`

이력서 파일을 다운로드하고 다운로드 횟수를 추적합니다.

**Path Variable**: `@PathVariable String id`

**Response**: `200 OK`
- Content-Type: `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Content-Disposition: `attachment; filename="{fileName}"`
- Body: Binary file content

**Service Method**: `ResumeService.recordDownload(id)`

**비즈니스 로직**:
1. Resume 엔티티 조회
2. 다운로드 횟수 증가 (`incrementDownloadCount()`)
3. 파일 URL에서 리소스 로드
4. 파일 스트림 반환

**파일 저장소**:
- 개발: 로컬 파일 시스템
- 프로덕션: Azure Blob Storage (구현 필요)

#### GET `/api/v1/resumes/statistics`

모든 이력서의 다운로드 통계를 조회합니다.

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

프로젝트 참여도 추적 API입니다.

#### Controller: `ProjectEngagementController`

**Base Path**: `ApiConstants.API_BASE_PATH + "/engagement"` = `/api/v1/engagement`

#### POST `/api/v1/engagement/track`

프로젝트 참여 메트릭을 기록합니다.

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
- IP 주소 (해싱됨)
- User Agent
- Device Type
- Browser
- Geographic info (선택적)

**Response**: `201 Created`
```json
{
  "success": true,
  "data": ProjectEngagement  // Enriched with server data
}
```

**Service Method**: `ProjectEngagementService.recordEngagement(ProjectEngagement)`

#### PATCH `/api/v1/engagement/{engagementId}`

참여 정보를 상호작용 데이터로 업데이트합니다.

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

**비즈니스 로직**:
- Engagement 엔티티 조회
- 상호작용 데이터 업데이트
- 참여도 점수 재계산 (`calculateEngagementScore()`)

#### GET `/api/v1/engagement/projects/{projectId}/stats`

특정 프로젝트의 참여 통계를 조회합니다.

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

가장 참여도가 높은 프로젝트 목록을 조회합니다.

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

**비즈니스 로직**:
- 모든 프로젝트의 참여도 점수 계산
- 점수 기준 정렬
- 상위 N개 프로젝트 반환

**참여도 점수 계산** (`calculateEngagementScore()`):
- View Duration: 최대 40점 (10초당 1점, 최대 400초)
- Scroll Depth: 최대 30점 (퍼센트 * 0.3)
- GitHub Link Click: 15점
- Demo Link Click: 15점
- 총점: 최대 100점

## 4. 데이터 모델 (Data Models)

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

## 5. Validation (검증)

### 5.1 Custom Validators

#### @ValidMongoId

MongoDB ObjectId 형식을 검증합니다.

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

**검증 규칙**:
- 24자리 16진수 문자열
- 정규식: `^[0-9a-fA-F]{24}$`

#### @ValidMongoIdList

MongoDB ObjectId 배열을 검증합니다.

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

**검증 규칙**:
- 각 요소가 유효한 MongoDB ObjectId
- `allowEmpty`: 빈 배열 허용 여부
- `maxSize`: 최대 배열 크기

#### @ValidUrl

URL 형식을 검증합니다.

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

**검증 규칙**:
- 유효한 URI 형식 (Java `URI` 클래스 사용)
- `allowEmpty`: 빈 문자열 허용 여부

#### @ValidDateRange

날짜 범위를 검증합니다.

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

**검증 규칙**:
- `endDate`가 `startDate`보다 이후여야 함
- 클래스 레벨 검증 (두 필드 비교)

### 5.2 Bean Validation

표준 Jakarta Bean Validation 어노테이션 사용:

- `@NotBlank`: null, 빈 문자열, 공백만 있는 문자열 불가
- `@NotNull`: null 불가
- `@Size(min, max)`: 문자열/컬렉션 크기 제한
- `@Email`: 이메일 형식 검증
- `@Min / @Max`: 숫자 값 범위 제한
- `@Pattern`: 정규식 패턴 검증

## 6. 에러 처리 (Error Handling)

### 6.1 ErrorCode Enum

표준화된 에러 코드를 정의합니다:

```java
public enum ErrorCode {
    // 4xx Client Errors
    VALIDATION_ERROR("VALIDATION_ERROR", "입력값 검증에 실패했습니다"),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "요청한 리소스를 찾을 수 없습니다"),
    DUPLICATE_RESOURCE("DUPLICATE_RESOURCE", "이미 존재하는 리소스입니다"),
    UNAUTHORIZED("UNAUTHORIZED", "인증이 필요합니다"),
    FORBIDDEN("FORBIDDEN", "접근 권한이 없습니다"),
    BAD_REQUEST("BAD_REQUEST", "잘못된 요청입니다"),
    INVALID_ID_FORMAT("INVALID_ID_FORMAT", "잘못된 ID 형식입니다"),
    MISSING_PARAMETER("MISSING_PARAMETER", "필수 파라미터가 누락되었습니다"),
    INVALID_PARAMETER_TYPE("INVALID_PARAMETER_TYPE", "잘못된 파라미터 타입입니다"),
    
    // 5xx Server Errors
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다"),
    DATABASE_ERROR("DATABASE_ERROR", "데이터베이스 오류가 발생했습니다"),
    EXTERNAL_SERVICE_ERROR("EXTERNAL_SERVICE_ERROR", "외부 서비스 오류가 발생했습니다"),
    
    // Authentication & Authorization
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "인증에 실패했습니다"),
    TOKEN_EXPIRED("TOKEN_EXPIRED", "토큰이 만료되었습니다"),
    TOKEN_INVALID("TOKEN_INVALID", "유효하지 않은 토큰입니다"),
    INSUFFICIENT_PERMISSIONS("INSUFFICIENT_PERMISSIONS", "권한이 부족합니다");
}
```

### 6.2 GlobalExceptionHandler

모든 예외를 중앙에서 처리합니다:

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

### 6.4 HTTP 상태 코드 매핑

| ErrorCode | HTTP Status | 설명 |
|-----------|-------------|------|
| VALIDATION_ERROR | 400 | 입력값 검증 실패 |
| RESOURCE_NOT_FOUND | 404 | 리소스 없음 |
| DUPLICATE_RESOURCE | 409 | 중복 리소스 |
| UNAUTHORIZED | 401 | 인증 필요 |
| FORBIDDEN | 403 | 권한 없음 |
| BAD_REQUEST | 400 | 잘못된 요청 |
| INTERNAL_SERVER_ERROR | 500 | 서버 오류 |
| DATABASE_ERROR | 500 | DB 오류 |
| AUTHENTICATION_FAILED | 401 | 인증 실패 |
| TOKEN_EXPIRED | 401 | 토큰 만료 |
| TOKEN_INVALID | 401 | 유효하지 않은 토큰 |

## 7. 보안 (Security)

### 7.1 CORS Configuration

`WebConfig.java`에서 CORS 설정:

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

**설정값** (환경 변수 또는 기본값):
- `cors.allowed-origins`: 허용된 오리진 목록
  - Default: `http://localhost:5173`, `http://localhost:3000`, `https://salieri009.studio`
- `cors.allowed-methods`: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`
- `cors.allowed-headers`: `Content-Type`, `Authorization`, `X-Requested-With`
- `cors.max-age`: 3600초 (1시간)
- `cors.allow-credentials`: false (기본값)

### 7.2 Security Headers

`SecurityConfig.java`에서 보안 헤더 설정:

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

**설정된 헤더**:
- `Strict-Transport-Security`: HSTS 활성화
- `X-Frame-Options: DENY`: Clickjacking 방지
- `X-Content-Type-Options: nosniff`: MIME 타입 스니핑 방지
- `Referrer-Policy`: Referrer 정보 제한

### 7.3 Input Sanitization

`InputSanitizer` 유틸리티를 통한 입력 정제:

```java
@Component
public class InputSanitizer {
    public String sanitizeText(String input) {
        // HTML 태그 제거
        // 특수 문자 이스케이프
        // XSS 방지
    }
}
```

**적용 위치**:
- `ContactService`: Contact form 입력 정제
- 모든 사용자 입력 데이터

### 7.4 Rate Limiting

Contact API에 Rate Limiting 적용 (구현 필요):

- IP 주소별 요청 제한
- 시간당 최대 요청 수 제한
- `429 Too Many Requests` 응답

### 7.5 JWT Authentication

Spring Security + JWT 토큰 기반 인증:

- Access Token: 단기 토큰 (기본 1시간)
- Refresh Token: 장기 토큰 (기본 7일)
- Token 검증: `JwtTokenProvider`
- Token 저장: 클라이언트 측 (localStorage)

## 8. 성능 최적화 (Performance Optimization)

### 8.1 Caching

TechStackService에 캐싱 적용:

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

**캐시 설정** (`CacheConfig.java`):
- Cache Manager: Caffeine
- TTL: Configurable (기본 1시간)

### 8.2 Pagination

모든 목록 API는 페이지네이션 지원:

- 기본 페이지 크기: 10
- 최대 페이지 크기: 100
- 총 개수 포함 (`total`)

### 8.3 Database Indexing

MongoDB 인덱스 설정:

- `Project`: `endDate` (정렬용), `techStackIds` (필터링용)
- `Academic`: `semester` (필터링용)
- `Resume`: `isActive` (주요 이력서 조회용)
- `ProjectEngagement`: `projectId`, `viewedAt` (통계용)

## 9. 문서화 (Documentation)

### 9.1 Swagger/OpenAPI

SpringDoc OpenAPI 3.0을 사용한 자동 문서 생성:

- **UI 경로**: `/swagger-ui.html`
- **API Docs 경로**: `/v3/api-docs`
- **어노테이션**: `@Operation`, `@ApiResponses`, `@Tag`, `@Parameter`

### 9.2 JavaDoc

모든 Controller, Service, DTO에 JavaDoc 주석:

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

## 10. 테스트 (Testing)

### 10.1 Unit Tests

- Service 레이어 단위 테스트
- Validation 로직 테스트
- Mapper 변환 테스트

### 10.2 Integration Tests

- Controller 통합 테스트
- Database 연동 테스트
- Security 설정 테스트

### 10.3 API Tests

- Postman Collection
- Swagger UI를 통한 수동 테스트
- 자동화된 API 테스트 (미구현)

## 11. 배포 및 운영 (Deployment & Operations)

### 11.1 Environment Variables

필수 환경 변수:

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

Spring Boot Actuator를 통한 헬스 체크:

- **Endpoint**: `/actuator/health`
- **Response**: `{"status": "UP"}`

### 11.3 Logging

구조화된 로깅 (SLF4J + Logback):

- 요청/응답 로깅
- 에러 로깅
- 성능 메트릭 로깅

## 12. 향후 개선 사항 (Future Improvements)

1. **Rate Limiting**: 모든 공개 엔드포인트에 Rate Limiting 적용
2. **API Monitoring**: API 사용량 및 성능 모니터링
3. **Request ID Tracking**: 모든 요청에 고유 ID 부여
4. **Circuit Breaker**: 외부 서비스 호출 시 Circuit Breaker 패턴 적용
5. **API Versioning**: v2 API 설계 및 마이그레이션 전략
6. **GraphQL**: 복잡한 쿼리를 위한 GraphQL 엔드포인트 추가 검토
7. **WebSocket**: 실시간 알림을 위한 WebSocket 지원
8. **File Upload**: 프로젝트 이미지 업로드 API 추가

## 13. 참고 자료 (References)

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Jakarta Bean Validation](https://beanvalidation.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [REST API Design Best Practices](https://restfulapi.net/)

---

**문서 버전**: 2.0.0  
**최종 업데이트**: 2025-11-15  
**작성자**: MyTechPortfolio Team
