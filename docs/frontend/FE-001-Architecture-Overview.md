# Architecture Overview

## Overview

MyPortFolio Frontend is a modern portfolio website built with React 18 and TypeScript. It adopts the Atomic Design Pattern for systematic component organization, lightweight state management with Zustand, and client-side routing via React Router.

## Overall Architecture

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

## Layer Structure

### 1. Presentation Layer (Component Layer)

**Location**: `src/components/` (94 files in 19 subdirs)

Organized according to Atomic Design Pattern:

| Category | Location | Count | Examples |
|----------|----------|-------|----------|
| **Atoms** | `ui/` | 21 | Button, Card, Tag, Typography, Container |
| **Molecules** | `molecules/`, `project/` | 14 | ProjectCard, TestimonialCard, Breadcrumbs |
| **Organisms** | `organisms/`, `sections/`, `layout/` | 24 | Header, Footer, ProjectShowcaseSection |
| **Features** | `recruiter/`, `admin/`, `feedback/` | 11 | PersonalInfoHeader, AdminDashboard |
| **Utilities** | `icons/`, `modals/`, `common/` | 9 | TechIcon, ConfirmDialog |

**Pages**: `src/pages/` (9 pages + admin subdirectory)
- HomePage, ProjectsPage, ProjectDetailPage, AcademicsPage
- AboutPage, FeedbackPage, LoginPage
- `admin/`: AdminDashboard and management pages

### 2. State Management Layer

**Location**: `src/stores/`

Lightweight state management using Zustand:

- **themeStore**: Dark/Light mode theme state
- **authStore**: Authentication state management
- **filters**: Project filtering state

**Features**:
- Global state is minimized (local state first)
- Theme settings persisted with Zustand's persist middleware

### 3. Service Layer

**Location**: `src/services/` (12 files + 2 subdirs)

API communication and business logic:

| File | Purpose | Backend Endpoint |
|------|---------|------------------|
| [`apiClient.ts`](file:///d:/UTS/MyPortFolio/frontend/src/services/apiClient.ts) | Axios instance, interceptors | Base client |
| [`projects.ts`](file:///d:/UTS/MyPortFolio/frontend/src/services/projects.ts) | Project CRUD | `/api/v1/projects` |
| [`academics.ts`](file:///d:/UTS/MyPortFolio/frontend/src/services/academics.ts) | Academics API | `/api/v1/academics` |
| [`authService.ts`](file:///d:/UTS/MyPortFolio/frontend/src/services/authService.ts) | Authentication | `/api/v1/auth/*` |
| [`testimonials.ts`](file:///d:/UTS/MyPortFolio/frontend/src/services/testimonials.ts) | Testimonials CRUD | `/api/v1/testimonials` |
| [`techStacks.ts`](file:///d:/UTS/MyPortFolio/frontend/src/services/techStacks.ts) | Tech stacks | `/api/v1/tech-stacks` |
| [`analytics.ts`](file:///d:/UTS/MyPortFolio/frontend/src/services/analytics.ts) | Engagement tracking | `/api/v1/engagements` |
| [`securityMonitor.ts`](file:///d:/UTS/MyPortFolio/frontend/src/services/securityMonitor.ts) | Security event reporting | `/api/security/*` |
| `admin/` | Admin-specific services (7 files) | Admin endpoints |
| `email/` | EmailJS integration (4 files) | External service |

**Features**:
- All API calls made through service layer with `apiClient`
- Centralized error handling with status code mapping
- Retry logic with exponential backoff (max 3 attempts)
- JWT token injection via request interceptor
- Request ID tracking (`X-Request-ID`)

### 4. Routing Layer

**Location**: `src/App.tsx`, `src/pages/`

Client-side routing using React Router DOM:

- **Code Splitting**: Route-based code splitting using React.lazy
- **Nested Routing**: Common layout management with Layout component
- **Suspense**: Loading state management

### 5. Styling Layer

**Location**: `src/styles/`

CSS-in-JS with Styled Components:

- **theme.ts**: Design tokens (colors, typography, spacing, etc.)
- **GlobalStyle.ts**: Global styles
- **styled.d.ts**: TypeScript type definitions

**Features**:
- Theme-based styling (light/dark mode)
- Responsive design (mobile-first)
- KickoffLabs guideline compliance (1-3 colors, 1 font)

### 6. Internationalization Layer

**Location**: `src/i18n/`

Internationalization support using React i18next:

- **config.ts**: i18next configuration
- **locales/**: Translation files (ko, en, ja)
- **Auto language detection**: Based on browser settings

## Data Flow

### 1. User Action → State Update

```
User Action → Component Event Handler → Zustand Store → UI Update
```

### 2. API Call → Data Display

```
Component → Service Layer → API Client → Backend API → Response → Store/State → UI Update
```

### 3. Routing

```
URL Change → React Router → Route Matching → Component Lazy Load → Page Render
```

## Key Design Principles

### 1. Single Responsibility Principle (SRP)
- Each component has one clear responsibility
- Service layer handles only API communication

### 2. Separation of Concerns (SoC)
- UI logic and business logic are separated
- State management and presentation are separated

### 3. Reusability
- Maximize component reusability with Atomic Design
- Extract common utility functions

### 4. Extensibility
- Modular structure makes adding features easy
- Type safety ensures refactoring safety

## Performance Optimization

### 1. Code Splitting
- Route-based code splitting reduces initial loading time

### 2. Lazy Loading
- Load components only when needed with React.lazy and Suspense

### 3. Memoization
- Prevent unnecessary re-renders with React.memo, useMemo, useCallback

### 4. Image Optimization
- Use WebP format, apply lazy loading

## Security Considerations

### 1. XSS Prevention
- Leverage React's default escaping
- User input validation and sanitization

### 2. CSRF Protection
- Token management in Axios interceptor
- SameSite cookie settings

### 3. Environment Variables
- Sensitive information managed via environment variables
- .env files excluded from version control

## Future Improvements

### 1. Testing
- Unit tests (Jest, React Testing Library)
- E2E tests (Playwright, Cypress)

### 2. Performance Monitoring
- Web Vitals tracking
- Error logging (Sentry, etc.)

### 3. PWA Support
- Service Worker
- Offline support

### 4. Accessibility Improvements
- ARIA attribute enhancements
- Keyboard navigation improvements
