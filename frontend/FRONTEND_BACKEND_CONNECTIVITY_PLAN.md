# Frontend-Backend Connectivity Plan
## 30년차 DevOps Engineer & Software Engineer 관점

## 참고 자료
- 현재 코드베이스 분석
- Spring Boot 3.3.4 + React + TypeScript 스택
- Docker Compose 기반 배포
- MongoDB 데이터베이스

## 1. 아키텍처 개요

### 1.1 현재 아키텍처 분석

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │         │   MongoDB       │
│   (React)       │◄───────►│   (Spring Boot) │◄───────►│   (Database)    │
│   Port: 5173    │  HTTP   │   Port: 8080    │  TCP    │   Port: 27017   │
│   (Dev)         │  /api   │   /api/v1       │         │                 │
│   Port: 80      │         │                 │         │                 │
│   (Prod/Nginx)  │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### 1.2 통신 흐름

**개발 환경**:
```
Frontend (localhost:5173)
  └─> Vite Proxy (/api)
      └─> Backend (localhost:8080/api/v1)
```

**프로덕션 환경**:
```
Frontend (Nginx:80)
  └─> API Gateway/Reverse Proxy
      └─> Backend (8080/api/v1)
```

### 1.3 API 엔드포인트 구조

```
/api/v1/
├── /auth          # 인증 (JWT, Google OAuth)
├── /projects      # 프로젝트 관리
├── /academics     # 학업 정보
├── /testimonials  # 추천사
├── /contact       # 연락처
├── /tech-stacks   # 기술 스택
├── /resume        # 이력서
├── /performance   # 성능 모니터링
└── /actuator      # Spring Actuator (헬스체크)
```

## 2. API 설계 표준 (RESTful Best Practices)

### 2.1 응답 포맷 표준화

**성공 응답**:
```typescript
interface ApiResponse<T> {
  success: boolean;        // 항상 true
  data: T;                // 실제 데이터
  error: null;            // 항상 null
  message?: string;       // 선택적 성공 메시지
  metadata?: {
    timestamp: string;    // ISO 8601 형식
    version: string;      // API 버전
    requestId: string;    // 요청 추적 ID
  };
}
```

**에러 응답**:
```typescript
interface ApiErrorResponse {
  success: boolean;        // 항상 false
  data: null;             // 항상 null
  error: string;          // 에러 메시지
  errorCode?: string;     // 에러 코드 (선택)
  errors?: Record<string, string>;  // 필드별 검증 에러
  metadata?: {
    timestamp: string;
    version: string;
    requestId: string;
    path: string;         // 요청 경로
  };
}
```

**페이지네이션 응답**:
```typescript
interface PageResponse<T> {
  items: T[];
  pagination: {
    page: number;         // 현재 페이지 (1-based)
    size: number;         // 페이지 크기
    totalPages: number;   // 전체 페이지 수
    totalItems: number;   // 전체 항목 수
    hasNext: boolean;     // 다음 페이지 존재 여부
    hasPrevious: boolean; // 이전 페이지 존재 여부
  };
}
```

### 2.2 HTTP 상태 코드 표준

| 상태 코드 | 의미 | 사용 시나리오 |
|---------|------|------------|
| 200 | OK | 성공적인 GET, PUT, PATCH 요청 |
| 201 | Created | 성공적인 POST 요청 (리소스 생성) |
| 204 | No Content | 성공적인 DELETE 요청 |
| 400 | Bad Request | 잘못된 요청 (검증 실패) |
| 401 | Unauthorized | 인증 실패 (JWT 토큰 없음/만료) |
| 403 | Forbidden | 권한 없음 (인증은 되었으나 권한 부족) |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 409 | Conflict | 리소스 충돌 (중복 생성 등) |
| 422 | Unprocessable Entity | 비즈니스 로직 검증 실패 |
| 429 | Too Many Requests | Rate limit 초과 |
| 500 | Internal Server Error | 서버 내부 오류 |
| 502 | Bad Gateway | 게이트웨이 오류 |
| 503 | Service Unavailable | 서비스 일시 중단 |

### 2.3 요청/응답 헤더 표준

