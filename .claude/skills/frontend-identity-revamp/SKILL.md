---
name: frontend-identity-revamp
description: Implement MyPortFolio frontend Track 1 and Track 2 changes with strict scope guard. Use this skill whenever the request includes home hero redesign, persona-aligned identity copy (ko/en/ja context), semantic theme mode updates (Dark/EVA), theme toggle UX, typography role separation (Tech vs Essay), or asks for mobile and accessibility-safe frontend refinement. Do not use this skill for Track 3 features.
---

# Frontend Identity Revamp

Use this skill to execute implementation work for Track 1 and Track 2 only.

## Scope Guard

- Allowed:
  - Home hero structure and content alignment
  - Hero interaction and motion behavior with reduced-motion support
  - Global semantic theming (Dark/EVA)
  - Theme toggle UX adjustments
  - Shared UI consistency updates tied to theme and typography tokens
- Not allowed:
  - Track 3 work (including RPG status features)
  - Unrequested large refactors
  - Full visual redesign outside requested scope

If the request conflicts with these rules, ask for explicit scope confirmation.

## Required Workflow

1. Baseline checks
- Run frontend build/typecheck and capture current failures.
- Classify failures: pre-existing vs introduced by your changes.

2. Track 1 implementation
- Align Home hero information hierarchy with persona and architecture references.
- Ensure 3-language context support and developer/philosophical identity balance.
- Respect prefers-reduced-motion and keep mobile layout stable.

3. Track 2 implementation
- Introduce semantic theme behavior using Dark/EVA meaning, not generic light/dark naming.
- Keep color/typography references token-driven.
- Preserve readability and contrast priorities.

4. Verification
- Build and typecheck must pass.
- Manually verify Home, About (no regression), Header/Footer, Theme Toggle.
- Verify responsive behavior at 360/768/1280.

5. Commit strategy
- Prefer 2-3 small commits by intent.
- Never mix unrelated files in one commit.

## Required References

Read these files before editing implementation code:

- `references/persona.md`
- `references/frontend-architecture.md`
- `references/scope-guard.md`

## Output Expectations

When reporting completion, include:

1. What changed
2. Why it changed
3. What was validated
4. Remaining risks (2-3)
5. Next actionable steps (1-2)
