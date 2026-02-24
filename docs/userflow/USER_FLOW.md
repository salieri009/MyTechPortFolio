# 업무 흐름 및 데이터 정의서 (User Flow)

## 1. 개요

이 문서는 PRD를 업무 프로세스 관점에서 재정리한 것으로, 각 사용자 유형별 동선(클릭 경로)과 시스템 자동 처리 내용을 상세히 기술합니다. 모든 흐름은 실제 라우팅 구조(`App.tsx`)와 API 엔드포인트에 기반합니다.

---

## 2. 핵심 업무 프로세스

### 2.1 포트폴리오 탐색 흐름 (Guest/모든 사용자)

**시작점:** `/` (Home Page) — 외부 링크, 검색 엔진, 직접 접속

**업무 흐름:**
1. 방문자가 Home Page에 진입하면 **Hero Section**이 표시됩니다
   - Typewriter 애니메이션으로 소개 텍스트 순차 출력
   - CTA 버튼 4개: Projects, About, Email, LinkedIn (3+1 배치)
   - Language Swiper로 언어 변경 가능 (스와이프 제스처)

2. 스크롤 다운 시 **Featured Projects** 섹션이 표시됩니다
   - `isFeatured=true`인 프로젝트가 카드 형태로 표시
   - 카드 클릭 시 → `/projects/:id` 오버레이로 상세 진입

3. **Journey Milestone** 섹션에서 기술 성장 타임라인을 확인합니다
   - 연도별 마일스톤 인터랙티브 표시
   - 각 마일스톤의 기술 스택, 복잡도, 성과 표시

4. **Tech Stack** 섹션에서 기술 스택 숙련도를 확인합니다
   - 카테고리별(Frontend/Backend/Database/DevOps 등) 그룹 표시
   - 숙련도 레벨(Beginner~Expert) 시각화

5. **Footer CTA**에서 연락 또는 추가 탐색으로 이동합니다

**참고:** Home Page의 모든 섹션은 Lazy Loading으로 성능 최적화됩니다.
**연관 데이터:** Projects, JourneyMilestones, TechStacks

---

### 2.2 프로젝트 탐색 및 상세 조회 흐름

**시작점:** `/projects` — Navigation 메뉴, Home Featured 카드 클릭, 직접 URL 접근

**업무 흐름:**
1. Projects Page에 진입하면 **프로젝트 갤러리**가 페이지네이션되어 표시됩니다
   - 기본 정렬: `endDate,DESC` (최신 순)
   - 기본 페이지 크기: 20개

2. 사용자가 **필터링**을 적용합니다
   - 기술 스택 필터: 다중 선택 가능 (콤마 구분, `techStacks` 파라미터)
   - 연도 필터: `year` 파라미터
   - 검색어 입력: `searchTerm` (클라이언트 사이드)

3. 프로젝트 카드 클릭 시 **ProjectDetailOverlay** 오버레이가 표시됩니다
   - Hybrid Routing: `/projects` 부모 라우트 위에 `/projects/:id` 자식 라우트가 오버레이로 렌더링
   - 배경의 프로젝트 목록은 유지된 채 상세 정보가 오버레이로 표시
   - URL이 `/projects/:id`로 변경되어 직접 접근/공유 가능

4. 오버레이에서 프로젝트 상세 정보를 확인합니다
   - Description (Markdown 지원)
   - 기술 스택 태그
   - GitHub 링크, Demo 링크
   - 관련 학업 과목 교차 참조
   - 프로젝트 기간 (startDate ~ endDate)

5. 등록 완료 시 시스템이 자동으로 처리하는 내용은 다음과 같습니다:
   - `POST /api/v1/engagement/track` — Engagement 기록 생성
   - 조회 시간, 스크롤 깊이, 링크 클릭 여부 추적
   - `PATCH /api/v1/engagement/:id` — 상호작용 시 메트릭 업데이트

6. 오버레이 닫기 또는 뒤로가기 시 `/projects` 목록으로 복귀합니다
   - 필터 상태가 Zustand Store에 유지되어 있어 목록이 보존됨

