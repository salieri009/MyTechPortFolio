import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  name: string
  pictureUrl?: string
  roles: string[]
  isAdmin: boolean
  createdAt: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: true,
        error: null 
      }),

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('refreshToken', refreshToken)
        set({ 
          accessToken,
          isAuthenticated: true 
        })
      },

      clearAuth: () => {
        localStorage.removeItem('refreshToken')
        set({ 
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null 
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