**필수 요청 헤더**:
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  (인증 필요 시)
X-Request-ID: <UUID>              (선택, 요청 추적용)
```

**응답 헤더**:
```
Content-Type: application/json
X-Request-ID: <UUID>              (요청 추적)
X-Response-Time: <ms>              (응답 시간)
X-Rate-Limit-Remaining: <count>   (Rate limit)
X-API-Version: v1                  (API 버전)
```

## 3. 보안 계층 (Security Layers)

### 3.1 인증 및 인가 (Authentication & Authorization)

**JWT 토큰 기반 인증**:
```typescript
// Frontend: apiClient.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Backend: JwtAuthenticationFilter
// - 토큰 검증
// - 만료 시간 확인
// - 권한 확인
```

**토큰 갱신 전략**:
```typescript
// Refresh token flow
if (response.status === 401) {
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) {
    // 자동 토큰 갱신
    const newToken = await refreshAccessToken(refreshToken)
    localStorage.setItem('token', newToken)
    // 원래 요청 재시도
    return api(originalRequest)
  } else {
    // 로그인 페이지로 리다이렉트
    redirectToLogin()
  }
}
```

### 3.2 CORS 정책 (Cross-Origin Resource Sharing)

**현재 설정** (`WebConfig.java`):
```java
registry.addMapping("/api/v1/**")
    .allowedOriginPatterns(allowedOrigins)  // 환경별 설정
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
    .allowedHeaders("Content-Type", "Authorization", "X-Requested-With", "X-Request-ID")
    .allowCredentials(false)  // JWT 사용 시 false 권장
    .maxAge(3600)
    .exposedHeaders("X-Request-ID", "X-Response-Time", "X-Rate-Limit-Remaining")
```

**개선 사항**:
- 프로덕션 환경에서는 특정 도메인만 허용
- 개발 환경에서는 localhost 허용
- 환경 변수로 관리 (`CORS_ALLOWED_ORIGINS`)

### 3.3 Rate Limiting (요청 제한)

**백엔드 구현 필요**:
```java
@Configuration
public class RateLimitConfig {
    // IP 기반 Rate Limiting
    // - 일반 API: 100 requests/minute
    // - 인증 API: 5 requests/minute
    // - 관리자 API: 1000 requests/minute
}
```

**프론트엔드 대응**:
```typescript
// 429 에러 처리
if (status === 429) {
  const retryAfter = response.headers['retry-after']
  showError(`Too many requests. Please try again after ${retryAfter} seconds.`)
}
```

### 3.4 입력 검증 (Input Validation)

**백엔드**:
```java
@PostMapping
public ResponseEntity<ApiResponse<ProjectResponse>> create(
    @Valid @RequestBody ProjectCreateRequest request
) {
    // @Valid 어노테이션으로 자동 검증
    // Bean Validation (Jakarta Validation) 사용
}
```

**프론트엔드**:
```typescript
// 클라이언트 사이드 검증 (사용자 경험 향상)
// 백엔드 검증은 필수 (보안)
const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})
```

## 4. 에러 처리 및 복원력 (Error Handling & Resilience)

### 4.1 에러 처리 전략

**백엔드 글로벌 예외 처리**:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(ValidationException e) {
        return ResponseEntity.status(400)
            .body(ApiErrorResponse.builder()
                .success(false)
                .error(e.getMessage())
                .errors(e.getFieldErrors())
                .build());
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(404)
            .body(ApiErrorResponse.builder()
                .success(false)
                .error(e.getMessage())
                .build());
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception e) {
        // 로깅
        log.error("Unexpected error", e);
        // 사용자에게는 일반적인 메시지
        return ResponseEntity.status(500)
            .body(ApiErrorResponse.builder()
                .success(false)
                .error("An unexpected error occurred")
                .build());
    }
}
```

**프론트엔드 에러 처리**:
```typescript
// apiClient.ts - 이미 구현됨
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 네트워크 에러
    if (!error.response) {
      return handleNetworkError(error)
    }
    
    // HTTP 상태 코드별 처리
    switch (error.response.status) {
      case 401: return handleUnauthorized(error)
      case 403: return handleForbidden(error)
      case 404: return handleNotFound(error)
      case 429: return handleRateLimit(error)
      case 500: return handleServerError(error)
      default: return handleGenericError(error)
    }
  }
)
```

### 4.2 재시도 전략 (Retry Strategy)

