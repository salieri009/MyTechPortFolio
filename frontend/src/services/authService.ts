declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: () => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || '1098017074065-i5kgtgj5upsvh06vtmhfi2ba78hh25sc.apps.googleusercontent.com'
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api'

export interface LoginRequest {
  googleIdToken: string
  twoFactorCode?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userInfo: {
    id: number
    email: string
    name: string
    pictureUrl?: string
    roles: string[]
    isAdmin: boolean
    createdAt: string
  }
  requiresTwoFactor: boolean
  twoFactorEnabled: boolean
  message?: string
  twoFactorSetup?: {
    secret: string
    qrCodeDataUri: string
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

class AuthService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  async initializeGoogleSignIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google Sign-In not available in server environment'))
        return
      }

      // Load Google Identity Services script
      if (!document.querySelector('script[src*="accounts.google.com"]')) {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
        document.head.appendChild(script)
      } else {
        resolve()
      }
    })
  }

  async loginWithGoogle(credential: string, twoFactorCode?: string): Promise<AuthResponse> {
    const loginRequest: LoginRequest = {
      googleIdToken: credential,
      twoFactorCode
    }

    const response = await fetch(`${this.API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify(loginRequest)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const apiResponse: ApiResponse<AuthResponse> = await response.json()
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'Authentication failed')
    }

    return apiResponse.data
  }

  async verifyTwoFactor(token: string): Promise<{
    user: any
    accessToken: string
    refreshToken: string
  }> {
    const response = await fetch(`${this.API_BASE_URL}/auth/2fa/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ token })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Verification failed' }))
      throw new Error(error.message || 'Two-factor verification failed')
    }

    const result = await response.json()
    return result.data
  }

  async setupTwoFactor(): Promise<{ qrCodeUrl: string; secret: string }> {
    const response = await fetch(`${this.API_BASE_URL}/auth/2fa/setup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Setup failed' }))
      throw new Error(error.message || 'Two-factor setup failed')
    }

    const result = await response.json()
    return result.data
  }

  async confirmTwoFactorSetup(token: string): Promise<void> {
    const response = await fetch(`${this.API_BASE_URL}/auth/2fa/confirm`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ token })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Confirmation failed' }))
      throw new Error(error.message || 'Two-factor confirmation failed')
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Token refresh failed' }))
      throw new Error(error.message || 'Failed to refresh token')
    }

    const result = await response.json()
    return result.data
  }

  async storeRefreshToken(refreshToken: string): Promise<void> {
    const response = await fetch(`${this.API_BASE_URL}/auth/set-refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ token: refreshToken })
    })

    if (!response.ok) {
      console.warn('Failed to store refresh token securely')
    }
  }

  async clearRefreshToken(): Promise<void> {
    try {
      await fetch(`${this.API_BASE_URL}/auth/clear-refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
    } catch (error) {
      console.warn('Failed to clear refresh token:', error)
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
    } catch (error) {
      console.warn('Logout request failed:', error)
    }
  }

  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${this.API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get current user')
    }

    const result = await response.json()
    return result.data
  }
}

export const authService = new AuthService()
