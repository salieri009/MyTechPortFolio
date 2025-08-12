
# API 기획안 (API Design Plan)

## 1. 개요 (Overview)

프론트엔드와 백엔드 간의 데이터 통신을 위한 RESTful API 명세를 정의합니다. 모든 요청과 응답은 JSON 형식을 기본으로 사용하며, 일관성 있는 API 구조를 통해 개발 효율성을 높이는 것을 목표로 합니다.

- **Base URL**: `/api`
- **인증**: 별도의 인증 없이 모든 API는 공개 상태로 설정 (관리자 API는 `/admin` 경로로 분리)
- **CORS**: 모든 오리진 허용 (개발 환경), 프로덕션에서는 특정 도메인으로 제한
- **API 문서**: SpringDoc OpenAPI 3 (Swagger UI) 지원
- **공통 응답 형식**:
    ```json
    {
      "success": true,
      "data": { ... },
      "error": null
    }
    ```
    - `success`: `true` 또는 `false`로 요청 성공 여부 표시
    - `data`: 요청 성공 시 전달할 데이터 객체
    - `error`: 요청 실패 시 에러 메시지 또는 코드

## 2. 현재 구현된 API 엔드포인트

### 📁 Projects API (`/api/projects`)

#### `[GET] /api/projects`
모든 프로젝트 목록을 조회합니다.

- **Query Parameters**:
    - `page` (optional, int, default: 1): 페이지 번호 (1부터 시작)
    - `size` (optional, int, default: 10): 페이지 크기 (1-100)
    - `sort` (optional, String): 정렬 기준 (예: "endDate,desc")
    - `techStacks` (optional, String): 기술 스택 필터 (쉼표로 구분)
    - `year` (optional, Integer): 연도 필터

- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "page": 1,
        "size": 10,
        "total": 25,
        "items": [
          {
            "id": 1,
            "title": "My Tech Folio",
            "summary": "나만의 역량을 담은 포트폴리오 허브",
            "startDate": "2023-01-01",
            "endDate": "2023-03-31",
            "techStacks": ["Spring Boot", "React", "AWS"]
          }
        ]
      },
      "error": null
    }
    ```

#### `[GET] /api/projects/{id}`
특정 ID를 가진 프로젝트의 상세 정보를 조회합니다.

- **Path Variable**:
    - `id` (`Long`): 조회할 프로젝트의 고유 ID

- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "title": "My Tech Folio",
        "summary": "...",
        "description": "## 프로젝트 개요\n...",
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "githubUrl": "https://github.com/...",
        "demoUrl": "https://...",
        "techStacks": ["Spring Boot", "React", "AWS"],
        "relatedAcademics": ["데이터베이스", "객체지향프로그래밍"]
      },
      "error": null
    }
    ```

#### `[POST] /api/projects`
새로운 프로젝트를 추가합니다.

- **Request Body**:
    ```json
    {
      "title": "New Awesome Project",
      "summary": "...",
      "description": "...",
      "startDate": "2024-01-01",
      "endDate": "2024-02-29",
      "githubUrl": "...",
      "demoUrl": "...",
      "techStackIds": [1, 3, 5],
      "academicIds": [2, 4]
    }
    ```

#### `[PUT] /api/projects/{id}`
특정 프로젝트 정보를 수정합니다.

#### `[DELETE] /api/projects/{id}`
특정 프로젝트를 삭제합니다.

### 📚 Academics API (`/api/academics`)

#### `[GET] /api/academics`
학업 과정 목록을 조회합니다.

- **Query Parameters**:
    - `page` (optional, int, default: 1): 페이지 번호
    - `size` (optional, int, default: 10): 페이지 크기
    - `semester` (optional, String): 학기 필터

#### `[GET] /api/academics/{id}`
특정 학업 과정의 상세 정보를 조회합니다.

### 🛠️ Tech Stacks API (`/api/techstacks`)

#### `[GET] /api/techstacks`
기술 스택 목록을 조회합니다.

- **Query Parameters**:
    - `type` (optional, String): 기술 스택 타입 필터 (FRONTEND, BACKEND, DATABASE, DEVOPS, OTHER)

### 📊 Analytics API (`/api/analytics`)

#### `[GET] /api/analytics/dashboard`
대시보드 개요 데이터를 조회합니다.

- **Query Parameters**:
    - `startDate` (optional, LocalDate): 시작 날짜
    - `endDate` (optional, LocalDate): 종료 날짜

- **Response**:
    ```json
    {
      "success": true,
      "data": {
        "summary": {
          "totalVisitors": 1250,
          "totalPageViews": 3400,
          "avgSessionDuration": 145,
          "bounceRate": 0.35
        },
        "comparison": {
          "visitorsGrowth": 0.15,
          "pageViewsGrowth": 0.22
        },
        "popularPages": [...],
        "topCountries": [...],
        "weeklyTrend": [...],
        "bounceRateAnalysis": {...}
      }
    }
    ```

#### `[GET] /api/analytics/visitors/daily`
일일 방문자 통계를 조회합니다.

#### `[GET] /api/analytics/visitors/country`
국가별 방문자 통계를 조회합니다.

#### `[GET] /api/analytics/pages/popular`
인기 페이지 통계를 조회합니다.