**참고:** `/projects/:id`로 직접 접근 시 레거시 `ProjectDetailPage`가 별도 페이지로 렌더링됩니다 (SEO 및 하위 호환성).
**연관 데이터:** Projects, TechStacks, Academics, ProjectEngagement

---

### 2.3 학업 정보 조회 흐름

**시작점:** `/academics` — Navigation 메뉴, 프로젝트 상세의 관련 학업 링크

**업무 흐름:**
1. Academics Page에 진입하면 **과목 목록**이 표시됩니다
   - 학기별 그룹핑 (예: "2025 AUT", "2024 SPR")
   - 성적, 학점, 점수 표시

2. 필터를 적용합니다
   - 학기 필터: `semester` 파라미터
   - 페이지네이션: `page`, `size`

3. 각 과목에서 **관련 프로젝트**가 표시됩니다
   - 프로젝트 클릭 시 → `/projects/:id`로 이동

**연관 데이터:** Academics, Projects

---

### 2.4 피드백/연락 제출 흐름

**시작점:** 모든 페이지의 Contact CTA 버튼 (Footer 또는 Header)

**업무 흐름:**
1. CTA 버튼 클릭 시 **FeedbackOverlay** 모달이 열립니다
   - `feedbackModalStore.openModal()` 호출
   - 현재 스크롤 위치가 sessionStorage에 저장됨
   - Body 스크롤이 잠김

2. 사용자가 폼을 작성합니다
   - **필수:** name, email, message
   - **선택:** company, subject, phoneNumber

3. Submit 클릭 시 다음이 처리됩니다:
   - 클라이언트: EmailJS로 이메일 발송
   - 서버: `POST /api/v1/contact` — 연락 기록 저장
   - 시스템 자동 처리: Honeypot 검사, IP 해싱, Rate Limit 검사
   - 스팸 판정 시 `isSpam=true`로 저장

4. 성공/실패 피드백 표시 후 모달이 닫힙니다
   - `feedbackModalStore.closeModal()` 호출
   - 포커스가 트리거 엘리먼트로 복귀 (A11y Focus Return)
   - 스크롤 위치가 복원됨

**참고:** `/feedback` 레거시 라우트는 비활성화되었습니다. 모든 피드백은 오버레이 모달을 통해 처리됩니다.
**연관 데이터:** Contacts

---

### 2.5 인증 흐름

#### 2.5.1 Google OAuth 로그인

**시작점:** `/login` — Navigation의 Login 버튼

**업무 흐름:**
1. Login Page에서 **Google Sign-In** 버튼을 클릭합니다
2. Google 동의 화면이 표시됩니다
3. 동의 후 Google ID Token이 프론트엔드로 반환됩니다
4. `POST /api/v1/auth/google` — ID Token을 서버로 전송
   - 서버가 Google Token을 검증
   - 최초 로그인 시 User 문서 자동 생성
   - JWT Access Token + Refresh Token 발급
5. 2FA가 활성화된 경우 TOTP 코드 입력 화면으로 전환
6. 토큰을 localStorage에 저장 (`token`, `adminToken`)
7. ADMIN 역할이면 `/admin`으로, 아니면 이전 페이지로 리다이렉트

#### 2.5.2 GitHub OAuth 로그인

**시작점:** `/login` — GitHub Sign-In 버튼

**업무 흐름:**
1. Login Page에서 **GitHub Sign-In** 버튼을 클릭합니다
2. GitHub Authorization 페이지로 리다이렉트
3. 승인 후 `/auth/github/callback`으로 콜백
4. GitHubCallbackPage에서 authorization code를 access token으로 교환
5. `POST /api/v1/auth/github` — Access Token을 서버로 전송
6. 이하 Google OAuth와 동일한 흐름

#### 2.5.3 Token Refresh 흐름

**시작점:** API 호출 시 401 Unauthorized 응답

