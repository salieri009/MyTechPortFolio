# Backend Architecture 설계서

## 1. 개요

### 1.1 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Spring Boot | 3.3.4 |
| Language | Java | 21 |
| Database | MongoDB | 7.0 |
| ODM | Spring Data MongoDB | 3.3.x |
| Security | Spring Security | 6.x |
| Authentication | JWT (jjwt) | 0.12.3 |
| OAuth | Google OAuth 2.0 + GitHub OAuth (Authorization Code Exchange) | - |
| Build | Gradle | 8.10.2 |
| Documentation | Swagger/OpenAPI | 3.0 |
| Caching | Caffeine | - |
| Email | Spring Boot Mail (Gmail) | - |
| Container | Docker | - |
| Cloud | Azure Container Apps / AKS | - |

### 1.2 아키텍처 원칙

- **Layered Architecture:** Controller → Service → Repository 3계층 분리
- **Stateless Authentication:** JWT 기반, 서버 세션 미사용
- **DTO Pattern:** Entity를 API에 직접 노출하지 않고 Request/Response DTO로 분리
- **단일 책임 원칙:** 도메인별 Controller/Service/Repository 분리

### 1.3 인프라 구성

```
Client (Browser)
    │
    ▼
Azure Static Web Apps (Frontend: React SPA)
    │
    ▼ /api/v1/*
Azure Container Apps / AKS (Backend: Spring Boot)
    │
    ├── MongoDB (Azure Cosmos DB for MongoDB API)
    ├── Azure Blob Storage (파일 저장)
    └── External APIs (Google OAuth, GitHub OAuth, EmailJS)
```

---

## 2. 프로젝트 구조

