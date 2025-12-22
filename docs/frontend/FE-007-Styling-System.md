# Styling System

## Overview

This project uses a CSS-in-JS approach with Styled Components. A theme-based design system is built to maintain consistent design and support dark mode.

## Technology Stack

- **Styled Components**: CSS-in-JS library
- **Theme Provider**: Global theme management
- **TypeScript**: Type safety

## Theme System

### Location
`src/styles/theme.ts`

### Theme Structure

```typescript
const baseTheme = {
  colors: {
    primary: { /* ... */ },
    neutral: { /* ... */ },
    // ...
  },
  typography: {
    fontFamily: { /* ... */ },
    fontSize: { /* ... */ },
    // ...
  },
  spacing: { /* ... */ },
  radius: { /* ... */ },
  shadows: { /* ... */ },
  // ...
}

export const lightTheme = { ...baseTheme, mode: 'light' }
export const darkTheme = { ...baseTheme, mode: 'dark' }
```

### Design Tokens

#### 1. Colors

**Following KickoffLabs Guidelines**: Use only 1-3 colors

- **Primary**: CTA buttons and emphasis elements
- **Neutral**: Text, background, borders
- **Semantic**: Success, Warning, Error, Info

```typescript
colors: {
  primary: {
    50: '#eff6ff',   // Lightest
    500: '#3b82f6',  // Main brand color
    950: '#172554'   // Darkest
  },
  neutral: {
    0: '#ffffff',
    500: '#737373',
    950: '#0a0a0a'
  }
}
```

#### 2. Typography

**Following KickoffLabs Guidelines**: Use only 1 font family

- **Font Family**: Inter (Primary)
- **Font Size**: xs ~ 9xl
- **Font Weight**: thin ~ black
- **Line Height**: none ~ loose
- **Letter Spacing**: tighter ~ widest

#### 3. Spacing

8px-based spacing system:

```typescript
spacing: {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  4: '1rem',     // 16px
  8: '2rem',     // 32px
  // ...
}
```

#### 4. Border Radius

```typescript
radius: {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '1rem',      // 16px
  full: '9999px'   // Full circle
}
```

#### 5. Shadows

```typescript
shadows: {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  // ...
}
```

## Styled Components Usage

### Basic Usage

```typescript
import styled from 'styled-components'

const Button = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.radius.md};
`
```

### Props-Based Styling

```typescript
const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  background: ${props => 
    props.$variant === 'primary' 
      ? props.theme.colors.primary[500]
      : props.theme.colors.neutral[200]
  };
`
```

**Note**: In Styled Components, use `$` prefix for props to prevent them from being passed to DOM.

### Theme Access

```typescript
const Component = styled.div`
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  
  ${props => props.theme.mode === 'dark' && `
    border-color: ${props.theme.colors.neutral[700]};
  `}
`
```

### Nested Styling

```typescript
const Card = styled.div`
  padding: ${props => props.theme.spacing[4]};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  & > * {
    margin-bottom: ${props => props.theme.spacing[2]};
  }
`
```

## Responsive Design

### Media Queries

```typescript
const Container = styled.div`
  padding: ${props => props.theme.spacing[4]};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[2]};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing[1]};
  }
`
```

### Breakpoints

Use breakpoints defined in theme:

```typescript
const Container = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    // ...
  }
`
```

## Dark Mode

### Theme Switching

```typescript
// App.tsx
const { isDark } = useThemeStore()
const currentTheme = isDark ? darkTheme : lightTheme

<ThemeProvider theme={currentTheme}>
  {/* ... */}
</ThemeProvider>
```

### Conditional Styling

```typescript
const Component = styled.div`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.neutral[800]};
  `}
`
```

## Global Styles

### Location
`src/styles/GlobalStyle.ts`

### Contents

- CSS Reset
- Default font settings
- Global styles

```typescript
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`
```

## Type Safety

### styled.d.ts

```typescript
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: { /* ... */ }
    typography: { /* ... */ }
    // ...
  }
}
```

This enables TypeScript to automatically infer theme types.

## Best Practices

### 1. Use Theme Tokens
- Avoid hardcoded values
- Use tokens defined in theme

```typescript
// ❌ Bad
const Button = styled.button`
  padding: 12px 24px;
  color: #3b82f6;
`

// ✅ Good
const Button = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.primary[500]};
`
```

### 2. Reusable Style Components
- Separate common styles into separate components
- Design to be variable via props

### 3. Performance Optimization
- Prevent unnecessary re-renders
- Use `shouldForwardProp` to filter DOM props

### 4. Accessibility
- Explicit focus styles
- Follow color contrast ratios (WCAG AA)

## KickoffLabs Guidelines Compliance

### Color Restrictions
- Use only Primary + Neutral (1-3 colors)
- CTA uses only Primary color

### Font Restrictions
- Use only Inter font family (1 font)
- Vary with font styles (bold, italic, etc.)

### Consistency
- All buttons have same style
- Consistent padding, border-radius values

## References

- [Styled Components Official Documentation](https://styled-components.com/)
- [KickoffLabs Guidelines](https://kickofflabs.com/blog/landing-page-fonts-colors/)
