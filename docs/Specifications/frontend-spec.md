# Frontend Implementation Spec (React + Vite + TypeScript)

> **Version**: 2.0.0  
> **Last Updated**: 2025-11-15  
> **Status**: Production Ready

## Overview

Modern, responsive portfolio frontend built with React 18, TypeScript, and Vite. Features atomic design pattern, internationalization, dark mode, and full backend integration.

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.2.0 | UI framework |
| **Language** | TypeScript | 5.5.3 | Type safety |
| **Build Tool** | Vite | 5.3.3 | Fast build & HMR |
| **Styling** | Styled Components | 6.1.11 | CSS-in-JS |
| **State Management** | Zustand | 4.5.7 | Global state |
| **Routing** | React Router | 6.23.1 | Client-side routing |
| **HTTP Client** | Axios | 1.7.2 | API communication |
| **Animation** | Framer Motion | 12.23.12 | Smooth animations |
| **i18n** | React i18next | 15.6.1 | Internationalization |
| **i18n Core** | i18next | 25.3.4 | i18n engine |
| **Language Detection** | i18next-browser-languagedetector | 8.2.0 | Auto language detection |
| **Email** | @emailjs/browser | 4.4.1 | Contact form emails |
| **Gestures** | React Swipeable | 7.0.2 | Touch gestures |

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Atomic: Atoms (Button, Card, Tag, etc.)
│   │   ├── layout/          # Organisms: Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── footer/      # Footer sub-components
│   │   ├── sections/        # Organisms: Page sections
│   │   │   ├── ProjectShowcaseSection.tsx
│   │   │   ├── JourneyMilestoneSection.tsx
│   │   │   └── TechStackSection.tsx
│   │   ├── recruiter/       # Recruiter-focused components
│   │   │   ├── PersonalInfoHeader.tsx
│   │   │   └── CareerSummaryDashboard.tsx
│   │   ├── project/          # Project-related components
│   │   │   └── ProjectCard.tsx
│   │   └── common/          # Shared components
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   ├── AcademicsPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── FeedbackPage.tsx
│   ├── services/            # API services
│   │   ├── apiClient.ts     # Axios instance
│   │   ├── projects.ts
│   │   ├── academics.ts
│   │   ├── techStacks.ts
│   │   ├── auth.ts
│   │   ├── analytics.ts
│   │   └── email/           # Email service
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   ├── filters.ts
│   │   └── theme.ts
│   ├── types/               # TypeScript types
│   │   ├── api.ts           # API response types
│   │   ├── domain.ts        # Domain models
│   │   └── recruiter.ts     # Recruiter-specific types
│   ├── styles/              # Global styles
│   │   ├── theme.ts         # Theme configuration
│   │   ├── GlobalStyle.ts   # Global CSS
│   │   └── styled.d.ts     # Styled-components types
│   ├── i18n/                # Internationalization
│   │   ├── config.ts        # i18n configuration
│   │   └── locales/         # Translation files
│   │       ├── ko.json      # Korean
│   │       ├── en.json      # English
│   │       └── ja.json      # Japanese
│   ├── mocks/               # Mock data (dev only)
│   │   ├── projects.ts
│   │   ├── academics.ts
│   │   ├── techStacks.ts
│   │   └── testimonials.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useAnalytics.ts
│   ├── constants/           # Constants
│   │   └── contact.ts
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Routing

### Route Configuration

```typescript
/ → HomePage
/projects → ProjectsPage (with filters)
/projects/:id → ProjectDetailPage
/academics → AcademicsPage
/about → AboutPage
/login → LoginPage
/feedback → FeedbackPage
```

### Route Features

- **Query String Sync**: Filters persist in URL (`/projects?techStacks=React&year=2024`)
- **Zustand Integration**: URL state synced with Zustand store
- **Code Splitting**: Route-based lazy loading (future)

## Data Access Strategy

### API Client Configuration

**Base URL**: Environment-based
- **Development**: `/api` (Vite proxy to `http://localhost:8080/api/v1`)
- **Production**: `VITE_API_BASE_URL` environment variable

