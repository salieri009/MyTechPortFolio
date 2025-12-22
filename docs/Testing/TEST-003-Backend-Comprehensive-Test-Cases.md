---
title: "Backend Comprehensive Test Cases"
version: "1.0.0"
last_updated: "2025-11-23"
status: "active"
category: "Testing"
audience: ["QA Engineers", "Developers", "Testers"]
prerequisites: ["API-Specification.md", "Database-Specification.md"]
related_docs: ["API-Specification.md", "Database-Specification.md"]
maintainer: "QA Team"
---

# Backend Comprehensive Test Cases

> **Version**: 1.0.0  
> **Last Updated**: 2025-01-27  
> **Status**: Active

이 문서는 MyTechPortfolio 백엔드 서비스에 대한 포괄적이고 체계적인 테스트 케이스를 제공합니다.

**테스트 대상**: Spring Boot 3.3.4 + MongoDB 백엔드 API  
**Base URL**: `/api/v1`

---

## 목차

1. [기능 테스트 (Functional Tests)](#1-기능-테스트-functional-tests)
2. [API 테스트 (API Layer)](#2-api-테스트-api-layer)
3. [데이터베이스 테스트 (Database Layer)](#3-데이터베이스-테스트-database-layer)
4. [성능 및 부하 테스트 (Performance/Load)](#4-성능-및-부하-테스트-performanceload)
5. [보안 테스트 (Security)](#5-보안-테스트-security)
6. [로깅 및 모니터링 (Observability)](#6-로깅-및-모니터링-observability)

---

## 1. 기능 테스트 (Functional Tests)

### 1.1 Projects API

#### [기능 테스트] - 프로젝트 목록 조회 (정상) - 기본 페이징 파라미터로 프로젝트 목록 조회 - 200 OK, PageResponse 반환

**전제 조건**: 데이터베이스에 최소 1개 이상의 프로젝트 존재

**테스트 단계**:
1. `GET /api/v1/projects` 요청 (파라미터 없음)
2. 응답 검증

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data.content` 배열 존재
- `data.page: 1`, `data.size: 10` (기본값)
- `data.totalElements >= 0`
- 각 프로젝트에 `id`, `title`, `summary` 필드 존재

---

#### [기능 테스트] - 프로젝트 목록 조회 (경계) - page=0으로 요청 - 400 Bad Request

**테스트 단계**:
1. `GET /api/v1/projects?page=0` 요청

**예상 결과**:
- HTTP 400 Bad Request
- `success: false`
- `error.code: "VALIDATION_ERROR"`
- `error.message`에 페이지 번호 관련 오류 메시지 포함

---

#### [기능 테스트] - 프로젝트 목록 조회 (경계) - size=101 (MAX 초과) 요청 - 400 Bad Request

**테스트 단계**:
1. `GET /api/v1/projects?size=101` 요청

**예상 결과**:
- HTTP 400 Bad Request
- `success: false`
- `error.code: "VALIDATION_ERROR"`
- `error.message`에 페이지 크기 제한 관련 오류 메시지 포함

---

#### [기능 테스트] - 프로젝트 목록 조회 (필터링) - techStacks 파라미터로 필터링 - 필터링된 결과만 반환

**전제 조건**: 특정 techStackIds를 가진 프로젝트 존재

**테스트 단계**:
1. `GET /api/v1/projects?techStacks=675aa6818b8e5d32789d5801` 요청
2. 반환된 프로젝트들의 `techStackIds` 검증

**예상 결과**:
- HTTP 200 OK
- 모든 반환된 프로젝트의 `techStackIds`에 요청한 ID 포함
- 필터링되지 않은 프로젝트는 결과에 포함되지 않음

---

#### [기능 테스트] - 프로젝트 목록 조회 (정렬) - sort=startDate,ASC로 정렬 - 시작일 오름차순 정렬

**전제 조건**: 서로 다른 startDate를 가진 프로젝트 3개 이상 존재

**테스트 단계**:
1. `GET /api/v1/projects?sort=startDate,ASC` 요청
2. 반환된 프로젝트들의 startDate 순서 검증

**예상 결과**:
- HTTP 200 OK
- `data.content` 배열이 startDate 오름차순으로 정렬됨
- 첫 번째 프로젝트의 startDate <= 두 번째 프로젝트의 startDate

---

#### [기능 테스트] - 프로젝트 상세 조회 (정상) - 유효한 ID로 프로젝트 조회 - 200 OK, ProjectDetailResponse 반환

**전제 조건**: ID `675aa6818b8e5d32789d5894`인 프로젝트 존재

**테스트 단계**:
1. `GET /api/v1/projects/675aa6818b8e5d32789d5894` 요청

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data.id`가 요청한 ID와 일치
- `data.title`, `data.description`, `data.techStackIds` 등 모든 필드 존재

---

#### [기능 테스트] - 프로젝트 상세 조회 (잘못된 입력) - 존재하지 않는 ID로 조회 - 404 Not Found

**테스트 단계**:
1. `GET /api/v1/projects/507f1f77bcf86cd799439999` 요청 (존재하지 않는 ID)

**예상 결과**:
- HTTP 404 Not Found
- `success: false`
- `error.code: "RESOURCE_NOT_FOUND"`
- `error.message`에 프로젝트를 찾을 수 없다는 메시지 포함

---

#### [기능 테스트] - 프로젝트 상세 조회 (잘못된 입력) - 유효하지 않은 ObjectId 형식으로 조회 - 400 Bad Request

**테스트 단계**:
1. `GET /api/v1/projects/invalid-id-format` 요청

**예상 결과**:
- HTTP 400 Bad Request
- `success: false`
- `error.code: "VALIDATION_ERROR"`
- `error.message`에 "Invalid project ID format" 메시지 포함

---

#### [기능 테스트] - 프로젝트 생성 (정상) - 모든 필수 필드 포함하여 생성 - 201 Created, 생성된 프로젝트 반환

**전제 조건**: 유효한 JWT 토큰 (CONTENT_MANAGER 이상 권한), 존재하는 techStackIds

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Request Body:
```json
{
  "title": "Test Project",
  "summary": "Test Summary",
  "description": "Test Description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "techStackIds": ["675aa6818b8e5d32789d5801"],
  "status": "COMPLETED"
}
```
3. 생성된 프로젝트 ID로 재조회

**예상 결과**:
- HTTP 201 Created
- `success: true`
- `data.id` 존재 (MongoDB ObjectId 형식)
- `data.title`이 요청한 값과 일치
- `data.createdAt`, `data.updatedAt` 타임스탬프 존재
- 재조회 시 동일한 데이터 반환

---

#### [기능 테스트] - 프로젝트 생성 (잘못된 입력) - 필수 필드(title) 누락 - 400 Bad Request

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Request Body (title 누락):
```json
{
  "summary": "Test Summary",
  "description": "Test Description"
}
```

**예상 결과**:
- HTTP 400 Bad Request
- `success: false`
- `error.code: "VALIDATION_ERROR"`
- `error.details`에 `title` 필드 관련 오류 메시지 포함

---

#### [기능 테스트] - 프로젝트 생성 (경계) - endDate가 startDate보다 이전 - 400 Bad Request

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Request Body:
```json
{
  "title": "Test Project",
  "startDate": "2024-12-31",
  "endDate": "2024-01-01"
}
```

**예상 결과**:
- HTTP 400 Bad Request
- `success: false`
- `error.code: "VALIDATION_ERROR"`
- 날짜 범위 검증 오류 메시지 포함

---

#### [기능 테스트] - 프로젝트 수정 (정상) - 존재하는 프로젝트의 일부 필드 수정 - 200 OK, 수정된 프로젝트 반환

**전제 조건**: 유효한 JWT 토큰, 존재하는 프로젝트 ID

**테스트 단계**:
1. `PUT /api/v1/projects/{id}` 요청
2. Request Body:
```json
{
  "title": "Updated Title",
  "summary": "Updated Summary"
}
```
3. 수정 후 재조회

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data.title`이 "Updated Title"로 변경됨
- `data.updatedAt`이 수정 전보다 이후 시간
- 재조회 시 수정된 값 반환

---

#### [기능 테스트] - 프로젝트 수정 (잘못된 입력) - 존재하지 않는 ID로 수정 시도 - 404 Not Found

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `PUT /api/v1/projects/507f1f77bcf86cd799439999` 요청

**예상 결과**:
- HTTP 404 Not Found
- `success: false`
- `error.code: "RESOURCE_NOT_FOUND"`

---

#### [기능 테스트] - 프로젝트 삭제 (정상) - 존재하는 프로젝트 삭제 - 204 No Content

**전제 조건**: 유효한 JWT 토큰, 존재하는 프로젝트 ID

**테스트 단계**:
1. `DELETE /api/v1/projects/{id}` 요청
2. 삭제 후 동일 ID로 조회 시도

**예상 결과**:
- HTTP 204 No Content
- 재조회 시 404 Not Found 반환

---

#### [기능 테스트] - 프로젝트 삭제 (잘못된 입력) - 존재하지 않는 ID로 삭제 시도 - 404 Not Found

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `DELETE /api/v1/projects/507f1f77bcf86cd799439999` 요청

**예상 결과**:
- HTTP 404 Not Found
- `success: false`
- `error.code: "RESOURCE_NOT_FOUND"`

---

### 1.2 Academics API

#### [기능 테스트] - 학업 과정 목록 조회 (정상) - 기본 파라미터로 조회 - 200 OK, PageResponse 반환

**전제 조건**: 데이터베이스에 최소 1개 이상의 학업 과정 존재

**테스트 단계**:
1. `GET /api/v1/academics` 요청

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data.content` 배열 존재
- 각 항목에 `id`, `subjectCode`, `name`, `semester` 필드 존재

---

#### [기능 테스트] - 학업 과정 목록 조회 (필터링) - semester 파라미터로 필터링 - 필터링된 결과만 반환

**전제 조건**: 특정 semester를 가진 학업 과정 존재

**테스트 단계**:
1. `GET /api/v1/academics?semester=2024 Autumn` 요청

**예상 결과**:
- HTTP 200 OK
- 모든 반환된 항목의 `semester`가 "2024 Autumn"과 일치

---

#### [기능 테스트] - 학업 과정 생성 (정상) - 모든 필수 필드 포함하여 생성 - 201 Created

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/academics` 요청
2. Request Body:
```json
{
  "subjectCode": "31257",
  "name": "Information Systems Development",
  "semester": "2024 Autumn",
  "grade": "DISTINCTION",
  "creditPoints": 6,
  "marks": 85,
  "status": "COMPLETED",
  "year": 2024,
  "semesterType": "AUTUMN"
}
```

**예상 결과**:
- HTTP 201 Created
- `success: true`
- `data.id` 존재
- 모든 입력 필드가 응답에 포함됨

---

#### [기능 테스트] - 학업 과정 생성 (잘못된 입력) - 유효하지 않은 grade 값 - 400 Bad Request

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/academics` 요청
2. Request Body (grade: "INVALID_GRADE"):

**예상 결과**:
- HTTP 400 Bad Request
- `error.code: "VALIDATION_ERROR"`
- grade enum 관련 오류 메시지

---

### 1.3 Journey Milestones API

#### [기능 테스트] - 마일스톤 목록 조회 (정상) - 모든 마일스톤 조회 - 200 OK, 연도순 정렬

**전제 조건**: 데이터베이스에 마일스톤 존재

**테스트 단계**:
1. `GET /api/v1/journey-milestones` 요청

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data` 배열이 연도(year) 오름차순으로 정렬됨
- 각 항목에 `id`, `year`, `title`, `description` 필드 존재

---

#### [기능 테스트] - 마일스톤 생성 (정상) - 복잡한 중첩 구조 포함하여 생성 - 201 Created

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/journey-milestones` 요청
2. Request Body:
```json
{
  "year": "2023",
  "title": "Transitioned to Full-Stack Engineer",
  "description": "Led migration...",
  "status": "COMPLETED",
  "technicalComplexity": 5,
  "codeMetrics": {
    "linesOfCode": 45000,
    "commits": 620,
    "repositories": 9
  },
  "keyAchievements": [
    {
      "title": "Deployed admin CRUD suite",
      "description": "Enabled non-technical staff",
      "impact": "Cut content turnaround time by 60%"
    }
  ]
}
```

**예상 결과**:
- HTTP 201 Created
- `success: true`
- `data.codeMetrics`, `data.keyAchievements` 등 중첩 구조가 올바르게 저장됨

---

### 1.4 Testimonials API

#### [기능 테스트] - 추천사 목록 조회 (정상) - 승인된 추천사만 조회 - 200 OK

**전제 조건**: `isApproved: true`인 추천사 존재

**테스트 단계**:
1. `GET /api/v1/testimonials` 요청

**예상 결과**:
- HTTP 200 OK
- 모든 반환된 항목의 `isApproved: true`
- `isApproved: false`인 항목은 포함되지 않음

---

#### [기능 테스트] - 추천사 Featured 조회 (정상) - Featured 추천사만 조회 - 200 OK

**전제 조건**: `isFeatured: true`인 추천사 존재

**테스트 단계**:
1. `GET /api/v1/testimonials/featured` 요청

**예상 결과**:
- HTTP 200 OK
- 모든 반환된 항목의 `isFeatured: true`
- `isApproved: true`도 만족해야 함

---

### 1.5 Tech Stacks API

#### [기능 테스트] - 기술 스택 목록 조회 (정상) - 모든 기술 스택 조회 - 200 OK

**테스트 단계**:
1. `GET /api/v1/techstacks` 요청

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data` 배열에 모든 기술 스택 포함
- 각 항목에 `id`, `name`, `category` 필드 존재

---

#### [기능 테스트] - 기술 스택 목록 조회 (필터링) - category 파라미터로 필터링 - 카테고리별 결과 반환

**전제 조건**: 특정 category를 가진 기술 스택 존재

**테스트 단계**:
1. `GET /api/v1/techstacks?category=FRONTEND` 요청

**예상 결과**:
- HTTP 200 OK
- 모든 반환된 항목의 `category`가 "FRONTEND"와 일치

---

### 1.6 Auth API

#### [기능 테스트] - Google OAuth 로그인 (정상) - 유효한 Google ID 토큰으로 로그인 - 200 OK, JWT 토큰 반환

**전제 조건**: 유효한 Google ID 토큰

**테스트 단계**:
1. `POST /api/v1/auth/google` 요청
2. Request Body:
```json
{
  "googleIdToken": "valid-google-id-token"
}
```

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data.accessToken` 존재 (JWT 형식)
- `data.refreshToken` 존재
- `data.user` 객체에 사용자 정보 포함

---

#### [기능 테스트] - Google OAuth 로그인 (잘못된 입력) - 유효하지 않은 토큰으로 로그인 시도 - 401 Unauthorized

**테스트 단계**:
1. `POST /api/v1/auth/google` 요청
2. Request Body:
```json
{
  "googleIdToken": "invalid-token"
}
```

**예상 결과**:
- HTTP 401 Unauthorized
- `success: false`
- `error.code: "AUTHENTICATION_FAILED"`

---

#### [기능 테스트] - 토큰 갱신 (정상) - 유효한 리프레시 토큰으로 갱신 - 200 OK, 새 토큰 반환

**전제 조건**: 유효한 리프레시 토큰

**테스트 단계**:
1. `POST /api/v1/auth/refresh` 요청
2. Header: `Authorization: Bearer {refreshToken}`

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data.accessToken` 존재 (새로운 토큰)
- `data.refreshToken` 존재 (새로운 토큰 또는 동일)

---

#### [기능 테스트] - 토큰 갱신 (잘못된 입력) - 만료된 리프레시 토큰으로 갱신 시도 - 401 Unauthorized

**전제 조건**: 만료된 리프레시 토큰

**테스트 단계**:
1. `POST /api/v1/auth/refresh` 요청
2. Header: `Authorization: Bearer {expiredRefreshToken}`

**예상 결과**:
- HTTP 401 Unauthorized
- `success: false`
- `error.code: "AUTHENTICATION_FAILED"`

---

#### [기능 테스트] - 로그아웃 (정상) - 유효한 토큰으로 로그아웃 - 200 OK

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/auth/logout` 요청
2. Header: `Authorization: Bearer {token}`
3. 로그아웃 후 동일 토큰으로 인증 필요한 API 호출

**예상 결과**:
- HTTP 200 OK
- `success: true`
- 로그아웃 후 동일 토큰으로 API 호출 시 401 Unauthorized 반환

---

#### [기능 테스트] - 사용자 프로필 조회 (정상) - 유효한 토큰으로 프로필 조회 - 200 OK

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `GET /api/v1/auth/profile` 요청
2. Header: `Authorization: Bearer {token}`

**예상 결과**:
- HTTP 200 OK
- `success: true`
- `data`에 사용자 프로필 정보 포함 (email, username 등)

---

#### [기능 테스트] - 사용자 프로필 조회 (인증 실패) - 토큰 없이 프로필 조회 시도 - 401 Unauthorized

**테스트 단계**:
1. `GET /api/v1/auth/profile` 요청 (Authorization 헤더 없음)

**예상 결과**:
- HTTP 401 Unauthorized
- `success: false`
- `error.code: "UNAUTHORIZED"`

---

## 2. API 테스트 (API Layer)

### 2.1 요청/응답 구조 검증

#### [API 테스트] - 응답 구조 검증 (성공) - 모든 성공 응답이 표준 ApiResponse 형식 준수 - 표준 구조 반환

**테스트 단계**:
1. 여러 엔드포인트에 대해 성공 응답 수집
2. 응답 구조 검증

**예상 결과**:
- 모든 응답에 `success: true` 필드 존재
- 모든 응답에 `data` 필드 존재
- 모든 응답에 `timestamp` 필드 존재 (ISO 8601 형식)
- 선택적으로 `message` 필드 존재

---

#### [API 테스트] - 응답 구조 검증 (에러) - 모든 에러 응답이 표준 ApiResponse 형식 준수 - 표준 에러 구조 반환

**테스트 단계**:
1. 여러 에러 시나리오에서 에러 응답 수집
2. 응답 구조 검증

**예상 결과**:
- 모든 에러 응답에 `success: false` 필드 존재
- 모든 에러 응답에 `error.code` 필드 존재
- 모든 에러 응답에 `error.message` 필드 존재
- 모든 에러 응답에 `timestamp` 필드 존재

---

#### [API 테스트] - 페이징 응답 구조 검증 - 페이징된 응답이 PageResponse 형식 준수 - 표준 페이징 구조 반환

**테스트 단계**:
1. `GET /api/v1/projects?page=2&size=5` 요청

**예상 결과**:
- HTTP 200 OK
- `data.content` 배열 존재
- `data.page: 2`
- `data.size: 5`
- `data.totalElements` 존재
- `data.totalPages` 존재
- `data.hasNext` 존재
- `data.hasPrevious` 존재

---

#### [API 테스트] - Content-Type 검증 - 모든 응답이 application/json 반환 - 올바른 Content-Type 헤더

**테스트 단계**:
1. 여러 엔드포인트에 대해 요청
2. 응답 헤더 검증

**예상 결과**:
- 모든 응답의 `Content-Type: application/json` 헤더 존재

---

### 2.2 인증/인가

#### [API 테스트] - 인증 (정상) - 유효한 JWT 토큰으로 보호된 엔드포인트 접근 - 200 OK 또는 201 Created

**전제 조건**: 유효한 JWT 토큰 (CONTENT_MANAGER 이상 권한)

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Header: `Authorization: Bearer {validToken}`

**예상 결과**:
- HTTP 201 Created
- 요청이 정상적으로 처리됨

---

#### [API 테스트] - 인증 (실패) - 토큰 없이 보호된 엔드포인트 접근 - 401 Unauthorized

**테스트 단계**:
1. `POST /api/v1/projects` 요청 (Authorization 헤더 없음)

**예상 결과**:
- HTTP 401 Unauthorized
- `error.code: "UNAUTHORIZED"`

---

#### [API 테스트] - 인증 (실패) - 유효하지 않은 JWT 토큰으로 접근 - 401 Unauthorized

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Header: `Authorization: Bearer invalid-token`

**예상 결과**:
- HTTP 401 Unauthorized
- `error.code: "AUTHENTICATION_FAILED"`

---

#### [API 테스트] - 인증 (실패) - 만료된 JWT 토큰으로 접근 - 401 Unauthorized

**전제 조건**: 만료된 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Header: `Authorization: Bearer {expiredToken}`

**예상 결과**:
- HTTP 401 Unauthorized
- `error.code: "AUTHENTICATION_FAILED"`

---

#### [API 테스트] - 인가 (정상) - CONTENT_MANAGER 권한으로 관리 엔드포인트 접근 - 200 OK

**전제 조건**: CONTENT_MANAGER 권한을 가진 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Header: `Authorization: Bearer {contentManagerToken}`

**예상 결과**:
- HTTP 201 Created
- 요청이 정상적으로 처리됨

---

#### [API 테스트] - 인가 (실패) - 권한 없는 사용자가 관리 엔드포인트 접근 - 403 Forbidden

**전제 조건**: 일반 사용자 권한만 가진 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Header: `Authorization: Bearer {userToken}`

**예상 결과**:
- HTTP 403 Forbidden
- `error.code: "FORBIDDEN"`

---

#### [API 테스트] - Public 엔드포인트 접근 - 인증 없이 Public 엔드포인트 접근 - 200 OK

**테스트 단계**:
1. `GET /api/v1/projects` 요청 (Authorization 헤더 없음)

**예상 결과**:
- HTTP 200 OK
- 데이터 정상 반환

---

### 2.3 속도 제한 및 에러 코드 처리

#### [API 테스트] - 에러 코드 일관성 - 동일한 에러 상황에서 일관된 에러 코드 반환 - 일관된 에러 코드

**테스트 단계**:
1. 존재하지 않는 리소스 조회를 여러 번 반복
2. 에러 코드 검증

**예상 결과**:
- 모든 경우에 `error.code: "RESOURCE_NOT_FOUND"` 반환
- HTTP 상태 코드 404 일관성 유지

---

#### [API 테스트] - 에러 메시지 보안 - 에러 메시지에 내부 시스템 정보 노출되지 않음 - 안전한 에러 메시지

**테스트 단계**:
1. 내부 예외를 유발하는 요청 전송
2. 에러 응답 검증

**예상 결과**:
- 에러 메시지에 스택 트레이스, 파일 경로, 내부 클래스명 등 노출되지 않음
- 일반적인 사용자 친화적 메시지만 반환

---

#### [API 테스트] - CORS 헤더 검증 - OPTIONS 요청에 올바른 CORS 헤더 반환 - CORS 헤더 포함

**테스트 단계**:
1. `OPTIONS /api/v1/projects` 요청
2. 응답 헤더 검증

**예상 결과**:
- `Access-Control-Allow-Origin` 헤더 존재
- `Access-Control-Allow-Methods` 헤더 존재
- `Access-Control-Allow-Headers` 헤더 존재
- 허용된 Origin에 `http://localhost:5173` 포함

---

## 3. 데이터베이스 테스트 (Database Layer)

### 3.1 CRUD 동작 검증

#### [데이터베이스 테스트] - Create 동작 검증 - 프로젝트 생성 시 MongoDB에 정확히 저장됨 - 데이터베이스에 저장 확인

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청으로 프로젝트 생성
2. 생성된 ID로 MongoDB에서 직접 조회
3. 저장된 데이터 검증

**예상 결과**:
- MongoDB에 문서가 생성됨
- `_id` 필드가 MongoDB ObjectId 형식
- 모든 필드가 요청한 값과 일치
- `createdAt`, `updatedAt` 타임스탬프 자동 생성

---

#### [데이터베이스 테스트] - Read 동작 검증 - 프로젝트 조회 시 MongoDB에서 정확히 조회됨 - 정확한 데이터 반환

**전제 조건**: 데이터베이스에 프로젝트 존재

**테스트 단계**:
1. MongoDB에서 직접 프로젝트 ID 확인
2. `GET /api/v1/projects/{id}` 요청
3. 반환된 데이터와 MongoDB 데이터 비교

**예상 결과**:
- 반환된 데이터가 MongoDB에 저장된 데이터와 일치
- 모든 필드가 올바르게 매핑됨

---

#### [데이터베이스 테스트] - Update 동작 검증 - 프로젝트 수정 시 MongoDB에서 정확히 업데이트됨 - 데이터베이스 업데이트 확인

**전제 조건**: 유효한 JWT 토큰, 존재하는 프로젝트

**테스트 단계**:
1. `PUT /api/v1/projects/{id}` 요청으로 수정
2. MongoDB에서 직접 조회
3. 업데이트된 필드 검증

**예상 결과**:
- MongoDB 문서의 해당 필드가 업데이트됨
- `updatedAt` 필드가 현재 시간으로 업데이트됨
- 수정하지 않은 필드는 변경되지 않음

---

#### [데이터베이스 테스트] - Delete 동작 검증 - 프로젝트 삭제 시 MongoDB에서 정확히 삭제됨 - 데이터베이스에서 삭제 확인

**전제 조건**: 유효한 JWT 토큰, 존재하는 프로젝트

**테스트 단계**:
1. `DELETE /api/v1/projects/{id}` 요청
2. MongoDB에서 직접 조회 시도

**예상 결과**:
- MongoDB에서 해당 문서가 삭제됨
- `findById` 결과가 null 또는 empty

---

### 3.2 트랜잭션 롤백/커밋 시나리오

#### [데이터베이스 테스트] - 트랜잭션 롤백 - 부분 실패 시 롤백 확인 - 변경사항 롤백 확인

**전제 조건**: MongoDB Replica Set 구성, 트랜잭션 지원

**테스트 단계**:
1. 프로젝트 생성 중 의도적으로 실패 유발 (예: 존재하지 않는 techStackId 참조)
2. 트랜잭션 롤백 확인

**예상 결과**:
- 트랜잭션이 롤백됨
- 부분적으로 생성된 데이터가 데이터베이스에 남지 않음
- 에러 응답 반환

---

#### [데이터베이스 테스트] - 트랜잭션 커밋 - 정상 완료 시 커밋 확인 - 변경사항 커밋 확인

**전제 조건**: MongoDB Replica Set 구성

**테스트 단계**:
1. 정상적인 프로젝트 생성 요청
2. 트랜잭션 커밋 확인

**예상 결과**:
- 트랜잭션이 커밋됨
- 모든 변경사항이 데이터베이스에 영구 저장됨

---

### 3.3 데이터 무결성 및 제약 조건 확인

#### [데이터베이스 테스트] - 참조 무결성 - 존재하지 않는 techStackId 참조 시 검증 - 400 Bad Request

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Request Body에 존재하지 않는 techStackId 포함:
```json
{
  "title": "Test",
  "techStackIds": ["507f1f77bcf86cd799439999"]
}
```

**예상 결과**:
- HTTP 400 Bad Request
- `error.code: "VALIDATION_ERROR"` 또는 `"RESOURCE_NOT_FOUND"`
- 프로젝트가 생성되지 않음

---

#### [데이터베이스 테스트] - 유니크 제약 조건 - 중복된 techStack name 생성 시도 - 409 Conflict 또는 400 Bad Request

**전제 조건**: 유효한 JWT 토큰, 이미 존재하는 techStack name

**테스트 단계**:
1. `POST /api/v1/techstacks` 요청 (이미 존재하는 name)

**예상 결과**:
- HTTP 409 Conflict 또는 400 Bad Request
- `error.code: "DUPLICATE_RESOURCE"`
- 중복된 데이터가 생성되지 않음

---

#### [데이터베이스 테스트] - 필수 필드 검증 - 필수 필드 누락 시 데이터베이스 저장 실패 - 400 Bad Request

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. 필수 필드(title) 누락

**예상 결과**:
- HTTP 400 Bad Request
- 데이터베이스에 저장되지 않음
- `error.details`에 필드별 검증 오류 포함

---

#### [데이터베이스 테스트] - 데이터 타입 검증 - 잘못된 데이터 타입으로 저장 시도 - 400 Bad Request

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Request Body에 잘못된 타입 (예: title을 숫자로):
```json
{
  "title": 12345,
  "summary": "Test"
}
```

**예상 결과**:
- HTTP 400 Bad Request
- `error.code: "VALIDATION_ERROR"`
- 데이터베이스에 저장되지 않음

---

#### [데이터베이스 테스트] - 인덱스 활용 - 인덱스가 있는 필드로 조회 시 성능 확인 - 빠른 조회 성능

**전제 조건**: 대량의 프로젝트 데이터 존재

**테스트 단계**:
1. `GET /api/v1/projects?techStacks={indexedTechStackId}` 요청
2. 응답 시간 측정
3. MongoDB 쿼리 실행 계획 확인

**예상 결과**:
- 응답 시간이 합리적 범위 내 (< 500ms)
- MongoDB 쿼리 실행 계획에서 인덱스 사용 확인

---

## 4. 성능 및 부하 테스트 (Performance/Load)

### 4.1 동시 요청 처리

#### [성능 테스트] - 동시 요청 처리 (읽기) - 100개의 동시 GET 요청 처리 - 모든 요청 성공, 응답 시간 < 1초

**전제 조건**: 충분한 데이터 존재

**테스트 단계**:
1. 100개의 동시 스레드에서 `GET /api/v1/projects` 요청
2. 응답 시간 및 성공률 측정

**예상 결과**:
- 모든 요청이 HTTP 200 OK 반환
- 평균 응답 시간 < 1초
- 95th percentile 응답 시간 < 2초
- 에러율 0%

---

#### [성능 테스트] - 동시 요청 처리 (쓰기) - 50개의 동시 POST 요청 처리 - 모든 요청 성공, 데이터 무결성 유지

**전제 조건**: 유효한 JWT 토큰 50개

**테스트 단계**:
1. 50개의 동시 스레드에서 `POST /api/v1/projects` 요청
2. 응답 시간 및 성공률 측정
3. 데이터 무결성 검증

**예상 결과**:
- 모든 요청이 HTTP 201 Created 반환
- 평균 응답 시간 < 2초
- 모든 프로젝트가 정상적으로 생성됨
- 중복 ID 없음

---

#### [성능 테스트] - 동시 요청 처리 (혼합) - 읽기/쓰기 혼합 부하 처리 - 안정적인 처리

**전제 조건**: 충분한 데이터, 유효한 JWT 토큰

**테스트 단계**:
1. 70% 읽기, 30% 쓰기 비율로 동시 요청
2. 총 200개 요청
3. 응답 시간 및 성공률 측정

**예상 결과**:
- 모든 요청이 성공
- 평균 응답 시간 < 1.5초
- 데이터 일관성 유지

---

### 4.2 대량 데이터 입력 시 안정성

#### [성능 테스트] - 대량 데이터 입력 - 1000개의 프로젝트 순차 생성 - 모든 데이터 정상 저장

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. 1000개의 프로젝트를 순차적으로 생성
2. 각 요청의 응답 시간 측정
3. 데이터베이스에 저장된 개수 확인

**예상 결과**:
- 모든 프로젝트가 성공적으로 생성됨
- 데이터베이스에 정확히 1000개 저장됨
- 메모리 누수 없음
- 응답 시간이 일정하게 유지됨 (성능 저하 없음)

---

#### [성능 테스트] - 대량 데이터 조회 - 10000개 프로젝트 중 페이징 조회 - 빠른 응답 시간

**전제 조건**: 데이터베이스에 10000개 이상의 프로젝트 존재

**테스트 단계**:
1. `GET /api/v1/projects?page=1&size=10` 요청
2. 응답 시간 측정
3. 여러 페이지 조회

**예상 결과**:
- 응답 시간 < 500ms
- 페이징이 정확하게 작동
- 모든 페이지에서 일관된 응답 시간

---

### 4.3 응답 시간 SLA 검증

#### [성능 테스트] - 응답 시간 SLA (읽기) - GET 요청 응답 시간 < 500ms - SLA 준수

**테스트 단계**:
1. `GET /api/v1/projects` 요청 100회
2. 각 요청의 응답 시간 측정

**예상 결과**:
- 평균 응답 시간 < 500ms
- 95th percentile < 800ms
- 99th percentile < 1초

---

#### [성능 테스트] - 응답 시간 SLA (쓰기) - POST 요청 응답 시간 < 1초 - SLA 준수

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청 50회
2. 각 요청의 응답 시간 측정

**예상 결과**:
- 평균 응답 시간 < 1초
- 95th percentile < 1.5초
- 99th percentile < 2초

---

#### [성능 테스트] - 응답 시간 SLA (복잡한 쿼리) - 필터링 및 정렬 포함 조회 < 1초 - SLA 준수

**테스트 단계**:
1. `GET /api/v1/projects?techStacks=id1,id2&year=2024&sort=endDate,DESC` 요청 50회
2. 응답 시간 측정

**예상 결과**:
- 평균 응답 시간 < 1초
- 95th percentile < 1.5초

---

## 5. 보안 테스트 (Security)

### 5.1 SQL Injection

#### [보안 테스트] - NoSQL Injection 방어 - MongoDB Injection 시도 차단 - 400 Bad Request 또는 안전한 처리

**테스트 단계**:
1. `GET /api/v1/projects?id[$ne]=null` 요청 (NoSQL Injection 시도)
2. `POST /api/v1/projects` 요청
3. Request Body에 Injection 페이로드 포함

**예상 결과**:
- HTTP 400 Bad Request 또는 안전한 처리
- 데이터베이스 쿼리에 Injection 페이로드가 포함되지 않음
- 에러 로그에 Injection 시도 기록

---

#### [보안 테스트] - ObjectId 검증 - 잘못된 ObjectId 형식으로 Injection 시도 차단 - 400 Bad Request

**테스트 단계**:
1. `GET /api/v1/projects/'; DROP TABLE projects; --` 요청
2. `GET /api/v1/projects/{$where: "1==1"}` 요청

**예상 결과**:
- HTTP 400 Bad Request
- `error.code: "VALIDATION_ERROR"`
- 데이터베이스에 영향 없음

---

### 5.2 XSS (Cross-Site Scripting)

#### [보안 테스트] - XSS 방어 (입력) - 스크립트 태그가 포함된 입력 차단 또는 이스케이프 - 안전한 처리

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Request Body:
```json
{
  "title": "<script>alert('XSS')</script>",
  "summary": "Test"
}
```

**예상 결과**:
- 입력이 이스케이프되거나 차단됨
- 저장된 데이터에 원본 스크립트 태그가 포함되지 않음
- 또는 HTTP 400 Bad Request (입력 검증 실패)

---

#### [보안 테스트] - XSS 방어 (출력) - 응답에 포함된 스크립트 태그 이스케이프 - 안전한 응답

**전제 조건**: 데이터베이스에 스크립트 태그가 포함된 데이터 존재 (테스트용)

**테스트 단계**:
1. `GET /api/v1/projects/{id}` 요청
2. 응답 내용 검증

**예상 결과**:
- 응답에 포함된 스크립트 태그가 이스케이프됨
- 또는 JSON 응답이므로 브라우저에서 실행되지 않음

---

### 5.3 CSRF (Cross-Site Request Forgery)

#### [보안 테스트] - CSRF 방어 - CSRF 토큰 없이 상태 변경 요청 차단 또는 JWT 기반 인증으로 방어 - 안전한 처리

**참고**: JWT 기반 인증은 CSRF에 상대적으로 안전하지만, 추가 검증 필요

**테스트 단계**:
1. CSRF 토큰 없이 `POST /api/v1/projects` 요청
2. 다른 Origin에서 요청 시도

**예상 결과**:
- JWT 토큰 검증으로 인증된 요청만 처리
- CORS 정책에 따라 다른 Origin 요청 차단

---

### 5.4 권한 없는 접근 차단

#### [보안 테스트] - 권한 없는 접근 차단 - 일반 사용자가 관리자 엔드포인트 접근 시도 - 403 Forbidden

**전제 조건**: 일반 사용자 권한만 가진 JWT 토큰

**테스트 단계**:
1. `DELETE /api/v1/projects/{id}` 요청
2. Header: `Authorization: Bearer {userToken}`

**예상 결과**:
- HTTP 403 Forbidden
- `error.code: "FORBIDDEN"`
- 프로젝트가 삭제되지 않음

---

#### [보안 테스트] - 수직 권한 상승 방어 - 낮은 권한 사용자가 높은 권한 필요 작업 시도 - 403 Forbidden

**전제 조건**: CONTENT_MANAGER 권한 토큰, SUPER_ADMIN 전용 엔드포인트

**테스트 단계**:
1. SUPER_ADMIN 전용 엔드포인트에 CONTENT_MANAGER 토큰으로 접근

**예상 결과**:
- HTTP 403 Forbidden
- `error.code: "FORBIDDEN"`

---

#### [보안 테스트] - 수평 권한 상승 방어 - 다른 사용자의 리소스 접근 시도 - 403 Forbidden 또는 404 Not Found

**전제 조건**: 사용자별 리소스가 있는 경우

**테스트 단계**:
1. User A의 리소스에 User B의 토큰으로 접근 시도

**예상 결과**:
- HTTP 403 Forbidden 또는 404 Not Found
- 다른 사용자의 리소스에 접근 불가

---

### 5.5 민감 데이터 암호화 확인

#### [보안 테스트] - 비밀번호 암호화 - 관리자 비밀번호가 평문으로 저장되지 않음 - 해시된 비밀번호 저장

**전제 조건**: 관리자 계정 생성 또는 조회 가능

**테스트 단계**:
1. MongoDB에서 admin_users 컬렉션 조회
2. password 필드 검증

**예상 결과**:
- password 필드가 BCrypt 해시 형식 (예: `$2a$10$...`)
- 평문 비밀번호가 저장되지 않음

---

#### [보안 테스트] - JWT 토큰 보안 - JWT 토큰에 민감 정보 포함되지 않음 - 안전한 토큰 구조

**테스트 단계**:
1. JWT 토큰 디코딩
2. 페이로드 내용 검증

**예상 결과**:
- 토큰에 비밀번호, 민감한 개인정보 포함되지 않음
- 필요한 최소한의 정보만 포함 (예: userId, roles)

---

#### [보안 테스트] - 전송 중 데이터 암호화 - HTTPS 사용 시 데이터 암호화 확인 - TLS 연결

**테스트 단계**:
1. HTTPS로 API 요청
2. 네트워크 트래픽 분석

**예상 결과**:
- 프로덕션 환경에서 HTTPS 사용
- TLS 1.2 이상 사용
- 평문 데이터 전송 없음

---

### 5.6 입력 검증 및 Sanitization

#### [보안 테스트] - 입력 길이 제한 - 과도하게 긴 입력 차단 - 400 Bad Request

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Request Body에 10000자 이상의 title 포함

**예상 결과**:
- HTTP 400 Bad Request
- `error.code: "VALIDATION_ERROR"`
- 입력 길이 제한 오류 메시지

---

#### [보안 테스트] - 특수 문자 처리 - 특수 문자 포함 입력 안전하게 처리 - 안전한 저장

**전제 조건**: 유효한 JWT 토큰

**테스트 단계**:
1. `POST /api/v1/projects` 요청
2. Request Body에 특수 문자 포함:
```json
{
  "title": "Test & <Project> 'with' \"quotes\"",
  "summary": "Test"
}
```

**예상 결과**:
- 입력이 안전하게 처리됨
- 데이터베이스에 정상 저장
- 응답 시 이스케이프 또는 안전한 형식으로 반환

---

## 6. 로깅 및 모니터링 (Observability)

### 6.1 에러 발생 시 로그 기록

#### [로깅 테스트] - 에러 로그 기록 - 404 에러 발생 시 로그 기록 - 에러 로그 파일에 기록

**테스트 단계**:
1. `GET /api/v1/projects/507f1f77bcf86cd799439999` 요청 (존재하지 않는 ID)
2. 로그 파일 확인

**예상 결과**:
- 로그 파일에 WARN 레벨 로그 기록
- 로그에 에러 메시지, 요청 경로, 타임스탬프 포함
- 스택 트레이스 포함 (개발 환경)

---

#### [로깅 테스트] - 에러 로그 기록 - 500 에러 발생 시 로그 기록 - 에러 로그 파일에 상세 기록

**테스트 단계**:
1. 내부 서버 오류를 유발하는 요청 전송
2. 로그 파일 확인

**예상 결과**:
- 로그 파일에 ERROR 레벨 로그 기록
- 로그에 에러 메시지, 스택 트레이스, 요청 정보 포함
- 민감한 정보는 마스킹됨

---

#### [로깅 테스트] - 인증 실패 로그 기록 - 인증 실패 시 보안 로그 기록 - 보안 로그 기록

**테스트 단계**:
1. 유효하지 않은 토큰으로 인증 필요한 엔드포인트 접근
2. 로그 파일 확인

**예상 결과**:
- 로그 파일에 WARN 또는 INFO 레벨 로그 기록
- 로그에 인증 실패 사유, 요청 IP, 타임스탬프 포함
- 반복 실패 시 경고 로그

---

### 6.2 주요 이벤트 모니터링 지표 확인

#### [모니터링 테스트] - 요청 수 모니터링 - API 요청 수가 모니터링 지표로 기록됨 - 지표 기록 확인

**테스트 단계**:
1. 여러 API 엔드포인트에 요청 전송
2. 모니터링 대시보드 또는 메트릭 확인

**예상 결과**:
- 요청 수가 카운터로 기록됨
- 엔드포인트별 요청 수 분리 기록
- HTTP 상태 코드별 분리

---

#### [모니터링 테스트] - 응답 시간 모니터링 - API 응답 시간이 모니터링 지표로 기록됨 - 지표 기록 확인

**테스트 단계**:
1. 여러 API 요청 전송
2. 모니터링 대시보드 확인

**예상 결과**:
- 응답 시간이 히스토그램 또는 게이지로 기록됨
- 평균, 중앙값, 95th percentile 등 기록
- 엔드포인트별 분리

---

#### [모니터링 테스트] - 에러율 모니터링 - 에러율이 모니터링 지표로 기록됨 - 지표 기록 확인

**테스트 단계**:
1. 일부 성공, 일부 실패 요청 전송
2. 모니터링 대시보드 확인

**예상 결과**:
- 에러율이 게이지로 기록됨
- 에러 유형별 분리 기록
- 임계값 초과 시 알림 가능

---

#### [모니터링 테스트] - 데이터베이스 연결 풀 모니터링 - DB 연결 풀 상태가 모니터링됨 - 지표 기록 확인

**테스트 단계**:
1. 대량의 동시 요청 전송
2. 모니터링 대시보드 확인

**예상 결과**:
- 활성 연결 수 기록
- 사용 가능한 연결 수 기록
- 연결 풀 고갈 시 경고

---

#### [모니터링 테스트] - 메모리 사용량 모니터링 - 애플리케이션 메모리 사용량 모니터링 - 지표 기록 확인

**테스트 단계**:
1. 장시간 부하 테스트 실행
2. 메모리 사용량 확인

**예상 결과**:
- 힙 메모리 사용량 기록
- 메모리 누수 없음
- GC 빈도 및 시간 기록

---

#### [모니터링 테스트] - Health Check 엔드포인트 - /actuator/health 엔드포인트 정상 동작 - 상태 정보 반환

**테스트 단계**:
1. `GET /actuator/health` 요청

**예상 결과**:
- HTTP 200 OK
- 상태 정보 반환 (예: `{"status": "UP"}`)
- 데이터베이스 연결 상태 포함

---

#### [모니터링 테스트] - 메트릭 엔드포인트 - /actuator/metrics 엔드포인트 정상 동작 - 메트릭 정보 반환

**테스트 단계**:
1. `GET /actuator/metrics` 요청

**예상 결과**:
- HTTP 200 OK
- 사용 가능한 메트릭 목록 반환
- JVM, HTTP, 데이터베이스 메트릭 포함

---

## 테스트 실행 가이드

### 사전 준비

1. **환경 설정**
   - MongoDB 실행 및 연결 확인
   - 백엔드 애플리케이션 실행
   - 테스트용 JWT 토큰 준비

2. **테스트 데이터 준비**
   - 샘플 프로젝트, 학업 과정, 기술 스택 등 생성
   - 다양한 시나리오를 위한 테스트 데이터 세트 준비

3. **도구 준비**
   - API 테스트 도구 (Postman, REST Assured, curl 등)
   - 부하 테스트 도구 (JMeter, Gatling, k6 등)
   - 로그 모니터링 도구

### 테스트 실행 순서

1. **기능 테스트** → **API 테스트** → **데이터베이스 테스트**
2. **보안 테스트** (별도 환경 권장)
3. **성능 테스트** (프로덕션과 유사한 환경)
4. **로깅 및 모니터링 테스트** (전체 테스트와 병행)

### 테스트 결과 문서화

각 테스트 케이스 실행 후 다음 정보를 기록:
- 실행 일시
- 테스트 환경
- 실제 결과
- 예상 결과와의 차이
- 스크린샷 또는 로그 (필요시)

---

## 관련 문서

- [API Specification](./Specifications/API-Specification.md)
- [Database Specification](./Specifications/Database-Specification.md)
- [Architecture Overview](./Architecture/README.md)
- [Getting Started Guide](./Getting-Started.md)

---

**Last Updated**: 2025-01-27  
**Maintained By**: QA Team

