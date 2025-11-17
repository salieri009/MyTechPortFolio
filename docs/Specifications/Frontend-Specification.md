---
title: "Frontend Specification"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Specification"
audience: ["Frontend Developers", "UI Developers"]
prerequisites: ["Getting-Started.md"]
related_docs: ["UI-UX-Specification.md", "Architecture/Frontend-Architecture.md"]
maintainer: "Development Team"
---

# Frontend Specification

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

This document specifies the frontend component contracts, data structures, and integration requirements for the MyTechPortfolio application.

**Framework**: React 18 + TypeScript  
**Build Tool**: Vite  
**State Management**: Zustand  
**Styling**: Styled Components  
**Routing**: React Router v6

---

## Component Architecture

### Atomic Design Pattern

The frontend follows Atomic Design principles:

- **Atoms**: Basic UI components (`Button`, `Card`, `Typography`, `Tag`)
- **Molecules**: Composed components (`ProjectCard`, `TechStackBadge`)
- **Organisms**: Complex sections (`Header`, `Footer`, `ProjectShowcaseSection`)
- **Templates**: Page layouts
- **Pages**: Complete page components

---

## Core Components

### ProjectCard

**Location**: `components/project/ProjectCard.tsx`

**Props**:
```typescript
interface ProjectCardProps {
  id: string | number
  title: string
  summary: string
  startDate: string
  endDate: string
  techStacks: string[]
  imageUrl?: string
}
```

**Behavior**:
- Navigates to `/projects/{id}` on click
- Tracks view analytics
- Displays tech stack badges
- Lazy loads images

---

### FeaturedProjectCard

**Location**: `components/project/FeaturedProjectCard.tsx`

**Props**:
```typescript
interface FeaturedProjectCardProps {
  id: string | number
  title: string
  summary: string
  startDate: string
  endDate: string
  techStacks: string[]
  imageUrl?: string
  index?: number
}
```

**Behavior**:
- Used in homepage featured section
- Supports asymmetric grid layout
- First project uses 12-column full width
- Subsequent projects use asymmetric grid

---

### HeroProjectCard

**Location**: `components/project/HeroProjectCard.tsx`

**Props**: Same as `FeaturedProjectCardProps`

**Behavior**:
- Main hero project on homepage
- 12-column full width layout
- Opens project detail modal

---

### ProjectDetailOverlay

**Location**: `components/project/ProjectDetailOverlay.tsx`

**Behavior**:
- Route-based modal (`/projects/:id`)
- Full-screen overlay with high contrast background
- Esc key to close
- Scroll position preservation
- Focus management

---

## Data Structures

### Project

```typescript
interface Project {
  id: string
  title: string
  summary: string
  description: string
  startDate: string
  endDate: string
  githubUrl?: string
  demoUrl?: string
  isFeatured: boolean
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
  viewCount: number
  techStackIds: string[]
  relatedAcademicIds: string[]
  createdAt: string
  updatedAt: string
}
```

### Academic

```typescript
interface Academic {
  id: string
  subjectCode: string
  name: string
  semester: string
  grade: 'HIGH_DISTINCTION' | 'DISTINCTION' | 'CREDIT' | 'PASS'
  creditPoints: number
  marks?: number
  description?: string
  status: 'COMPLETED' | 'ENROLLED' | 'EXEMPTION'
  year: number
  semesterType: 'SPRING' | 'AUTUMN'
}
```

### JourneyMilestone

```typescript
interface JourneyMilestone {
  id: string
  year: string
  title: string
  description: string
  icon?: string
  techStack: string[]
  status: 'COMPLETED' | 'CURRENT' | 'PLANNED'
  technicalComplexity: number
  projectCount: number
  codeMetrics?: {
    linesOfCode: number
    commits: number
    repositories: number
  }
  keyAchievements: Array<{
    title: string
    description: string
    impact: string
  }>
  skillProgression: Array<{
    name: string
    level: number
    category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'OTHER'
  }>
}
```

---

## API Integration

### API Client

**Location**: `services/apiClient.ts`

**Features**:
- Axios instance with interceptors
- JWT token management
- Error handling
- Request/response logging

### API Services

- `projectsApi.ts` - Project CRUD operations
- `academicsApi.ts` - Academic CRUD operations
- `milestonesApi.ts` - Journey milestone operations
- `adminApi.ts` - Admin authentication

---

## State Management

### Zustand Stores

- `authStore.ts` - User authentication state
- `adminStore.ts` - Admin authentication and permissions
- `themeStore.ts` - Theme preferences
- `filterStore.ts` - Project filters

---

## Routing

### Route Structure

```
/ - HomePage
/projects - ProjectsPage (with Outlet for child routes)
/projects/:id - ProjectDetailOverlay (modal route)
/academics - AcademicsPage
/about - AboutPage
/feedback - FeedbackOverlay (modal route)
/admin - AdminRoute (protected)
  /admin - AdminDashboard
  /admin/projects - ProjectsAdminPage
  /admin/projects/new - ProjectForm (create)
  /admin/projects/:id/edit - ProjectForm (edit)
  /admin/academics - AcademicsAdminPage
  /admin/milestones - JourneyMilestonesAdminPage
```

### Hybrid Routing

- `/projects/:id` renders as modal overlay
- Direct URL access supported
- SEO-friendly URLs
- Scroll position preservation

---

## Styling

### Design System

- **Spacing**: 4-point grid system
- **Colors**: Theme-based with dark/light mode
- **Typography**: Consistent font hierarchy
- **Components**: Styled Components with theme

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ??1024px

---

## Accessibility

### WCAG Compliance

- **Level**: AA
- **Keyboard Navigation**: Full support
- **Screen Readers**: ARIA labels
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Meets WCAG AA standards

### A11y Features

- Skip to content link
- Focus trap in modals
- Esc key support
- ARIA labels and roles
- Semantic HTML

---

## Performance

### Code Splitting

- Route-based lazy loading
- Component-level code splitting
- Vendor chunk separation

### Optimization

- Image lazy loading
- Intersection Observer for animations
- Memoization for expensive computations
- Debounced search/filter inputs

---

## Testing

### Component Testing

- React Testing Library
- Jest for unit tests
- Component snapshot tests

### E2E Testing

- Playwright/Cypress
- Critical user flows
- Cross-browser testing

---

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Related Documentation

- [UI/UX Specification](./UI-UX-Specification.md)
- [Frontend Architecture](../Architecture/Frontend-Architecture.md)
- [API Specification](./API-Specification.md)
- [Best Practices](../Best-Practices/Component-Guidelines.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team


