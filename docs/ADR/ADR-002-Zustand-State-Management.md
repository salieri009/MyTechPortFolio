---
title: "ADR-002: Zustand for State Management"
version: "1.0.0"
last_updated: "2025-11-17"
status: "accepted"
category: "Architecture Decision"
audience: ["Developers", "Architects"]
prerequisites: ["ADR-001-React-TypeScript-Stack.md"]
related_docs: ["Architecture/Frontend-Architecture.md", "Specifications/Frontend-Specification.md"]
maintainer: "Development Team"
---

# ADR-002: Zustand for State Management

## Status

**Accepted** - Zustand is the primary state management solution for the frontend application.

## Context

The MyTechPortfolio application requires state management for:
- Theme preferences (light/dark mode)
- Admin authentication state
- User preferences
- UI state (modals, loading states)
- Potentially cached API data

### Alternatives Considered

1. **Redux Toolkit**
   - Pros: Industry standard, extensive ecosystem, DevTools
   - Cons: Boilerplate-heavy, steep learning curve, overkill for portfolio site

2. **Context API + useReducer**
   - Pros: Built into React, no external dependencies
   - Cons: Performance concerns with frequent updates, prop drilling issues

3. **Jotai / Recoil**
   - Pros: Atomic state management, modern approach
   - Cons: Newer libraries, smaller community, learning curve

4. **Zustand**
   - Pros: Minimal boilerplate, TypeScript-first, simple API
   - Cons: Smaller ecosystem than Redux, newer library

5. **No State Management (Local State Only)**
   - Pros: Simplest approach, no dependencies
   - Cons: Prop drilling, difficult to share state across components

## Decision

We chose **Zustand ^4.5.7** as the state management solution.

### Rationale

1. **Simplicity**
   - Minimal boilerplate compared to Redux
   - Simple API that's easy to learn
   - No need for actions, reducers, or complex setup

2. **TypeScript Support**
   - Excellent TypeScript integration
   - Type-safe stores out of the box
   - No need for additional type definitions

3. **Performance**
   - Lightweight library (~1KB gzipped)
   - Efficient re-renders (only components using changed state update)
   - No unnecessary re-renders

4. **Flexibility**
   - Can be used for global or local state
   - Easy to integrate with React hooks
   - Supports middleware (persist, devtools, etc.)

5. **Project Fit**
   - Portfolio site doesn't need complex state management
   - Zustand handles our use cases perfectly:
     - Theme state
     - Admin authentication
     - Simple UI state
   - Avoids Redux overkill

6. **Developer Experience**
   - Easy to test
   - Simple to debug
   - Clear mental model

## Consequences

### Positive

- **Low Boilerplate**: Stores are simple to create and maintain
- **Type Safety**: Full TypeScript support with minimal setup
- **Performance**: Efficient updates, small bundle size
- **Learning Curve**: Easy for developers to understand and use
- **Flexibility**: Can scale if needed, but simple for current needs

### Negative

- **Ecosystem**: Smaller ecosystem than Redux (fewer middleware options)
- **Community**: Smaller community, fewer Stack Overflow answers
- **Migration**: If we need Redux features later, migration would be required
- **DevTools**: Less powerful than Redux DevTools (though Zustand has DevTools support)

### Neutral

- **Scalability**: Can handle complex state if needed, but may need Redux for very large apps
- **Team Knowledge**: Team needs to learn Zustand (but it's simpler than Redux)

## Implementation Details

### Store Structure

```typescript
// Example: themeStore.ts
import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}))
```

### Current Stores

1. **themeStore**: Manages light/dark theme preference
2. **adminStore**: Manages admin authentication state and user info

### Usage Pattern

```typescript
// In components
import { useThemeStore } from '@stores/themeStore'

function MyComponent() {
  const { isDark, toggleTheme } = useThemeStore()
  // Component logic
}
```

## Migration Considerations

If we need to migrate to Redux in the future:
- Zustand stores can be converted to Redux slices
- State structure is similar
- Migration would require refactoring but is feasible

## Related Decisions

- [ADR-001: React + TypeScript Stack](./ADR-001-React-TypeScript-Stack.md)
- [ADR-003: Styled Components for Styling](./ADR-003-Styled-Components.md) (to be created)

## References

- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Frontend Architecture](../Architecture/Frontend-Architecture.md)

---

**Decision Date**: 2025-11-17  
**Decided By**: Development Team  
**Review Date**: TBD (review if state management needs become significantly more complex)