```
backend/
├── src/main/java/com/mytechfolio/portfolio/
│   ├── PortfolioApplication.java          # Spring Boot 메인 클래스
│   │
│   ├── config/                            # 설정 클래스
│   │   ├── ApplicationConfig.java         # 앱 기본 설정
│   │   ├── CacheConfig.java               # Caffeine 캐시 설정
│   │   ├── DataInitializerConfig.java      # 초기 데이터 로딩
│   │   ├── DataLoaderConfig.java          # 데이터 로더
│   │   ├── EmailConfig.java               # 이메일 발송 설정
│   │   ├── EnvironmentValidationConfig.java # 환경변수 검증
│   │   ├── LoggingConfig.java             # 로깅 설정
│   │   ├── MongoConfig.java               # MongoDB 연결 설정
│   │   ├── PerformanceConfig.java         # 성능 모니터링 설정
│   │   ├── PerformanceMonitoringConfig.java
│   │   ├── SwaggerConfig.java             # OpenAPI/Swagger 설정
│   │   └── WebConfig.java                 # CORS, 인터셉터 설정
│   │
│   ├── constants/                         # 상수 정의
│   │   ├── ApiConstants.java              # API 경로, 페이징, CORS 설정
│   │   ├── ErrorCode.java                 # 에러 코드 Enum
│   │   └── SecurityConstants.java         # 보안 관련 상수
│   │
│   ├── controller/                        # REST API 엔드포인트
│   │   ├── base/
│   │   │   └── AbstractCrudController.java # 공통 CRUD 컨트롤러 추상 클래스
│   │   ├── AuthController.java            # 인증 (OAuth, JWT)
│   │   ├── AcademicController.java        # 학업 CRUD
│   │   ├── ContactController.java         # 연락 폼
│   │   ├── JourneyMilestoneController.java # 마일스톤 CRUD
│   │   ├── PerformanceController.java     # 성능 모니터링
│   │   ├── ProjectController.java         # 프로젝트 CRUD + 필터
│   │   ├── ProjectEngagementController.java # 참여도 추적
│   │   ├── ProjectMediaController.java    # 미디어 업로드/관리
│   │   ├── ResumeController.java          # 이력서 관리
│   │   ├── SeoController.java             # SEO 메타 태그
│   │   ├── TechStackController.java       # 기술 스택 조회
│   │   └── TestimonialController.java     # 추천사 CRUD
│   │
│   ├── domain/                            # MongoDB 엔티티 (Document)
│   │   ├── Academic.java
│   │   ├── Contact.java
│   │   ├── JourneyMilestone.java          # + CodeMetrics, KeyAchievement, SkillLevel (embedded)
│   │   ├── Project.java
│   │   ├── ProjectEngagement.java
│   │   ├── ProjectMedia.java
│   │   ├── Resume.java
│   │   ├── TechStack.java
│   │   ├── Testimonial.java
│   │   ├── User.java
│   │   └── admin/
│   │       └── AdminUser.java             # + AdminRole enum
│   │
│   ├── dto/                               # Data Transfer Objects
│   │   ├── auth/                          # 인증 관련 DTO
│   │   │   ├── GoogleLoginRequest.java
│   │   │   ├── GitHubLoginRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   └── TwoFactorVerificationRequest.java
│   │   ├── request/                       # 요청 DTO
│   │   │   ├── ProjectCreateRequest.java
│   │   │   ├── ProjectUpdateRequest.java
│   │   │   ├── AcademicCreateRequest.java
│   │   │   ├── AcademicUpdateRequest.java
│   │   │   └── ...
│   │   └── response/                      # 응답 DTO
│   │       ├── ApiResponse.java           # 표준 응답 래퍼
│   │       ├── PageResponse.java          # 페이지네이션 응답
│   │       ├── ProjectSummaryResponse.java
│   │       ├── ProjectDetailResponse.java
│   │       └── ...
│   │
│   ├── exception/                         # 예외 처리
│   │   ├── GlobalExceptionHandler.java    # @ControllerAdvice 전역 예외 핸들러
│   │   ├── ResourceNotFoundException.java # 404 예외
│   │   └── DuplicateResourceException.java # 409 예외
│   │
│   ├── filter/                            # 서블릿 필터
│   │   └── PerformanceMonitoringFilter.java
│   │
│   ├── mapper/                            # Entity ↔ DTO 변환
│   │   ├── EntityMapper.java              # 공통 매퍼 인터페이스
│   │   ├── ProjectMapper.java
│   │   ├── AcademicMapper.java
│   │   └── ...
│   │
│   ├── repository/                        # MongoDB Repository
│   │   ├── ProjectRepository.java
│   │   ├── AcademicRepository.java
│   │   ├── TechStackRepository.java
│   │   ├── ContactRepository.java
│   │   ├── TestimonialRepository.java
│   │   ├── ResumeRepository.java
│   │   ├── JourneyMilestoneRepository.java
│   │   ├── ProjectEngagementRepository.java
│   │   ├── ProjectMediaRepository.java
│   │   ├── UserRepository.java
│   │   └── admin/
│   │       └── AdminUserRepository.java
│   │
│   ├── security/                          # 보안 모듈
│   │   ├── config/
│   │   │   └── SecurityConfig.java        # Spring Security 필터 체인 설정
│   │   ├── filter/
│   │   │   └── JwtAuthenticationFilter.java # JWT 인증 필터
│   │   ├── service/
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── GoogleOAuthService.java
│   │   │   └── GitHubOAuthService.java
│   │   ├── util/
│   │   │   ├── JwtUtil.java               # JWT 생성/검증 유틸
│   │   │   └── TwoFactorAuthUtil.java     # 2FA TOTP 유틸
│   │   ├── dto/
│   │   ├── entity/
│   │   │   └── Role.java
│   │   └── repository/
│   │       └── RoleRepository.java
│   │
│   ├── service/                           # 비즈니스 로직
│   │   ├── BaseService.java               # 공통 서비스 인터페이스
│   │   ├── BaseServiceImpl.java           # 공통 CRUD 구현
│   │   ├── ProjectService.java
│   │   ├── AcademicService.java
│   │   ├── TechStackService.java          # + Caffeine 캐시 (1시간 TTL)
│   │   ├── ContactService.java
│   │   ├── TestimonialService.java
│   │   ├── ResumeService.java
│   │   ├── JourneyMilestoneService.java
│   │   ├── ProjectEngagementService.java
│   │   ├── ProjectMediaService.java
│   │   ├── EmailService.java
│   │   ├── SeoService.java
│   │   └── storage/
│   │       └── StorageService.java        # 파일 저장 (Azure Blob / Local)
│   │
│   ├── util/                              # 유틸리티
│   │   ├── DateUtil.java
│   │   ├── InputSanitizer.java            # 입력값 세정
│   │   ├── PaginationUtil.java            # 페이지네이션 헬퍼
│   │   ├── PerformanceMetrics.java
│   │   ├── ResponseUtil.java              # 표준 응답 생성 헬퍼
│   │   └── StringUtil.java
│   │
│   └── validation/                        # 커스텀 검증
│       ├── ValidMongoId.java              # @ValidMongoId 어노테이션
│       ├── ValidMongoIdList.java          # @ValidMongoIdList 어노테이션
│       ├── ValidUrl.java                  # @ValidUrl 어노테이션
│       ├── ValidDateRange.java            # @ValidDateRange 어노테이션
│       ├── MongoIdValidator.java
│       ├── MongoIdListValidator.java
│       ├── UrlValidator.java
│       ├── DateRangeValidator.java
│       └── ValidationService.java
│
├── src/main/resources/
│   └── application.yml                    # Spring Boot 설정
│
├── src/test/java/                         # 테스트
├── build.gradle                           # Gradle 빌드 설정
├── Dockerfile                             # Docker 이미지 빌드
└── gradlew                                # Gradle 래퍼
```