#### `[GET] /api/analytics/traffic/sources`
트래픽 소스 분석 데이터를 조회합니다.

### 👥 Visitor API (`/api/visitor`)

#### `[POST] /api/visitor/track`
페이지 방문을 추적합니다.

- **Request Body**:
    ```json
    {
      "pagePath": "/projects",
      "pageTitle": "Projects",
      "referrer": "https://google.com"
    }
    ```

- **Response**:
    ```json
    {
      "success": true,
      "visitId": 12345,
      "sessionId": "session_abc123",
      "message": "Visit tracked successfully"
    }
    ```

#### `[GET] /api/visitor/stats`
방문자 통계 요약 정보를 조회합니다.

### 🔧 Admin API (`/admin`)

관리자 전용 API로 프로젝트, 학업 정보, 기술 스택 등의 생성, 수정, 삭제를 처리합니다.

#### Projects Management
- `[POST] /admin/projects` - 프로젝트 생성
- `[PUT] /admin/projects/{id}` - 프로젝트 수정  
- `[DELETE] /admin/projects/{id}` - 프로젝트 삭제

#### Academics Management  
- `[POST] /admin/academics` - 학업 정보 생성
- `[PUT] /admin/academics/{id}` - 학업 정보 수정
- `[DELETE] /admin/academics/{id}` - 학업 정보 삭제

#### Tech Stacks Management
- `[POST] /admin/techstacks` - 기술 스택 생성
- `[PUT] /admin/techstacks/{id}` - 기술 스택 수정
- `[DELETE] /admin/techstacks/{id}` - 기술 스택 삭제

#### System Management
- `[POST] /admin/reset-data` - 데이터 초기화

## 3. 데이터 모델

### ProjectSummary
```typescript
interface ProjectSummary {
  id: number
  title: string
  summary: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  techStacks: string[]
}
```

### ProjectDetail
```typescript
interface ProjectDetail extends ProjectSummary {
  description: string // markdown
  githubUrl?: string
  demoUrl?: string
  relatedAcademics?: string[]
}
```

### Academic
```typescript
interface Academic {
  id: number
  name: string
  semester: string
  grade?: string
  description?: string
  creditPoints?: number
  marks?: number
  status: 'completed' | 'enrolled' | 'exemption'
}
```

### TechStack
```typescript
interface TechStack {
  id: number
  name: string
  type: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'OTHER'
  logoUrl?: string
}
```

## 4. 에러 처리

### 공통 에러 응답 형식
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "요청한 리소스를 찾을 수 없습니다.",
    "details": {...}
  }
}
```

### HTTP 상태 코드
- `200` OK - 성공
- `201` Created - 생성 성공
- `204` No Content - 삭제 성공
- `400` Bad Request - 잘못된 요청
- `404` Not Found - 리소스 없음
- `500` Internal Server Error - 서버 오류

## 5. 성능 및 보안 고려사항

### 성능 최적화
- **페이지네이션**: 모든 목록 API는 페이지네이션 지원
- **필터링**: 기술 스택, 연도, 학기 등 다양한 필터 옵션
- **정렬**: 날짜, 이름 등 다양한 정렬 기준 지원
- **캐싱**: 자주 조회되는 데이터는 캐싱 적용 고려

### 보안
- **CORS**: 개발 환경에서는 모든 오리진 허용, 프로덕션에서는 제한
- **입력 검증**: Bean Validation (@Valid) 적용
- **SQL Injection 방지**: JPA를 통한 안전한 데이터베이스 접근
- **XSS 방지**: 출력 데이터 이스케이프 처리

### 모니터링
- **방문자 추적**: 실시간 방문자 통계 수집
- **성능 분석**: 페이지별 로딩 시간 및 인기도 분석
- **에러 로깅**: 자세한 에러 로그 및 알림 시스템

### `[DELETE] /api/projects/{id}` (관리자용)

특정 프로젝트를 삭제합니다.

- **Success Response (204 No Content)**

## 3. API 명세: Academics

### `[GET] /api/academics`

모든 수강 과목 목록을 조회합니다.

- **Query Parameters**:
    - `semester` (optional, `String`): 특정 학기 과목만 필터링 (예: "2-1")
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "name": "자료구조",
          "semester": "2학년 1학기",
          "grade": "A+"
        }
      ],
      "error": null
    }
    ```

### `[GET] /api/academics/{id}`

특정 ID를 가진 수강 과목의 상세 정보를 조회합니다. (연관된 프로젝트 포함)

- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "name": "자료구조",
        "semester": "2학년 1학기",
        "description": "...",
        "relatedProjects": [
          {
            "id": 5,
            "title": "알고리즘 문제 풀이 저장소"
          }
        ]
      },
      "error": null
    }
    ```

## 4. API 명세: Tech Stacks

### `[GET] /api/tech-stacks`

모든 기술 스택 목록을 조회합니다.

- **Query Parameters**:
    - `type` (optional, `String`): 'Backend', 'Frontend' 등 타입별 필터링
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        { "id": 1, "name": "Java", "type": "Backend" },
        { "id": 2, "name": "React", "type": "Frontend" }
      ],
      "error": null
    }
    ```
