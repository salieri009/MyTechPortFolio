import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '../services/authService'

interface User {
  id: number
  email: string
  name: string
  pictureUrl?: string
  roles: string[]
  isAdmin: boolean
  createdAt: string
}

interface SecurityContext {
  sessionId: string
  lastActivity: number
  deviceFingerprint: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  twoFactorRequired: boolean
  securityContext: SecurityContext | null
  
  // Actions
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  setTwoFactorRequired: (required: boolean) => void
  verifyTwoFactor: (token: string) => Promise<void>
  updateLastActivity: () => void
  checkSessionValidity: () => boolean
}

// Generate device fingerprint for security
function generateDeviceFingerprint(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx?.fillText('fingerprint', 2, 2)
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|')
  
  return btoa(fingerprint).slice(0, 32)
}

// Encryption utilities (simplified for now)
const encrypt = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data))
  } catch {
    return data
  }
}

const decrypt = (data: string): string => {
  try {
    return decodeURIComponent(atob(data))
  } catch {
    return data
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      twoFactorRequired: false,
      securityContext: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: true,
        error: null,
        securityContext: {
          sessionId: crypto.randomUUID(),
          lastActivity: Date.now(),
          deviceFingerprint: generateDeviceFingerprint()
        }
      }),

      setTokens: (accessToken, refreshToken) => {
        // Store refresh token in httpOnly cookie via API call
        authService.storeRefreshToken(refreshToken).catch(console.error)
        set({ 
          accessToken,
          isAuthenticated: true 
        })
      },

      clearAuth: () => {
        // Clear refresh token from server
        authService.clearRefreshToken().catch(console.error)
        set({ 
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
          twoFactorRequired: false,
          securityContext: null
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      setTwoFactorRequired: (twoFactorRequired) => set({ twoFactorRequired }),
      
      verifyTwoFactor: async (token) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.verifyTwoFactor(token)
          const { user, accessToken, refreshToken } = response
          
          get().setUser(user)
          get().setTokens(accessToken, refreshToken)
          set({ twoFactorRequired: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Two-factor authentication failed'
          set({ error: message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateLastActivity: () => {
        const state = get()
        if (state.securityContext) {
          set({
            securityContext: {
              ...state.securityContext,
              lastActivity: Date.now()
            }
          })
        }
      },

      checkSessionValidity: () => {
        const state = get()
        if (!state.securityContext) return false
        
        const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
        const isValid = Date.now() - state.securityContext.lastActivity < SESSION_TIMEOUT
        
        if (!isValid) {
          get().clearAuth()
        }
        
        return isValid
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const item = localStorage.getItem(name)
          return item ? decrypt(item) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, encrypt(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      })),
      partialize: (state) => ({
        user: state.user,
        securityContext: state.securityContext
        // accessToken is NOT persisted for security
      })
    }
  )
)
