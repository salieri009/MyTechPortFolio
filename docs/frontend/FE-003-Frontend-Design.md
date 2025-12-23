# Frontend Design Plan

## 1. Overview

The primary goal is to provide users (recruiters, fellow developers) with an attractive and intuitive experience. We reflect the latest web trends to demonstrate technical expertise and implement a responsive web design that looks perfect on all devices.

### Key Improvements (2024 Update)
1. **Language Selection UX Improvement**: Clear hint text for users unfamiliar with the feature
2. **Interactive Navigation**: Navigate to projects directly by clicking 3-Column cards on the main page
3. **Scroll Storytelling**: Visualize developer growth journey through Journey Milestone timeline
4. **Accessibility-First Design**: WCAG 2.1 AA compliance and full keyboard navigation support

- **Core Technology**: **React.js**
- **Selection Rationale**:
    - **Component-Based Architecture**: Create reusable UI components to increase development efficiency and maintainability.
    - **Rich Ecosystem**: Easily extend functionality through various libraries and community support.
    - **High Market Demand**: Established as the standard for modern web development, demonstrating the relevance of the tech stack.

## 2. Tech Stack

| Category | Technology | Description |
| --- | --- | --- |
| **Framework** | React 18.2.0 | Performance and development experience optimization using latest React features |
| **Language** | TypeScript 5.5.3 | Code stability and readability through static type checking |
| **Styling** | Styled-components 6.1.11 | Component-level styling for CSS complexity management and reusability |
| **State Management**| Zustand 4.5.7 | State management with simpler syntax and lower boilerplate than Redux |
| **Routing** | React Router 6.23.1 | Page navigation and nested routing implementation |
| **Data Fetching** | Axios 1.7.2 | HTTP client for async communication with backend API |
| **Build Tool** | Vite 5.3.3 | Maximize development productivity with fast build speed and HMR |
| **Animation** | Framer Motion 12.23.12 | Smooth animations and interactions |
| **Internationalization** | React i18next 15.6.1 + i18next 25.3.4 | Multi-language support system |
| **UI Interaction** | React Swipeable 7.0.2 | Touch gesture and swipe interaction support |

## 3. UI/UX Design

### A. Main Page (Home) - With Improvements

#### Hero Section
- **Title**: Sequential output with Typewriter effect: "I'm a developer who enjoys solving problems"
- **CTA Buttons**: 4 buttons in 3+1 layout navigating to Projects, About, Email, LinkedIn
- **Language Setting Improvements**:
  - **Problem**: Need clear indication for users unfamiliar with language change
  - **Solution**: Add hint text in format `🇰🇷 한국어 ← Swipe to change language →`
  - **Multi-language Support**: Korean (default), English, Japanese
  - **Technical Implementation**: Added `showHint` prop to LanguageSwiper component

#### Project Showcase Section (3-Column Interactive Cards)
- **Improvement**: Navigate to respective project category page when clicking each column
- **Structure**:
  1. **3D/Game Development** (🎮): Three.js, WebGL, Unity related projects
  2. **Software Engineering** (💻): React, Spring Boot, Full-stack projects
  3. **Game Development** (🎯): Unity, game development projects
- **Interactions**:
  - **On Hover**: Display related tech stacks with animation below
  - **On Click**: Route to filtered project page via React Router
  - **Mobile**: Immediate navigation with touch feedback
  - **Accessibility**: Tab key focus + Enter/Space key activation support

#### Journey Milestone Section (Latest Trend)
- **Improvement**: Implement scroll-based developer journey timeline
- **Technical Implementation**:
  - Scroll trigger animation using Intersection Observer API
  - ID-based scroll navigation for each milestone (`#milestone-university`, `#milestone-programming`, etc.)
  - Sequential appearance animation using Framer Motion (stagger: 150ms)
- **Content Structure**:
  ```
  🎓 High School Graduation (2015) → 🏫 Jeonbuk National University (2015~2020) → 
  🪖 Military Service - Interpreter (2021~2023) → 🇦🇺 Study in Australia (2023~Present) → 
  🚀 Current Goals (2025)
  ```
