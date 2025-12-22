# UI/UX Specification

> **Version**: 2.0.0  
> **Last Updated**: 2025-11-15  
> **Status**: Production Implementation Complete

## Overview

Comprehensive UI/UX specification for MyTechPortfolio, ensuring consistency, accessibility, and optimal user experience across all devices. All components follow Nielsen's 10 Usability Heuristics and WCAG AA accessibility standards.

## Design System

### Color Palette (DevOps Theme)

#### Light Mode

- **Primary**: Sky Blue 500 (`#3b82f6`)
- **Accent**: Sky Blue 400 (`#60a5fa`)
- **Background**: White (`#FFFFFF`)
- **Surface**: Slate 50 (`#f8fafc`)
- **Text Primary**: Slate 900 (`#0f172a`)
- **Text Secondary**: Slate 600 (`#475569`)
- **Border**: Slate 200 (`#e2e8f0`)
- **Error**: Red 500 (`#ef4444`)
- **Success**: Emerald 500 (`#10b981`)
- **Warning**: Amber 500 (`#f59e0b`)

#### Dark Mode

- **Primary**: Sky Blue 400 (`#38bdf8`)
- **Accent**: Sky Blue 500 (`#0ea5e9`)
- **Background**: Slate 900 (`#0f172a`)
- **Surface**: Slate 800 (`#1e293b`)
- **Text Primary**: Slate 50 (`#f8fafc`)
- **Text Secondary**: Slate 400 (`#94a3b8`)
- **Border**: Slate 700 (`#334155`)
- **Error**: Red 500 (`#ef4444`)
- **Success**: Emerald 500 (`#10b981`)
- **Warning**: Amber 500 (`#f59e0b`)

### Typography Scale

| Element | Font Size | Line Height | Font Weight | Usage |
|---------|-----------|-------------|-------------|-------|
| **Title** | 48px / 3rem | 56px / 3.5rem | 700 | Hero titles |
| **H1** | 36px / 2.25rem | 44px / 2.75rem | 700 | Page titles |
| **H2** | 28px / 1.75rem | 36px / 2.25rem | 600 | Section titles |
| **H3** | 20px / 1.25rem | 28px / 1.75rem | 600 | Subsection titles |
| **Body Large** | 18px / 1.125rem | 28px / 1.75rem | 400 | Large body text |
| **Body** | 16px / 1rem | 24px / 1.5rem | 400 | Default body text |
| **Body Small** | 14px / 0.875rem | 20px / 1.25rem | 400 | Small body text |
| **Caption** | 12px / 0.75rem | 16px / 1rem | 400 | Captions, labels |

### Spacing Scale

- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

### Grid System

- **Container Max Width**: 1200px
- **Gutters**: 24px
- **Card Gap**: 24px
- **Grid Columns**: 12-column system (responsive)

### Breakpoints

| Name | Size | Usage |
|------|------|-------|
| **sm** | 640px | Small tablets |
| **md** | 768px | Tablets |
| **lg** | 1024px | Small desktops |
| **xl** | 1280px | Large desktops |

## Navigation & Information Architecture

### Top Navigation

**Components**: `Header.tsx`, `MainHeader.tsx`

**Structure**:
- **Logo**: Left side, links to home
- **Navigation Links**: Center (Home, Projects, Academics, About)
- **Actions**: Right side (Theme Toggle, Language Switcher, Login)

**Behavior**:
- **Sticky**: Header sticks to top on scroll
- **Collapse**: Slightly reduces height when scrolled
- **Mobile**: Collapses to hamburger menu below 768px
- **Accessibility**: Skip link to main content

### Footer

**Component**: `Footer.tsx` with sub-components

**Sections**:
1. **Branding** (`FooterBranding.tsx`): Salieri.dev logo, tagline
2. **Navigation** (`FooterNav.tsx`): Quick links
3. **Contact** (`FooterContact.tsx`): Contact information
4. **CTA** (`FooterCTA.tsx`): Resume download, contact CTA
5. **Social** (`FooterSocial.tsx`): Social media links
6. **Legal** (`FooterLegal.tsx`): Copyright, privacy, terms

**Mobile**: Simplified footer with accordion sections

## Pages

### Home Page

**Component**: `HomePage.tsx`

