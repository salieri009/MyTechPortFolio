# Creating Your First Component

This tutorial guides you step-by-step on how to create your first component in the project.

## Table of Contents

- [What is a Component?](#what-is-a-component)
- [Atomic Design Pattern](#atomic-design-pattern)
- [Creating a Simple Component](#creating-a-simple-component)
- [Adding Styling](#adding-styling)
- [Using the Component](#using-the-component)
- [Next Steps](#next-steps)

## What is a Component?

A component is a reusable UI element. In React, components are written as functions or classes that receive props and render UI.

## Atomic Design Pattern

This project uses the Atomic Design Pattern. Components are categorized by size:

- **Atoms**: Smallest unit components (Button, Input, Tag, etc.)
- **Molecules**: Components combining Atoms (SearchBar, Card, etc.)
- **Organisms**: Complex components combining Molecules and Atoms (Header, Footer, etc.)

For more details, see [Atomic Design Pattern Explanation](../FE-002-Atomic-Design-Pattern.md).

## Creating a Simple Component

Let's create a new Atom component in the `src/components/ui/` directory.

### 1. Create Component File

Create `src/components/ui/Badge.tsx`:

```typescript
import React from 'react'
import styled from 'styled-components'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

const BadgeBase = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${props => {
    const sizes = {
      sm: '2px 8px',
      md: '4px 12px',
      lg: '6px 16px'
    }
    return sizes[props.size || 'md']
  }};
  font-size: ${props => {
    const sizes = {
      sm: '12px',
      md: '14px',
      lg: '16px'
    }
    return sizes[props.size || 'md']
  }};
  font-weight: 600;
  border-radius: ${props => props.theme.radius.full};
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.primary[500]
      case 'secondary':
        return props.theme.colors.neutral[500]
      case 'success':
        return props.theme.colors.success
      case 'warning':
        return props.theme.colors.warning
      case 'error':
        return props.theme.colors.error
      default:
        return props.theme.colors.primary[500]
    }
  }};
  color: white;
`

export function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  return (
    <BadgeBase variant={variant} size={size}>
      {children}
    </BadgeBase>
  )
}
```

### 2. Export the Component

Add the component to `src/components/ui/index.ts`:

```typescript
export { Badge } from './Badge'
export type { BadgeProps } from './Badge'
```

## Adding Styling

Components are styled using Styled Components. Use the theme system to maintain consistent design.

### Using Theme

Use theme colors, spacing, and typography:

```typescript
const StyledComponent = styled.div`
  padding: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`
```

For more details, see [Styling System Explanation](./understanding-styling-system.md).

## Using the Component

Use the created component in pages or other components:

```typescript
import { Badge } from '@components/ui'

function MyPage() {
  return (
    <div>
      <Badge variant="primary">New</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="error" size="sm">Error</Badge>
    </div>
  )
}
```

## Next Steps

Now that you've created a component, learn the following:

1. [Understanding Styling System](./understanding-styling-system.md) - Understand the styling system in depth
2. [Add New Component](../how-to/add-new-component.md) - Create more complex components
3. [Components API Reference](../reference/components-api.md) - Check existing component APIs

## Best Practices

- **Type Safety**: Use TypeScript to clearly define prop types
- **Reusability**: Make components as reusable as possible
- **Consistency**: Follow patterns from existing components
- **Accessibility**: Follow accessibility guidelines (ARIA attributes, keyboard navigation, etc.)
