# Routing Strategy with React Router DOM

## Overview

This project implements client-side routing using React Router DOM. Performance is optimized by utilizing code splitting and lazy loading.

## Routing Structure

### Location
`src/App.tsx`

### Basic Structure

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

## Route List

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Home page |
| `/projects` | ProjectsPage | Project list |
| `/projects/:id` | ProjectDetailPage | Project detail |
| `/academics` | AcademicsPage | Academic information |
| `/about` | AboutPage | About page |
| `/feedback` | FeedbackPage | Feedback page |

### Auth Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | LoginPage | Login page |

## Code Splitting

### Using React.lazy

Lazy load each page to reduce initial bundle size:

```typescript
const HomePage = lazy(() => 
  import('@pages/HomePage').then(module => ({ default: module.HomePage }))
)

const ProjectsPage = lazy(() => import('@pages/ProjectsPage'))
```

### Loading with Suspense

```typescript
<Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
  <Routes>
    {/* ... */}
  </Routes>
</Suspense>
```

## Nested Routing

### Layout Component

Implement nested routing by wrapping common layout (Header, Footer) with Layout component:

```typescript
<Route path="/*" element={
  <Layout>
    <Routes>
      {/* Routes that need common layout */}
    </Routes>
  </Layout>
} />
```

**Benefits**:
- Header, Footer render only once
- Only one place to modify when changing layout

## Dynamic Routing

### Using Parameters

```typescript
<Route path="/projects/:id" element={<ProjectDetailPage />} />
```

**Using in Component**:

```typescript
import { useParams } from 'react-router-dom'

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  // ...
}
```

## Navigation

### Link Component

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

### Programmatic Navigation

```typescript
// Go to previous page
navigate(-1)

// Go to next page
navigate(1)

// Navigate to specific path
navigate('/projects', { replace: true })
```

## Route Protection (Route Guards)

### Current Implementation

Currently all routes are public. To protect routes that require authentication in the future:

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Usage
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

## 404 Handling

### Current Implementation

Currently there is no explicit 404 page. To add in the future:

```typescript
<Route path="*" element={<NotFoundPage />} />
```

## Route-Based Code Splitting

### Benefits

1. **Reduced Initial Load Time**: Load only necessary pages
2. **Optimized Bundle Size**: Each page is split into independent chunks
3. **Caching Efficiency**: Unchanged pages are reused

### Implementation

```typescript
// Import each page with lazy
const HomePage = lazy(() => import('@pages/HomePage'))

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</Suspense>
```

## Performance Optimization

### 1. Preloading

Preload on mouse hover:

```typescript
<Link 
  to="/projects"
  onMouseEnter={() => import('@pages/ProjectsPage')}
>
  Projects
</Link>
```

### 2. Route-based Analytics

Automatically send analytics events on page change:

```typescript
// Handled in useAnalytics hook
useEffect(() => {
  analytics.trackPageView(location.pathname)
}, [location])
```

## Best Practices

### 1. Clear Route Structure
- RESTful URL structure
- Use meaningful path names

### 2. Code Splitting
- Split by page units
- Separate common components into different chunks

### 3. Loading State
- Provide Suspense fallback
- Consider user experience

### 4. Type Safety
- Specify useParams types
- Define route path types (optional)

## Future Improvements

### 1. Route-Based Data Fetching
- Utilize React Router's loader feature
- Consider server-side rendering

### 2. Route Animations
- Page transition animations
- Integration with Framer Motion

### 3. Route Metadata
- Manage meta information for each route
- SEO optimization

## References

- [React Router Official Documentation](https://reactrouter.com/)
- [Code Splitting Guide](https://react.dev/reference/react/lazy)
