# Setting Up Routing

이 튜토리얼은 React Router를 사용하여 라우팅을 설정하는 방법을 설명합니다.

## 목차

- [라우팅 개요](#라우팅-개요)
- [기본 라우트 설정](#기본-라우트-설정)
- [동적 라우트](#동적-라우트)
- [중첩 라우트](#중첩-라우트)
- [코드 스플리팅](#코드-스플리팅)
- [다음 단계](#다음-단계)

## 라우팅 개요

이 프로젝트는 **React Router DOM v6**를 사용하여 클라이언트 사이드 라우팅을 구현합니다.

### 주요 기능

- **선언적 라우팅**: JSX를 사용하여 라우트를 정의합니다
- **코드 스플리팅**: 페이지별로 코드를 분할하여 성능을 최적화합니다
- **중첩 라우팅**: 레이아웃과 페이지를 분리하여 관리합니다

## 기본 라우트 설정

라우트는 `src/App.tsx`에서 정의됩니다:

```typescript
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}
```

### 라우트 경로

- `/` - 홈 페이지
- `/projects` - 프로젝트 목록
- `/projects/:id` - 프로젝트 상세
- `/academics` - 학업 정보
- `/about` - 소개
- `/feedback` - 피드백
- `/login` - 로그인

## 동적 라우트

URL 파라미터를 사용하여 동적 라우트를 만들 수 있습니다:

```typescript
<Route path="/projects/:id" element={<ProjectDetailPage />} />
```

페이지 컴포넌트에서 파라미터를 가져옵니다:

```typescript
import { useParams } from 'react-router-dom'

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  // id를 사용하여 프로젝트 데이터를 가져옵니다
}
```

## 중첩 라우트

레이아웃 컴포넌트를 사용하여 중첩 라우트를 구성합니다:

```typescript
<Route path="/*" element={
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  </Layout>
} />
```

이렇게 하면 모든 페이지가 `Layout` 컴포넌트로 감싸집니다.

## 코드 스플리팅

성능 최적화를 위해 React.lazy를 사용하여 코드 스플리팅을 구현합니다:

```typescript
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('@pages/HomePage').then(module => ({ 
  default: module.HomePage 
})))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Suspense>
  )
}
```

### 장점

- **초기 로딩 시간 단축**: 필요한 페이지만 로드합니다
- **번들 크기 최적화**: 각 페이지가 별도의 청크로 분할됩니다
- **사용자 경험 향상**: 빠른 페이지 전환

## 다음 단계

라우팅을 이해했으니 다음을 학습하세요:

1. [Add New Page](../how-to/add-new-page.md) - 새 페이지 추가하기
2. [Routing Structure 설명](../explanation/routing-structure.md) - 라우팅 구조 상세 설명

## 모범 사례

- **코드 스플리팅**: 모든 페이지에 lazy loading을 적용하세요
- **에러 처리**: Suspense fallback을 명확하게 정의하세요
- **타입 안정성**: useParams의 타입을 명시하세요
- **성능**: 불필요한 리렌더링을 피하기 위해 React.memo를 사용하세요




