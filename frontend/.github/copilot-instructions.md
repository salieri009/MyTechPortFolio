# MyTechPortfolio Frontend Instructions

## Project Context
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Styled Components
- **State Management**: Zustand
- **Internationalization**: i18next
- **Testing**: Vitest, React Testing Library

## Code Style & Patterns
- **Components**:
  - Use functional components with hooks.
  - Separate "Smart" (Container) and "Dumb" (Presentational) components.
  - Use `MainHeader.tsx` for the unified navigation bar.
- **Styling**:
  - Use `styled-components` for all component styling.
  - Define global theme variables in `src/styles/theme.ts` (if applicable).
- **Data & Types**:
  - **Domain Models**: Defined in `src/types/domain.ts` (e.g., `ProjectSummary`, `Academic`).
  - **API Client**: MUST use `src/services/apiClient.ts` for all HTTP requests.
  - **Mock Data**: Located in `src/mocks/`. Use for development/testing.

## Developer Workflow
- **Build**: `npm run build` (runs `tsc` + `vite build`)
- **Test**: `npm run test` (runs `vitest`)
- **Dev Server**: `npm run dev`

## Key Files
- `src/types/domain.ts`: Core type definitions.
- `src/services/apiClient.ts`: Axios instance with interceptors.
- `src/components/layout/MainHeader.tsx`: Primary navigation.
- `src/pages/HomePage.tsx`: Main landing page with Featured & Testimonials sections.
