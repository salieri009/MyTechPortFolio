# Frontend Architecture 설계서

## 1. 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | React | 18.2.0 |
| Language | TypeScript | 5.5.3 |
| Build Tool | Vite | 5.3.3 |
| Styling | Styled Components | 6.1.11 |
| State Management | Zustand | 4.5.7 |
| Routing | React Router | 6.23.1 |
| Animation | Framer Motion | 12.23.12 |
| i18n | react-i18next + i18next | 15.6.1 + 25.3.4 |
| HTTP Client | Axios | 1.7.2 |
| Swipe Gesture | react-swipeable | 7.0.2 |
| Email | @emailjs/browser | 4.4.1 |
| Font | Inter | -apple-system fallback |
| Unit Test | Vitest + Testing Library | 1.6.1 |

---

## 2. 프로젝트 구조

```
frontend/src/
├── main.tsx                          # ReactDOM.createRoot 진입점
├── App.tsx                           # 라우팅 + ThemeProvider + FeedbackOverlay
│
├── components/                       # UI 컴포넌트 (Atomic Design 기반)
│   ├── admin/                        # Admin 전용 컴포넌트
│   │   ├── AdminLayout.tsx           # Admin 레이아웃 (사이드바 + 헤더 + Outlet)
│   │   ├── AdminRoute.tsx            # ADMIN 역할 가드
│   │   ├── ConfirmationModal.tsx     # 삭제 확인 모달
│   │   ├── SkeletonCard.tsx          # 로딩 스켈레톤
│   │   └── forms/                    # CRUD 폼
│   │       ├── ProjectForm.tsx       # 프로젝트 생성/수정 폼
│   │       ├── AcademicForm.tsx      # 학업 생성/수정 폼
│   │       └── TestimonialForm.tsx   # 추천사 생성/수정 폼
│   │
│   ├── atoms/                        # Atoms (최소 단위)
│   │   └── SkipToContent/            # 접근성: 본문 바로가기
│   │
│   ├── ui/                           # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   ├── Typography.tsx
│   │   ├── Tag.tsx
│   │   ├── Section.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── SuccessMessage.tsx
│   │   ├── ConfirmationDialog.tsx
│   │   ├── CustomSelect.tsx
│   │   ├── Tooltip/
│   │   └── Layout.tsx
│   │
│   ├── molecules/                    # Molecules (복합 컴포넌트)
│   │   ├── ContactButton/            # 연락 CTA 버튼
│   │   ├── StatCard/                 # 통계 카드
│   │   └── TechStackBadge/           # 기술 스택 뱃지
│   │
│   ├── organisms/                    # Organisms (큰 단위)
│   │   └── InteractiveBackground/    # 인터랙티브 배경 효과
│   │
│   ├── sections/                     # 페이지 섹션
│   │   ├── ProjectShowcaseSection.tsx # Featured 프로젝트 쇼케이스
│   │   ├── JourneyMilestoneSection.tsx # 타임라인 섹션
│   │   ├── TechStackSection.tsx       # 기술 스택 섹션
│   │   ├── TechIcon.tsx
│   │   ├── SectionBridge.tsx
│   │   ├── SectionPurpose.tsx
│   │   └── journey/                   # 마일스톤 하위 컴포넌트
│   │       ├── ComplexityIndicator.tsx
│   │       ├── MilestoneMetrics.tsx
│   │       └── TechStackProgression.tsx
│   │
│   ├── project/                      # 프로젝트 관련
│   │   ├── ProjectCard.tsx           # 프로젝트 카드
│   │   ├── ProjectCardSkeleton.tsx   # 카드 로딩 스켈레톤
│   │   ├── ProjectDetailOverlay.tsx  # 프로젝트 상세 오버레이
│   │   ├── FeaturedProjectCard.tsx
│   │   └── HeroProjectCard.tsx
│   │
│   ├── layout/                       # 레이아웃
│   │   ├── Layout.tsx                # 기본 레이아웃 (Header + Main + Footer)
│   │   ├── MainHeader.tsx            # 메인 헤더
│   │   ├── Footer.tsx
│   │   └── footer/                   # Footer 하위 컴포넌트
│   │       ├── FooterBranding.tsx
│   │       ├── FooterCTA.tsx
│   │       ├── FooterContact.tsx
│   │       ├── FooterLegal.tsx
│   │       ├── FooterNav.tsx
│   │       ├── FooterSocial.tsx
│   │       └── MobileFooter.tsx
│   │
│   ├── feedback/                     # 피드백
│   │   └── FeedbackOverlay.tsx       # 피드백 오버레이 모달 (글로벌)
│   │
│   ├── recruiter/                    # 채용담당자 뷰
│   │   ├── PersonalInfoHeader.tsx
│   │   └── CareerSummaryDashboard.tsx
│   │
│   ├── testimonials/
│   │   └── TestimonialCard.tsx
│   │
│   ├── icons/                        # 아이콘 컴포넌트
│   ├── modals/                       # 모달 컴포넌트
│   ├── common/                       # 공통 컴포넌트
│   ├── Typewriter/                   # 타이핑 애니메이션
│   ├── AdvancedTypewriter/
│   ├── ThemeToggle/                  # 테마 토글
│   ├── LanguageSwiper/               # 언어 스와이프
│   ├── LanguageSwitcher/             # 언어 선택기
│   ├── GoogleLoginButton.tsx
│   └── GitHubLoginButton.tsx
│
├── pages/                            # 페이지 컴포넌트
│   ├── HomePage.tsx (+styles)        # 메인 페이지
│   ├── ProjectsPage.tsx              # 프로젝트 갤러리
│   ├── ProjectDetailPage.tsx         # 프로젝트 상세 (레거시)
│   ├── AcademicsPage.tsx             # 학업 페이지
│   ├── AboutPage.tsx (+styles)       # 소개 페이지
│   ├── FeedbackPage.tsx              # 피드백 (레거시)
│   ├── LoginPage.tsx                 # 로그인 페이지
│   ├── GitHubCallbackPage.tsx        # GitHub OAuth 콜백
│   └── admin/                        # Admin 페이지
│       ├── AdminDashboard.tsx
│       ├── ProjectsAdminPage.tsx
│       ├── AcademicsAdminPage.tsx
│       ├── TestimonialsAdminPage.tsx
│       └── JourneyMilestonesAdminPage.tsx
│
├── services/                         # API 서비스 레이어
│   ├── apiClient.ts                  # Axios 인스턴스 (인터셉터 포함)
│   ├── projects.ts                   # 프로젝트 API
│   ├── academics.ts                  # 학업 API
│   ├── testimonials.ts               # 추천사 API
│   ├── techStacks.ts                 # 기술 스택 API
│   ├── authService.ts                # 인증 API
│   ├── analytics.ts                  # Google Analytics 4
│   ├── securityMonitor.ts            # 보안 이벤트 모니터링
│   ├── admin/                        # Admin 전용 API
│   │   ├── projectsApi.ts
│   │   ├── academicsApi.ts
│   │   └── testimonialsApi.ts
│   └── email/                        # EmailJS 통합
│       └── emailService.ts
│
├── stores/                           # Zustand 전역 상태
│   ├── themeStore.ts                 # 테마 상태 (persist → localStorage)
│   ├── feedbackModalStore.ts         # 피드백 모달 상태
│   ├── projectModalStore.ts          # 프로젝트 모달 상태
│   └── filters.ts                    # 프로젝트 필터/페이지네이션 상태
│
├── styles/                           # 스타일 시스템
│   ├── theme.ts                      # 디자인 토큰 (컬러, 타이포, 간격 등)
│   ├── GlobalStyle.ts                # 전역 CSS 리셋/기본 스타일
│   └── styled.d.ts                   # Styled Components 타입 확장
│
├── i18n/                             # 다국어 지원
│   ├── config.ts                     # i18next 설정
│   └── locales/
│       ├── ko.json                   # 한국어
│       ├── en.json                   # 영어
│       └── ja.json                   # 일본어
│
├── hooks/                            # 커스텀 훅
│   └── useAnalytics.ts              # 페이지 추적 훅
│
├── types/                            # TypeScript 타입
│   ├── domain.ts                     # 도메인 모델 인터페이스
│   ├── api.ts                        # API 응답 타입 (ApiResponse, Page)
│   └── recruiter.ts                  # 채용담당자 뷰 타입
│
├── config/                           # 앱 설정
├── constants/                        # 상수
├── utils/                            # 유틸리티 함수
├── mocks/                            # 개발용 Mock 데이터
└── test/                             # 테스트 유틸
```

