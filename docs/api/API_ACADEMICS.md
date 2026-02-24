# API: 학업 (Academics)

Base Path: `/api/v1/academics`

---

## GET `/academics`
학업 목록 조회 (Public)
- 필터: `page` (default: 1), `size` (default: 10, max: 100), `semester` (string, e.g., "2025 AUT")
- 응답: 페이지네이션된 학업 목록
  - 각 항목: id, subjectCode, name, semester, grade, creditPoints, marks, description, status, year, semesterType

---

## GET `/academics/{id}`
학업 상세 조회 (Public)
- 응답: 모든 필드 + 관련 프로젝트 정보

---

## POST `/academics`
학업 생성 (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)
- 요청:
```json
{
  "subjectCode": "31264",
  "name": "UX Design",
  "semester": "2025 AUT",
  "grade": "HIGH_DISTINCTION",
  "creditPoints": 6,
  "marks": 92,
  "description": "string (optional)",
  "status": "COMPLETED",
  "year": 2025,
  "semesterType": "AUTUMN"
}
```

---

## PUT `/academics/{id}`
학업 수정 (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)

---

## DELETE `/academics/{id}`
학업 삭제 (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)
