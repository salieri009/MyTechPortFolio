import { create } from 'zustand'

interface ThemeState {
  isDarkMode: boolean
  toggle: () => void
}

export const useTheme = create<ThemeState>((set) => ({
  isDarkMode: false,
  toggle: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}))