**현재 구현** (`apiClient.ts`):
- 지수 백오프 (Exponential Backoff)
- 최대 3회 재시도
- 5xx 에러만 재시도
- 4xx 에러는 재시도하지 않음

**개선 사항**:
```typescript
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,  // 1초
  retryableStatuses: [500, 502, 503, 504],
  retryableMethods: ['GET', 'POST', 'PUT', 'PATCH'],
  // DELETE는 재시도하지 않음 (멱등성 문제)
}
```

### 4.3 서킷 브레이커 (Circuit Breaker) - 향후 구현

**목적**: 백엔드 장애 시 프론트엔드 보호

```typescript
// Circuit Breaker 패턴
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  private failureCount: number = 0
  private lastFailureTime: number = 0
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > 60000) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }
    
    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
}
```

## 5. 성능 최적화

### 5.1 요청 최적화

**배치 요청 (Batch Requests)**:
```typescript
// 여러 리소스를 한 번에 요청
POST /api/v1/projects/batch
{
  "ids": ["id1", "id2", "id3"]
}
```

**필드 선택 (Field Selection)**:
```typescript
// 필요한 필드만 요청
GET /api/v1/projects?fields=id,name,summary
```

**조건부 요청 (Conditional Requests)**:
```typescript
// ETag 기반 캐싱
GET /api/v1/projects/123
If-None-Match: "etag-value"

// 304 Not Modified 응답 시 캐시 사용
```

### 5.2 응답 최적화

**압축 (Compression)**:
```java
// Backend: application.properties
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain
server.compression.min-response-size=1024
```

**캐싱 전략**:
```typescript
// HTTP 캐싱 헤더
Cache-Control: public, max-age=3600  // 정적 데이터
Cache-Control: no-cache              // 동적 데이터
ETag: "version-hash"                 // 버전 관리
```

**페이지네이션 최적화**:
```typescript
// 커서 기반 페이지네이션 (대용량 데이터)
GET /api/v1/projects?cursor=lastId&limit=20

// 오프셋 기반 페이지네이션 (현재 구현)
GET /api/v1/projects?page=1&size=20
```

### 5.3 연결 풀링 (Connection Pooling)

**MongoDB 연결 풀**:
```properties
# application.properties
spring.data.mongodb.connection-pool.max-size=100
spring.data.mongodb.connection-pool.min-size=5
spring.data.mongodb.connection-pool.max-wait-time=5000
```

**HTTP 클라이언트 풀** (프론트엔드):
```typescript
// Axios는 기본적으로 연결 재사용
// Keep-Alive 헤더 자동 처리
```

## 6. 모니터링 및 관찰 가능성 (Monitoring & Observability)

### 6.1 로깅 전략

**구조화된 로깅 (Structured Logging)**:
```java
// Backend: Logback/SLF4J
log.info("API request received", 
    kv("method", request.getMethod()),
    kv("path", request.getRequestURI()),
    kv("requestId", requestId),
    kv("userId", userId)
)
```

**프론트엔드 로깅**:
```typescript
// 개발 환경: 상세 로깅
// 프로덕션: 에러만 로깅
if (import.meta.env.DEV) {
  console.log('API Request:', { method, url, data })
} else {
  // 에러만 Sentry/LogRocket 등으로 전송
}
```

### 6.2 메트릭 수집 (Metrics Collection)

**백엔드 메트릭** (Spring Actuator):
```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.metrics.export.prometheus.enabled=true
```

**수집할 메트릭**:
- API 응답 시간 (P50, P95, P99)
- 요청 수 (QPS)
- 에러율 (4xx, 5xx)
- 데이터베이스 쿼리 시간
- JVM 메모리 사용량
- 활성 연결 수

**프론트엔드 메트릭**:
```typescript
// 성능 API 사용
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'navigation') {
      // 페이지 로드 시간
    }
    if (entry.entryType === 'resource') {
      // API 응답 시간
    }
  }
})
```

### 6.3 분산 추적 (Distributed Tracing)

**요청 ID 전파**:
```typescript
// Frontend: 요청 ID 생성
const requestId = crypto.randomUUID()
config.headers['X-Request-ID'] = requestId

// Backend: 요청 ID 로깅
MDC.put("requestId", requestId)
```

**구현 계획**:
- OpenTelemetry 통합
- Jaeger/Zipkin 추적
- 요청 전체 라이프사이클 추적

