
# Frontend Design Plan

## 1. Overview

The primary goal is to provide an attractive and intuitive experience for users (recruiters, fellow developers). We reflect the latest web trends to showcase technical expertise and implement a responsive web that looks perfect on all devices.

### Key Improvements (2024 Update)
1. **Language Setting UX Improvement**: Provide clear hint text for users unfamiliar with the usage
2. **Interactive Navigation**: Direct project exploration via 3-Column card clicks on main page
3. **Scroll Storytelling**: Visualize developer growth journey through Journey Milestone timeline
4. **Accessibility-First Design**: WCAG 2.1 AA compliance and full keyboard navigation support

- **Core Technology**: **React.js**
- **Selection Reasons**:
    - **Component-Based Architecture**: Create reusable UI components to improve development efficiency and maintainability.
    - **Rich Ecosystem**: Easily extend functionality through various libraries and community support.
    - **High Market Demand**: Established as the standard for modern web development, demonstrating the currency of the tech stack.

## 2. Technology Stack

| Category | Technology | Description |
| --- | --- | --- |
| **Framework** | React 18.2.0 | Optimized performance and development experience with latest React features |
| **Language** | TypeScript 5.5.3 | Code stability and readability through static type checking |
| **Styling** | Styled-components 6.1.11 | Component-level styling for CSS complexity management and reusability |
| **State Management**| Zustand 4.5.7 | State management with concise syntax and low boilerplate compared to Redux |
| **Routing** | React Router 6.23.1 | Page navigation and nested routing implementation |
| **Data Fetching** | Axios 1.7.2 | HTTP client for async communication with backend API |
| **Build Tool** | Vite 5.3.3 | Maximize development productivity with fast build speed and HMR |
| **Animation** | Framer Motion 12.23.12 | Smooth animations and interactions |
| **Internationalization** | React i18next 15.6.1 + i18next 25.3.4 | Multi-language support system |
| **UI Interaction** | React Swipeable 7.0.2 | Touch gesture and swipe interaction support |

## 3. UI/UX Design

### A. Main Page (Home) - With Improvements

#### Hero Section
- **타이틀**: Typewriter 효과로 "문제 해결을 즐기는 개발자 정욱반입니다" 순차 출력
- **CTA 버튼들**: Projects, About, Email, LinkedIn으로 이동하는 4개 버튼을 3+1 레이아웃으로 배치
- **언어 설정 개선사항**:
  - **문제점**: 언어 변경 방법을 모르는 사용자를 위한 명확한 표기 필요
  - **해결책**: `🇰🇷 한국어 ← Swipe to change language →` 형태로 힌트 텍스트 추가
  - **다국어 지원**: 한국어(기본), English, 日本語
  - **기술 구현**: LanguageSwiper 컴포넌트에 `showHint` prop 추가

#### Project Showcase Section (3-Column Interactive Cards)
- **개선사항**: 각 컬럼 클릭 시 해당 분야의 프로젝트 페이지로 이동
- **구조**:
  1. **3D/Game Development** (🎮): Three.js, WebGL, Unity 관련 프로젝트
  2. **Software Engineering** (💻): React, Spring Boot, 풀스택 프로젝트  
  3. **Game Development** (🎯): Unity, 게임 개발 프로젝트
- **인터랙션**:
  - **호버 시**: 관련 기술 스택 하단에 애니메이션으로 표시
  - **클릭 시**: React Router를 통해 해당 카테고리로 필터링된 프로젝트 페이지로 라우팅
  - **모바일**: 터치 피드백과 함께 즉시 이동
  - **접근성**: Tab 키 포커스 + Enter/Space 키 활성화 지원

#### Journey Milestone Section (최신 트렌드 반영)
- **개선사항**: 스크롤 기반 개발자 여정 타임라인 구현
- **기술 구현**:
  - Intersection Observer API를 활용한 스크롤 트리거 애니메이션
  - 각 마일스톤별 ID 기반 스크롤 네비게이션 (`#milestone-university`, `#milestone-programming` 등)
  - Framer Motion을 활용한 순차적 등장 애니메이션 (stagger: 150ms)
- **컨텐츠 구조**:
  ```
  🎓 High School Graduation (2015) → 🏫 Jeonbuk National University (2015~2020) → 
  🪖 Military Service - Interpreter (2021~2023) → 🇦🇺 Study in Australia (2023~Present) → 
  🚀 Current Goals (2025)
  ```
