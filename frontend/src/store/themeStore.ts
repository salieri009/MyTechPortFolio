import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'dark' | 'eva'

interface ThemeState {
  mode: ThemeMode
  isDark: boolean
  toggleTheme: () => void
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      isDark: true,
      toggleTheme: () =>
        set((state) => {
          const nextMode: ThemeMode = state.mode === 'dark' ? 'eva' : 'dark'
          return { mode: nextMode, isDark: true }
        }),
      setMode: (mode) => set({ mode, isDark: true })
    }),
    {
      name: 'theme-storage'
    }
  )
)