- **Visual Elements**:
  - Vertical timeline with progress bar (CSS `::before` pseudo-element)
  - Icon, title, description, and related tech tags for each stage
  - Current stage emphasized with CSS `animation: pulse 2s infinite` effect
  - Timeline line color change based on scroll progress

### B. Projects Page

- **Layout**: Display all projects in a card-based grid layout
- **Filtering & Sorting**: Filter by tech stack, development year, project category
- **Card Component**: Each card includes project thumbnail, title, duration, core tech stack icons, and 'View Details' button
- **Category Integration**: Auto-filter to respective category when clicking from main page 3-Column
  - URL parameters: `/projects?category=threejs` | `/projects?category=software` | `/projects?category=gamedev`
  - Filter state management via Zustand store

### C. Project Details Page

- **Header**: Prominently display project name, overview, GitHub repository, and live demo buttons
- **Body**:
    - **What I Did**: Clearly describe specific contributions in bullet points
        - Example: `- Developed JWT-based user authentication/authorization API (Spring Security)`
    - **Tech Deep Dive**: Describe why the technology was chosen and how it was utilized
    - **Problem & Solution**: Detail problems and solutions in 'Problem → Root Cause Analysis → Solution → Result' structure to emphasize problem-solving ability
    - **Demo**: Demonstrate key features with GIF or short video for intuitive understanding

### D. Academics Page

- **Layout**: Visually represent major courses by semester/year in timeline format
- **Interaction**: Click on course items to view brief learning content or related project popup/detail page navigation

### E. About Me Page

- **Content**: Go beyond a rigid resume format to present a storytelling format covering growth journey, values, and future goals as a developer
- **Contact**: Clearly guide channels for contact and additional information: email, GitHub, LinkedIn, tech blog, etc.

## 4. Component Architecture

```
src/
|-- components/       # Reusable common components
|   |-- common/       # Common UI components
|   |   |-- Button.tsx
|   |   |-- Card.tsx
|   |   └-- Tag.tsx
|   |-- layout/       # Layout components
|   |   |-- Header.tsx
|   |   |-- Footer.tsx
|   |   └-- Layout.tsx
|   |-- ui/           # Reusable UI components
|   |-- sections/     # Per-page section components
|   |   |-- ProjectShowcaseSection.tsx    # 3-Column interactive cards
|   |   |-- JourneyMilestoneSection.tsx   # Scroll-based timeline
|   |   └-- TechStackSection.tsx
|   |-- LanguageSwiper/    # Language switcher component (improved)
|   |   |-- LanguageSwiper.tsx
|   |   └-- index.ts
|   |-- Typewriter/        # Typing effect component
|   |-- ThemeToggle/       # Dark mode toggle
|   └-- ScrollMilestone/   # Scroll-based milestone component
|-- hooks/           # Custom hooks
|   |-- useScrollAnimation.ts  # Scroll animation hook
|   |-- useIntersectionObserver.ts
|   └-- useAnalytics.ts
|-- i18n/            # Internationalization settings
|-- pages/           # Page components
|-- services/        # API integration services
|-- stores/          # Individual stores (Zustand)
|   |-- themeStore.ts     # Theme management
|   |-- filterStore.ts    # Project filter state
|   └-- milestoneStore.ts # Milestone progress state
|-- styles/          # Global styles and theme
|-- types/           # TypeScript type definitions
|   |-- domain.ts         # Domain types
|   |-- milestone.ts      # Milestone types
|   └-- interaction.ts    # Interaction types
|-- utils/           # Utility functions
|   |-- scrollUtils.ts    # Scroll-related utilities
|   └-- routingUtils.ts   # Routing helpers
|-- App.tsx          # Main application component
└-- main.tsx         # Entry point
```

## 5. Information Architecture & Navigation - With Improvements

- **Global Navigation**: Home, Projects, Academics, About, Blog + Language Settings + Dark Mode Toggle
- **Main Page Structure** (Improved):
  - Hero Section (CTA buttons)
  - 3-Column Project Showcase (Clickable categories)
  - Journey Milestone Timeline (Scroll-based, ID anchor navigation)
