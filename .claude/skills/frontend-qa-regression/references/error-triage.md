# Error Triage Rules

## Goal

Separate failures into two classes:

1. Pre-existing issues
- Failures reproducible before the current task changes

2. Newly introduced issues
- Failures that appeared only after the current task changes

## Triage Procedure

1. Capture baseline command output before code edits.
2. Re-run the same command after changes.
3. Compare error signatures (file, line, message family).
4. Label each issue with one of:
- `existing`
- `new`
- `uncertain` (requires further isolation)

## Evidence Requirements

For each `new` issue, include:

- Command used
- Affected file/path
- Error summary
- Why this is linked to current changes

For each `existing` issue, include:

- Baseline evidence reference
- Confirmation it persists unchanged

## Reporting Template

- Total issues: N
- Existing: X
- New: Y
- Uncertain: Z
- Blocking new issues: ...
- Non-blocking new issues: ...