## 7. CI/CD 및 배포 전략

### 7.1 CI/CD 파이프라인 구조

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Git Push  │───►│   Build     │───►│   Test      │───►│   Deploy    │
│             │    │   (Docker)  │    │   (Unit/    │    │   (Docker   │
│             │    │             │    │    E2E)     │    │    Compose) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 7.2 GitHub Actions 워크플로우

**Backend CI/CD**:
```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      - name: Build with Gradle
        run: cd backend && ./gradlew build
      - name: Run tests
        run: cd backend && ./gradlew test
      - name: Build Docker image
        run: docker build -t portfolio-backend:latest ./backend
      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push portfolio-backend:latest
```

**Frontend CI/CD**:
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run linter
        run: cd frontend && npm run lint
      - name: Run tests
        run: cd frontend && npm run test
      - name: Build
        run: cd frontend && npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      - name: Build Docker image
        run: docker build -t portfolio-frontend:latest ./frontend
      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push portfolio-frontend:latest
```

### 7.3 배포 전략

**Blue-Green 배포**:
```
Production (Green)
  └─> Deploy to Blue
  └─> Health Check
  └─> Switch Traffic
  └─> Keep Green as Backup
```

**롤링 업데이트** (Docker Compose):
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      update_config:
        parallelism: 1      # 한 번에 1개씩 업데이트
        delay: 10s          # 10초 대기
        failure_action: rollback
        monitor: 60s        # 60초 모니터링
```

## 8. 환경 관리 (Environment Management)

### 8.1 환경 변수 관리

**Backend 환경 변수**:
```properties
# application-dev.properties
server.port=8080
spring.data.mongodb.uri=mongodb://localhost:27017/portfolio_dev
cors.allowed-origins=http://localhost:5173,http://localhost:3000

# application-prod.properties
server.port=8080
spring.data.mongodb.uri=${MONGODB_URI}
cors.allowed-origins=${CORS_ALLOWED_ORIGINS}
```

**Frontend 환경 변수**:
```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=dev-client-id
VITE_USE_BACKEND_API=true

# .env.production
VITE_API_BASE_URL=https://api.example.com/api
VITE_GOOGLE_CLIENT_ID=prod-client-id
VITE_USE_BACKEND_API=true
```

### 8.2 시크릿 관리 (Secrets Management)

**개발 환경**:
- `.env` 파일 (Git에 포함하지 않음)
- `.env.example` 템플릿 제공

**프로덕션 환경**:
- Docker Secrets
- 환경 변수 주입
- Kubernetes Secrets (향후)
- AWS Secrets Manager / Azure Key Vault (향후)

### 8.3 설정 검증 (Configuration Validation)

**Backend**:
```java
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    @NotBlank
    private String jwtSecret;
    
    @Min(1000)
    @Max(3600000)
    private long jwtValidity;
    
    // 애플리케이션 시작 시 검증
}
```

**Frontend**:
```typescript
// 환경 변수 검증
const requiredEnvVars = ['VITE_API_BASE_URL']
requiredEnvVars.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})
```

## 9. 테스트 전략

### 9.1 백엔드 테스트

**단위 테스트**:
```java
@SpringBootTest
class ProjectControllerTest {
    @MockBean
    private ProjectService projectService;
    
    @Test
    void testGetProjects() {
        // Given
        when(projectService.getProjects(any(), any(), any(), any(), any()))
            .thenReturn(mockPageResponse);
        
        // When
        ResponseEntity<ApiResponse<PageResponse<ProjectSummaryResponse>>> response = 
            projectController.getProjects(1, 10, "endDate,desc", null, null);
        
        // Then
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }
}
```

**통합 테스트**:
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class ProjectApiIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetProjectsIntegration() throws Exception {
        mockMvc.perform(get("/api/v1/projects")
                .param("page", "1")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }
}
```

**E2E 테스트** (Testcontainers):
```java
@SpringBootTest
@Testcontainers
class ProjectE2ETest {
    @Container
    static MongoDBContainer mongoDB = new MongoDBContainer("mongo:7.0");
    
