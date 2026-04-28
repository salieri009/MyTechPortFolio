# 제품 요구사항 정의서 (PRD)

## 제품명: MyTechPortfolio
- 버전: 1.0.0
- 작성일: 2026-02-24
- Live URL: https://salieri009.studio

---

## 1. 제품 개요

### 1.1 배경 및 문제

**핵심 문제:**
- **포트폴리오 차별화 부재:** 대부분의 개발자 포트폴리오가 정적 사이트로, 기술적 깊이와 DevOps 역량을 보여주기 어려움
- **채용담당자 관점 부재:** 기존 포트폴리오는 개발자 관점으로 설계되어, 채용담당자가 핵심 정보를 빠르게 파악하기 어려움
- **학업-프로젝트 연계 부족:** 학업 성과와 실제 프로젝트 간의 연결고리를 보여주는 플랫폼이 부족
- **다국어 지원 미비:** 글로벌 취업 시장에서 한국어/영어/일본어 동시 지원이 가능한 포트폴리오가 희소
- **실시간 데이터 관리 부재:** 프로젝트, 학업 정보를 실시간으로 관리하고 업데이트할 수 있는 Admin 기능이 없는 정적 사이트가 대부분

### 1.2 제품 비전

"클라우드 네이티브 기술 역량과 풀스택 개발 능력을 실제 운영되는 서비스로 증명하는 포트폴리오 플랫폼"

React + Spring Boot + MongoDB 기반의 풀스택 웹 애플리케이션으로, Azure 클라우드 인프라 위에서 운영됩니다. 단순한 정적 포트폴리오를 넘어 실시간 데이터 관리, OAuth 인증, 참여도 추적, 다국어 지원 등 엔터프라이즈급 기능을 구현하여 기술적 깊이를 직접 보여줍니다.

### 1.3 핵심 가치

| 가치 | 설명 |
|------|------|
| 기술 증명 (Proof of Skill) | 포트폴리오 자체가 풀스택 + DevOps 역량의 실증 |
| 채용자 최적화 (Recruiter-First) | F-패턴/Z-패턴 레이아웃으로 핵심 정보 빠른 파악 |
| 실시간 관리 (Real-Time Management) | Admin 대시보드를 통한 콘텐츠 CRUD 관리 |
| 글로벌 접근성 (Global Accessibility) | 한국어/영어/일본어 3개 국어 지원 |
| 보안 우선 (Security First) | OAuth 2.0, JWT, 2FA 등 엔터프라이즈급 보안 |

---

## 2. 사용자 및 권한

### 2.1 타겟 사용자

- **채용담당자/헤드헌터:** IT 기업 HR팀, 기술 리크루터 (주 타겟)
- **동료 개발자:** 기술 교류 및 협업 가능성 탐색
- **교수/멘토:** 학업 성과 및 기술 성장 확인
- **포트폴리오 소유자 (Admin):** 콘텐츠 관리 및 분석

### 2.2 사용자 유형

| 유형 | 설명 |
|------|------|
| GUEST | 인증 없이 Public 페이지 열람 가능한 일반 방문자 |
| USER | Google/GitHub OAuth로 로그인한 등록 사용자 |
| RECRUITER | 이력서 다운로드, 참여도 추적 등 확장 접근 가능 |
| ADMIN | 전체 CRUD, 대시보드, 분석 기능 사용 가능한 관리자 |

### 2.3 권한 체계

| 권한 영역 | GUEST | USER | RECRUITER | ADMIN |
|-----------|-------|------|-----------|-------|
| Public 페이지 조회 | O | O | O | O |
| 프로젝트 상세 조회 | O | O | O | O |
| 학업 정보 조회 | O | O | O | O |
| 피드백/연락 제출 | O | O | O | O |
| 이력서 다운로드 | O | O | O | O |
| 프로젝트 CRUD | X | X | X | O |
| 학업 CRUD | X | X | X | O |
| 추천사 CRUD | X | X | X | O |
| 마일스톤 CRUD | X | X | X | O |
| 대시보드/분석 | X | X | X | O |

### 2.4 사용자별 주요 업무

| 역할 | 주요 업무 | 사용 빈도 |
|------|----------|----------|
| GUEST | 포트폴리오 탐색, 프로젝트 열람, 연락 보내기 | 수시 (외부 유입) |
| RECRUITER | 프로젝트 분석, 이력서 다운로드, 기술 역량 평가 | 채용 시즌 집중 |
| ADMIN | 프로젝트/학업/추천사 관리, 분석 확인 | 주 2~3회 |