**Proxy Configuration** (`vite.config.ts`):
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
  },
}
```

### Response Envelope

All API responses follow standardized format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
  errorCode?: string;
  errors?: Record<string, string>;
  message?: string;
  metadata?: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}
```

### Error Handling

- **Network Errors**: User-friendly toast notifications
- **Validation Errors**: Field-level error display
- **404 Errors**: Custom error pages
- **Empty States**: Friendly empty state components

## Authentication

### Auth Modes

**Environment Variable**: `VITE_AUTH_MODE` (default: `demo`)

- **Demo Mode** (`demo`):
  - `isAuthenticated()` returns `true`
  - `login()` resolves immediately
  - No actual authentication

- **JWT Mode** (`jwt`):
  - Reads JWT token from `localStorage`
  - Attaches `Authorization: Bearer <token>` header
  - Token refresh on expiration
  - Logout clears token

### Auth Service

```typescript
// services/auth.ts
export const authService = {
  login: (googleIdToken: string) => Promise<LoginResponse>,
  logout: () => void,
  getToken: () => string | null,
  isAuthenticated: () => boolean,
  refreshToken: () => Promise<LoginResponse>,
};
```

### Axios Interceptor

```typescript
api.interceptors.request.use((config) => {
  if (AUTH_MODE === 'jwt') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

## Component Architecture

### Atomic Design Pattern

#### Atoms (UI Components)

Located in `components/ui/`:

- **Button**: Primary, secondary, ghost variants; loading, disabled states
- **Card**: Container with hover effects, clickable
- **Tag**: Selectable, removable, keyboard accessible
- **Typography**: Consistent text styling (H1-H6, Body, Caption)
- **LoadingSpinner**: Loading indicator
- **ErrorMessage**: Error display component
- **SuccessMessage**: Success notification
- **ConfirmationDialog**: Modal confirmation
- **Breadcrumbs**: Navigation breadcrumbs
- **Container**: Max-width container wrapper

**Nielsen's Heuristics Compliance**:
- Visibility of system status (LoadingSpinner, SuccessMessage)
- Error prevention (ConfirmationDialog)
- Error recovery (ErrorMessage)
- Consistency (unified design system)

#### Molecules

- **ProjectCard**: Project summary card
- **FeaturedProjectCard**: Featured project display
- **TechIcon**: Technology icon with tooltip

#### Organisms

- **Header**: Main navigation with theme toggle
- **Footer**: Multi-section footer (Branding, Nav, Contact, CTA, Legal, Social)
- **ProjectShowcaseSection**: 3-column interactive project showcase
- **JourneyMilestoneSection**: Scroll-based timeline
- **TechStackSection**: Technology stack display
- **PersonalInfoHeader**: Recruiter-focused header
- **CareerSummaryDashboard**: Career summary with resume download

## Internationalization (i18n)

### Supported Languages

- **Korean** (`ko`) - Default
- **English** (`en`)
- **Japanese** (`ja`)

### Configuration

**i18n setup** (`src/i18n/config.ts`):
- Language detection: Browser language + localStorage
- Fallback: Korean
- Namespace: `translation`

### Usage

```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

### Language Switcher

- **Component**: `LanguageSwiper`
- **Features**: Swipe gesture support, hint text for UX
- **Storage**: Selected language persisted in localStorage

## Styling

### Theme System

**Theme Configuration** (`src/styles/theme.ts`):
- **Colors**: Primary (Indigo), Accent (Cyan), Neutrals
- **Dark Mode**: Full dark mode support
- **Typography**: Type scale (Title, H2, H3, Body, Caption)
- **Spacing**: Consistent spacing scale
- **Breakpoints**: 640px, 768px, 1024px, 1280px

### Styled Components

- **Global Styles**: `GlobalStyle.ts` with CSS reset
- **Theme Provider**: Wraps entire app
- **Dark Mode**: `prefers-color-scheme` + manual toggle

### Responsive Design

- **Mobile First**: Base styles for mobile
- **Breakpoints**: 
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Grid System**: CSS Grid for layouts
- **Flexbox**: For component layouts

## State Management

### Zustand Stores

#### Auth Store (`store/authStore.ts`)
```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
```

