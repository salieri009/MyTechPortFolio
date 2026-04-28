# Depth Strategy Skill — Borders-Only Elevation

## When to invoke this skill
- Adding new UI components in dark or EVA theme
- Reviewing components that use glassmorphism or box-shadow
- Migrating components from old glass tokens to depth tokens

---

## The Strategy in One Sentence
**Dark mode elevation = border opacity only. No blur. No shadow. No glow.**

---

## Depth Token Quick Reference

```ts
// In theme.ts → baseTheme.depth (dark defaults)
depth: {
  cardBorder:       'rgba(255, 255, 255, 0.06)',   // resting card
  cardBorderHover:  'rgba(255, 255, 255, 0.14)',   // hovered card
  cardBorderFocus:  'rgba(59, 130, 246, 0.5)',     // focused element
  dividerBorder:    'rgba(255, 255, 255, 0.04)',   // section dividers
  emphasisBorder:   'rgba(255, 255, 255, 0.10)',   // featured elements
  modalShadow:      '0 25px 50px -12px rgba(0,0,0,0.7)',  // true overlays only
  floatBorder:      'rgba(255, 255, 255, 0.12)',   // floating UI
  cardBackground:   'rgba(255, 255, 255, 0.02)',   // subtle card fill
}

// EVA theme overrides (purple-tinted)
depth: {
  cardBorder:       'rgba(139, 92, 246, 0.12)',
  cardBorderHover:  'rgba(139, 92, 246, 0.25)',
  // ... (see theme.ts evaTheme.depth)
}

// Light theme overrides (rgba black)
depth: {
  cardBorder:       'rgba(0, 0, 0, 0.08)',
  cardBorderHover:  'rgba(0, 0, 0, 0.16)',
  // ... (see theme.ts lightTheme.depth)
}
```

---

## Component Template

```tsx
const Card = styled.div`
  background: ${p => p.theme.depth?.cardBackground ?? p.theme.colors.surface};
  border: 1px solid ${p => p.theme.depth?.cardBorder ?? p.theme.colors.border};
  border-radius: ${p => p.theme.radius.xl};
  transition: border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${p => p.theme.depth?.cardBorderHover ?? p.theme.colors.primary[500]};
  }
`
```

---

## Migration Checklist

When updating a component from old glass tokens:

- [ ] Remove `backdrop-filter: blur(...)`
- [ ] Remove hardcoded `rgba(255,255,255,0.1-0.3)` backgrounds/borders
- [ ] Replace with `depth.cardBackground` (background)
- [ ] Replace border with `depth.cardBorder`
- [ ] Replace hover border with `depth.cardBorderHover`
- [ ] Remove `box-shadow` from hover (dark mode: shadows all = 'none')
- [ ] Keep `backdrop-filter` only for true overlays (Modal, Tooltip, Dialog)

---

## Files Already Migrated

| File | Change |
|------|--------|
| `molecules/StatCard/StatCard.tsx` | glass variant → depth tokens |
| `molecules/ContactButton/ContactButton.tsx` | glass variant → depth tokens |
| `project/ProjectCard.tsx` | HoverTechTag → depth tokens |
| `project/FeaturedProjectCard.tsx` | CardContainer hover → depth token |
| `common/FooterComponents.tsx` | FooterButton shimmer → depth token |
| `recruiter/CareerSummaryDashboard.tsx` | DashboardContainer → depth tokens |
| `recruiter/PersonalInfoHeader.tsx` | ContactItem → depth tokens |
| `sections/ProjectShowcaseSection.tsx` | ColumnCard → depth tokens |
| `styles/theme.ts` | baseTheme.depth added, darkTheme.shadows = none |
| `styles/styled.d.ts` | depth?: typeof lightTheme.depth added |
