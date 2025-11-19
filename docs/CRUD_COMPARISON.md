---
title: "Frontend vs Backend CRUD Comparison"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Analysis"
audience: ["Developers", "Project Managers"]
---

# Frontend vs Backend CRUD Comparison

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

이 문서는 프론트엔드와 백엔드 간의 CRUD 기능 구현 상태를 비교 분석합니다.

---

## 📊 Summary

### ✅ 완전히 구현된 CRUD (Frontend + Backend)

| 리소스 | Frontend Admin API | Backend Controller | 상태 |
|--------|-------------------|-------------------|------|
| **Projects** | ✅ `projectsApi.ts` | ✅ `ProjectController.java` | 완료 |
| **Academics** | ✅ `academicsApi.ts` | ✅ `AcademicController.java` | 완료 |
| **Journey Milestones** | ✅ `milestonesApi.ts` | ✅ `JourneyMilestoneController.java` | 완료 |
| **Testimonials** | ✅ `testimonialsApi.ts` | ✅ `TestimonialController.java` | ✅ **완료 (2025-11-17)** |

### ⚠️ 백엔드에만 CRUD가 있는 리소스

| 리소스 | Frontend Admin API | Backend Controller | 상태 |
|--------|-------------------|-------------------|------|
| **Project Media** | ✅ `projectMediaApi.ts` (API 완료) | ✅ `ProjectMediaController.java` | ⚠️ **관리 UI 필요** |

### 📋 Read-Only 리소스 (CRUD 불필요)

| 리소스 | Frontend | Backend | 설명 |
|--------|----------|---------|------|
| **Tech Stack** | Public API | `TechStackController.java` | 읽기 전용 |
| **SEO** | Public API | `SeoController.java` | 읽기 전용 |
| **Resume** | Public API | `ResumeController.java` | 읽기 전용 |
| **Performance** | 없음 | `PerformanceController.java` | 모니터링 전용 |

---

## 🔍 상세 분석

### 1. Projects ✅

**Frontend:**
- 파일: `frontend/src/services/admin/projectsApi.ts`
- 기능: `getAll`, `getById`, `create`, `update`, `delete`
- 페이지: `frontend/src/pages/admin/ProjectsAdminPage.tsx`

**Backend:**
- 파일: `backend/src/main/java/com/mytechfolio/portfolio/controller/ProjectController.java`
- 엔드포인트:
  - `GET /api/v1/projects` - 목록 조회
  - `GET /api/v1/projects/{id}` - 상세 조회
  - `POST /api/v1/projects` - 생성
  - `PUT /api/v1/projects/{id}` - 수정
  - `DELETE /api/v1/projects/{id}` - 삭제

**상태**: ✅ 완전히 구현됨

---

### 2. Academics ✅

**Frontend:**
- 파일: `frontend/src/services/admin/academicsApi.ts`
- 기능: `getAll`, `getById`, `create`, `update`, `delete`
- 페이지: `frontend/src/pages/admin/AcademicsAdminPage.tsx`

**Backend:**
- 파일: `backend/src/main/java/com/mytechfolio/portfolio/controller/AcademicController.java`
- 엔드포인트:
  - `GET /api/v1/academics` - 목록 조회
  - `GET /api/v1/academics/{id}` - 상세 조회
  - `POST /api/v1/academics` - 생성 (권한 필요)
  - `PUT /api/v1/academics/{id}` - 수정 (권한 필요)
  - `DELETE /api/v1/academics/{id}` - 삭제 (권한 필요)

**상태**: ✅ 완전히 구현됨

---

### 3. Journey Milestones ✅

**Frontend:**
- 파일: `frontend/src/services/admin/milestonesApi.ts`
- 기능: `getAll`, `getById`, `create`, `update`, `delete`, `getByStatus`

**Backend:**
- 파일: `backend/src/main/java/com/mytechfolio/portfolio/controller/JourneyMilestoneController.java`
- 엔드포인트:
  - `GET /api/v1/journey-milestones` - 목록 조회
  - `GET /api/v1/journey-milestones/{id}` - 상세 조회
  - `POST /api/v1/journey-milestones` - 생성
  - `PUT /api/v1/journey-milestones/{id}` - 수정
  - `DELETE /api/v1/journey-milestones/{id}` - 삭제
  - `GET /api/v1/journey-milestones/status/{status}` - 상태별 조회

**상태**: ✅ 완전히 구현됨

---

### 4. Testimonials ✅

**Frontend:**
- ✅ Admin API 서비스: `frontend/src/services/admin/testimonialsApi.ts`
  - `getAll(filters?)` - 목록 조회 (필터링 지원)
  - `getById(id)` - 상세 조회
  - `getFeatured()` - 추천 목록
  - `getByType(type)` - 타입별 조회
  - `getByRating(minRating)` - 평점별 조회
  - `create(data)` - 생성 ✅
  - `update(id, data)` - 수정 ✅
  - `delete(id)` - 삭제 ✅
- ✅ Admin 페이지: `frontend/src/pages/admin/TestimonialsAdminPage.tsx`
- ✅ Admin 폼: `frontend/src/components/admin/forms/TestimonialForm.tsx`
- ✅ 라우팅: `/admin/testimonials`, `/admin/testimonials/new`, `/admin/testimonials/:id/edit`
- ✅ 네비게이션: AdminLayout에 Testimonials 메뉴 추가

