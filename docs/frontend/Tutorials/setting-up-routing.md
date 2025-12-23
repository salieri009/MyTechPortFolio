# Setting Up Routing

This tutorial explains how to set up routing using React Router.

## Table of Contents

- [Routing Overview](#routing-overview)
- [Basic Route Setup](#basic-route-setup)
- [Dynamic Routes](#dynamic-routes)
- [Nested Routes](#nested-routes)
- [Code Splitting](#code-splitting)
- [Next Steps](#next-steps)

## Routing Overview

This project uses **React Router DOM v6** to implement client-side routing.

### Key Features

- **Declarative Routing**: Define routes using JSX
- **Code Splitting**: Optimize performance by splitting code per page
- **Nested Routing**: Manage layouts and pages separately

## Basic Route Setup

Routes are defined in `src/App.tsx`:

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

### Route Paths

- `/` - Home page
- `/projects` - Project list
- `/projects/:id` - Project detail
- `/academics` - Academic information
- `/about` - About
- `/feedback` - Feedback
- `/login` - Login

## Dynamic Routes

Create dynamic routes using URL parameters:

```typescript
<Route path="/projects/:id" element={<ProjectDetailPage />} />
```

Get parameters in page components:

```typescript
import { useParams } from 'react-router-dom'

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  // Use id to fetch project data
}
```

## Nested Routes

Compose nested routes using layout components:

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

This wraps all pages with the `Layout` component.

## Code Splitting

Implement code splitting using React.lazy for performance optimization:

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

### Benefits

- **Reduced Initial Load Time**: Only load necessary pages
- **Bundle Size Optimization**: Each page is split into separate chunks
- **Improved User Experience**: Fast page transitions

## Next Steps

Now that you understand routing, learn the following:

1. [Add New Page](../how-to/add-new-page.md) - Add new pages
2. [Routing Structure Explanation](../FE-005-Routing-Structure.md) - Detailed routing structure explanation

## Best Practices

- **Code Splitting**: Apply lazy loading to all pages
- **Error Handling**: Define Suspense fallback clearly
- **Type Safety**: Specify useParams types
- **Performance**: Use React.memo to avoid unnecessary re-renders
