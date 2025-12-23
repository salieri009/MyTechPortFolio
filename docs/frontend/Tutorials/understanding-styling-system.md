# Understanding Styling System

This tutorial explains how to understand the project's styling system.

## Table of Contents

- [Styling System Overview](#styling-system-overview)
- [Styled Components](#styled-components)
- [Theme System](#theme-system)
- [Design Tokens](#design-tokens)
- [Responsive Design](#responsive-design)
- [Next Steps](#next-steps)

## Styling System Overview

This project uses **Styled Components** for CSS-in-JS styling. This offers the following benefits:

- **Component-Based**: Styles are managed together with components
- **Type Safety**: Integrated with TypeScript for type checking
- **Dynamic Styling**: Styles can be dynamically changed based on props
- **Theme Support**: Consistent design maintained through global theme system

## Styled Components

Styled Components define styles using template literals:

```typescript
import styled from 'styled-components'

const Button = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primary[600]};
  }
`
```

### Props-Based Styling

Dynamically change styles based on component props:

```typescript
const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  background: ${props => 
    props.$variant === 'primary' 
      ? props.theme.colors.primary[500]
      : props.theme.colors.neutral[500]
  };
`
```

> **Note**: In Styled Components, props use the `$` prefix to prevent them from being passed to the DOM.

## Theme System

The theme is defined in `src/styles/theme.ts` and accessible from all components.

### Theme Structure

```typescript
const theme = {
  colors: {
    primary: { /* color palette */ },
    neutral: { /* neutral colors */ },
    // ...
  },
  typography: {
    fontFamily: { /* font families */ },
    fontSize: { /* font sizes */ },
    // ...
  },
  spacing: { /* spacing system */ },
  radius: { /* border radius */ },
  shadows: { /* shadows */ },
  // ...
}
```

### Using Theme

Access theme in components through `props.theme`:

```typescript
const Card = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`
```

## Design Tokens

The project follows KickoffLabs guidelines with limited design tokens:

### Color Palette

- **Primary**: Electric Blue series (CTA and emphasis)
- **Neutral**: Modern Gray series (text, background, borders)

> **Important**: Secondary and Accent colors have been removed and mapped to Primary for backward compatibility.

### Font Family

- **Primary**: Inter (used for all text)

> **Important**: Mono and Display fonts have been removed and mapped to Primary for backward compatibility.

### Spacing System

Spacing is consistently managed through the `spacing` object:

```typescript
spacing: {
  0: '0px',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  // ...
}
```

## Responsive Design

Implement responsive design using media queries:

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

Main breakpoints used in the project:

- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 1024px and above

## Next Steps

Now that you understand the styling system, learn the following:

1. [Styling System Explanation](../FE-007-Styling-System.md) - More detailed architecture explanation
2. [Customize Theme](../how-to/customize-theme.md) - Customize the theme
3. [Theme Reference](../reference/theme-reference.md) - Theme API reference

## Best Practices

- **Use Theme**: Use theme instead of hardcoded colors or spacing
- **Consistency**: Follow styling patterns from existing components
- **Responsive**: Consider all screen sizes from mobile to desktop
- **Performance**: Avoid unnecessary style recalculations