---

## 3. Core 모듈

### 3.1 ApiConstants (상수)

| 상수 | 값 | 설명 |
|------|-----|------|
| API_VERSION | "v1" | API 버전 |
| API_BASE_PATH | "/api/v1" | 기본 경로 |
| DEFAULT_PAGE_NUMBER | 1 | 기본 페이지 번호 (1-based) |
| DEFAULT_PAGE_SIZE | 10 | 기본 페이지 크기 |
| MAX_PAGE_SIZE | 100 | 최대 페이지 크기 |
| DEFAULT_SORT_FIELD | "endDate" | 기본 정렬 필드 |
| DEFAULT_SORT_DIRECTION | "DESC" | 기본 정렬 방향 |
| CORS_MAX_AGE | 3600L | CORS 캐시 시간 (1시간) |

### 3.2 ErrorCode (에러 코드)

**클라이언트 에러:**

| 코드 | HTTP | 설명 |
|------|------|------|
| VALIDATION_ERROR | 400 | 입력값 검증 실패 |
| BAD_REQUEST | 400 | 잘못된 요청 |
| INVALID_ID_FORMAT | 400 | 잘못된 ID 형식 |
| MISSING_PARAMETER | 400 | 필수 파라미터 누락 |
| INVALID_PARAMETER_TYPE | 400 | 잘못된 파라미터 타입 |
| UNAUTHORIZED | 401 | 인증 필요 |
| AUTHENTICATION_FAILED | 401 | 인증 실패 |
| TOKEN_EXPIRED | 401 | 토큰 만료 |
| TOKEN_INVALID | 401 | 유효하지 않은 토큰 |
| FORBIDDEN | 403 | 접근 권한 없음 |
| INSUFFICIENT_PERMISSIONS | 403 | 권한 부족 |
| RESOURCE_NOT_FOUND | 404 | 리소스 없음 |
| DUPLICATE_RESOURCE | 409 | 중복 리소스 |

**서버 에러:**

| 코드 | HTTP | 설명 |
|------|------|------|
| INTERNAL_SERVER_ERROR | 500 | 서버 내부 오류 |
| DATABASE_ERROR | 500 | 데이터베이스 오류 |
| EXTERNAL_SERVICE_ERROR | 502 | 외부 서비스 오류 |

### 3.3 ResponseUtil (응답 헬퍼)

표준 응답 구조 `ApiResponse<T>`:

```json
{
  "success": true,
  "data": { },
  "message": "Optional message",
  "error": null,
  "errorCode": null,
  "errors": null,
  "metadata": {
    "timestamp": "2026-02-24T10:30:00Z",
    "version": "v1",
    "requestId": "uuid"
  }
}
```

---

## 4. 인증/인가

### 4.1 JWT 구조

| 토큰 | 내용 | 만료 |
|------|------|------|
| Access Token | userId, email, role | 24시간 (86400000ms) |
| Refresh Token | userId | 7일 (604800000ms) |

- **암호화:** BCrypt (strength=12)
- **전송:** `Authorization: Bearer {token}` 헤더

### 4.2 Security Filter Chain

```
Request → CORS Filter → JwtAuthenticationFilter → SecurityConfig
    ├── Public Endpoints → permitAll
    ├── Admin Endpoints → hasRole(ADMIN)
    └── Protected Endpoints → authenticated
```