#### Filter Store (`store/filters.ts`)
```typescript
interface FilterStore {
  techStacks: string[];
  year: number | null;
  sort: string;
  setTechStacks: (stacks: string[]) => void;
  setYear: (year: number | null) => void;
  setSort: (sort: string) => void;
  reset: () => void;
}
```

#### Theme Store (`store/theme.ts`)
```typescript
interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
}
```

### URL State Sync

- Filters synced with URL query parameters
- Debounced updates (150ms)
- Browser back/forward support

## Types

### Core Types (`types/domain.ts`)

```typescript
interface ProjectSummary {
  id: string;              // MongoDB ObjectId
  title: string;
  summary: string;
  startDate: string;      // ISO-8601 date
  endDate: string;         // ISO-8601 date
  techStacks: string[];
  imageUrl?: string;
  featured?: boolean;
}

interface ProjectDetail extends ProjectSummary {
  description: string;     // Markdown
  githubUrl?: string;
  demoUrl?: string;
  relatedAcademics?: string[];
  challenge?: string;
  solution?: string[];
  keyOutcomes?: string[];
}

interface Academic {
  id: string;              // MongoDB ObjectId
  name: string;
  semester: string;
  grade?: string;
  description?: string;
  creditPoints?: number;
  marks?: number;
  status: 'completed' | 'enrolled' | 'exemption';
}

interface TechStack {
  id: string;             // MongoDB ObjectId
  name: string;
  type: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'MOBILE' | 'TESTING' | 'OTHER';
}
```

### API Types (`types/api.ts`)

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

interface Page<T> {
  page: number;
  size: number;
  total: number;
  items: T[];
}
```

## UI/UX Features

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: All interactive elements labeled
- **Focus Management**: Visible focus indicators
- **Skip Links**: Skip to main content
- **Screen Reader**: Semantic HTML

### Performance

- **Code Splitting**: Route-based (future)
- **Image Lazy Loading**: Native `loading="lazy"`
- **Skeleton Loading**: Loading states
- **Debouncing**: Filter updates debounced

### Animations

- **Framer Motion**: Smooth page transitions
- **Scroll Reveal**: Intersection Observer for scroll animations
- **Hover Effects**: Card hover scale + shadow
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Build & Development

### Scripts

```json
{
  "dev": "vite",                    // Development server
  "build": "tsc -b && vite build",  // Production build
  "preview": "vite preview"        // Preview production build
}
```

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCK=false

# Authentication
VITE_AUTH_MODE=jwt  # or 'demo'

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id

# EmailJS (Contact Form)
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

### Development Server

- **Port**: 5173 (default)
- **Hot Module Replacement**: Enabled
- **Proxy**: `/api` → `http://localhost:8080/api/v1`

## Testing

### Test Files

- **Location**: `src/test/frontend-test-cases.yaml`
- **Format**: YAML test cases
- **Coverage**: Component, integration, E2E scenarios

### Acceptance Criteria

- **Lighthouse** (Mobile):
  - Performance: ≥ 85
  - Accessibility: ≥ 95
  - SEO: ≥ 90
- **Keyboard Navigation**: Complete, no focus traps
- **Responsive**: All breakpoints tested
- **Cross-Browser**: Chrome, Firefox, Safari, Edge

## Deployment

### Build Output

- **Directory**: `dist/`
- **Static Files**: HTML, CSS, JS, assets
- **SPA Routing**: `_redirects` file for Netlify/Vercel

### Deployment Platforms

- **Vercel**: Automatic deployments
- **Netlify**: Static site hosting
- **Azure Static Web Apps**: Azure integration

### Environment Configuration

- **Production API**: Set `VITE_API_BASE_URL` to production URL
- **CDN**: Assets served via CDN
- **Caching**: Static assets cached, API calls not cached

## Future Improvements

1. **Code Splitting**: Route-based lazy loading
2. **Service Worker**: PWA support
3. **Offline Mode**: Cache API responses
4. **Error Boundary**: React Error Boundaries
5. **Performance Monitoring**: Web Vitals tracking
6. **A/B Testing**: Feature flags
7. **Analytics**: Enhanced tracking

---

**Document Version**: 2.0.0  
**Last Updated**: 2025-11-15  
**Maintained By**: Development Team
