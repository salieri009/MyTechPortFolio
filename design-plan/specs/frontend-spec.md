# Frontend Implementation Spec (React + Vite + TS)

## Scope
- Build a responsive portfolio frontend using React 18 + TypeScript + Vite.
- Until backend API is live, use mock data; switchable via env flag without code changes.
- Auth flows bypassed for demo; provide clear integration points for JWT later.

## Tech Choices
- React 18, TypeScript
- Router: react-router-dom v6
- Styling: styled-components
- State: Zustand (UI filters, theme, transient UI)
- HTTP: Axios (single instance), optional interceptors

## Project Structure
```
frontend/
  src/
    components/
      common/ (Card, Button, Tag)
      layout/ (Header, Footer, Layout)
    pages/ (HomePage, ProjectsPage, ProjectDetailPage, AcademicsPage, AboutPage)
    services/ (apiClient, projects, academics, auth)
    mocks/ (projects.ts, academics.ts, techStacks.ts)
    store/ (ui.ts, filters.ts)
    styles/ (theme.ts, global.ts)
    types/ (api.ts, domain.ts)
    App.tsx, main.tsx
```

## Routing
- "/" → HomePage
- "/projects" → ProjectsPage (filters via querystring; sync with Zustand)
- "/projects/:id" → ProjectDetailPage
- "/academics" → AcademicsPage
- "/about" → AboutPage
- Private routes placeholder: `PrivateRoute` that currently passes through.

## Data Access Strategy
- Env toggle: `VITE_USE_MOCK=true` in dev. Service modules route to mock modules when true; otherwise call Axios instance.
- Common response envelope: `{ success, data, error }` for parity with backend.
- Error policy: Network/API errors → user toast + console; show friendly empty states.

## Auth (Demo Bypass)
- Env `VITE_AUTH_MODE=demo|jwt` (default demo). When `demo`: `isAuthenticated()` returns true, `login()` resolves immediately. When `jwt`: read token from storage and attach in Axios `Authorization: Bearer <token>` interceptor.
- Integration points: `auth.ts` (login/logout/getToken/isAuthenticated), `PrivateRoute`, Axios interceptor.

## UI/UX Essentials
- Theme tokens from design-plan; dark mode via prefers-color-scheme + toggle in header.
- Accessibility: focus-visible, skip link, ARIA labels for icon buttons/cards.
- Performance: route-based code splitting, image lazy loading, skeletons.

## Types (Core)
- `ProjectSummary`: id, title, summary, startDate, endDate, techStacks[]
- `ProjectDetail`: ProjectSummary + description, githubUrl, demoUrl, relatedAcademics[]
- `Academic`: id, name, semester, grade?, description?
- `TechStack`: id, name, type
- `ApiResponse<T>`

## Filters & Sorting
- Filters: techStacks[], yearRange?, type?
- Sort: endDate desc|asc (default desc)
- Persist in URL query and Zustand store; debounce updates 150ms.

## Build/Run
- Dev: `npm run dev` (VITE_USE_MOCK=true)
- Build: `npm run build`
- Preview: `npm run preview`

## Definition of Done
- Lighthouse mobile: Perf ≥ 85, A11y ≥ 95, SEO ≥ 90
- Keyboard navigation complete, no focus traps
- Mock/Real toggle without code changes