**업무 흐름:**
1. Axios Response Interceptor가 401 응답을 감지
2. `POST /api/v1/auth/refresh` — Refresh Token으로 새 Access Token 요청
3. 성공 시: 새 Access Token으로 원래 요청 재시도
4. 실패 시: localStorage 클리어 → `/login`으로 리다이렉트

#### 2.5.4 로그아웃 흐름

**시작점:** Header의 Logout 버튼

**업무 흐름:**
1. `POST /api/v1/auth/logout` — 서버에서 토큰 무효화
2. localStorage에서 `token`, `adminToken` 제거
3. `/`로 리다이렉트

---

### 2.6 Admin CRUD 흐름 (공통 패턴)

**시작점:** `/admin` — AdminDashboard

**업무 흐름 (프로젝트 예시, 학업/추천사도 동일 패턴):**

1. `/admin`에서 **AdminDashboard**의 통계를 확인합니다
2. 좌측 사이드바에서 **Projects** 메뉴를 클릭합니다
3. `/admin/projects`에서 프로젝트 목록을 확인합니다
4. **생성:** "New Project" 버튼 클릭 → `/admin/projects/new`
   - ProjectForm (mode="create")이 표시됨
   - 폼 작성 후 Submit → `POST /api/v1/projects`
   - 성공 시 `/admin/projects` 목록으로 복귀
5. **수정:** 목록에서 Edit 버튼 클릭 → `/admin/projects/:id/edit`
   - ProjectForm (mode="edit")이 기존 데이터로 채워져 표시됨
   - 폼 수정 후 Submit → `PUT /api/v1/projects/:id`
6. **삭제:** 목록에서 Delete 버튼 클릭
   - ConfirmationModal로 삭제 확인
   - 확인 시 `DELETE /api/v1/projects/:id`
   - 목록 자동 갱신

**참고:** 모든 Admin 라우트는 `AdminRoute` 컴포넌트로 보호됩니다. ADMIN 역할이 아니면 접근이 거부됩니다.
**연관 데이터:** Projects, Academics, Testimonials (각각 동일 패턴)

---

### 2.7 테마 전환 흐름

**시작점:** Header의 Theme Toggle 버튼

**업무 흐름:**
1. Toggle 버튼 클릭 → `themeStore.toggleTheme()` 호출
2. `isDark` 상태가 반전됨
3. Zustand persist 미들웨어가 localStorage(`theme-storage`)에 저장
4. ThemeProvider가 `lightTheme` / `darkTheme` 전환
5. 전체 UI가 새 테마로 즉시 리렌더링

---

### 2.8 언어 전환 흐름

**시작점:** Header의 Language Switcher 또는 Home의 Language Swiper

**업무 흐름:**
1. 언어 선택: ko(한국어) / en(영어) / ja(일본어)
2. `i18next.changeLanguage(lang)` 호출
3. localStorage(`i18nextLng`)에 저장
4. 전체 UI 텍스트가 선택 언어로 즉시 변경
5. SEO 엔드포인트 호출 시 `locale` 파라미터에 반영

---

## 3. 관리 데이터 및 상태 정의

### 3.1 Projects

**기본 정보:**

| 필드 | 설명 | 필수 여부 |
|------|------|----------|
| title | 프로젝트명 | 필수 |
| summary | 짧은 요약 | 필수 |
| description | 상세 설명 (Markdown) | 필수 |
| startDate | 시작일 | 필수 |
| endDate | 종료일 | 필수 |
| githubUrl | GitHub 저장소 URL | 선택 |
| demoUrl | 데모 사이트 URL | 선택 |
| repositoryName | GitHub 저장소명 | 선택 |
| isFeatured | Home 노출 여부 | 선택 (기본: false) |
| techStackIds | 사용 기술 스택 ID 목록 | 필수 |
| relatedAcademicIds | 관련 학업 ID 목록 | 선택 |

**상태값:**