---

## 3. 핵심 기능

### 3.1 Public 페이지

#### 3.1.1 Home Page (`/`)
- **Hero Section:** Typewriter 애니메이션으로 소개 텍스트 표시
- **Featured Projects:** `isFeatured=true`인 프로젝트 카드 쇼케이스
- **Journey Timeline:** 기술 성장 과정을 인터랙티브 타임라인으로 시각화
- **Tech Stack:** 카테고리별 기술 스택 숙련도 표시
- **Contact CTA:** 피드백 오버레이 모달 트리거 버튼

#### 3.1.2 Projects Page (`/projects`)
- 페이지네이션된 프로젝트 갤러리 (카드 형태)
- 기술 스택별 필터링 (콤마 구분)
- 연도별 필터링
- 정렬: `endDate` 기준 DESC (기본값)
- **Hybrid Routing:** 프로젝트 클릭 시 오버레이(`/projects/:id`)로 상세 표시
- GitHub/Demo 링크, 관련 학업 표시
- 프로젝트 Engagement 추적 (조회 시간, 스크롤 깊이, 링크 클릭)

#### 3.1.3 Academics Page (`/academics`)
- 학기별 과목 목록 표시
- 성적: HD(High Distinction), D(Distinction), C(Credit), P(Pass) 스케일
- 학점(Credit Points) 및 점수(Marks) 표시
- 관련 프로젝트 교차 참조

#### 3.1.4 About Page (`/about`)
- 개인 프로필 정보
- Journey Milestone 인터랙티브 타임라인
- 카테고리별 기술 스택 시각화
- 이력서 다운로드 (다중 버전 지원)
- 기술 숙련도 진행률 표시

#### 3.1.5 Feedback (피드백 오버레이 모달)
- 모든 페이지에서 CTA 버튼으로 접근 가능
- 입력 필드: name, email, company, subject, message
- Honeypot 스팸 방지
- IP 기반 Rate Limiting
- EmailJS 클라이언트 사이드 이메일 발송

### 3.2 인증 시스템

- **Google OAuth 2.0:** ID 토큰 기반 로그인
- **GitHub OAuth:** Authorization Code를 백엔드에서 Access Token으로 교환하는 로그인 플로우
- **JWT 세션:** Access Token (24시간) + Refresh Token (7일)
- **2FA 지원:** TOTP 기반 이중 인증
- **RBAC:** USER, ADMIN, RECRUITER, GUEST 역할 기반 접근 제어

### 3.3 Admin Dashboard (`/admin/*`)

- **AdminRoute** 보호 라우트 (ADMIN 역할 필수)
- **프로젝트 CRUD:** 목록/생성/수정/삭제 (`/admin/projects`)
- **학업 CRUD:** 목록/생성/수정/삭제 (`/admin/academics`)
- **추천사 CRUD:** 목록/생성/수정/삭제 (`/admin/testimonials`)
- **마일스톤 관리:** 목록/관리 (`/admin/milestones`)
- **대시보드:** 통계 및 분석

### 3.4 다국어 지원 (i18n)

- 지원 언어: 한국어(ko, 기본), 영어(en), 일본어(ja)
- 브라우저 언어 자동 감지
- Header의 Language Switcher로 전환
- SEO 엔드포인트의 locale 파라미터 지원

### 3.5 테마 시스템

- Dark/Light 모드 토글
- Zustand persist 미들웨어로 localStorage 저장
- DevOps 테마 컬러 팔레트 (Slate Dark + Electric Blue)

---

## 4. 관리 데이터 및 상태 정의

### 4.1 Projects

**필수 정보:** title, summary, description, startDate, endDate, techStackIds
**선택 정보:** githubUrl, demoUrl, repositoryName, isFeatured, relatedAcademicIds

**상태 흐름:**

| 상태 | 설명 | 전환 조건 |
|------|------|----------|
| planning | 기획 단계 | 초기 등록 시 |
| in_progress | 개발 진행 중 | 개발 시작 시 수동 전환 |
| completed | 완료 | 개발 완료 시 수동 전환 |
| archived | 보관 | 비활성화 시 수동 전환 |

### 4.2 Academics

