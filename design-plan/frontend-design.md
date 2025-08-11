
# 프론트엔드 기획안 (Frontend Design Plan)

## 1. 개요 (Overview)

사용자(채용 담당자, 동료 개발자)에게 매력적이고 직관적인 경험을 제공하는 것을 최우선 목표로 합니다. 최신 웹 트렌드를 반영하여 기술적 전문성을 보여주고, 모든 디바이스에서 완벽하게 보이는 반응형 웹으로 구현합니다.

- **핵심 기술**: **React.js**
- **선택 이유**:
    - **컴포넌트 기반 아키텍처**: 재사용 가능한 UI 컴포넌트를 만들어 개발 효율성과 유지보수성을 높입니다.
    - **풍부한 생태계**: 다양한 라이브러리와 커뮤니티 지원을 통해 손쉽게 기능을 확장할 수 있습니다.
    - **높은 시장 수요**: 현대 웹 개발의 표준으로 자리 잡아, 기술 스택의 현재성을 어필할 수 있습니다.

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 | 내용 |
| --- | --- | --- |
| **Framework** | React 18+ | 최신 React 기능을 활용하여 성능 및 개발 경험 최적화 |
| **Language** | TypeScript | 정적 타입 체크로 코드 안정성 및 가독성 확보 |
| **Styling** | Styled-components | 컴포넌트 단위 스타일링으로 CSS 복잡도 관리 및 재사용성 증대 |
| **State Management**| Zustand | Redux 대비 간결한 문법과 낮은 Boilerplate로 상태 관리 |
| **Routing** | React Router | 페이지 간 이동 및 중첩 라우팅 구현 |
| **Data Fetching** | Axios | 백엔드 API와 비동기 통신을 위한 HTTP 클라이언트 |
| **Build Tool** | Vite | 빠른 빌드 속도와 Hot Module Replacement(HMR)로 개발 생산성 극대화 |

## 3. 화면 설계 (UI/UX Design)

### 가. 메인 페이지 (Home)

- **Hero Section**: "문제 해결을 즐기는 개발자 OOO입니다"와 같은 핵심 캐치프레이즈와 함께 자신의 사진이나 아바타를 배치하여 친근감 부여.
- **Tech Stack Section**: 자신 있는 기술 스택 아이콘들을 나열. 마우스를 올리면 해당 기술에 대한 간략한 설명(예: "Spring Boot를 활용한 API 서버 설계 및 구축 경험")이 툴팁으로 표시.
- **Featured Projects**: 가장 자신 있는 프로젝트 2-3개를 세련된 카드 디자인으로 노출. 카드에는 프로젝트 이미지, 제목, 한 줄 설명, 사용 기술 태그 포함.

### 나. 프로젝트 페이지 (Projects)

- **Layout**: 모든 프로젝트를 카드 형태의 그리드 레이아웃으로 표시.
- **Filtering & Sorting**: 사용 기술 스택, 개발 연도 등으로 프로젝트를 필터링하거나 정렬하는 기능을 추가하여 사용자가 원하는 정보를 빠르게 찾을 수 있도록 지원.
- **Card Component**: 각 카드에는 프로젝트 썸네일, 제목, 기간, 핵심 기술 스택 아이콘, 그리고 '자세히 보기' 버튼을 포함.

### 다. 프로젝트 상세 페이지 (Project Details)

- **상단**: 프로젝트명, 개요, GitHub 저장소 및 라이브 데모로 바로 갈 수 있는 버튼들을 눈에 띄게 배치.
- **본문**:
    - **What I Did (나의 역할)**: 구체적인 기여 사항을箇条書き(bullet points)로 명확하게 기술.
        - 예: `- JWT 기반 사용자 인증/인가 API 개발 (Spring Security)`
    - **Tech Deep Dive (기술적 선택과 이유)**: 왜 해당 기술을 선택했는지, 그리고 그 기술을 어떻게 활용했는지 서술.
    - **Problem & Solution (문제 해결 경험)**: 발생했던 문제와 해결 과정을 '문제 -> 원인 분석 -> 해결책 -> 결과' 구조로 상세히 작성하여 문제 해결 능력을 강조.
    - **Demo**: 핵심 기능은 GIF나 짧은 영상으로 시연하여 텍스트보다 직관적으로 이해할 수 있도록 구성.

### 라. 학업 페이지 (Academics)

- **Layout**: 타임라인(Timeline) 형태로 학년/학기별로 수강한 주요 전공 과목을 시각적으로 표현.
- **Interaction**: 각 과목 아이템을 클릭하면 해당 과목과 연관된 프로젝트(팝업 또는 상세 페이지 이동)나 학습 내용을 간략히 볼 수 있도록 구현.

### 마. 자기소개 페이지 (About Me)