**Sections**:
1. **Hero Section**:
   - Headline: "Engineering Scalable Cloud-Native Solutions"
   - CTA buttons: View Projects, Learn More
   - Language hint: "🇺🇸 English / 🇰🇷 한국어"

2. **Project Showcase** (`ProjectShowcaseSection.tsx`):
   - 3-column interactive cards
   - Categories: 3D/Game Development, Software Engineering, Game Development
   - Hover: Tech stack animation
   - Click: Navigate to filtered projects page

3. **Journey Milestone** (`JourneyMilestoneSection.tsx`):
   - Scroll-based timeline
   - Milestones: High School → University → Military → Australia → Current Goals
   - Animation: Framer Motion stagger effect
   - Visual: Vertical timeline with progress bar

4. **Tech Stack** (`TechStackSection.tsx`):
   - Technology icons grid
   - Hover: Tooltip with technology name
   - Categorized: Frontend, Backend, Database, DevOps

5. **Recruiter Focus**:
   - `PersonalInfoHeader.tsx`: Name, title, experience, contact
   - `CareerSummaryDashboard.tsx`: Skills, achievements, resume download

### Projects Page

**Component**: `ProjectsPage.tsx`

**Layout**:
- **Filter Bar**: Tech stacks, year, sort dropdown
- **Card Grid**: Responsive (1/2/3 columns)
- **Pagination**: Bottom pagination controls

**Features**:
- **URL Sync**: Filters persist in URL query string
- **Debouncing**: Filter updates debounced (150ms)
- **Loading States**: Skeleton loaders
- **Empty States**: Friendly "No projects found" message

**Card Component** (`ProjectCard.tsx`):
- Thumbnail: 16:9 aspect ratio
- Title, summary, tech stacks
- Hover: Scale (1.02) + shadow elevation
- Click: Navigate to project detail
- Keyboard: Full keyboard support

### Project Detail Page

**Component**: `ProjectDetailPage.tsx`

**Sections**:
1. **Header**: Title, summary, dates, tech stacks
2. **Links**: GitHub, Demo buttons
3. **Description**: Markdown content
4. **What I Did**: Bullet points of contributions
5. **Tech Deep Dive**: Technology choices and rationale
6. **Problem & Solution**: Problem-solving narrative
7. **Demo**: GIF or video embed
8. **Related Academics**: Linked academic courses

**Features**:
- **Markdown Rendering**: Full markdown support
- **Code Highlighting**: Syntax highlighting for code blocks
- **Media**: Responsive images and videos
- **Breadcrumbs**: Navigation breadcrumbs

### Academics Page

**Component**: `AcademicsPage.tsx`

**Layout**:
- **Timeline View**: Chronological timeline by semester
- **Filter**: Semester filter dropdown
- **Card View**: Alternative grid view (optional)

**Timeline Item**:
- Semester label
- Course name, code
- Grade, marks, credit points
- Description
- Related projects (clickable)

**Features**:
- **Modal**: Click course for detailed modal
- **Related Projects**: Links to project detail pages
- **Grade Display**: Color-coded grades (HD, D, C, P)

### About Page

**Component**: `AboutPage.tsx`

**Sections**:
1. **Story**: Personal journey narrative
2. **Values**: Core values and principles
3. **Goals**: Current and future goals
4. **Contact Links**: Email, GitHub, LinkedIn, Blog

**Design**:
- **Typography**: Large, readable text
- **Spacing**: Generous whitespace
- **Images**: Optional profile image

## Components

### Button

**Component**: `components/ui/Button.tsx`

**Variants**:
- **Primary**: Solid background, primary color
- **Secondary**: Outlined, primary color border
- **Ghost**: Transparent, text only

**Sizes**:
- **sm**: 32px height
- **md**: 40px height (default)
- **lg**: 48px height

**States**:
- **Default**: Normal state
- **Hover**: Slight elevation
- **Active**: Pressed state
- **Loading**: Spinner + disabled
- **Disabled**: Reduced opacity, no interaction

**Accessibility**:
- Keyboard focus: Visible outline
- ARIA labels: For icon-only buttons
- Loading state: `aria-busy="true"`

**Nielsen's Heuristics**:
- ✅ Visibility of system status (loading state)
- ✅ Consistency (consistent styling)
- ✅ Error prevention (disabled state)

### Card

