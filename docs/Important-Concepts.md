# Important Concepts ??5-minute overview

This page highlights the most important concepts for this portfolio project. Read this first.

1) Architecture & Deployment (high priority)

- The project uses a React + TypeScript frontend. The repo contains an Azure Static Web Apps deployment pipeline (GitHub Actions).
- Key decision: Keep frontend and backend separated. Frontend is deployed as a static site; backend (if present) is packaged separately.
- Production build: `frontend` produces `dist/` (Vite). Ensure Static Web Apps `app_location` + `output_location` match.

Why it matters: deployment mistakes (wrong output path or navigationFallback) cause the website to return HTML for static assets and break module loading.

2) Frontend build & static hosting (high priority)

- Vite builds assets into `dist/` and uses hashed filenames in `dist/assets/`.
- Ensure `staticwebapp.config.json` or SWA routing excludes JS/CSS assets from being rewritten to `index.html`.

3) MIME types and navigationFallback (high priority)

- If JS files are served as `text/html` (404 or rewrite to index), the browser will refuse to load ES module scripts.
- Keep `manifest.json` and favicons at consistent public paths; check HTML references (e.g. `/manifest.json`, `/favicon.ico`).

4) API & backend (medium priority)

- Backend design is in `design-plan/backend-design.md`. If an API is present, host it separately or configure Azure SWA / Functions properly.

5) Security & headers (medium priority)

- Add `X-Content-Type-Options: nosniff` to prevent content-type sniffing issues.

6) Tests & QA (medium priority)

- Test run docs are in `design-plan/test-run/`. Prioritize the failing tests and regression checks when modifying deploy configs.

7) CI/CD (low-to-medium priority)

- GitHub Actions workflow is `/.github/workflows/*`. Keep `app_location`, `output_location` correct and avoid skipping the build unless you commit `dist/`.

Where to go next:

- Read `docs/design-plan/README.md` for the full design-plan index.
- If you saw MIME errors in the browser console, check `docs/important-concepts.md` section 2?? and the `staticwebapp.config.json` files.

