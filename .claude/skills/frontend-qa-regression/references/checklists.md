# QA Checklists

## A. Build and Typecheck

- Run frontend build command
- Record success/failure and error output category
- Confirm whether failures existed before current change set

## B. Core Manual Pages

- Home page renders without layout breaks
- About page has no unintended regression
- Header behavior is stable on desktop/mobile
- Footer layout and links remain usable
- Theme Toggle changes mode as expected

## C. Responsive Checkpoints

- 360 width: hero text wraps correctly, CTA/buttons remain usable
- 768 width: nav and hero layout transitions are stable
- 1280 width: desktop spacing, hierarchy, and alignment remain consistent

## D. Accessibility

- prefers-reduced-motion disables non-essential motion
- Focus indicators are visible via keyboard navigation
- Contrast remains readable for body text and controls

## E. Theme Consistency

- Mode naming and user-facing semantics are consistent (Dark/EVA)
- Shared components keep consistent color and typography behavior
- No low-contrast state appears after mode toggle

## F. Final QA Report

- Pass/fail by checklist category
- Repro steps for unresolved issues
- Clear distinction: blocking issues vs non-blocking observations