### 4.3 Public Endpoints (인증 불필요)

```
/api/v1/auth/**
/api/v1/projects/**
/api/v1/academics/**
/api/v1/techstacks/**
/api/v1/journey-milestones/**
/api/v1/seo/**
/api/v1/testimonials/**
/uploads/**
/swagger-ui/**
/v3/api-docs/**
/actuator/health
/actuator/info
```

### 4.4 보안 헤더

| 헤더 | 값 | 목적 |
|------|-----|------|
| HSTS | max-age=31536000; includeSubDomains | HTTPS 강제 |
| X-Frame-Options | DENY | 클릭재킹 방지 |
| X-Content-Type-Options | nosniff | MIME 스니핑 방지 |
| X-XSS-Protection | 1; mode=block | XSS 보호 |
| Referrer-Policy | strict-origin-when-cross-origin | 리퍼러 제한 |

### 4.5 CORS 설정

| 설정 | 값 |
|------|-----|
| Allowed Origins | localhost:5173, localhost:3000, salieri009.studio |
| Allowed Methods | GET, POST, PUT, DELETE, OPTIONS, PATCH |
| Allowed Headers | Content-Type, Authorization, X-Requested-With, X-Request-ID |
| Max Age | 3600초 |

### 4.6 Rate Limiting

| 대상 | 제한 |
|------|------|
| 일반 API | 분당 60회 |
| 인증 API | 분당 5회 |
| 최대 세션 | 사용자당 5개 |
| 세션 타임아웃 | 30분 |

---

## 5. Services 구조

### 5.1 공통 패턴

- `BaseService<T>`: CRUD 공통 인터페이스
- `BaseServiceImpl<T>`: 공통 구현 (findAll, findById, create, update, delete)
- 각 도메인 서비스가 BaseService를 확장하여 도메인 특화 로직 추가

### 5.2 주요 Services

| Service | 역할 |
|---------|------|
| ProjectService | 프로젝트 CRUD + 필터링 + 페이지네이션 |
| AcademicService | 학업 CRUD + 학기별 필터 |
| TechStackService | 기술 스택 조회 + Caffeine 캐시 (TTL 1시간) |
| ContactService | 연락 폼 제출 + 스팸 검사 + IP 해싱 |
| TestimonialService | 추천사 CRUD + featured/type/rating 필터 |
| ResumeService | 이력서 관리 + 다운로드 카운트 |
| JourneyMilestoneService | 마일스톤 CRUD + status별 조회 |
| ProjectEngagementService | 참여도 생성/업데이트 + 통계 집계 |
| ProjectMediaService | 미디어 업로드/관리 + 갤러리 순서 |
| SeoService | locale별 동적 SEO 메타 태그 생성 |
| EmailService | 이메일 발송 (Gmail SMTP) |
| StorageService | 파일 저장 (Azure Blob / 로컬) |

---

## 6. 파일 업로드/다운로드

### 6.1 미디어 업로드

- **엔드포인트:** `POST /api/v1/projects/{projectId}/media`
- **형식:** Multipart Form Data (file + metadata)
- **저장:** StorageService → Azure Blob Storage 또는 로컬 파일시스템
- **메타데이터:** ProjectMedia 문서로 MongoDB에 저장

### 6.2 이력서 다운로드

- **엔드포인트:** `GET /api/v1/resumes/{id}/download`
- **동작:** 파일 전송 + downloadCount 자동 증가 + lastDownloadedAt 업데이트

---

## 7. 테스트

| 항목 | 설명 |
|------|------|
| Framework | JUnit 5 + Spring Boot Test |
| Database | Testcontainers (MongoDB) |
| Coverage | JaCoCo 리포트 |
| 위치 | `src/test/java/` |

---

## 8. 배포

| 항목 | 설명 |
|------|------|
| Container | `Dockerfile` — Multi-stage build (Gradle build → JRE runtime) |
| Registry | Azure Container Registry (ACR) |
| Runtime | Azure Container Apps 또는 AKS (Kubernetes) |
| Health Check | `/actuator/health` (Spring Boot Actuator) |
| API Docs | `/swagger-ui.html`, `/v3/api-docs` |
| CI/CD | GitHub Actions + Azure Pipelines |
| Security Scan | Trivy (컨테이너), Snyk (의존성) |
| Environments | Dev → Staging → Production (3단계) |
