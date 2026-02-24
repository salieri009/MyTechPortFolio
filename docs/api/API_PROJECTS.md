# API: 프로젝트 (Projects)

Base Path: `/api/v1/projects`

---

## GET `/projects`
프로젝트 목록 조회 (Public)
- 필터: `page` (default: 1), `size` (default: 10, max: 100), `sort` (default: "endDate,DESC"), `techStacks` (comma-separated tech stack names), `year` (integer)
- 응답: 페이지네이션된 프로젝트 목록
  - 각 항목: id, title, summary, startDate, endDate, techStacks[], imageUrl, isFeatured, status

---

## GET `/projects/{id}`
프로젝트 상세 조회 (Public)
- Path: `id` (MongoDB ObjectId, 24자 hex)
- 응답: id, title, summary, description (Markdown), startDate, endDate, githubUrl, demoUrl, techStacks[] (full objects), relatedAcademics[], isFeatured, status, viewCount

---

## POST `/projects`
프로젝트 생성 (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)
- 요청:
```json
{
  "title": "string (필수)",
  "summary": "string (필수)",
  "description": "string (필수, Markdown)",
  "startDate": "2024-01-01",
  "endDate": "2024-06-01",
  "githubUrl": "string (optional)",
  "demoUrl": "string (optional)",
  "techStackIds": ["objectId1", "objectId2"],
  "relatedAcademicIds": ["objectId1"]
}
```
- 응답: 생성된 프로젝트 상세

---

## PUT `/projects/{id}`
프로젝트 수정 (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)
- 요청: POST와 동일 구조
- 응답: 수정된 프로젝트 상세

---

## DELETE `/projects/{id}`
프로젝트 삭제 (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)
- 응답: `{ message: "Project deleted successfully" }`
