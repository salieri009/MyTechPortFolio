# State Management with Zustand

## Overview

This project uses Zustand for global state management. Zustand is simpler and lighter than Redux, and integrates well with TypeScript.

## Why Zustand

### 1. Simplicity
- Minimal boilerplate code
- Intuitive API

### 2. Lightweight
- Small bundle size
- Fast runtime performance

### 3. TypeScript Support
- Excellent type inference
- Type safety

### 4. Flexibility
- Middleware support (persist, devtools, etc.)
- Various pattern support

## Store Structure

### Location
`src/stores/`

### Main Stores

#### 1. themeStore
**File**: `src/stores/themeStore.ts`

Manages theme (dark/light mode) state.

```typescript
interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark }))
    }),
    {
      name: 'theme-storage' // localStorage key
    }
  )
)
```

**Features**:
- `persist` middleware for permanent user settings
- Auto save/restore to localStorage

**Usage Example**:
```typescript
function MyComponent() {
  const { isDark, toggleTheme } = useThemeStore()
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
```

#### 2. authStore
**File**: `src/stores/authStore.ts`

Manages authentication state.

```typescript
interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
}
```

**Features**:
- Authentication state and user info management
- Login/Logout actions provided

## State Management Strategy

### 1. Minimize Global State

**Principle**: Use local state when possible, use global state only when necessary

**Global State Use Cases**:
- Theme settings (applied globally)
- Authentication state (shared across components)
- User info (used across pages)

**Local State Use Cases**:
- Form input values
- Modal open/close state
- Component internal UI state

### 2. Store Separation

Separate stores by domain:

```
stores/
├── themeStore.ts      # Theme related
├── authStore.ts       # Auth related
└── filters.ts         # Filter related (if needed)
```

**Benefits**:
- Separation of concerns
- Improved code readability
- Easy maintenance

### 3. Selector Pattern

Selectively subscribe to only needed state:

```typescript
// ❌ Bad: Subscribe to entire store
const store = useThemeStore()

// ✅ Good: Subscribe to only needed state
const isDark = useThemeStore(state => state.isDark)
const toggleTheme = useThemeStore(state => state.toggleTheme)
```

**Benefits**:
- Prevent unnecessary re-renders
- Performance optimization

## Persist Middleware

### Purpose
Permanently store user settings in browser for retention on next visit

### Configuration Example

```typescript
import { persist } from 'zustand/middleware'

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // ... store definition
    }),
    {
      name: 'theme-storage',        // localStorage key
      // storage: localStorage,      // default
      // partialize: (state) => ({  // select state to persist
      //   isDark: state.isDark
      // })
    }
  )
)
```

### Supported Storage
- `localStorage` (default)
- `sessionStorage`
- Custom storage

## Async Actions

### Pattern 1: Direct Handling

```typescript
interface MyStore {
  data: Data | null
  loading: boolean
  fetchData: () => Promise<void>
}

export const useMyStore = create<MyStore>((set) => ({
  data: null,
  loading: false,
  fetchData: async () => {
    set({ loading: true })
    try {
      const data = await api.getData()
      set({ data, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  }
}))
```

### Pattern 2: Separate Service Layer

```typescript
// Store defines only actions
export const useMyStore = create<MyStore>((set) => ({
  data: null,
  setData: (data: Data) => set({ data })
}))

// Component calls service
function MyComponent() {
  const setData = useMyStore(state => state.setData)
  
  useEffect(() => {
    dataService.getData().then(setData)
  }, [])
}
```

## DevTools Integration

Redux DevTools integration available in development:

```typescript
import { devtools } from 'zustand/middleware'

export const useMyStore = create<MyStore>()(
  devtools(
    (set) => ({
      // ... store definition
    }),
    { name: 'MyStore' }
  )
)
```

## Best Practices

### 1. Keep Store Shallow
- Avoid deep nested structures
- Prefer flat state structures

### 2. Maintain Immutability
- Create new objects when updating state
- immer middleware available

### 3. Type Safety
- Explicitly type stores with TypeScript
- Utilize type inference

### 4. Testability
- Define actions as pure functions
- Easy mock store creation

## Comparison with Redux

| Feature | Zustand | Redux |
|---------|---------|-------|
| Boilerplate | Low | High |
| Learning Curve | Low | High |
| Bundle Size | Small | Large |
| TypeScript | Excellent | Good |
| DevTools | Supported | Built-in |
| Middleware | Optional | Required |

## Migration Considerations

### From Redux to Zustand
- Direct correspondence possible in most cases
- Similar patterns to Redux Toolkit

### From Context API to Zustand
- No Provider needed
- Performance improvement (reduced unnecessary re-renders)

## References

- [Zustand Official Documentation](https://github.com/pmndrs/zustand)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
