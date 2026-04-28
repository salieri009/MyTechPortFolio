---
name: frontend-qa-regression
description: Validate frontend regressions for MyPortFolio Track 1 and Track 2 work. Use this skill whenever the user asks to verify typecheck/build, classify failures as existing vs newly introduced, run responsive checks at 360/768/1280, check reduced-motion behavior, test theme toggle consistency, and validate key pages including Home, About, Header, and Footer.
---

# Frontend QA Regression

Use this skill after implementation changes or when debugging suspected regressions in Track 1/2.

## Validation Scope

- Build and typecheck health
- Functional smoke checks for core pages and global UI
- Responsive behavior at fixed viewport checkpoints
- Accessibility checks focused on motion preference, focus visibility, and readability contrast

## Required Workflow

1. Collect baseline diagnostics
- Run build/typecheck in frontend workspace.
- Capture failures before any fixes.

2. Triage failures
- Mark each issue as pre-existing or newly introduced.
- Do not mask pre-existing issues as newly fixed unless verified.

3. Manual QA walkthrough
- Verify Home and About key rendering paths.
- Verify Header/Footer behavior and Theme Toggle interactions.
- Verify responsive layouts at 360/768/1280.

4. Accessibility checks
- Confirm prefers-reduced-motion handling.
- Confirm keyboard focus visibility.
- Confirm text/background contrast remains readable.

5. Report quality gate
- Produce pass/fail status by category.
- List unresolved items with reproduction notes.

## Required References

- `references/checklists.md`
- `references/error-triage.md`

## Output Expectations

1. Validation summary
2. Failure classification table
3. Regression status for key pages/components
4. Residual risks and recommended next actions
