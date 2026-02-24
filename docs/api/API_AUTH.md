# API: 인증 (Auth)

Base Path: `/api/v1/auth`

---

## POST `/auth/google`
Google OAuth 로그인 (Public)
- 요청:
```json
{
  "googleIdToken": "string",
  "twoFactorCode": "string (optional)"
}
```
- 응답: `{ accessToken, refreshToken, user: { id, email, displayName, role, profileImageUrl } }`
- 동작: Google ID Token 검증 → 최초 로그인 시 User 문서 자동 생성 → JWT 발급

---

## POST `/auth/github`
GitHub OAuth 로그인 (Public)
- 요청:
```json
{
  "accessToken": "string",
  "twoFactorCode": "string (optional)"
}
```
- 응답: 동일 구조
- 동작: GitHub Access Token으로 사용자 정보 조회 → JWT 발급

---

## POST `/auth/refresh`
토큰 갱신 (Public)
- 요청: `{ "refreshToken": "string" }`
- 응답: `{ accessToken, refreshToken }`

---

## POST `/auth/logout`
로그아웃 (Auth Required)
- 요청: 없음 (Authorization 헤더로 인증)
- 응답: `{ message: "Logged out successfully" }`
- 동작: 서버에서 토큰 무효화

---

## GET `/auth/profile`
현재 사용자 프로필 (Auth Required)
- 응답: `{ id, email, displayName, role, profileImageUrl, twoFactorEnabled }`

---

## POST `/auth/2fa/setup`
2FA 설정 (Auth Required, ADMIN)
- 응답: `{ secret, qrCodeUrl }`

## POST `/auth/2fa/verify`
2FA 코드 검증 (Auth Required)
- 요청: `{ "code": "123456" }`
- 응답: `{ verified: true }`

## POST `/auth/2fa/confirm`
2FA 설정 확인 (Auth Required, ADMIN)
- 요청: `{ "code": "123456" }`
- 응답: `{ twoFactorEnabled: true }`