- **Content**: 딱딱한 이력서 형식을 넘어, 개발자로서의 성장 과정, 가치관, 앞으로의 목표 등을 담은 스토리텔링 형식으로 구성하여 인간적인 매력을 어필.
- **Contact**: 이메일 주소, GitHub, LinkedIn, 기술 블로그 등 연락 및 추가 정보를 얻을 수 있는 채널을 명확히 안내.

## 4. 컴포넌트 구조 (Component Architecture)

```
src/
|-- components/       # 재사용 가능한 공통 컴포넌트
|   |-- common/
|   |   |-- Button.tsx
|   |   |-- Card.tsx
|   |   `-- Tag.tsx
|   `-- layout/
|       |-- Header.tsx
|       |-- Footer.tsx
|       `-- Layout.tsx
|-- hooks/            # 커스텀 훅
|-- pages/            # 각 페이지 컴포넌트
|   |-- HomePage.tsx
|   |-- ProjectsPage.tsx
|   |-- ProjectDetailPage.tsx
|   |-- AcademicsPage.tsx
|   `-- AboutPage.tsx
|-- services/         # API 연동 서비스
|   `-- api.ts
|-- store/            # 상태 관리 (Zustand)
|-- styles/           # 전역 스타일 및 테마
|-- types/            # TypeScript 타입 정의
|-- utils/            # 유틸리티 함수
`-- App.tsx           # 메인 애플리케이션 컴포넌트
```

## 5. 정보 구조 및 내비게이션 (IA & Navigation)

- 최상단 글로벌 내비게이션: Home, Projects, Academics, About, Contact(스크롤 앵커) + 다크모드 토글
- 하위 구조
    - Home: Hero, Tech Stack, Featured Projects, Testimonials(선택), CTA(이메일/LinkedIn)
    - Projects: 필터 바(Zustand 상태 동기화) → 카드 그리드 → 페이지네이션/무한스크롤(최대 12개/페이지)
    - Project Details: 개요 → 역할 → 기술 선택 이유 → 문제/해결 → 미디어 데모 → 링크
    - Academics: 학기별 타임라인 → 과목 상세 툴팁/모달
    - About: 스토리, 가치관, 취향(아트/음악 등 선택) → 연락처

## 6. 디자인 시스템 (Design System)

- 컬러 팔레트
    - Primary: #4F46E5 (Indigo 600), Hover #4338CA
    - Accent: #06B6D4 (Cyan 500)
    - Neutral: 글자 #0F172A, 본문 #334155, 경계 #E2E8F0, 배경 #FFFFFF
    - Dark Mode: 배경 #0B1220, 카드 #0F172A, 글자 #E5E7EB, 경계 #1F2937
- 타이포그라피
    - Title/Hero: Pretendard SemiBold 48/56
    - H2: 28/36, H3: 20/28, Body: 16/24, Caption: 14/20
    - 글자 대비 AA 이상, 줄간 1.5, 문단 최대 폭 72ch
- 레이아웃/그리드
    - 컨테이너: max-width 1200px, 양옆 24px 패딩
    - 카드 그리드: Desktop 3열, Tablet 2열, Mobile 1열, gap 24px
    - 컴포넌트 라운딩 12px, 그림자 Elevation 1/2/3 단계 사용
- 컴포넌트 상태
    - 버튼: default/hover/active/disabled, focus-visible 아웃라인 2px Accent
    - 태그: 선택/해제, 다중 선택 시 칩 형태 집계
- 아이콘: Lucide/Feather 계열 선형 아이콘 1.5px 두께統一
- 테마 토큰(styled-components ThemeProvider)

```
// 예시 토큰(발췌)
export const theme = {
    colors: { primary: '#4F46E5', primaryHover: '#4338CA', accent: '#06B6D4',
        text: '#0F172A', textSecondary: '#334155', border: '#E2E8F0', bg: '#FFFFFF' },
    dark:   { bg: '#0B1220', card: '#0F172A', text: '#E5E7EB', border: '#1F2937' },
    radius: { sm: 8, md: 12, lg: 16 },
    shadow: { 1: '0 2px 8px rgba(0,0,0,.06)', 2: '0 6px 20px rgba(0,0,0,.08)' },
    breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 }
}
```

## 7. 반응형 규칙 (Responsive)

- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px
- Hero: 모바일에서 1열(텍스트 → 이미지), 데스크톱 2열 좌우 배치
- 네비게이션: md 미만 햄버거 + 오버레이 드로어, 스크롤 시 축소 고정 헤더
- 프로젝트 카드: 이미지 16:9 고정, 스켈레톤 로딩 제공

## 8. 상호작용 & 모션 (Interaction & Motion)

