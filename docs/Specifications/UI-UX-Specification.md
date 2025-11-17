---
title: "UI/UX Specification"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Specification"
audience: ["UX Designers", "UI Developers", "Frontend Developers"]
prerequisites: ["Frontend-Specification.md"]
related_docs: ["Best-Practices/Heuristics-Implementation.md", "Best-Practices/Accessibility.md"]
maintainer: "Development Team"
---

# UI/UX Specification

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

This document defines the UI/UX design guidelines, patterns, and user experience standards for MyTechPortfolio.

**Design System**: KickoffLabs-inspired with glassmorphism  
**Accessibility**: WCAG 2.1 Level AA  
**Responsive**: Mobile-first approach

---

## Design Principles

### 1. Immersive Staging Direction
- Core content (projects, academics) displayed in high-contrast modal overlays
- 100% focus isolation for detailed views
- Context preservation when closing modals

### 2. Context Preservation
- No page navigation for core content
- Modal-based interactions
- Scroll position restoration
- Focus return after modal close

### 3. Design System Consistency
- 4-Point Spacing system
- SVG icons (no emojis or text icons)
- Consistent typography hierarchy
- Unified color palette

---

## Visual Design

### Color Palette

**Light Theme**:
- Primary: `#2563eb` (Blue)
- Secondary: `#64748b` (Slate)
- Background: `#ffffff`
- Surface: `#f8fafc`
- Text: `#1e293b`

**Dark Theme**:
- Primary: `#3b82f6` (Blue)
- Secondary: `#94a3b8` (Slate)
- Background: `#0f172a`
- Surface: `#1e293b`
- Text: `#f1f5f9`

### Typography

**Font Family**: System fonts (San Francisco, Segoe UI, Roboto)

**Scale**:
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- H4: 1.25rem (20px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Spacing

**4-Point Grid System**:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

---

## Component Patterns

### Modal Overlays

**ProjectDetailOverlay**:
- Full-screen overlay
- High contrast background (`rgba(0, 0, 0, 0.95)`)
- Centered content
- Esc key to close
- Click outside to close
- Scroll position preservation

**FeedbackOverlay**:
- Same modal pattern
- Form-focused layout
- Clear CTA buttons

### Cards

**ProjectCard**:
- Hover effect with scale transform
- Image overlay on hover
- Magnifying glass icon on hover
- Smooth transitions (300ms ease)

**FeaturedProjectCard**:
- Asymmetric grid layout
- First project: 12-column full width
- Subsequent: Dynamic grid (6-4-2, 4-6-2, etc.)

### Navigation

**Header**:
- Sticky navigation
- Mobile hamburger menu
- Language switcher
- Theme toggle

**Footer**:
- 4-column grid (desktop)
- 2-column grid (tablet)
- Single column (mobile)
- Contact information
- Social links
- CTA section

---

## User Flows

### Project Exploration

1. User visits homepage
2. Sees featured projects
3. Clicks project card
4. Modal opens with project details
5. User can navigate to related projects
6. Esc key or close button closes modal
7. Returns to homepage with scroll position preserved

### Feedback Submission

1. User clicks feedback button
2. Modal opens with form
3. User fills form
4. Submits feedback
5. Success message displayed
6. Modal closes
7. Returns to previous page

---

## Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

### Mobile Considerations

- Touch-friendly targets (min 44x44px)
- Simplified navigation
- Stacked layouts
- Optimized images

### Tablet Considerations

- 2-column grids
- Collapsible sidebar
- Optimized spacing

### Desktop Considerations

- Multi-column layouts
- Hover states
- Keyboard shortcuts
- Full feature set

---

## Accessibility

### WCAG 2.1 Level AA Compliance

**Color Contrast**:
- Normal text: ≥ 4.5:1
- Large text: ≥ 3:1
- Interactive elements: ≥ 3:1

**Keyboard Navigation**:
- All interactive elements accessible
- Tab order follows visual order
- Focus indicators visible
- Skip links available

**Screen Readers**:
- Semantic HTML
- ARIA labels
- Alt text for images
- Live regions for dynamic content

**Focus Management**:
- Visible focus indicators
- Focus trap in modals
- Focus return after modal close

---

## Animation & Transitions

### Principles

- **Duration**: 300ms for most transitions
- **Easing**: `ease` or `ease-in-out`
- **Respect**: `prefers-reduced-motion`

### Common Animations

- **Modal Open/Close**: Fade + scale (300ms)
- **Card Hover**: Scale transform (300ms)
- **Page Transitions**: Fade (300ms)
- **Loading States**: Spinner rotation

---

## Iconography

### Icon System

- **Type**: SVG stroke-based icons
- **Style**: Consistent stroke width (2px)
- **Size**: 16px, 20px, 24px, 32px
- **No Emojis**: Professional appearance

### Common Icons

- Magnifying glass (view details)
- Close (X)
- Arrow (navigation)
- External link
- GitHub
- LinkedIn

---

## Form Design

### Input Fields

- Clear labels
- Placeholder text
- Error states
- Success states
- Help text

### Buttons

- Primary: Solid background
- Secondary: Outline
- Destructive: Red variant
- Loading states
- Disabled states

---

## Error Handling

### Error Messages

- Clear, actionable language
- Specific error details
- Recovery suggestions
- Retry options

### Empty States

- Helpful messaging
- Clear CTAs
- Visual indicators

---

## Performance

### Loading States

- Skeleton loaders
- Progress indicators
- Optimistic updates

### Image Optimization

- Lazy loading
- Responsive images
- WebP format support
- Placeholder images

---

## Related Documentation

- [Frontend Specification](./Frontend-Specification.md)
- [Heuristics Implementation](../Best-Practices/Heuristics-Implementation.md)
- [Accessibility Guide](../Best-Practices/Accessibility.md)
- [Component Guidelines](../Best-Practices/Component-Guidelines.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team