- **시각적 요소**:
  - 세로 타임라인 with 진행 표시바 (CSS `::before` pseudo-element)
  - 각 단계별 아이콘, 제목, 설명, 관련 기술 태그
  - 현재 진행 중인 단계는 CSS `animation: pulse 2s infinite` 효과로 강조
  - 스크롤 진행도에 따른 타임라인 라인 색상 변화

### B. Projects Page

- **Layout**: Display all projects in a card-based grid layout.
- **Filtering & Sorting**: Filter by tech stack, development year, project category
- **Card Component**: Each card includes project thumbnail, title, duration, core tech stack icons, and 'View Details' button.
- **Category Linking**: Auto-filter to specific category when clicking from main page 3-Column
  - URL Parameters: `/projects?category=threejs` | `/projects?category=software` | `/projects?category=gamedev`
  - Filter state management through Zustand store

### C. Project Details Page

- **Top**: Prominently display project name, overview, and buttons to GitHub repository and live demo.
- **Body**:
    - **What I Did (My Role)**: Clearly describe specific contributions with bullet points.
        - Example: `- Developed JWT-based user authentication/authorization API (Spring Security)`
    - **Tech Deep Dive (Technical Choices)**: Explain why the technology was chosen and how it was utilized.
    - **Problem & Solution**: Detail problems encountered and resolution process in 'Problem -> Root Cause Analysis -> Solution -> Result' structure to emphasize problem-solving ability.
    - **Demo**: Demonstrate key features with GIFs or short videos for intuitive understanding.

### D. Academics Page

- **Layout**: Visually represent major courses taken by year/semester in timeline format.
- **Interaction**: Clicking each course item shows related projects (popup or detail page navigation) or brief learning content.

### E. About Me Page

- **Content**: Beyond rigid resume format, compose in storytelling format covering developer growth journey, values, future goals to appeal human charm.
- **Contact**: Clearly guide channels for contact and additional information: email, GitHub, LinkedIn, tech blog, etc.

## 4. Component Architecture

```
src/
|-- components/       # 재사용 가능한 공통 컴포넌트
|   |-- common/       # 공통 UI 컴포넌트
|   |   |-- Button.tsx
|   |   |-- Card.tsx
|   |   `-- Tag.tsx
|   |-- layout/       # 레이아웃 컴포넌트
|   |   |-- Header.tsx
|   |   |-- Footer.tsx
|   |   `-- Layout.tsx
|   |-- ui/           # 재사용 가능한 UI 컴포넌트
|   |-- sections/     # 페이지별 섹션 컴포넌트
|   |   |-- ProjectShowcaseSection.tsx    # 3-Column 인터랙티브 카드
|   |   |-- JourneyMilestoneSection.tsx   # 스크롤 기반 타임라인
|   |   `-- TechStackSection.tsx
|   |-- LanguageSwiper/    # 언어 스위처 컴포넌트 (개선)
|   |   |-- LanguageSwiper.tsx
|   |   `-- index.ts
|   |-- Typewriter/        # 타이핑 효과 컴포넌트
|   |-- ThemeToggle/       # 다크모드 토글
|   `-- ScrollMilestone/   # 스크롤 기반 마일스톤 컴포넌트
|-- hooks/           # 커스텀 훅
|   |-- useScrollAnimation.ts  # 스크롤 애니메이션 훅
|   |-- useIntersectionObserver.ts
|   `-- useAnalytics.ts
|-- i18n/            # 다국어 설정
|-- pages/           # 각 페이지 컴포넌트
|-- services/        # API 연동 서비스
|-- stores/          # 개별 스토어들 (Zustand)
|   |-- themeStore.ts     # 테마 관리
|   |-- filterStore.ts    # 프로젝트 필터 상태
|   `-- milestoneStore.ts # 마일스톤 진행 상태
|-- styles/          # 전역 스타일 및 테마
|-- types/           # TypeScript 타입 정의
|   |-- domain.ts         # 도메인 타입
|   |-- milestone.ts      # 마일스톤 타입
|   `-- interaction.ts    # 인터랙션 타입
|-- utils/           # 유틸리티 함수
|   |-- scrollUtils.ts    # 스크롤 관련 유틸
|   `-- routingUtils.ts   # 라우팅 헬퍼
|-- App.tsx          # 메인 애플리케이션 컴포넌트
`-- main.tsx         # 엔트리 포인트
```

