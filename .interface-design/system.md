# Salieri.dev — Interface Design System

## Identity

**Product:** Personal portfolio for Jungwook Van (Salieri.dev)
**Voice:** logical, efficient, technically grounded, philosophical depth
**Persona:** practical cyber-philosopher — not generic DevOps, not generic dark portfolio
**Modes:** Dark (default), EVA (philosophical/purple — the real identity mode)
**Languages:** Korean, English, Japanese

---

## Direction & Feel

The interface should feel like a **terminal that thinks** — precise and structured like software infrastructure, but with philosophical weight underneath. Not the generic "dark dev portfolio." Something between a command line and a journal.

Reference worlds: Neon Genesis Evangelion (EVA theme), classical music (Salieri), modern terminal UIs (Warp, Charm.sh), structured prose.

---

## Depth Strategy

**Borders-only for dark mode.** Subtle rgba borders only. No mixed shadows/glassmorphism/neumorphism.
- Default border: `rgba(255,255,255, 0.06)`
- Emphasis border: `rgba(255,255,255, 0.12)`
- Focus ring: `rgba(59, 130, 246, 0.5)` (primary brand)

---

## Color System

### Dark Mode Primitives
- `--bg-canvas`: `#0f172a` (Slate 900)
- `--bg-surface`: `#1e293b` (Slate 800)
- `--bg-elevated`: `#253347` (+subtle tint of surface)
- `--ink-primary`: `#f8fafc`
- `--ink-secondary`: `#94a3b8`
- `--ink-tertiary`: `#64748b`
- `--ink-muted`: `#475569`
- `--signal`: `#3b82f6` (CTA / action only)
- `--border-default`: `rgba(255,255,255,0.06)`
- `--border-emphasis`: `rgba(255,255,255,0.12)`

### EVA Mode Primitives
- `--bg-canvas`: `#120f1d`
- `--bg-surface`: `#1b1530`
- `--ink-primary`: `#f5f3ff`
- `--ink-secondary`: `#c4b5fd`
- `--signal`: `#8b5cf6`

---

## Typography

Two fonts. Enforced roles. No exceptions.

- **Tech role** (code, labels, CLI, data): JetBrains Mono — cold, precise
- **Essay role** (philosophy lines, long-form prose, reflective copy): Lora — warm, considered
- **UI role** (nav, buttons, section titles): Inter — neutral infrastructure

**Sizes:**
- Headline h1: `clamp(2rem, 5vw, 4rem)`, weight 800, tracking `-0.02em`
- Subtitle: `1.25rem`, weight 400, tracking `0`
- PhilosophyLine: `1rem`, Lora, weight 400, tracking `0.01em`, italic optional
- CLI terminal: `0.875rem`, JetBrains Mono, weight 500
- Labels: `0.75rem`, Inter, weight 500, tracking `0.06em` uppercase

---

## Spacing Base

4px grid. All values multiples of 4.

---

## Signature Element

**CLI Identity Terminal** — the `> init profile --lang={{lang}}` terminal prompt in the hero. This is the signature, but needs a real font (JetBrains Mono) and a real-looking terminal shell (not just a div with border). Should look like an actual terminal prompt with cursor blink.

Second signature: **EVA mode toggle** should be discoverable and have a distinctive reveal interaction, not hidden in a generic theme toggle.

---

## Component Patterns

### Button Primary
- Height: 48px
- Padding: `12px 32px`
- Radius: `8px`
- Font: Inter, 16px, 600 weight
- Background: `--signal`
- Hover: Y-only lift `-2px`, no X translation

### Navigation
- Height: 64px
- Background: `--bg-surface` with bottom border `--border-default`
- Logo: Inter 700, `--signal` color
- Links: Inter 500, `--ink-secondary` → `--ink-primary` on hover
- Active: `--signal` underline 2px, not color change alone
- Admin/Login: hidden from public nav

### CLI Terminal (Hero)
- Font: JetBrains Mono
- Background: `rgba(2, 6, 23, 0.6)`
- Border: `--border-emphasis`
- Cursor: animated blink `|`
- Prompt: `$` in `--signal` color

---

## What Has Been Decided

- Single font for body/UI: Inter
- Tech/code font: JetBrains Mono (to be implemented)
- Essay/philosophy font: Lora (to be implemented)
- Depth: borders-only (glassmorphism and neumorphism to be removed)
- Color: `--signal` replaces generic `primary[500]` for CTA usage
- Login/admin items removed from public header
- EVA mode as primary identity expression (not hidden)