| 상태 | 한국어 | 설명 | 전환 조건 | 자동/수동 |
|------|--------|------|----------|----------|
| planning | 기획 중 | 기획 단계 | 초기 등록 | 수동 |
| in_progress | 진행 중 | 개발 진행 | Admin 전환 | 수동 |
| completed | 완료 | 개발 완료 | Admin 전환 | 수동 |
| archived | 보관 | 비활성화 | Admin 전환 | 수동 |

### 3.2 Academics

**기본 정보:**

| 필드 | 설명 | 필수 여부 |
|------|------|----------|
| subjectCode | 과목 코드 (예: "31264") | 필수 |
| name | 과목명 | 필수 |
| semester | 학기 정보 (예: "2025 AUT") | 필수 |
| year | 학년도 | 필수 |
| semesterType | 학기 구분 (SPRING/AUTUMN) | 필수 |
| grade | 성적 (HD/D/C/P) | 선택 |
| creditPoints | 학점 | 선택 |
| marks | 점수 | 선택 |
| description | 과목 설명 | 선택 |
| status | 이수 상태 | 선택 (기본: completed) |

**상태값:**

| 상태 | 한국어 | 설명 | 전환 조건 | 자동/수동 |
|------|--------|------|----------|----------|
| enrolled | 수강 중 | 현재 수강 | 학기 등록 시 | 수동 |
| completed | 이수 완료 | 성적 확정 | 성적 입력 시 | 수동 |
| exemption | 면제 | 학점 인정 | 면제 처리 시 | 수동 |

### 3.3 Contacts

**기본 정보:**

| 필드 | 설명 | 필수 여부 |
|------|------|----------|
| name | 이름 | 필수 |
| email | 이메일 | 필수 |
| message | 메시지 | 필수 |
| company | 회사명 | 선택 |
| subject | 제목 | 선택 |
| phoneNumber | 전화번호 | 선택 |
| linkedInUrl | LinkedIn URL | 선택 |
| jobTitle | 직책 | 선택 |

**상태값:**

| 상태 | 한국어 | 설명 | 전환 조건 | 자동/수동 |
|------|--------|------|----------|----------|
| new | 새 연락 | 미확인 | 제출 시 | 자동 |
| read | 읽음 | Admin 확인 | Admin 열람 시 | 수동 |
| replied | 답변 완료 | 답변 발송됨 | 답변 시 | 수동 |
| archived | 보관 | 처리 완료 | 보관 처리 시 | 수동 |
| spam | 스팸 | 스팸으로 분류 | Honeypot/수동 | 자동/수동 |

### 3.4 Testimonials

**기본 정보:**

| 필드 | 설명 | 필수 여부 |
|------|------|----------|
| authorName | 작성자 이름 | 필수 |
| content | 추천사 내용 | 필수 |
| type | 유형 (CLIENT/COLLEAGUE/MENTOR/PROFESSOR/OTHER) | 필수 |
| authorTitle | 직함 | 선택 |
| authorCompany | 회사명 | 선택 |
| rating | 평점 (1~5) | 선택 |
| isFeatured | 주요 표시 여부 | 선택 (기본: false) |
| projectId | 관련 프로젝트 ID | 선택 |

### 3.5 Journey Milestones

**기본 정보:**

| 필드 | 설명 | 필수 여부 |
|------|------|----------|
| year | 연도/범위 (예: "2015", "2015~2020") | 필수 |
| title | 마일스톤 제목 | 필수 |
| description | 상세 설명 | 필수 |
| icon | 아이콘 식별자 | 선택 |
| techStack | 관련 기술 스택 목록 | 선택 |
| technicalComplexity | 기술 복잡도 (1~5) | 선택 (기본: 1) |
| projectCount | 프로젝트 수 | 선택 (기본: 0) |

**상태값:**

| 상태 | 한국어 | 설명 | 전환 조건 |
|------|--------|------|----------|
| completed | 완료 | 달성된 마일스톤 | 기본값 |
| current | 현재 | 현재 진행 중 | 수동 전환 |
| planned | 계획 | 향후 계획 | 수동 전환 |

---

## 4. 페이지 구조 (업무 흐름 기반)