---

## 3. 라우팅 아키텍처

### 3.1 라우트 구조

| 경로 | 페이지 | 권한 | 비고 |
|------|--------|------|------|
| `/` | HomePage | Public | Lazy Loading |
| `/projects` | ProjectsPage | Public | 자식 라우트: `:id` |
| `/projects/:id` | ProjectDetailOverlay | Public | 부모(`/projects`) 위 오버레이 |
| `/projects/:id` (직접) | ProjectDetailPage | Public | 레거시 호환, SEO |
| `/academics` | AcademicsPage | Public | Lazy Loading |
| `/about` | AboutPage | Public | Lazy Loading |
| `/login` | LoginPage | Public | Layout 없이 독립 |
| `/auth/github/callback` | GitHubCallbackPage | Public | OAuth 콜백 |
| `/admin` | AdminDashboard | ADMIN | AdminRoute 가드 |
| `/admin/projects` | ProjectsAdminPage | ADMIN | 프로젝트 관리 |
| `/admin/projects/new` | ProjectForm (create) | ADMIN | 프로젝트 생성 |
| `/admin/projects/:id/edit` | ProjectForm (edit) | ADMIN | 프로젝트 수정 |
| `/admin/academics` | AcademicsAdminPage | ADMIN | 학업 관리 |
| `/admin/academics/new` | AcademicForm (create) | ADMIN | 학업 생성 |
| `/admin/academics/:id/edit` | AcademicForm (edit) | ADMIN | 학업 수정 |
| `/admin/testimonials` | TestimonialsAdminPage | ADMIN | 추천사 관리 |
| `/admin/testimonials/new` | TestimonialForm (create) | ADMIN | 추천사 생성 |
| `/admin/testimonials/:id/edit` | TestimonialForm (edit) | ADMIN | 추천사 수정 |
| `/admin/milestones` | JourneyMilestonesAdminPage | ADMIN | 마일스톤 관리 |