**Backend:**
- 파일: `backend/src/main/java/com/mytechfolio/portfolio/controller/TestimonialController.java`
- 엔드포인트:
  - `GET /api/v1/testimonials` - 목록 조회
  - `GET /api/v1/testimonials/featured` - 추천 목록
  - `GET /api/v1/testimonials/type/{type}` - 타입별 조회
  - `GET /api/v1/testimonials/rating/{minRating}` - 평점별 조회
  - `GET /api/v1/testimonials/{id}` - 상세 조회
  - `POST /api/v1/testimonials` - 생성 ✅
  - `PUT /api/v1/testimonials/{id}` - 수정 ✅
  - `DELETE /api/v1/testimonials/{id}` - 삭제 ✅

**상태**: ✅ **완전히 구현됨 (2025-11-17)**

**구현된 기능:**
- 타입 필터링 (CLIENT, COLLEAGUE, MENTOR, PROFESSOR, OTHER)
- 평점 필터링 (최소 평점)
- 별점 시각화
- 타입별 배지 색상 구분
- 작성자 정보 표시 (이름, 직책, 회사)
- Featured 표시

---

### 5. Project Media ⚠️

**Frontend:**
- ✅ Admin API 서비스: `frontend/src/services/admin/projectMediaApi.ts`
  - `getAll(projectId)` - 모든 미디어 조회 ✅
  - `getGallery(projectId)` - 활성 미디어만 조회 ✅
  - `getPrimary(projectId)` - 대표 이미지 조회 ✅
  - `upload(projectId, file, request?)` - 업로드 ✅
  - `update(projectId, mediaId, request)` - 메타데이터 수정 ✅
  - `delete(projectId, mediaId)` - 삭제 ✅
- ⚠️ 관리 UI 없음 (Project 편집 페이지에 통합 필요)

**Backend:**
- 파일: `backend/src/main/java/com/mytechfolio/portfolio/controller/ProjectMediaController.java`
- 엔드포인트:
  - `POST /api/v1/projects/{projectId}/media` - 업로드 ✅ (권한 필요)
  - `GET /api/v1/projects/{projectId}/media` - 목록 조회 ✅
  - `GET /api/v1/projects/{projectId}/media/gallery` - 갤러리 조회 ✅
  - `GET /api/v1/projects/{projectId}/media/primary` - 대표 이미지 조회 ✅
  - `PUT /api/v1/projects/{projectId}/media/{mediaId}` - 수정 ✅ (권한 필요)
  - `DELETE /api/v1/projects/{projectId}/media/{mediaId}` - 삭제 ✅ (권한 필요)

**상태**: ⚠️ **API는 완료, 관리 UI 필요 (2025-11-17)**

**구현된 기능:**
- ✅ 전체 CRUD API 서비스
- ✅ 파일 업로드 (multipart/form-data)
- ✅ 메타데이터 수정 (altText, caption, displayOrder, isPrimary)

**필요한 작업:**
1. Project 편집 페이지에 Media 갤러리 관리 섹션 추가
2. Media 업로드 UI (드래그 앤 드롭 지원)
3. Media 목록 표시 및 편집 UI
4. Media 삭제 확인 다이얼로그

---

## 📝 권장 사항

### ✅ 완료된 작업 (2025-11-17)

**Testimonials Admin UI:**
- ✅ `frontend/src/services/admin/testimonialsApi.ts` 생성
- ✅ `frontend/src/pages/admin/TestimonialsAdminPage.tsx` 생성
- ✅ `frontend/src/components/admin/forms/TestimonialForm.tsx` 생성
- ✅ 라우팅 추가 (`/admin/testimonials/*`)
- ✅ AdminLayout 네비게이션에 Testimonials 메뉴 추가
- ✅ `ADMIN_TESTIMONIALS_PAGE_STRUCTURE.xml` 생성

### ✅ 완료된 작업 (2025-11-17)

**Project Media Admin API:**
- ✅ `frontend/src/services/admin/projectMediaApi.ts` 생성 (전체 CRUD)
- ✅ `uploadApi.ts` 업데이트 (projectMediaApi 사용하도록 변경)

### 우선순위 1: Project Media 관리 UI

**이유:**
- 프로젝트에 미디어 관리가 중요함
- 백엔드 API와 프론트엔드 API 서비스가 완전히 구현되어 있음
- Project 편집 페이지와 통합 필요

**구현 항목:**
1. Project 편집 페이지에 Media 갤러리 관리 섹션 추가
2. Media 업로드 UI (드래그 앤 드롭 지원)
3. Media 목록 표시 및 편집 UI
4. Media 삭제 확인 다이얼로그

---

## 🔗 관련 문서

- [Backend Controller Patterns](../backend/docs/PATTERNS/Controller-Patterns.md)
- [Frontend Admin API Services](../frontend/src/services/admin/README.md)
- [Creating Controllers Guide](../backend/docs/GUIDES/Creating-Controllers.md)

---

## 📅 업데이트 이력

- **2025-11-17**: 
  - 초기 문서 작성 및 CRUD 비교 분석
  - Testimonials Admin UI 완전 구현 완료
    - Admin API 서비스 생성
    - Admin 페이지 및 폼 컴포넌트 생성
    - 라우팅 및 네비게이션 추가
    - XML 구조 문서 생성
  - Project Media Admin API 서비스 완료
    - 전체 CRUD API 서비스 생성
    - uploadApi.ts 업데이트

