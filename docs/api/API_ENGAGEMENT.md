# API: 프로젝트 참여도 (Engagement)

Base Path: `/api/v1/engagement`

---

## POST `/engagement/track`
참여도 기록 생성 (Public)
- 요청:
```json
{
  "projectId": "objectId (필수)",
  "sessionId": "string",
  "visitorId": "string",
  "referrer": "string",
  "source": "direct | search | social | referral",
  "deviceType": "mobile | tablet | desktop",
  "browser": "string",
  "userAgent": "string"
}
```
- 응답: 생성된 engagement ID
- 자동 처리: viewedAt 자동 설정, IP 해싱, country/city 추출 (Geo IP)

## PATCH `/engagement/{engagementId}`
참여도 메트릭 업데이트 (Public)
- 요청:
```json
{
  "viewDuration": 45,
  "scrollDepth": 75,
  "githubLinkClicked": true,
  "demoLinkClicked": false,
  "timesViewed": 2
}
```
- 자동 처리: lastInteractionAt 자동 업데이트

## GET `/engagement/projects/{projectId}/stats`
프로젝트 참여 통계 (Public)
- 응답: totalViews, avgViewDuration, avgScrollDepth, githubClickRate, demoClickRate, deviceBreakdown, sourceBreakdown

## GET `/engagement/projects/most-engaged`
가장 참여도 높은 프로젝트 (Public)
- 필터: `limit` (default: 10)
- 응답: 참여도 순 프로젝트 목록