- **Navigation Improvements**:
  - Added usage hint to language switcher: "← Swipe to change language →"
  - Direct connection from 3-Column cards to project pages
  - Anchor-based internal navigation in milestone section (`#milestone-*`)
- **Sub-structure**:
    - **Home**: Hero → 3-Column Showcase → Journey Timeline → CTA
    - **Projects**: Filter bar (category integration) → Card grid → Pagination
    - **Project Details**: Overview → Role → Tech selection rationale → Problem/Solution → Media demo
    - **Academics**: Semester-based timeline → Course detail tooltip/modal
    - **About**: Story, Values, Contact

## 6. Design System

- Color Palette
    - Primary: #4F46E5 (Indigo 600), Hover #4338CA
    - Accent: #06B6D4 (Cyan 500)
    - Neutral: Text #0F172A, Body #334155, Border #E2E8F0, Background #FFFFFF
    - Dark Mode: Background #0B1220, Card #0F172A, Text #E5E7EB, Border #1F2937
- Typography
    - Title/Hero: Pretendard SemiBold 48/56
    - H2: 28/36, H3: 20/28, Body: 16/24, Caption: 14/20
    - Text contrast AA+, line height 1.5, max paragraph width 72ch
- Layout/Grid
    - Container: max-width 1200px, 24px horizontal padding
    - Card grid: Desktop 3 columns, Tablet 2 columns, Mobile 1 column, gap 24px
    - Component border-radius 12px, shadow Elevation 1/2/3 levels
- Component States
    - Button: default/hover/active/disabled, focus-visible outline 2px Accent
    - Tag: selected/deselected, chip form aggregation for multi-select
- Icons: Lucide/Feather linear icons unified at 1.5px stroke width
- Theme tokens (styled-components ThemeProvider)

```javascript
// Example tokens (excerpt)
export const theme = {
    colors: { primary: '#4F46E5', primaryHover: '#4338CA', accent: '#06B6D4',
        text: '#0F172A', textSecondary: '#334155', border: '#E2E8F0', bg: '#FFFFFF' },
    dark:   { bg: '#0B1220', card: '#0F172A', text: '#E5E7EB', border: '#1F2937' },
    radius: { sm: 8, md: 12, lg: 16 },
    shadow: { 1: '0 2px 8px rgba(0,0,0,.06)', 2: '0 6px 20px rgba(0,0,0,.08)' },
    breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 }
}
```

## 7. Responsive Rules

- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px
- Hero: Single column on mobile (text → image), side-by-side on desktop
- Navigation: Hamburger + overlay drawer below md, shrinking fixed header on scroll
- Project cards: Fixed 16:9 image ratio, skeleton loading provided

## 8. Interaction & Motion - With Improvements

### Main Page Interactions
- **Typewriter Effect**: Sequential text output in Hero section (speed: 80ms/char)
- **3-Column Hover/Click**:
  - **Hover**: Card scale (1.02) + display related tech stacks below
  - **Click**: Route to category project page (React Router)
  - **Transition**: `transform 0.2s ease, box-shadow 0.2s ease`
- **Scroll-based Journey Timeline**:
  - Viewport entry detection via Intersection Observer (threshold: 0.3)
  - Sequential milestone appearance animation (stagger: 150ms)
  - CSS `pulse` animation effect for current milestone

### Language Switcher Improvements
- **Hint Display**: "← Swipe to change language →" text (opacity: 0.7)
- **Swipe Gesture**: Change language with left/right swipe (delta: 50px)
- **Keyboard Support**: Tab + Enter for language toggle
- **Animation**: Slide + fade effect on language change (duration: 200ms)

### Animation Performance Optimization
- **will-change** property applied to animated elements
- Minimize repaint using only **transform** and **opacity**
- Accessibility support via **prefers-reduced-motion** media query

## 9. Accessibility & i18n - With Improvements

### Language Support Improvements
- **Hint Text Internationalization**:
  - Korean: "← 스와이프하여 언어 변경 →"
  - English: "← Swipe to change language →"
  - Japanese: "← スワイプして言語変更 →"