### 3.2 코드 스플리팅

- 모든 페이지/폼 컴포넌트가 `React.lazy()`로 동적 import
- `<Suspense fallback={<LoadingSpinner />}>`로 로딩 상태 처리
- Vite 빌드 시 manual chunk splitting: `react-vendor`, `ui-vendor`, `i18n-vendor`

### 3.3 가드 컴포넌트

- **AdminRoute:** localStorage의 토큰에서 역할 확인 → ADMIN이 아니면 접근 거부
- **Layout:** Public 페이지를 Header + Main + Footer로 감싸는 래퍼

---

## 4. State Management

### 4.1 Zustand Stores

| 스토어 | 상태 | 용도 | Persist |
|--------|------|------|---------|
| themeStore | `isDark: boolean` | 다크/라이트 모드 토글 | localStorage (`theme-storage`) |
| feedbackModalStore | `isOpen: boolean, triggerElementRef` | 피드백 모달 열기/닫기, 스크롤 위치 관리, A11y 포커스 복귀 | sessionStorage (스크롤 위치) |
| projectModalStore | `selectedProjectId, triggerElementRef` | 프로젝트 상세 오버레이 상태, A11y 포커스 복귀 | sessionStorage (스크롤 위치) |
| useFilters | `searchTerm, selectedTechStacks, year, sort, currentPage, pageSize, pagination` | 프로젝트 필터/정렬/페이지네이션 상태 | 없음 |

### 4.2 데이터 흐름

```
User Action → Component → Zustand Store Update → Re-render
                ↓
            Service Layer → Axios → Backend API → Response
                ↓
            Component State (useState/useEffect) → UI Update
```

---

## 5. API 레이어

### 5.1 Axios 인스턴스 (apiClient.ts)

**Base URL:**
- Dev: `/api` (Vite proxy → localhost:8080)
- Prod: `VITE_API_BASE_URL` 환경변수