### 4.1 Public 영역

**Home (`/`):**
Layout → Hero Section (Typewriter + CTA 버튼) → Featured Projects (카드 갤러리, 카드 클릭 시 → `/projects/:id` 오버레이) → Journey Milestone Section (인터랙티브 타임라인) → Tech Stack Section (카테고리별 그리드) → Footer CTA

**Projects (`/projects`):**
Layout → 필터 바 (기술 스택 / 연도 / 정렬) → 프로젝트 카드 그리드 (페이지네이션) → `<Outlet />` (자식 라우트: ProjectDetailOverlay)
- 카드 클릭 시 → 오버레이가 같은 페이지 위에 표시 (URL: `/projects/:id`)
- 오버레이 닫기 시 → `/projects`로 복귀, 필터 상태 유지

**Project Detail Overlay:**
오버레이 배경 → 프로젝트 상세 패널 (title, description, techStacks, GitHub/Demo 링크, 관련 학업)

**Academics (`/academics`):**
Layout → 필터 (학기) → 과목 목록 (학기별 그룹) → 관련 프로젝트 링크

**About (`/about`):**
Layout → 프로필 섹션 → Journey Timeline → Tech Stack 시각화 → 이력서 다운로드 섹션

**Login (`/login`):**
Google Sign-In 버튼 + GitHub Sign-In 버튼 (Layout 없이 독립 페이지)

**FeedbackOverlay (글로벌 모달):**
모든 페이지 위에 오버레이로 표시 → 연락 폼 (name, email, company, subject, message) → Submit/Cancel

### 4.2 Admin 영역

**AdminDashboard (`/admin`):**
AdminLayout (좌측 사이드바 + 상단 헤더) → 통계 카드 그리드 → 최근 활동 목록

**Projects 관리 (`/admin/projects`):**
AdminLayout → 프로젝트 목록 테이블 → "New" 버튼 → `/admin/projects/new`
- 행 클릭/Edit 버튼 → `/admin/projects/:id/edit`
- Delete 버튼 → ConfirmationModal → 확인 시 삭제

**Academics 관리 (`/admin/academics`):**
동일 패턴 — 목록 테이블 / New / Edit / Delete

**Testimonials 관리 (`/admin/testimonials`):**
동일 패턴 — 목록 테이블 / New / Edit / Delete

**Milestones 관리 (`/admin/milestones`):**
AdminLayout → 마일스톤 목록 (생성/수정 폼은 추후 추가 예정)

---

## 5. 자동화 규칙 정리

### 5.1 상태 자동 변경

| 트리거 | 자동 처리 |
|--------|----------|
| Access Token 만료 (401 응답) | Interceptor가 Refresh Token으로 자동 갱신 시도 |
| 연락 폼 Honeypot 감지 | Contact 상태를 `spam`으로 자동 설정, `isSpam=true` |
| Rate Limit 초과 | 429 응답 반환, 요청 차단 |

### 5.2 자동 생성

| 트리거 | 자동 생성 내용 |
|--------|--------------|
| 프로젝트 상세 조회 | ProjectEngagement 문서 생성 (viewedAt, sessionId, deviceType 등) |
| 이력서 다운로드 | Resume.downloadCount 자동 증가, lastDownloadedAt 업데이트 |
| OAuth 최초 로그인 | User 문서 자동 생성 (oauthProvider, oauthId, role=USER) |
| 페이지 접근 | SEO Controller가 locale 기반 메타 태그 동적 생성 |

### 5.3 분석 이벤트 추적

| 이벤트 | 추적 대상 | 시점 |
|--------|----------|------|
| page_view | GA4 | 모든 페이지 전환 시 |
| project_view | GA4 + ProjectEngagement | 프로젝트 상세 조회 시 |
| file_download | GA4 + Resume.downloadCount | 이력서 다운로드 시 |
| contact_click | GA4 | 연락 CTA 클릭 시 |
| filter_usage | GA4 | 필터/정렬 사용 시 |