**Component**: `components/ui/Card.tsx`

**Variants**:
- **Default**: Standard card
- **Elevated**: Higher shadow
- **Outlined**: Border only

**Sizes**:
- **sm**: Compact
- **md**: Default
- **lg**: Large

**Features**:
- **Hover**: Scale (1.02) + shadow elevation
- **Clickable**: Entire card clickable (if `onClick` provided)
- **Padding**: Consistent internal spacing

**Accessibility**:
- **Role**: `button` or `article` depending on usage
- **Keyboard**: Full keyboard support
- **Focus**: Visible focus indicator

### Tag

**Component**: `components/ui/Tag.tsx`

**Features**:
- **Selectable**: Toggle selection state
- **Removable**: Close button (if `onRemove` provided)
- **Variants**: Default, selected, disabled

**Usage**:
- Tech stack tags
- Filter tags
- Category labels

**Accessibility**:
- **Keyboard**: Space/Enter to toggle
- **ARIA**: `aria-pressed` for selection state
- **Focus**: Visible focus ring

### Typography

**Component**: `components/ui/Typography.tsx`

**Variants**:
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- `body`, `bodySmall`, `caption`
- `title` (hero title)

**Props**:
- `variant`: Typography variant
- `color`: Text color override
- `align`: Text alignment
- `weight`: Font weight override

**Accessibility**:
- Semantic HTML: Proper heading hierarchy
- Color contrast: WCAG AA compliant

### Loading Spinner

**Component**: `components/ui/LoadingSpinner.tsx`

**Variants**:
- **Default**: Circular spinner
- **Dots**: Three-dot animation
- **Skeleton**: Content placeholder

**Usage**:
- Page loading
- Button loading state
- Content skeleton

**Accessibility**:
- **ARIA**: `aria-label="Loading"`, `aria-busy="true"`
- **Screen Reader**: "Loading" announcement

**Nielsen's Heuristics**:
- ✅ Visibility of system status

### Error Message

**Component**: `components/ui/ErrorMessage.tsx`

**Features**:
- **Icon**: Error icon
- **Message**: User-friendly error message
- **Action**: Optional retry button

**Usage**:
- API errors
- Validation errors
- Network errors

**Accessibility**:
- **Role**: `alert`
- **ARIA**: `aria-live="polite"`

**Nielsen's Heuristics**:
- ✅ Help users recognize, diagnose, and recover from errors

### Success Message

**Component**: `components/ui/SuccessMessage.tsx`

**Features**:
- **Icon**: Success icon
- **Message**: Success notification
- **Auto-dismiss**: Optional auto-dismiss timer

**Usage**:
- Form submission success
- Action confirmation

**Accessibility**:
- **Role**: `status`
- **ARIA**: `aria-live="polite"`

### Confirmation Dialog

**Component**: `components/ui/ConfirmationDialog.tsx`

**Features**:
- **Title**: Dialog title
- **Message**: Confirmation message
- **Actions**: Confirm, Cancel buttons
- **Modal**: Overlay backdrop

**Usage**:
- Delete confirmation
- Destructive actions

**Accessibility**:
- **Focus Trap**: Keyboard focus trapped in dialog
- **Escape**: ESC key closes dialog
- **ARIA**: `role="dialog"`, `aria-modal="true"`

**Nielsen's Heuristics**:
- ✅ User control and freedom (cancel option)
- ✅ Error prevention (confirmation before destructive action)

### Breadcrumbs

**Component**: `components/ui/Breadcrumbs.tsx`

**Features**:
- **Items**: Array of breadcrumb items
- **Separator**: Visual separator between items
- **Link**: Clickable breadcrumb items

**Usage**:
- Project detail page
- Nested navigation

**Accessibility**:
- **ARIA**: `aria-label="Breadcrumb"`, `aria-current="page"`
- **Semantic**: `<nav>` element

**Nielsen's Heuristics**:
- ✅ Recognition rather than recall (shows location)

## Visual Design

### Layout Principles

- **Container**: Max-width 1200px, centered
- **Gutters**: 24px spacing
- **Grid**: 12-column responsive grid
- **Whitespace**: Generous spacing for readability

### Shadows

- **Card**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Elevated**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **Hover**: `0 10px 15px rgba(0, 0, 0, 0.1)`

### Border Radius