## 5. 정보 구조 및 내비게이션 (IA & Navigation) - 개선사항 반영

- **글로벌 내비게이션**: Home, Projects, Academics, About, Blog + 언어 설정 + 다크모드 토글
- **메인 페이지 구조** (개선):
  - Hero Section (CTA 버튼들)
  - 3-Column Project Showcase (클릭 가능한 카테고리)
  - Journey Milestone Timeline (스크롤 기반, ID 앵커 네비게이션)
- **네비게이션 개선사항**:
  - 언어 스위처에 사용법 힌트 추가: "← Swipe to change language →"
  - 3-Column 카드에서 프로젝트 페이지로의 직접 연결
  - 마일스톤 섹션의 앵커 기반 내부 네비게이션 (`#milestone-*`)
- **하위 구조**:
    - **Home**: Hero → 3-Column Showcase → Journey Timeline → CTA
    - **Projects**: 필터 바(카테고리 연동) → 카드 그리드 → 페이지네이션
    - **Project Details**: 개요 → 역할 → 기술 선택 이유 → 문제/해결 → 미디어 데모
    - **Academics**: 학기별 타임라인 → 과목 상세 툴팁/모달
    - **About**: 스토리, 가치관, 연락처

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

## 8. 상호작용 & 모션 (Interaction & Motion) - 개선사항

### 메인 페이지 인터랙션
- **Typewriter 효과**: Hero 섹션에서 순차적 텍스트 출력 (속도: 80ms/char)
- **3-Column 호버/클릭**:
  - **호버**: 카드 확대 (scale 1.02) + 관련 기술 스택 하단 표시
  - **클릭**: 해당 카테고리 프로젝트 페이지로 라우팅 (React Router)
  - **트랜지션**: `transform 0.2s ease, box-shadow 0.2s ease`
- **스크롤 기반 Journey Timeline**:
  - Intersection Observer로 뷰포트 진입 감지 (threshold: 0.3)
  - 순차적 마일스톤 등장 애니메이션 (stagger: 150ms)
  - 현재 진행 중인 마일스톤은 CSS `pulse` 애니메이션 효과

### 언어 스위처 개선
- **힌트 표시**: "← Swipe to change language →" 텍스트 (opacity: 0.7)
- **스와이프 제스처**: 좌우 스와이프로 언어 변경 (delta: 50px)
- **키보드 지원**: Tab + Enter로 언어 토글
- **애니메이션**: 언어 변경 시 slide + fade 효과 (duration: 200ms)

### 애니메이션 성능 최적화
- **will-change** 속성을 애니메이션 요소에 적용
- **transform**과 **opacity**만 사용하여 리페인트 최소화
- **prefers-reduced-motion** 미디어 쿼리로 접근성 대응

## 9. 접근성 & 국제화 (A11y & i18n) - 개선사항

### 언어 지원 개선
- **힌트 텍스트 다국어화**:
  - 한국어: "← 스와이프하여 언어 변경 →"
  - English: "← Swipe to change language →"  
  - 日本語: "← スワイプして言語変更 →"
- **키보드 접근성**: Tab + Space/Enter로 언어 변경 가능
- **ARIA 라벨**: `aria-label="Language selector"`, `aria-describedby="lang-hint"` 추가
- **언어별 폰트 최적화**: 한글(Pretendard), 영문(Inter), 일문(Noto Sans JP)

### 스크롤 애니메이션 접근성
- **prefers-reduced-motion**: 모션 민감 사용자를 위한 애니메이션 비활성화
- **키보드 네비게이션**: 마일스톤 간 Tab 키 이동 지원
- **스크린 리더**: 각 마일스톤에 `aria-label="Milestone: University Entry, 2021"` 제공
- **포커스 관리**: 스크롤 애니메이션 중에도 포커스 트랩 없이 자연스러운 탐색

### 인터랙션 접근성
- **3-Column 카드**: `role="button"`, `aria-describedby` 속성으로 카테고리 설명 연결
- **키보드 지원**: Enter/Space 키로 카드 클릭 기능 활성화
- **포커스 표시**: 2px solid accent color 아웃라인으로 포커스 상태 명확히 표시

## 10. 성능/SEO/분석 (Perf/SEO/Analytics)

