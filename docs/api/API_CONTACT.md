# API: 연락 (Contact)

Base Path: `/api/v1/contact`

---

## POST `/contact`
연락 폼 제출 (Public)
- 요청:
```json
{
  "name": "string (필수)",
  "email": "string (필수, 이메일 형식)",
  "message": "string (필수)",
  "company": "string (optional)",
  "subject": "string (optional)",
  "phoneNumber": "string (optional)",
  "linkedInUrl": "string (optional)",
  "jobTitle": "string (optional)"
}
```
- 응답: `{ message: "Contact submitted successfully" }`
- 자동 처리:
  - IP 주소 해싱 (개인정보 보호)
  - User Agent 기록
  - Honeypot 스팸 검사
  - Rate Limiting (429 Too Many Requests)
  - Contact 상태 = NEW, isSpam 판정

Security:
- Honeypot 필드 감지 시 자동 스팸 처리 (isSpam=true)
- IP 기반 Rate Limiting
- 프록시 지원: X-Forwarded-For, X-Real-IP 헤더에서 IP 추출