- **Small**: 4px (buttons, tags)
- **Medium**: 8px (cards)
- **Large**: 12px (modals, large cards)

### Transitions

- **Default**: 150ms ease-in-out
- **Hover**: 200ms ease-in-out
- **Page**: 300ms ease-in-out

## Accessibility

### WCAG AA Compliance

- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML, ARIA labels
- **Focus Indicators**: Visible focus rings (2px, primary color)

### Keyboard Navigation

- **Tab**: Navigate forward
- **Shift+Tab**: Navigate backward
- **Enter/Space**: Activate buttons, links
- **Escape**: Close modals, dialogs
- **Arrow Keys**: Navigate lists, menus (where applicable)

### ARIA Labels

- **Icon Buttons**: `aria-label` with descriptive text
- **Cards**: `aria-describedby` for descriptions
- **Forms**: `aria-required`, `aria-invalid` for validation
- **Loading**: `aria-busy="true"` during loading
- **Alerts**: `aria-live="polite"` for notifications

### Focus Management

- **Skip Links**: "Skip to main content" link
- **Focus Trap**: Modals trap focus
- **Focus Restoration**: Return focus after modal close
- **Visible Focus**: 2px outline, primary color

### Reduced Motion

- **Respect**: `prefers-reduced-motion` media query
- **Disable**: Animations disabled for users who prefer reduced motion
- **Alternative**: Static states instead of animations

## Motion & Animation

### Page Transitions

- **Duration**: 300ms
- **Easing**: `ease-in-out`
- **Effect**: Fade + slight slide

### Component Animations

- **Card Hover**: Scale (1.02) + shadow elevation (200ms)
- **Button Press**: Scale (0.98) (100ms)
- **Modal Enter**: Fade + scale (300ms)
- **Toast**: Slide in from top (300ms)

### Scroll Animations

- **Scroll Reveal**: Intersection Observer API
- **Stagger**: 150ms delay between items
- **Threshold**: 10% visibility triggers animation

### Framer Motion

- **Page Transitions**: `AnimatePresence` for route transitions
- **Stagger Children**: Sequential animations
- **Spring Physics**: Natural motion feel

## Responsive Rules

### Mobile (< 640px)

- **Navigation**: Hamburger menu
- **Grid**: Single column
- **Cards**: Full width
- **Typography**: Reduced font sizes
- **Spacing**: Reduced padding/margins

### Tablet (640px - 1024px)

- **Navigation**: Horizontal menu
- **Grid**: 2 columns
- **Cards**: 2-column grid
- **Typography**: Standard sizes

### Desktop (> 1024px)

- **Navigation**: Full horizontal menu
- **Grid**: 3 columns
- **Cards**: 3-column grid
- **Typography**: Full sizes
- **Sidebar**: Optional sidebar (future)

## Telemetry & Analytics

### Tracked Events

- **Page Views**: `page_view`
- **Project Detail View**: `project_detail_view`
- **External Link Click**: `external_link_click`
- **Contact Click**: `contact_click`
- **Filter Change**: `filter_change`
- **Resume Download**: `resume_download`
- **Theme Toggle**: `theme_toggle`
- **Language Change**: `language_change`

### Implementation

- **Hook**: `useAnalytics.ts` custom hook
- **Service**: `services/analytics.ts`
- **Privacy**: IP address hashing, GDPR compliant

## Performance

### Optimization Strategies

- **Code Splitting**: Route-based lazy loading (future)
- **Image Lazy Loading**: Native `loading="lazy"`
- **Debouncing**: Filter updates (150ms)
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For long lists (future)

### Loading States

- **Skeleton Loaders**: Content placeholders
- **Progressive Loading**: Load critical content first
- **Error Boundaries**: Graceful error handling

## Acceptance Criteria

### Lighthouse Scores (Mobile)

- **Performance**: ≥ 85
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Functional Requirements

- ✅ Full keyboard navigation
- ✅ No focus traps (except modals)
- ✅ Logical tab order
- ✅ Screen reader compatible
- ✅ Color contrast compliant
- ✅ Responsive on all breakpoints
- ✅ Dark mode support
- ✅ Internationalization (3 languages)

### Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

---

**Document Version**: 2.0.0  
**Last Updated**: 2025-11-15  
**Maintained By**: Development Team
