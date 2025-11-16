# Architecture Overview

## 개요

MyPortFolio Frontend는 React 18과 TypeScript를 기반으로 한 현대적인 포트폴리오 웹사이트입니다. Atomic Design Pattern을 채택하여 컴포넌트를 체계적으로 구성하고, Zustand를 사용한 경량 상태 관리, React Router를 통한 클라이언트 사이드 라우팅을 구현했습니다.

## 전체 아키텍처

```
┌─────────────────────────────────────────────────┐
│                   User Browser                    │
└────────────────────┬──────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────┐            ┌─────▼─────┐
    │ Frontend │            │  Backend  │
    │  React   │◄──API──►  │ Spring    │
    │  + Vite  │            │  Boot     │
    └────┬────┘            └─────┬─────┘
         │                       │
         │                       │
    ┌────▼────┐            ┌─────▼─────┐
    │  State  │            │  MongoDB  │
    │ Zustand │            │  Database │
    └─────────┘            └───────────┘
```

## 레이어 구조

### 1. Presentation Layer (컴포넌트 레이어)

**위치**: `src/components/`

Atomic Design Pattern에 따라 구성:

- **Atoms** (`ui/`): 가장 작은 단위의 재사용 가능한 컴포넌트
  - Button, Card, Tag, Typography 등
- **Molecules**: Atoms를 조합한 복합 컴포넌트
  - ProjectCard, TestimonialCard 등
- **Organisms**: Molecules와 Atoms를 조합한 복잡한 컴포넌트
  - Header, Footer, ProjectShowcaseSection 등
- **Pages**: Organisms를 조합한 전체 페이지
  - HomePage, ProjectsPage 등

### 2. State Management Layer (상태 관리 레이어)

**위치**: `src/stores/`

Zustand를 사용한 경량 상태 관리:

- **themeStore**: 다크/라이트 모드 테마 상태
- **authStore**: 인증 상태 관리
- **filters**: 프로젝트 필터링 상태

**특징**:
- 전역 상태는 최소화 (로컬 상태 우선)
- Zustand의 persist 미들웨어로 테마 설정 영구 저장

### 3. Service Layer (서비스 레이어)

**위치**: `src/services/`

API 통신 및 비즈니스 로직:

- **apiClient.ts**: Axios 인스턴스 및 인터셉터 설정
- **projects.ts**: 프로젝트 관련 API 호출
- **academics.ts**: 학업 관련 API 호출
- **auth.ts**: 인증 관련 API 호출
- **email/**: 이메일 서비스 (EmailJS)

**특징**:
- 모든 API 호출은 서비스 레이어를 통해 수행
- 에러 핸들링 및 재시도 로직 중앙화

### 4. Routing Layer (라우팅 레이어)

**위치**: `src/App.tsx`, `src/pages/`

React Router DOM을 사용한 클라이언트 사이드 라우팅:

- **코드 스플리팅**: React.lazy를 사용한 라우트 기반 코드 분할
- **중첩 라우팅**: Layout 컴포넌트로 공통 레이아웃 관리
- **Suspense**: 로딩 상태 관리

### 5. Styling Layer (스타일링 레이어)

**위치**: `src/styles/`

Styled Components를 사용한 CSS-in-JS:

- **theme.ts**: 디자인 토큰 (색상, 타이포그래피, 간격 등)
- **GlobalStyle.ts**: 전역 스타일
- **styled.d.ts**: TypeScript 타입 정의

**특징**:
- 테마 기반 스타일링 (light/dark mode)
- 반응형 디자인 (모바일 우선)
- KickoffLabs 가이드라인 준수 (색상 1-3개, 폰트 1개)

### 6. Internationalization Layer (다국어 레이어)

**위치**: `src/i18n/`

React i18next를 사용한 다국어 지원:

- **config.ts**: i18next 설정
- **locales/**: 번역 파일 (ko, en, ja)
- **자동 언어 감지**: 브라우저 설정 기반

## 데이터 흐름

### 1. 사용자 액션 → 상태 업데이트

```
User Action → Component Event Handler → Zustand Store → UI Update
```

### 2. API 호출 → 데이터 표시

```
Component → Service Layer → API Client → Backend API → Response → Store/State → UI Update
```

### 3. 라우팅

```
URL Change → React Router → Route Matching → Component Lazy Load → Page Render
```

## 주요 설계 원칙

### 1. 단일 책임 원칙 (SRP)
- 각 컴포넌트는 하나의 명확한 책임만 가짐
- 서비스 레이어는 API 통신만 담당

### 2. 관심사의 분리 (SoC)
- UI 로직과 비즈니스 로직 분리
- 상태 관리와 프레젠테이션 분리

### 3. 재사용성
- Atomic Design으로 컴포넌트 재사용성 극대화
- 공통 유틸리티 함수 분리

### 4. 확장성
- 모듈화된 구조로 기능 추가 용이
- 타입 안정성으로 리팩토링 안전성 확보

## 성능 최적화

### 1. 코드 스플리팅
- 라우트 기반 코드 분할로 초기 로딩 시간 단축

### 2. Lazy Loading
- React.lazy와 Suspense로 필요할 때만 컴포넌트 로드

### 3. 메모이제이션
- React.memo, useMemo, useCallback으로 불필요한 리렌더링 방지

### 4. 이미지 최적화
- WebP 포맷 사용, lazy loading 적용

## 보안 고려사항

### 1. XSS 방지
- React의 기본 이스케이핑 활용
- 사용자 입력 검증 및 sanitization

### 2. CSRF 보호
- Axios 인터셉터에서 토큰 관리
- SameSite 쿠키 설정

### 3. 환경 변수
- 민감한 정보는 환경 변수로 관리
- .env 파일은 버전 관리 제외

## 향후 개선 방향

### 1. 테스트
- Unit 테스트 (Jest, React Testing Library)
- E2E 테스트 (Playwright, Cypress)

### 2. 성능 모니터링
- Web Vitals 추적
- 에러 로깅 (Sentry 등)

### 3. PWA 지원
- Service Worker
- 오프라인 지원

### 4. 접근성 개선
- ARIA 속성 보완
- 키보드 네비게이션 개선