- **Core Web Vitals 목표**: LCP < 2.5s, CLS < 0.1, TTI < 3.5s (모바일 4G 기준)
- **최적화 전략**:
  - 컴포넌트 기반 코드 스플리팅 (`React.lazy()` + `Suspense`)
  - 이미지 lazy loading + WebP 포맷 + responsive images
  - Intersection Observer 기반 애니메이션 최적화 (GPU 가속)
  - 폰트 디스플레이 swap + preload critical fonts
- **캐싱 전략**: 
  - 프로젝트 목록 SWR 캐시 5분
  - 정적 에셋 1년 캐시 + 컨텐츠 해시
- **SEO**: 메타 태그, OG 카드, 구조화 데이터 (Person, CreativeWork schema)
- **분석**: 주요 인터랙션 이벤트 추적 (카드 클릭, 언어 변경, 마일스톤 도달)

## 11. 스크롤 기반 Journey Milestone 구현 명세

### 기술적 구현 방식
```typescript
interface MilestoneData {
  id: string;
  year: number;
  title: string;
  description: string;
  icon: string;
  techStack: string[];
  status: 'completed' | 'current' | 'planned';
}

// Intersection Observer 기반 스크롤 트리거
const useScrollMilestone = () => {
  const [visibleMilestones, setVisibleMilestones] = useState<string[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleMilestones(prev => [...prev, entry.target.id]);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    return () => observer.disconnect();
  }, []);
};
```

### 시각적 구현
- **타임라인 라인**: 세로 진행바 with 그라데이션 (`linear-gradient`)
- **마일스톤 노드**: 원형 아이콘 + 연결선 (`border-radius: 50%`)
- **컨텐츠 카드**: 우측에 등장하는 정보 카드 (`transform: translateX`)
- **진행 상태 표시**: 
  - 완료: 체크 아이콘 + 녹색 (`#10B981`)
  - 진행중: 펄스 애니메이션 + 파란색 (`#3B82F6`)
  - 계획: 점선 + 회색 (`border-style: dashed`)

### CSS 애니메이션 최적화
```css
.milestone-card {
  transform: translateY(50px);
  opacity: 0;
  transition: transform 0.6s ease, opacity 0.6s ease;
  will-change: transform, opacity;
}

.milestone-card.visible {
  transform: translateY(0);
  opacity: 1;
}

.milestone-current::after {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 12. 핵심 컴포넌트 명세 (개선사항 반영)

### LanguageSwiper (개선)
```typescript
interface LanguageSwiperProps {
  showHint?: boolean;
  hintText?: string;
  className?: string;
  onLanguageChange?: (language: string) => void;
}
```
- **개선사항**: 힌트 텍스트 표시 옵션 추가
- **다국어 지원**: 힌트 텍스트도 i18n으로 관리
- **접근성**: ARIA 라벨 및 키보드 지원 (Tab + Enter/Space)

### ProjectShowcaseCard (클릭 가능)
```typescript
interface ProjectShowcaseCardProps {
  category: 'threejs' | 'software' | 'gamedev';
  icon: string;
  title: string;
  description: string;
  techStack: string[];
  onClick: () => void;
  isHovered: boolean;
  className?: string;
}
```
- **개선사항**: 클릭 이벤트 및 라우팅 기능 추가
- **호버 상태**: 기술 스택 표시 애니메이션
- **접근성**: 키보드 포커스, ARIA 라벨, `role="button"`

### JourneyMilestone (신규)
```typescript
interface MilestoneData {
  id: string;
  year: number;
  title: string;
  description: string;
  icon: string;
  techStack: string[];
  status: 'completed' | 'current' | 'planned';
}