**필수 정보:** subjectCode, name, semester, year, semesterType
**선택 정보:** grade, creditPoints, marks, description, status

**상태 흐름:**

| 상태 | 설명 | 전환 조건 |
|------|------|----------|
| enrolled | 수강 중 | 학기 등록 시 |
| completed | 이수 완료 | 성적 확정 시 수동 전환 |
| exemption | 면제 | 학점 인정 시 수동 전환 |

### 4.3 Contacts

**필수 정보:** name, email, message
**선택 정보:** company, subject, phoneNumber, linkedInUrl, jobTitle

**상태 흐름:**

| 상태 | 설명 | 전환 조건 |
|------|------|----------|
| new | 새 연락 | 제출 시 자동 |
| read | 읽음 | Admin 확인 시 수동 전환 |
| replied | 답변 완료 | 답변 시 수동 전환 |
| archived | 보관 | 처리 완료 후 수동 전환 |
| spam | 스팸 | 스팸 판별 시 자동/수동 전환 |

### 4.4 Testimonials

**필수 정보:** authorName, content, type
**선택 정보:** authorTitle, authorCompany, rating, isFeatured, projectId

**Type 분류:**

| 유형 | 설명 |
|------|------|
| CLIENT | 클라이언트/고객 |
| COLLEAGUE | 동료 개발자 |
| MENTOR | 멘토 |
| PROFESSOR | 교수 |
| OTHER | 기타 |

---

## 5. 페이지 구조

### 5.1 Public 영역

| 페이지 | 경로 | 기능 |
|--------|------|------|
| Home | `/` | Hero + Featured Projects + Journey Timeline + Tech Stack + CTA |
| Projects | `/projects` | 프로젝트 갤러리 (필터/정렬/페이지네이션) |
| Project Detail | `/projects/:id` | 오버레이 상세 보기 (Hybrid Routing) |
| Academics | `/academics` | 학업 성과 목록 |
| About | `/about` | 프로필 + 마일스톤 + 기술 스택 + 이력서 |
| Login | `/login` | Google/GitHub OAuth 로그인 |
| GitHub Callback | `/auth/github/callback` | GitHub OAuth 콜백 처리 |

- 프로젝트 카드 클릭 시 `/projects/:id` 오버레이로 상세 표시
- 피드백은 모든 페이지에서 CTA 버튼 클릭 시 FeedbackOverlay 모달로 표시
- Language Switcher와 Theme Toggle은 Header에 고정

### 5.2 Admin 영역

| 페이지 | 경로 | 기능 |
|--------|------|------|
| Dashboard | `/admin` | 통계 대시보드 |
| Projects 관리 | `/admin/projects` | 프로젝트 목록/관리 |
| Project 생성 | `/admin/projects/new` | 프로젝트 생성 폼 |
| Project 수정 | `/admin/projects/:id/edit` | 프로젝트 수정 폼 |
| Academics 관리 | `/admin/academics` | 학업 목록/관리 |
| Academic 생성 | `/admin/academics/new` | 학업 생성 폼 |
| Academic 수정 | `/admin/academics/:id/edit` | 학업 수정 폼 |
| Testimonials 관리 | `/admin/testimonials` | 추천사 목록/관리 |
| Testimonial 생성 | `/admin/testimonials/new` | 추천사 생성 폼 |
| Testimonial 수정 | `/admin/testimonials/:id/edit` | 추천사 수정 폼 |
| Milestones 관리 | `/admin/milestones` | 마일스톤 목록/관리 |

---

## 6. 자동화 규칙

### 6.1 Engagement 자동 추적

| 트리거 | 처리 |
|--------|------|
| 프로젝트 상세 조회 | `POST /engagement/track` - 조회 기록 생성 |
| 프로젝트 스크롤/클릭 | `PATCH /engagement/:id` - 메트릭 업데이트 |
| 이력서 다운로드 | downloadCount 자동 증가 |

### 6.2 보안 자동 처리

| 트리거 | 처리 |
|--------|------|
| Access Token 만료 (401) | Interceptor가 자동으로 Refresh Token으로 갱신 시도 |
| 연락 폼 제출 | IP 해싱, Honeypot 검사, Rate Limit 검사 |
| 로그인 실패 5회 | Rate Limiting (인증 요청 분당 5회 제한) |

### 6.3 SEO 자동 생성

