# API 공통 규격

## 1. 기본 정보

| 항목 | 값 |
|------|-----|
| Base URL | `/api/v1` |
| API Version | `v1` |
| Protocol | HTTPS (Production), HTTP (Development) |
| Content-Type | `application/json` |
| Authentication | JWT Bearer Token |
| Documentation | Swagger UI (`/swagger-ui.html`), OpenAPI (`/v3/api-docs`) |

---

## 2. 공통 헤더

| 헤더 | 필수 | 설명 |
|------|------|------|
| Content-Type | 필수 | `application/json` |
| Authorization | 조건부 | `Bearer {access_token}` — Admin 엔드포인트에 필수 |
| X-Request-ID | 선택 | 요청 추적용 UUID |
| X-Requested-With | 선택 | AJAX 요청 식별 |

---

## 3. 표준 응답 구조

### 3.1 성공 응답

```json
{
  "success": true,
  "data": { },
  "message": "Optional success message",
  "error": null,
  "errorCode": null,
  "errors": null,
  "metadata": {
    "timestamp": "2026-02-24T10:30:00Z",
    "version": "v1",
    "requestId": "optional-uuid"
  }
}
```

### 3.2 목록 응답 (페이지네이션)

```json
{
  "success": true,
  "data": {
    "page": 1,
    "size": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false,
    "items": [ ]
  },
  "message": null,
  "error": null,
  "errorCode": null,
  "errors": null,
  "metadata": {
    "timestamp": "2026-02-24T10:30:00Z",
    "version": "v1"
  }
}
```

### 3.3 에러 응답

```json
{
  "success": false,
  "data": null,
  "message": null,
  "error": "Error description",
  "errorCode": "RESOURCE_NOT_FOUND",
  "errors": {
    "fieldName": "Validation error message"
  },
  "metadata": {
    "timestamp": "2026-02-24T10:30:00Z",
    "version": "v1"
  }
}
```

---

## 4. 에러 코드

### 4.1 클라이언트 에러 (4xx)

| 코드 | HTTP | 설명 |
|------|------|------|
| VALIDATION_ERROR | 400 | 입력값 검증 실패 |
| BAD_REQUEST | 400 | 잘못된 요청 |
| INVALID_ID_FORMAT | 400 | 잘못된 ObjectId 형식 (24자 hex 아님) |
| MISSING_PARAMETER | 400 | 필수 파라미터 누락 |
| INVALID_PARAMETER_TYPE | 400 | 파라미터 타입 불일치 |
| UNAUTHORIZED | 401 | 인증 필요 |
| AUTHENTICATION_FAILED | 401 | 인증 실패 (잘못된 자격증명) |
| TOKEN_EXPIRED | 401 | JWT 토큰 만료 |
| TOKEN_INVALID | 401 | 유효하지 않은 토큰 |
| FORBIDDEN | 403 | 접근 권한 없음 |
| INSUFFICIENT_PERMISSIONS | 403 | 역할/권한 부족 |
| RESOURCE_NOT_FOUND | 404 | 요청한 리소스 없음 |
| DUPLICATE_RESOURCE | 409 | 중복된 리소스 (예: 기술 스택 이름) |
| TOO_MANY_REQUESTS | 429 | Rate Limit 초과 |

### 4.2 서버 에러 (5xx)

| 코드 | HTTP | 설명 |
|------|------|------|
| INTERNAL_SERVER_ERROR | 500 | 서버 내부 오류 |
| DATABASE_ERROR | 500 | MongoDB 접근 오류 |
| EXTERNAL_SERVICE_ERROR | 502 | 외부 서비스 오류 (Google/GitHub OAuth 등) |

---

## 5. 공통 쿼리 파라미터

### 5.1 페이지네이션

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| page | int | 1 | 페이지 번호 (1-based) |
| size | int | 10 | 페이지 크기 (최대: 100) |

### 5.2 정렬

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| sort | string | `endDate,DESC` | `{field},{direction}` 형식 |

### 5.3 필터 (도메인별 다름)

각 도메인 API 문서에서 사용 가능한 필터 파라미터를 개별 정의합니다.

---

## 6. CORS 설정

| 항목 | 값 |
|------|-----|
| Allowed Origins | `http://localhost:5173`, `http://localhost:3000`, `https://salieri009.studio` |
| Allowed Methods | GET, POST, PUT, DELETE, OPTIONS, PATCH |
| Allowed Headers | Content-Type, Authorization, X-Requested-With, X-Request-ID |
| Max Age | 3600초 (1시간) |

---

## 7. Rate Limiting

| 대상 | 제한 |
|------|------|
| 일반 API | 분당 60회 |
| 인증 API (`/auth/**`) | 분당 5회 |

초과 시 `429 Too Many Requests` + `TOO_MANY_REQUESTS` 에러 코드 반환.

---

## 8. 인증 방식

### JWT Bearer Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

- **Access Token:** 만료 24시간 — API 접근용
- **Refresh Token:** 만료 7일 — Access Token 갱신용
- **Public 엔드포인트:** 토큰 불필요 (대부분의 GET 엔드포인트)
- **Admin 엔드포인트:** ADMIN 역할 토큰 필수
