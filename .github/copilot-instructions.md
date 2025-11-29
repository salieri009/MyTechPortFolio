# MyTechPortfolio Copilot Instructions

## Project Context
Full-stack portfolio application showcasing technical skills.
- **Frontend**: React 18, TypeScript, Vite, Styled Components, Zustand, i18next.
- **Backend**: Spring Boot 3.3, Java 21, MongoDB, Spring Security.
- **Infrastructure**: Azure (Static Web Apps, Container Apps, MongoDB).

## Code Style & Patterns

### Frontend (React + TypeScript)
- **Data Models**: Define domain interfaces in `src/types/domain.ts` (e.g., `ProjectSummary`, `Academic`).
- **API Client**: Use `src/services/apiClient.ts` for all HTTP requests. It handles base URLs and interceptors.
- **Mocking**: Use `src/mocks/` for development data. Toggle via `VITE_USE_MOCK` or similar logic if present.
- **Components**:
  - Prefer functional components with hooks.
  - Use `styled-components` for styling.
  - Separate "smart" containers (data fetching) from "dumb" presentational components.
- **State**: Use `zustand` for global state management.

### Backend (Spring Boot + Java)
- **API Structure**:
  - Controllers return `ResponseEntity<ApiResponse<T>>`.
  - Use `ResponseUtil` for consistent response building.
  - Define endpoints in `ApiConstants`.
- **DTO Pattern**:
  - strictly separate `dto/request` and `dto/response` packages.
  - Do NOT expose Entities directly in APIs.
- **Documentation**: Use Swagger/OpenAPI annotations (`@Operation`, `@Tag`) on Controllers.
- **Validation**: Use Jakarta Bean Validation (`@Valid`, `@Min`, etc.) on Request DTOs.

## Developer Workflow
- **Frontend Build**: `npm run build` (uses `tsc -b && vite build`).
- **Frontend Test**: `npm run test` (uses `vitest`).
- **Backend Build**: `./gradlew build` (Java 21 required).
- **Local Dev**:
  - Frontend proxies to backend in dev mode (see `vite.config.ts` or `apiClient.ts`).
  - Ensure MongoDB is running or configured for backend.

## Key Files & Directories
- `frontend/src/types/domain.ts`: Central domain type definitions.
- `frontend/src/services/apiClient.ts`: Axios instance configuration.
- `backend/src/main/java/com/mytechfolio/portfolio/dto/`: DTO definitions.
- `backend/src/main/java/com/mytechfolio/portfolio/controller/`: API Controllers.
- `backend/src/main/java/com/mytechfolio/portfolio/util/ResponseUtil.java`: Standard response helper.

## Conventions
- **Language**: Write comments and commit messages in English.
- **Error Handling**:
  - Frontend: Handle errors in `apiClient` interceptors or React Error Boundaries.
  - Backend: Use `@ControllerAdvice` for global exception handling.