    @Test
    void testFullFlow() {
        // 실제 데이터베이스와 통신하는 E2E 테스트
    }
}
```

### 9.2 프론트엔드 테스트

**단위 테스트** (React Testing Library):
```typescript
describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText(mockProject.name)).toBeInTheDocument()
  })
})
```

**통합 테스트** (MSW - Mock Service Worker):
```typescript
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/v1/projects', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: { items: mockProjects, pagination: {...} }
    }))
  })
)

test('loads and displays projects', async () => {
  render(<ProjectsPage />)
  await waitFor(() => {
    expect(screen.getByText('Project 1')).toBeInTheDocument()
  })
})
```

**E2E 테스트** (Playwright/Cypress):
```typescript
// Playwright
test('user can view projects', async ({ page }) => {
  await page.goto('http://localhost:5173/projects')
  await expect(page.locator('[data-testid="project-card"]')).toBeVisible()
})
```

### 9.3 API 계약 테스트 (Contract Testing)

**Pact 테스트**:
```typescript
// Frontend: Consumer Contract
const pact = new Pact({
  consumer: 'Frontend',
  provider: 'Backend',
})

await pact.addInteraction({
  state: 'projects exist',
  uponReceiving: 'a request for projects',
  withRequest: {
    method: 'GET',
    path: '/api/v1/projects',
  },
  willRespondWith: {
    status: 200,
    body: {
      success: true,
      data: { items: [...] }
    }
  }
})
```

## 10. 문서화 (Documentation)

### 10.1 API 문서 (OpenAPI/Swagger)

**현재 구현**:
- SpringDoc OpenAPI 3
- `/swagger-ui.html` 접근
- `/api-docs` JSON 스펙

**개선 사항**:
- 모든 엔드포인트 문서화
- 요청/응답 예제 추가
- 에러 응답 예제 추가
- 인증 방법 설명

### 10.2 코드 문서화

**Backend**:
```java
/**
 * 프로젝트 목록을 조회합니다.
 * 
 * @param page 페이지 번호 (1부터 시작)
 * @param size 페이지 크기 (1-100)
 * @param sort 정렬 기준 (field,direction)
 * @param techStacks 기술 스택 필터 (쉼표로 구분)
 * @param year 연도 필터
 * @return 페이지네이션된 프로젝트 목록
 * 
 * @apiNote 
 * - 기본 정렬: endDate,desc
 * - 최대 페이지 크기: 100
 * - 기술 스택 필터는 AND 조건
 */
@GetMapping
public ResponseEntity<ApiResponse<PageResponse<ProjectSummaryResponse>>> getProjects(...)
```

**Frontend**:
```typescript
/**
 * 프로젝트 목록을 조회합니다.
 * 
 * @param params - 쿼리 파라미터
 * @param params.page - 페이지 번호 (기본값: 1)
 * @param params.size - 페이지 크기 (기본값: 10)
 * @param params.techStacks - 기술 스택 필터 배열
 * @param params.year - 연도 필터
 * @returns 프로젝트 목록 응답
 * 
 * @throws {ApiError} API 에러 발생 시
 * 
 * @example
 * ```typescript
 * const projects = await getProjects({ page: 1, size: 10 })
 * ```
 */