- **Keyboard Accessibility**: Language change via Tab + Space/Enter
- **ARIA Labels**: Added `aria-label="Language selector"`, `aria-describedby="lang-hint"`
- **Font Optimization by Language**: Korean (Pretendard), English (Inter), Japanese (Noto Sans JP)

### Scroll Animation Accessibility
- **prefers-reduced-motion**: Disable animations for motion-sensitive users
- **Keyboard Navigation**: Tab key movement between milestones
- **Screen Reader**: Provide `aria-label="Milestone: University Entry, 2021"` for each milestone
- **Focus Management**: Natural navigation without focus trap during scroll animations

### Interaction Accessibility
- **3-Column Cards**: `role="button"`, `aria-describedby` attribute linking category descriptions
- **Keyboard Support**: Activate card click functionality with Enter/Space keys
- **Focus Indication**: Clear focus state with 2px solid accent color outline

## 10. Performance/SEO/Analytics

- **Core Web Vitals Targets**: LCP < 2.5s, CLS < 0.1, TTI < 3.5s (mobile 4G baseline)
- **Optimization Strategies**:
  - Component-based code splitting (`React.lazy()` + `Suspense`)
  - Image lazy loading + WebP format + responsive images
  - Intersection Observer-based animation optimization (GPU acceleration)
  - Font display swap + preload critical fonts
- **Caching Strategy**:
  - Project list SWR cache 5 minutes
  - Static assets 1 year cache + content hash
- **SEO**: Meta tags, OG cards, structured data (Person, CreativeWork schema)
- **Analytics**: Track key interaction events (card clicks, language changes, milestone reach)

## 11. Scroll-based Journey Milestone Implementation Spec

### Technical Implementation

```typescript
interface MilestoneData {
  id: string;
  year: number;
  title: string;
  description: string;
  icon: string;
  techStack: string[];
  status: 'completed' | 'current' | 'planned';
}

// Intersection Observer based scroll trigger
const useScrollMilestone = () => {
  const [visibleMilestones, setVisibleMilestones] = useState<string[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleMilestones(prev => [...prev, entry.target.id]);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    return () => observer.disconnect();
  }, []);
};
```

### Visual Implementation
- **Timeline Line**: Vertical progress bar with gradient (`linear-gradient`)
- **Milestone Node**: Circular icon + connection line (`border-radius: 50%`)
- **Content Card**: Info card appearing on right (`transform: translateX`)
- **Progress Status Display**:
  - Completed: Check icon + green (`#10B981`)
  - In Progress: Pulse animation + blue (`#3B82F6`)
  - Planned: Dashed + gray (`border-style: dashed`)

### CSS Animation Optimization

```css
.milestone-card {
  transform: translateY(50px);
  opacity: 0;
  transition: transform 0.6s ease, opacity 0.6s ease;
  will-change: transform, opacity;
}

.milestone-card.visible {
  transform: translateY(0);
  opacity: 1;
}

.milestone-current::after {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 12. Key Component Specifications - With Improvements

### LanguageSwiper (Improved)

```typescript
interface LanguageSwiperProps {
  showHint?: boolean;
  hintText?: string;
  className?: string;
  onLanguageChange?: (language: string) => void;
}
```
- **Improvement**: Added hint text display option
- **i18n Support**: Hint text also managed via i18n
- **Accessibility**: ARIA labels and keyboard support (Tab + Enter/Space)

### ProjectShowcaseCard (Clickable)

```typescript
interface ProjectShowcaseCardProps {
  category: 'threejs' | 'software' | 'gamedev';
  icon: string;
  title: string;
  description: string;
  techStack: string[];
  onClick: () => void;
  isHovered: boolean;
  className?: string;
}
```
- **Improvement**: Added click event and routing functionality
- **Hover State**: Tech stack display animation
- **Accessibility**: Keyboard focus, ARIA labels, `role="button"`

### JourneyMilestone (New)

```typescript
interface MilestoneData {
  id: string;
  year: number;
  title: string;
  description: string;
  icon: string;
  techStack: string[];
  status: 'completed' | 'current' | 'planned';
}

