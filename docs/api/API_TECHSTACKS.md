# API: 기술 스택 (Tech Stacks)

Base Path: `/api/v1/techstacks`

Caching: Caffeine 캐시 적용, TTL 1시간

---

## GET `/techstacks`
기술 스택 전체 조회 (Public)
- 필터: `type` (FRONTEND | BACKEND | DATABASE | DEVOPS | MOBILE | TESTING | OTHER), `proficiencyLevel` (BEGINNER | INTERMEDIATE | ADVANCED | EXPERT)
- 응답: 기술 스택 목록
  - 각 항목: id, name, type, logoUrl, officialUrl, description, proficiencyLevel, usageCount, isPrimary

## GET `/techstacks/expert`
Expert 레벨 기술 스택 조회 (Public)
- 응답: proficiencyLevel=EXPERT인 기술 스택 목록

## GET `/techstacks/advanced`
Advanced 이상 기술 스택 조회 (Public)
- 응답: proficiencyLevel=ADVANCED 또는 EXPERT인 기술 스택 목록

## GET `/techstacks/primary`
주력 기술 스택 조회 (Public)
- 응답: isPrimary=true인 기술 스택 목록
