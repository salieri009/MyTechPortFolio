---
title: "ADR-003: Styled Components for Styling"
version: "1.0.0"
last_updated: "2025-11-17"
status: "accepted"
category: "Architecture Decision"
audience: ["Developers", "Architects"]
prerequisites: ["ADR-001-React-TypeScript-Stack.md"]
related_docs: ["Architecture/Frontend-Architecture.md", "Specifications/UI-UX-Specification.md"]
maintainer: "Development Team"
---

# ADR-003: Styled Components for Styling

## Status

**Accepted** - Styled Components is the primary styling solution for the frontend application.

## Context

The MyTechPortfolio application requires a styling solution that:
- Integrates seamlessly with React and TypeScript
- Supports theming (light/dark mode)
- Enables component-scoped styling
- Provides excellent developer experience
- Supports dynamic styling based on props
- Maintains type safety
- Enables code reuse and maintainability

### Alternatives Considered

1. **CSS Modules**
   - Pros: Standard CSS, no runtime overhead, good tooling
   - Cons: No dynamic styling, limited theming support, separate files

2. **Tailwind CSS**
   - Pros: Utility-first, fast development, small bundle size
   - Cons: Large HTML class lists, less component-scoped, learning curve

3. **CSS-in-JS (Emotion)**
   - Pros: Similar to Styled Components, good performance
   - Cons: Less popular, smaller ecosystem

4. **Sass/SCSS**
   - Pros: Mature, powerful features, widely used
   - Cons: No component-scoped styling, no TypeScript integration, separate files

5. **Styled Components**
   - Pros: Component-scoped, TypeScript support, theming, dynamic props
   - Cons: Runtime overhead, bundle size, learning curve

6. **Plain CSS**
   - Pros: No dependencies, standard
   - Cons: No scoping, no theming, difficult to maintain

## Decision

We chose **Styled Components ^6.1.11** as the styling solution.

### Rationale

1. **Component-Scoped Styling**
   - Styles are scoped to components automatically
   - No CSS class name conflicts
   - Better encapsulation

2. **TypeScript Integration**
   - Full TypeScript support
   - Type-safe theme access
   - Autocomplete for theme properties
   - Type checking for styled component props

3. **Theming Support**
   - Built-in theme provider
   - Easy theme switching (light/dark mode)
   - Centralized theme configuration
   - Type-safe theme access via `props.theme`

4. **Dynamic Styling**
   - Styles based on component props
   - Conditional styling
   - Responsive design support
   - State-based styling

5. **Developer Experience**
   - Co-located styles with components
   - No separate CSS files
   - Better code organization
   - Easy to refactor

6. **React Integration**
   - First-class React support
   - Works seamlessly with React hooks
   - Component composition support
   - Server-side rendering support

7. **Ecosystem**
   - Large community
   - Extensive documentation
   - Good tooling support
   - Active maintenance

## Consequences

### Positive

- **Component Encapsulation**: Styles are scoped to components, preventing conflicts
- **Type Safety**: Full TypeScript support with theme typing
- **Theming**: Easy theme management and switching
- **Dynamic Styling**: Styles can change based on props and state
- **Maintainability**: Co-located styles make components self-contained
- **Developer Experience**: Better IDE support and autocomplete

### Negative

- **Runtime Overhead**: Styles are generated at runtime (mitigated by babel plugin)
- **Bundle Size**: Adds ~15KB to bundle (gzipped)
- **Learning Curve**: Developers need to learn styled-components syntax
- **Debugging**: Generated class names can be harder to debug
- **Performance**: Slight performance impact for dynamic styles (minimal in practice)

### Neutral

- **Migration**: Can coexist with other styling solutions if needed
- **Team Knowledge**: Team needs to learn styled-components (but it's intuitive)

## Implementation Details

### Theme Structure

```typescript
// theme.ts
export const lightTheme = {
  colors: {
    primary: { 50: '#eff6ff', ... },
    neutral: { 50: '#f9fafb', ... },
  },
  spacing: { ... },
  typography: { ... },
  // ...
}

export const darkTheme = { ... }
```

### Usage Pattern

```typescript
import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
`
```

### Theme Provider

```typescript
import { ThemeProvider } from 'styled-components'

function App() {
  const { isDark } = useThemeStore()
  const currentTheme = isDark ? darkTheme : lightTheme
  
  return (
    <ThemeProvider theme={currentTheme}>
      {/* App content */}
    </ThemeProvider>
  )
}
```

### TypeScript Theme Typing

```typescript
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: { ... }
    spacing: { ... }
    // ...
  }
}
```

## Best Practices

1. **Theme Usage**: Always use theme values instead of hardcoded values
2. **Component Organization**: Keep styled components close to their usage
3. **Reusability**: Create reusable styled components for common patterns
4. **Performance**: Use `css` helper for complex styles
5. **Naming**: Use descriptive names for styled components

## Migration Considerations

If we need to migrate to another solution:
- Styled Components can coexist with CSS Modules or Tailwind
- Migration would require refactoring all styled components
- Theme system would need to be reimplemented

## Related Decisions

- [ADR-001: React + TypeScript Stack](./ADR-001-React-TypeScript-Stack.md)
- [ADR-002: Zustand State Management](./ADR-002-Zustand-State-Management.md)
- [ADR-004: Atomic Design Pattern](./ADR-004-Atomic-Design-Pattern.md) (to be created)

## References

- [Styled Components Documentation](https://styled-components.com/)
- [Styled Components GitHub](https://github.com/styled-components/styled-components)
- [Frontend Architecture](../Architecture/Frontend-Architecture.md)
- [UI/UX Specification](../Specifications/UI-UX-Specification.md)

---

**Decision Date**: 2025-11-17  
**Decided By**: Development Team  
**Review Date**: TBD (review if styling needs become significantly more complex)