**Request Interceptor:**
- `Authorization: Bearer {token}` 추가 (localStorage에서 `adminToken` 또는 `token`)
- `X-Request-ID` 헤더 추가 (요청 추적용)
- 요청 타임스탬프 기록 (성능 모니터링)

**Response Interceptor:**
- 응답 시간 계산 + 느린 요청 로깅
- `ApiResponse` 래퍼에서 `data` 추출
- `success: false` 시 에러 처리

**에러 처리:**
- 401: 토큰 클리어 + 재로그인 유도
- 403: 접근 거부
- 404: 리소스 없음
- 409: 충돌
- 429: Rate Limit 초과
- 500~504: 서버 에러 + 지수 백오프 재시도 (최대 3회)
- 네트워크 에러: 타임아웃, 연결 불가 처리

### 5.2 서비스별 API 매핑

| 서비스 | Base 경로 | 주요 메서드 |
|--------|----------|-----------|
| projects.ts | /projects | getAll(filters), getById(id), create, update, delete |
| academics.ts | /academics | getAll(page, semester), getById, create, update, delete |
| testimonials.ts | /testimonials | getAll, getFeatured, getById, create, update, delete |
| techStacks.ts | /tech-stacks | getAll(type) |
| authService.ts | /auth | googleLogin, githubLogin, refresh, logout, getMe |

---

## 6. 다국어 지원 (i18n)

- **라이브러리:** react-i18next + i18next-browser-languagedetector
- **지원 언어:** ko (기본), en, ja
- **감지 순서:** localStorage(`i18nextLng`) → 브라우저 언어 → HTML lang
- **번역 파일:** `src/i18n/locales/{ko,en,ja}.json`
- **디버그:** 개발 모드에서만 활성화

---

## 7. 성능 최적화

| 기법 | 적용 |
|------|------|
| Route-based Code Splitting | `React.lazy()` + `Suspense`로 모든 페이지 동적 로드 |
| Manual Chunk Splitting | Vite config에서 react-vendor, ui-vendor, i18n-vendor 분리 |
| Render Optimization | `React.memo`, `useMemo`, `useCallback` 활용 |
| Image Optimization | Lazy loading + WebP 포맷 |
| Bundle Optimization | Terser minification, tree shaking |
| Dev Proxy | Vite dev server → backend proxy (CORS 우회) |

---

## 8. 프론트엔드 보안

| 항목 | 구현 |
|------|------|
| XSS 방지 | React 기본 이스케이핑 + 입력값 검증 |
| 토큰 관리 | Axios Interceptor에서 자동 주입/클리어 |
| 환경 변수 | `.env` 파일로 민감 설정 분리 (VITE_ prefix) |
| 보안 모니터링 | securityMonitor.ts로 보안 이벤트 리포팅 |
| CSRF | Stateless JWT → CSRF 불필요 |

---

## 9. 환경 변수

| 변수 | 용도 |
|------|------|
| VITE_API_BASE_URL | 백엔드 API URL |
| VITE_USE_BACKEND_API | 백엔드/Mock 전환 |
| VITE_AUTH_MODE | 인증 모드 (jwt/demo) |
| VITE_GOOGLE_CLIENT_ID | Google OAuth Client ID |
| VITE_GA_MEASUREMENT_ID | Google Analytics Measurement ID |
| VITE_EMAILJS_SERVICE_ID | EmailJS Service ID |
| VITE_EMAILJS_TEMPLATE_ID | EmailJS Template ID |
| VITE_EMAILJS_PUBLIC_KEY | EmailJS Public Key |
| VITE_FEEDBACK_EMAIL | 피드백 수신 이메일 |

---

## 10. 빌드 및 배포

| 항목 | 설명 |
|------|------|
| Dev 서버 | `npm run dev` → Vite dev server (HMR, proxy) |
| 빌드 | `npm run build` → `tsc -b && vite build` |
| 테스트 | `npm run test` → Vitest |
| 미리보기 | `npm run preview` → 빌드 결과 확인 |
| 배포 | Azure Static Web Apps + nginx.conf |
| Docker | Dockerfile → nginx 기반 SPA 호스팅 |
