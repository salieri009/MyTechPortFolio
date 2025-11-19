# Routing Strategy with React Router DOM

## 개요

본 프로젝트는 React Router DOM을 사용하여 클라이언트 사이드 라우팅을 구현합니다. 코드 스플리팅과 지연 로딩을 활용하여 성능을 최적화했습니다.

## 라우팅 구조

### 위치
`src/App.tsx`

### 기본 구조

```typescript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/*" element={
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Layout>
  } />
</Routes>
```

## 라우트 목록

### 공개 라우트 (Public Routes)

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | HomePage | 홈 페이지 |
| `/projects` | ProjectsPage | 프로젝트 목록 |
| `/projects/:id` | ProjectDetailPage | 프로젝트 상세 |
| `/academics` | AcademicsPage | 학업 정보 |
| `/about` | AboutPage | 소개 페이지 |
| `/feedback` | FeedbackPage | 피드백 페이지 |

### 인증 라우트 (Auth Routes)

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/login` | LoginPage | 로그인 페이지 |

## 코드 스플리팅

### React.lazy 사용

각 페이지를 지연 로드하여 초기 번들 크기를 줄입니다:

```typescript
const HomePage = lazy(() => 
  import('@pages/HomePage').then(module => ({ default: module.HomePage }))
)

const ProjectsPage = lazy(() => import('@pages/ProjectsPage'))
```

### Suspense로 로딩 처리

```typescript
<Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
  <Routes>
    {/* ... */}
  </Routes>
</Suspense>
```

## 중첩 라우팅

### Layout 컴포넌트

공통 레이아웃(Header, Footer)을 Layout 컴포넌트로 감싸 중첩 라우팅을 구현:

```typescript
<Route path="/*" element={
  <Layout>
    <Routes>
      {/* 공통 레이아웃이 필요한 라우트 */}
    </Routes>
  </Layout>
} />
```

**장점**:
- Header, Footer를 한 번만 렌더링
- 레이아웃 변경 시 한 곳만 수정

## 동적 라우팅

### 파라미터 사용

```typescript
<Route path="/projects/:id" element={<ProjectDetailPage />} />
```

**컴포넌트에서 사용**:

```typescript
import { useParams } from 'react-router-dom'

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  // ...
}
```

## 네비게이션

### Link 컴포넌트

```typescript
import { Link } from 'react-router-dom'

<Link to="/projects">Projects</Link>
```

### useNavigate Hook

```typescript
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/projects')
  }
  
  return <button onClick={handleClick}>Go to Projects</button>
}
```

### 프로그래밍 방식 네비게이션

```typescript
// 이전 페이지로
navigate(-1)

// 다음 페이지로
navigate(1)

// 특정 경로로
navigate('/projects', { replace: true })
```

## 라우트 보호 (Route Guards)

### 현재 구현

현재는 모든 라우트가 공개되어 있습니다. 향후 인증이 필요한 라우트를 보호하려면:

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// 사용
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

## 404 처리

### 현재 구현

현재는 명시적인 404 페이지가 없습니다. 향후 추가 시:

```typescript
<Route path="*" element={<NotFoundPage />} />
```

## 라우트 기반 코드 스플리팅

### 장점

1. **초기 로딩 시간 단축**: 필요한 페이지만 로드
2. **번들 크기 최적화**: 각 페이지가 독립적인 청크로 분리
3. **캐싱 효율성**: 변경되지 않은 페이지는 재사용

### 구현 방법

```typescript
// 각 페이지를 lazy로 import
const HomePage = lazy(() => import('@pages/HomePage'))

// Suspense로 감싸기
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</Suspense>
```

## 성능 최적화

### 1. Preloading

마우스 오버 시 미리 로드:

```typescript
<Link 
  to="/projects"
  onMouseEnter={() => import('@pages/ProjectsPage')}
>
  Projects
</Link>
```

### 2. Route-based Analytics

페이지 변경 시 자동으로 분석 이벤트 전송:

```typescript
// useAnalytics hook에서 처리
useEffect(() => {
  analytics.trackPageView(location.pathname)
}, [location])
```

## 모범 사례

### 1. 명확한 라우트 구조
- RESTful한 URL 구조
- 의미 있는 경로명 사용

### 2. 코드 스플리팅
- 페이지 단위로 분할
- 공통 컴포넌트는 별도 청크로 분리

### 3. 로딩 상태
- Suspense fallback 제공
- 사용자 경험 고려

### 4. 타입 안정성
- useParams 타입 지정
- 라우트 경로 타입 정의 (선택사항)

## 향후 개선 방향

### 1. 라우트 기반 데이터 페칭
- React Router의 loader 기능 활용
- 서버 사이드 렌더링 고려

### 2. 라우트 애니메이션
- 페이지 전환 애니메이션
- Framer Motion과 통합

### 3. 라우트 메타데이터
- 각 라우트의 메타 정보 관리
- SEO 최적화

## 참고 자료

- [React Router 공식 문서](https://reactrouter.com/)
- [Code Splitting 가이드](https://react.dev/reference/react/lazy)