- 페이지 전환: 페이드 120ms + 위계 강조를 위한 헤더 고정 트랜지션
- 호버 모션: 카드 scale 1.02, 그림자 단계 1→2로 강화(120ms)
- 필터/정렬: 변경 즉시 애니메이션으로 레이아웃 재배치(Masonry-like)
- 스크롤 리빌: 섹션 진입 시 24px 상향 슬라이드+페이드(한 섹션당 1회)

## 9. 접근성 & 국제화 (A11y & i18n)

- 키보드 내비게이션 완전 지원(Tab 순서, Skip to content 제공)
- ARIA 라벨: 아이콘 버튼, 카드 링크 그룹에 역할/라벨 명시
- 명도 대비: 주요 텍스트/버튼 WCAG AA 이상, 폼 에러 텍스트 4.5:1 확보
- 모션 민감 사용자: prefers-reduced-motion 대응(모션 최소화)
- 언어: ko 기본, en 준비(문자열 리소스 분리, date/number locale 포맷)

## 10. 성능/SEO/분석 (Perf/SEO/Analytics)

- 성능: LCP < 2.5s, CLS < 0.1, TTI < 3.5s(모바일 4G 기준)
- 전략: Vite 코드 분할, 라우트 기반 청크, 이미지 lazy/priority, 폰트 디스플레이 swap, preconnect GitHub/Images
- 캐싱: 프로젝트 목록 SWR 캐시 5분, 세부 페이지 Stale-While-Revalidate
- SEO: 메타 태그/OG/Twitter 카드, 구조화 데이터(Project as CreativeWork)
- 분석: Plausible/GA4 중 택1, 주요 이벤트(프로젝트 상세 클릭, 외부 링크, 연락 클릭)

## 11. 페이지 와이어프레임 (ASCII 개념)

Home

[LOGO     | Home Projects Academics About  •  ☾]
-------------------------------------------------
| Hero: "문제 해결을 즐기는 개발자" [CTA: Email / LinkedIn]
|  [사진/아바타] [기술 스택 아이콘 나열]
-------------------------------------------------
| Featured Projects: [ 카드 ][ 카드 ][ 카드 ] → 더보기

Projects

[필터: Tag✔  Year▼  Type▼]  [Sort: 최신순▼]
[칩: React x] [칩: TypeScript x]
| [Card] [Card] [Card]
| [Card] [Card] [Card]
|          Pagination ◀ 1 2 3 ▶

Project Details

[제목] [GitHub] [Live]
| 개요
| 나의 역할 • 기술 선택 • 문제/해결 • 결과
| [GIF/Video]  [Tech Tags]

## 12. 핵심 컴포넌트 명세 (요약)

- Button: variant(primary/ghost), size(sm/md/lg), icon(옵션), loading
- Card: 썸네일, 제목, 설명, 태그[], onClick/Link, 강조 플래그
- Tag(Chip): 선택/해제, 카운터, 키보드 토글 지원
- Header: 로고, nav, themeToggle, scrollCondensed 상태
- FilterBar: 선택된 태그 Zustand 상태와 양방향 바인딩
- TimelineItem: 학기, 과목명, 링크/모달 트리거

## 13. 데이터 흐름 & 상태 (Data & State)

- 전역: UI 테마, 필터 상태, 토스트 알림(Zustand store)
- 서버 데이터: 프로젝트 목록/상세, 학업 이력(Axios + SWR 패턴)
- 에러/로딩: 페이지 스켈레톤, API 에러 토스트, 재시도 버튼

## 14. 개발 마일스톤 (2~3주 가량)

1) Day 1-2: 프로젝트 스캐폴딩(Vite+TS), 라우팅, 전역 테마/글로벌 스타일
2) Day 3-5: Home/Projects 기본 레이아웃, 카드/버튼/태그 컴포넌트
3) Day 6-8: 필터/정렬, 스켈레톤, 페이지네이션, 접근성 점검
4) Day 9-11: 상세 페이지(미디어, 문제/해결), 타임라인
5) Day 12-14: 성능/SEO 튜닝, 분석 연동, 다크모드, QA 및 문서화

## 15. 성공 기준 (Quality Gates)

- Build/Lint/Typecheck: 경고 0, 오류 0
- Lighthouse(모바일): Perf ≥ 85, A11y ≥ 95, SEO ≥ 90, PWA(선택)
- 크로스브라우징: 최신 크롬/엣지/사파리, iOS/안드로이드 기본 브라우저
- 접근성: 키보드 전 탐색 가능, 포커스 트랩 없음, 폼 라벨/에러 연결

---

부가 가치 제안
- 다크모드 자동 감지(prefers-color-scheme) + 수동 토글
- 프로젝트 데이터 JSON 정적 소스 → 추후 백엔드 API 전환 용이
- 모노레포(Optional): frontend/backend 폴더로 경로 정리 및 공통 타입 공유
