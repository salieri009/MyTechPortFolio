# API: 추천사 (Testimonials)

Base Path: `/api/v1/testimonials`

---

## GET `/testimonials`
전체 추천사 조회 - isActive=true 필터 (Public)

## GET `/testimonials/featured`
주요 추천사 조회 - isFeatured=true 필터 (Public)

## GET `/testimonials/type/{type}`
유형별 추천사 조회 (Public)
- Path: type = CLIENT | COLLEAGUE | MENTOR | PROFESSOR | OTHER

## GET `/testimonials/rating/{minRating}`
최소 평점 기준 조회 (Public)
- Path: minRating (1~5)

## GET `/testimonials/{id}`
추천사 상세 조회 (Public)

## POST `/testimonials`
추천사 생성 (Public - 외부인 제출 가능)
- 요청:
```json
{
  "authorName": "string (필수)",
  "authorTitle": "string (optional)",
  "authorCompany": "string (optional)",
  "authorEmail": "string (optional)",
  "authorLinkedInUrl": "string (optional)",
  "content": "string (필수)",
  "rating": 5,
  "type": "COLLEAGUE",
  "source": "MANUAL",
  "projectId": "objectId (optional)"
}
```

## PUT `/testimonials/{id}`
추천사 수정 (ADMIN)

## DELETE `/testimonials/{id}`
추천사 삭제 (ADMIN)