interface JourneyMilestoneProps {
  milestones: MilestoneData[];
  onMilestoneVisible: (id: string) => void;
  className?: string;
}
```
- **Features**: Scroll-based timeline display
- **Animation**: Sequential appearance + status-based styling
- **Interaction**: Navigate to related project page on click

### Existing Components (Maintained)
- **Button**: variant(primary/ghost), size(sm/md/lg), icon, loading, onClick
- **Card**: thumbnail, title, description, tags[], onClick/Link, highlight flag
- **Header**: logo, nav, LanguageSwiper(improved), ThemeToggle, scroll state
- **FilterBar**: Two-way binding with selected tags via Zustand state

## 13. Data Flow & State

- Global: UI theme, filter state, toast notifications (Zustand store)
- Server Data: Project list/detail, academic history (Axios + SWR pattern)
- Error/Loading: Page skeletons, API error toasts, retry buttons

## 14. Development Milestones (3-week Plan) - With Improvements

### Week 1: Foundation & Core Components
- **Day 1-2**: Project setup, routing, basic layout + theme system
- **Day 3-4**: Hero section + Typewriter component implementation
- **Day 5-7**: 3-Column Showcase section + click routing functionality

### Week 2: Interactions & Animations
- **Day 8-10**: Journey Milestone section implementation (scroll-based)
- **Day 11-12**: Intersection Observer + sequential animation implementation
- **Day 13-14**: Language switcher improvements + hint text internationalization

### Week 3: Optimization & Completion
- **Day 15-17**: Performance optimization + accessibility improvements (WCAG 2.1 AA)
- **Day 18-19**: Cross-browser testing + responsive optimization
- **Day 20-21**: QA, documentation, deployment preparation

### Key Technical Implementation Points
1. **Intersection Observer API**: Scroll-based animation optimization
2. **React Router**: Category-based dynamic routing
3. **Framer Motion**: High-performance animations (GPU acceleration)
4. **Zustand**: Lightweight state management (filter, theme, milestone state)
5. **i18next**: Multi-language support + hint text management

## 15. Success Criteria (Quality Gates) - Updated

### Functional Requirements
- ✅ Language switcher displays usage hint (3 languages supported)
- ✅ 3-Column card click navigates to project page (category filtering)
- ✅ Scroll-based Journey Milestone implemented (Intersection Observer)
- ✅ All interactions support keyboard accessibility (Tab + Enter/Space)

### Performance Requirements
- **Lighthouse Score**: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, TTI < 3.5s
- **Animation**: Maintain 60fps (transform/opacity usage, GPU acceleration)
- **First Screen Load**: < 2 seconds (mobile 4G baseline)

### User Experience Requirements
- **Language Change**: Understandable within 5 seconds
- **Project Navigation**: 1-click navigation to desired category from main page
- **Developer Journey**: Intuitive storytelling understanding through scrolling
- **Accessibility**: WCAG 2.1 AA compliance + full keyboard/screen reader support

### Technical Requirements
- **Build**: 0 warnings, 0 errors (ESLint + TypeScript)
- **Cross-browser**: Chrome, Safari, Edge latest 2 versions
- **Responsive**: Support all resolutions from 320px to 2560px
- **SEO**: Meta tags, structured data, sitemap.xml

---

## Value Proposition

### Latest Trend Adoption
- **Scroll Storytelling**: Visualize developer growth story through Journey Milestone
- **Micro-interactions**: Fine-grained feedback on hover, click, scroll
- **Accessibility First**: WCAG 2.1 AA compliance + full keyboard/screen reader support

### Technical Excellence
- **Performance Optimization**: Intersection Observer, code splitting, image optimization
- **Extensibility**: Component-based architecture enables easy addition of new sections
- **Internationalization**: 3 language support + improved UX with usage hints

### Differentiation
- **Developer-Focused Storytelling**: Visualize technical growth journey as timeline
- **Interactive Portfolio**: Experiential content, not just a list
- **Recruiter-Friendly**: Structure enabling quick exploration of desired tech areas
