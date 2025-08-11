# UI/UX Specification

## Navigation & IA
- Top nav: Home, Projects, Academics, About, Contact(anchor). Dark mode toggle.
- Breadcrumb not needed; use consistent header and back links on detail pages.

## Pages
- Home: Hero, Tech Stack icons, Featured Projects (max 3), CTA buttons.
- Projects: Filter bar (tech stacks, year, sort), card grid (1/2/3 columns responsive), pagination.
- Project Detail: Title, summary, role bullets, tech deep dive, problem/solution, media (GIF/video), links.
- Academics: Timeline by semester; item modal with quick details and related projects.
- About: Story, values, goals; contact links (email, GitHub, LinkedIn, blog).

## Components
- Button: primary/ghost, sm/md/lg, loading, disabled, keyboard focus-visible outline.
- Card: thumbnail 16:9, title, description, tags; hover elevation; entire card clickable.
- Tag/Chip: selectable, removable; supports keyboard toggling.
- Header: sticky on scroll; collapses height slightly when scrolled; theme toggle.
- FilterBar: synced to URL and Zustand store; debounced.

## Visual Design
- Colors: Primary Indigo 600, Accent Cyan 500; neutrals per design-plan. Dark mode palette specified.
- Type scale: Title 48/56, H2 28/36, H3 20/28, Body 16/24, Caption 14/20.
- Grid: max 1200px container; 24px gutters; cards gap 24px.

## Accessibility
- Keyboard navigation end-to-end; skip link; aria-labels; roles on composite card links.
- Contrast AA+; reduced motion support.

## Motion
- Page fade 120ms; card hover scale 1.02 + shadow step; scroll reveal once per section.

## Responsive Rules
- Breakpoints: 640/768/1024/1280.
- Nav collapses to drawer <768px; Home becomes single column; grids adjust to 1/2/3 cols.

## Telemetry
- Track: project_detail_view, external_link_click, contact_click, filter_change.

## Acceptance
- Lighthouse (mobile): Perf ≥ 85, A11y ≥ 95, SEO ≥ 90; no focus traps; tab order logical.