interface JourneyMilestoneProps {
  milestones: MilestoneData[];
  onMilestoneVisible: (id: string) => void;
  className?: string;
}
```
- **기능**: 스크롤 기반 타임라인 표시
- **애니메이션**: 순차적 등장 + 진행 상태별 스타일링
- **인터랙션**: 클릭 시 관련 프로젝트 페이지로 이동

### 기존 컴포넌트 (유지)
- **Button**: variant(primary/ghost), size(sm/md/lg), icon, loading, onClick
- **Card**: 썸네일, 제목, 설명, 태그[], onClick/Link, 강조 플래그
- **Header**: 로고, nav, LanguageSwiper(개선), ThemeToggle, 스크롤 상태
- **FilterBar**: 선택된 태그 Zustand 상태와 양방향 바인딩

## 13. 데이터 흐름 & 상태 (Data & State)

- 전역: UI 테마, 필터 상태, 토스트 알림(Zustand store)
- 서버 데이터: 프로젝트 목록/상세, 학업 이력(Axios + SWR 패턴)
- 에러/로딩: 페이지 스켈레톤, API 에러 토스트, 재시도 버튼

## 14. 개발 마일스톤 (3주 계획) - 개선사항 반영

### Week 1: 기초 구조 및 핵심 컴포넌트
- **Day 1-2**: 프로젝트 설정, 라우팅, 기본 레이아웃 + 테마 시스템
- **Day 3-4**: Hero 섹션 + Typewriter 컴포넌트 구현
- **Day 5-7**: 3-Column Showcase 섹션 + 클릭 라우팅 기능

### Week 2: 인터랙션 및 애니메이션
- **Day 8-10**: Journey Milestone 섹션 구현 (스크롤 기반)
- **Day 11-12**: Intersection Observer + 순차적 애니메이션 구현
- **Day 13-14**: 언어 스위처 개선 + 힌트 텍스트 다국어화

### Week 3: 최적화 및 완성
- **Day 15-17**: 성능 최적화 + 접근성 개선 (WCAG 2.1 AA)
- **Day 18-19**: 크로스 브라우저 테스트 + 반응형 최적화
- **Day 20-21**: QA, 문서화, 배포 준비

### 주요 기술 구현 포인트
1. **Intersection Observer API**: 스크롤 기반 애니메이션 최적화
2. **React Router**: 카테고리 기반 동적 라우팅
3. **Framer Motion**: 고성능 애니메이션 (GPU 가속)
4. **Zustand**: 경량 상태 관리 (필터, 테마, 마일스톤 상태)
5. **i18next**: 다국어 지원 + 힌트 텍스트 관리

## 15. 성공 기준 (Quality Gates) - 업데이트

### 기능적 요구사항
- ✅ 언어 스위처에 사용법 힌트 표시 (3개 언어 지원)
- ✅ 3-Column 카드 클릭 시 프로젝트 페이지 이동 (카테고리 필터링)
- ✅ 스크롤 기반 Journey Milestone 구현 (Intersection Observer)
- ✅ 모든 인터랙션의 키보드 접근성 지원 (Tab + Enter/Space)

### 성능 요구사항
- **Lighthouse Score**: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, TTI < 3.5s
- **애니메이션**: 60fps 유지 (transform/opacity 사용, GPU 가속)
- **첫 화면 로딩**: < 2초 (모바일 4G 기준)

### 사용자 경험 요구사항
- **언어 변경**: 5초 내에 사용법 이해 가능
- **프로젝트 탐색**: 메인 페이지에서 원하는 카테고리로 1클릭 이동
- **개발자 여정**: 스크롤을 통한 직관적 스토리텔링 이해
- **접근성**: WCAG 2.1 AA 준수 + 키보드/스크린 리더 완전 지원

### 기술적 요구사항
- **Build**: 경고 0, 오류 0 (ESLint + TypeScript)
- **크로스 브라우저**: Chrome, Safari, Edge 최신 2버전
- **반응형**: 320px ~ 2560px 모든 해상도 대응
- **SEO**: 메타 태그, 구조화 데이터, sitemap.xml

---

## 부가 가치 제안

### 최신 트렌드 반영
- **스크롤 스토리텔링**: Journey Milestone을 통한 개발자 성장 스토리 시각화
- **마이크로 인터랙션**: 호버, 클릭, 스크롤 시 세밀한 피드백 제공
- **접근성 우선**: WCAG 2.1 AA 준수 + 키보드/스크린 리더 완전 지원

### 기술적 우수성
- **성능 최적화**: Intersection Observer, 코드 스플리팅, 이미지 최적화
- **확장 가능성**: 컴포넌트 기반 아키텍처로 새로운 섹션 추가 용이
- **국제화**: 3개 언어 지원 + 사용법 힌트로 UX 개선

### 차별화 요소
- **개발자 중심 스토리텔링**: 기술적 성장 과정을 타임라인으로 시각화
- **인터랙티브 포트폴리오**: 단순 나열이 아닌 체험형 콘텐츠
- **채용 담당자 친화적**: 원하는 기술 분야를 빠르게 탐색할 수 있는 구조