| 트리거 | 생성 |
|--------|------|
| 페이지 접근 | SEO Controller가 locale 기반 동적 메타 태그 생성 |
| 프로젝트 조회 | Open Graph, Twitter Cards, 구조화 데이터 자동 생성 |

---

## 7. 비기능 요구사항

| 항목 | 요구사항 |
|------|----------|
| 성능 | Route 기반 코드 스플리팅, Lazy Loading, React.memo 최적화 |
| 보안 | JWT Stateless 인증, HSTS, X-Frame-Options DENY, CORS 제한, BCrypt(12) |
| 가용성 | Azure Container Apps 기반 오토스케일링, Health Check (/actuator/health) |
| 확장성 | MongoDB 수평 확장, Docker 컨테이너화, AKS 지원 |
| 호환성 | 반응형 디자인 (모바일 475px ~ 와이드 모니터 1536px), 주요 브라우저 지원 |
| 접근성 | WCAG 2.1 AA 준수, Skip-to-Content, ARIA 속성, 키보드 네비게이션 |
| 다국어 | 한국어/영어/일본어 3개 국어, 브라우저 자동 감지 |

---

## 8. 기술 스택 요약

| 영역 | 기술 | 버전 |
|------|------|------|
| Frontend Framework | React | 18.2.0 |
| Frontend Language | TypeScript | 5.5.3 |
| Build Tool | Vite | 5.3.3 |
| Styling | Styled Components | 6.1.11 |
| State Management | Zustand | 4.5.7 |
| Routing | React Router | 6.23.1 |
| Animation | Framer Motion | 12.23.12 |
| i18n | react-i18next | 15.6.1 |
| Backend Framework | Spring Boot | 3.3.4 |
| Backend Language | Java | 21 |
| Database | MongoDB | 7.0 |
| Security | Spring Security + JWT | 6.x |
| OAuth | Google OAuth 2.0 + GitHub OAuth | - |
| API Documentation | Swagger/OpenAPI | 3.0 |
| Container | Docker | - |
| Cloud (Frontend) | Azure Static Web Apps | - |
| Cloud (Backend) | Azure Container Apps / AKS | - |
| CI/CD | GitHub Actions + Azure Pipelines | - |
| Security Scan | Trivy + Snyk | - |

---

## 9. 성공 지표

| 시점 | 지표 | 목표 |
|------|------|------|
| 출시 시 | 페이지 로드 시간 (LCP) | 2.5초 이내 |
| 출시 시 | Lighthouse 성능 점수 | 90점 이상 |
| 운영 1개월 | 프로젝트 평균 조회 시간 | 30초 이상 |
| 운영 1개월 | 이력서 다운로드 수 | 월 10건 이상 |
| 운영 3개월 | GitHub 링크 클릭률 | 프로젝트 조회 대비 15% 이상 |
| 운영 3개월 | 연락 폼 제출 수 | 월 5건 이상 |

---

## 10. 용어 정의

| 용어 | 설명 |
|------|------|
| Hybrid Routing | 부모 라우트 위에 자식 라우트를 오버레이로 표시하는 라우팅 패턴 |
| Engagement Tracking | 프로젝트 조회 시간, 스크롤 깊이, 링크 클릭 등 사용자 참여도 추적 |
| Journey Milestone | 개발자의 기술 성장 과정을 연도별로 시각화한 타임라인 항목 |
| Atomic Design | 컴포넌트를 Atoms/Molecules/Organisms/Templates/Pages로 계층화하는 설계 패턴 |
| F-Pattern / Z-Pattern | 사용자의 시선 이동 경로에 최적화된 레이아웃 패턴 |
| Glassmorphism | 반투명 유리 효과를 활용한 UI 디자인 스타일 |
| Neumorphism | 소프트한 그림자로 볼록/오목 효과를 주는 UI 디자인 스타일 |
| OAuth 2.0 | 제3자 인증 프로바이더를 통한 인증 프로토콜 |
| JWT (JSON Web Token) | 서버 상태 없이 클라이언트 토큰으로 인증하는 방식 |
| WCAG 2.1 AA | 웹 콘텐츠 접근성 지침 2.1의 AA 적합성 수준 |
| Code Splitting | 라우트 단위로 번들을 분할하여 초기 로딩 성능을 개선하는 기법 |
| Presigned URL | 클라우드 스토리지에서 임시 인증된 파일 업로드/다운로드 URL |