export async function getProjects(params: ProjectQueryParams): Promise<ApiResponse<PageResponse<ProjectSummary>>>
```

## 11. 구현 우선순위 (30년차 엔지니어 관점)

### Phase 1: 핵심 안정성 (1-2주)
1. ✅ **에러 처리 표준화**
   - 글로벌 예외 처리기
   - 일관된 에러 응답 포맷
   - 프론트엔드 에러 처리 개선

2. ✅ **로깅 시스템**
   - 구조화된 로깅
   - 요청 ID 전파
   - 로그 집계 시스템

3. ✅ **환경 변수 관리**
   - 환경별 설정 분리
   - 시크릿 관리
   - 설정 검증

### Phase 2: 성능 및 모니터링 (2-3주)
4. **메트릭 수집**
   - Spring Actuator 설정
   - Prometheus 통합
   - 대시보드 구성

5. **캐싱 전략**
   - HTTP 캐싱 헤더
   - 프론트엔드 캐싱
   - Redis 통합 (선택)

6. **성능 최적화**
   - 데이터베이스 쿼리 최적화
   - 연결 풀 튜닝
   - 응답 압축

### Phase 3: 고급 기능 (3-4주)
7. **Rate Limiting**
   - IP 기반 제한
   - 사용자 기반 제한
   - 프론트엔드 대응

8. **서킷 브레이커**
   - Resilience4j 통합
   - 장애 격리
   - 폴백 메커니즘

9. **분산 추적**
   - OpenTelemetry 통합
   - 요청 추적
   - 성능 분석

### Phase 4: CI/CD 및 자동화 (2-3주)
10. **CI/CD 파이프라인**
    - GitHub Actions 설정
    - 자동 테스트
    - 자동 배포

11. **테스트 자동화**
    - 단위 테스트 커버리지 80%+
    - 통합 테스트
    - E2E 테스트

12. **문서화**
    - API 문서 완성
    - 아키텍처 다이어그램
    - 운영 가이드

## 12. 체크리스트 (30년차 엔지니어 관점)

### 보안
- [x] JWT 인증 구현
- [x] CORS 정책 설정
- [ ] Rate Limiting 구현
- [ ] 입력 검증 (백엔드)
- [ ] SQL Injection 방지 (MongoDB는 NoSQL이지만 유사 취약점 방지)
- [ ] XSS 방지 (프론트엔드)
- [ ] CSRF 방지 (JWT 사용 시 불필요하지만 확인)

### 성능
- [x] 연결 풀링 (MongoDB)
- [ ] HTTP 캐싱 헤더
- [ ] 응답 압축
- [ ] 데이터베이스 인덱싱
- [ ] 쿼리 최적화
- [ ] 페이지네이션

### 안정성
- [x] 에러 처리 표준화
- [x] 재시도 로직
- [ ] 서킷 브레이커
- [ ] 타임아웃 설정
- [ ] Health Check
- [ ] Graceful Shutdown

### 모니터링
- [ ] 구조화된 로깅
- [ ] 메트릭 수집
- [ ] 분산 추적
- [ ] 알림 시스템
- [ ] 대시보드

### 테스트
- [ ] 단위 테스트 (백엔드 80%+)
- [ ] 단위 테스트 (프론트엔드 80%+)
- [ ] 통합 테스트
- [ ] E2E 테스트
- [ ] 성능 테스트
- [ ] 보안 테스트

### 문서화
- [x] API 문서 (Swagger)
- [ ] 아키텍처 문서
- [ ] 운영 가이드
- [ ] 트러블슈팅 가이드
- [ ] 코드 주석

## 13. 기술 스택 및 도구

### 현재 사용 중
- **Frontend**: React, TypeScript, Vite, Axios
- **Backend**: Spring Boot 3.3.4, Java 21, MongoDB
- **인증**: JWT, Google OAuth
- **배포**: Docker, Docker Compose
- **API 문서**: SpringDoc OpenAPI

### 추천 추가 도구
- **모니터링**: Prometheus + Grafana
- **로깅**: ELK Stack (Elasticsearch, Logstash, Kibana) 또는 Loki
- **추적**: Jaeger 또는 Zipkin
- **테스트**: Jest, React Testing Library, Playwright
- **CI/CD**: GitHub Actions
- **캐싱**: Redis (선택)
- **메시지 큐**: RabbitMQ / Kafka (향후 확장 시)

## 14. 예상 개발 시간

- **Phase 1**: 1-2주 (핵심 안정성)
- **Phase 2**: 2-3주 (성능 및 모니터링)
- **Phase 3**: 3-4주 (고급 기능)
- **Phase 4**: 2-3주 (CI/CD 및 자동화)

**총 예상 시간: 8-12주**

## 15. 결론

이 계획은 30년차 DevOps Engineer와 Software Engineer의 관점에서:
- **안정성**: 견고한 에러 처리 및 복원력
- **성능**: 최적화된 통신 및 캐싱
- **보안**: 다층 보안 전략
- **관찰 가능성**: 완전한 모니터링 및 추적
- **자동화**: CI/CD 파이프라인
- **문서화**: 완전한 기술 문서

를 목표로 합니다.

**핵심 원칙**:
1. **Fail Fast**: 빠른 실패 및 명확한 에러 메시지
2. **Defense in Depth**: 다층 보안
3. **Observability First**: 모든 것을 관찰 가능하게
4. **Automate Everything**: 반복 작업 자동화
5. **Document as You Go**: 개발과 함께 문서화

