# Recruiter-Focused Improvements Roadmap

This document prioritizes what recruiters care most about when reviewing engineering portfolios and turns them into concrete, high-impact improvements for this project.

## What recruiters look for (and how we?™ll show it)

- Clear value and role
  - What problem did you solve, for whom, and what was your role? Show it on the first screen with a one-sentence value prop + role tag.
- Real impact with metrics
  - Numbers beat adjectives. Include quantifiable results (e.g., performance, reliability, usage, time saved, adoption).
- Depth over breadth
  - One or two polished case studies with architecture, trade-offs, and measurable outcomes are stronger than many shallow projects.
- Production readiness
  - Tests, CI/CD, security, error handling, logging/monitoring, and sensible architecture.
- Code quality and clarity
  - Readable, typed, modular code with a clean structure, docs, and conventions.
- UX polish
  - Fast, accessible, responsive, internationalized, and visually consistent.

## Quick wins (1?? hours each)

- [ ] Home hero: add a one-liner ?œWho I am + What I do + Outcomes??
- [ ] Add prominent links: GitHub, LinkedIn, Email (track clicks via analytics)
- [ ] Add favicon and social preview image (fixes 404 on favicon)
- [ ] Add a Case Study section on the Home page linking to Projects with highlights
- [ ] Add Lighthouse budget to ensure good Web Vitals (CLS/LCP/INP)
- [ ] Fix path aliases consistency (Vite + tsconfig) and simplify imports
- [ ] Provide a single source of truth for UI components and theme tokens

## High-impact case study template (use for 1?? best projects)

1. Context
   - Goal, constraints, your role, timeline, stakeholders
2. Architecture
   - Diagram + key components (frontend, backend, persistence, CI/CD)
3. Trade-offs & decisions
   - Why X over Y (performance, complexity, cost, learning)
4. Results (with numbers)
   - Performance (page load, API time), reliability (error rate), reach (users, views)
5. What I?™d improve next
   - Honest, technical, and feasible next steps

Create each as `/projects/:id` detail pages with consistent sections.

## Frontend improvements

- Architecture & DX
  - [ ] Normalize import aliases: use `@src/*` or keep `@components/@pages/@services/@styles/@types` consistently in both `vite.config.ts` and `tsconfig.json`
  - [ ] Remove unused/duplicate exports. Ensure each page exports exactly one default
  - [ ] Add error boundary around routes to avoid blank screens on runtime errors
  - [ ] Add fallback skeletons and Suspense boundaries for async sections
- UI/UX
  - [ ] Add global 404/500 pages with soft navigation back to home/projects
  - [ ] Build a minimal design system (Buttons, Card, Tag, Grid, Typography) and document props in a MDX/Storybook later
  - [ ] Improve accessibility: labels for controls, focus states, color contrast
  - [ ] i18n: ensure keys exist, add language toggle, and lazy-load namespaces
- Performance
  - [ ] Code split routes (React.lazy) and prefetch next pages
  - [ ] Optimize images and add `og:*` metadata for link previews
  - [ ] Audit with Lighthouse and fix top offenders (LCP image, render-blocking)

## Backend improvements

- API & data
  - [ ] Add OpenAPI (springdoc) for /api docs and client generation
  - [ ] Validate payloads (Bean Validation) and return consistent error shapes
  - [ ] Add pagination, sorting, and filters for projects/academics endpoints
- Reliability & ops
  - [ ] Add global exception handler and structured logging (trace ID)
  - [ ] Add health/readiness endpoints and simple rate limiting
  - [ ] Add integration tests for repositories/services/controllers

## Testing & quality gates

- [ ] Add unit tests for critical utils and components (button, card, project list)
- [ ] Add a minimal e2e smoke test (Playwright/Cypress) for main flows
- [ ] Set up CI (GitHub Actions): build, typecheck, lint, test, preview
- [ ] Add Prettier + ESLint + strict TS rules, enforce in CI

## Observability & analytics

- [ ] Add privacy-friendly analytics (Plausible/Umami) for clicks and nav
- [ ] Add front-end error tracking (Sentry) with release marker
- [ ] Correlate frontend error IDs with backend logs via response headers

## Security & compliance

- [ ] Security headers via Vite/hosting config (CSP, HSTS, X-Content-Type)
- [ ] Sanitize and validate all user input paths (project id)
- [ ] Least-privilege credentials and secrets handling (env, not code)

## Documentation upgrades

- [ ] Rewrite README with:
  - What this is, live demo link, screenshots
  - Tech stack and why
  - Quick start (frontend/backend), scripts, env vars
  - Architecture diagram and request flow
  - Project structure and conventions
- [ ] Add CONTRIBUTING and simple ADRs for key decisions

## Suggested repo structure (clean and recruiter-friendly)

```
frontend/
  src/
    components/
    pages/
    services/
    styles/
    types/
    routes/ (optional)
  vite.config.ts
  tsconfig.json
backend/
  src/main/java/... (layers: domain, repository, service, controller)
  src/test/java/...
  build.gradle or pom.xml
project-ideas/
  recruiter-focus-improvements.md (this file)
```

## Milestoned plan

- Milestone 1: Baseline polish (1?? days)
  - Home hero, favicon/og image, 404, export/import cleanup, a11y fixes
- Milestone 2: Case study + performance (1?? days)
  - One in-depth project page with metrics; Lighthouse improvements
- Milestone 3: Tests + CI (1?? days)
  - Unit tests, smoke e2e, GitHub Actions pipeline
- Milestone 4: API quality + docs (1?? days)
  - OpenAPI, error handling, logs, health checks

## Success criteria

- Lighthouse: ??90 on Performance, Accessibility, Best Practices, SEO
- Zero ?œblank screen??incidents on route errors (verified by error boundary)
- Case study page with at least 3 quantifiable outcomes
- CI green: build, typecheck, lint, tests passing

---

If you want, I can also generate a checklist issue set (GitHub issues) from this doc so you can track progress sprint-by-sprint.

