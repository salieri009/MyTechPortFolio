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
  requiresTwoFactor?: boolean
  sessionId?: string
  userInfo?: {
    id: number
    email: string
    displayName: string
    profileImageUrl?: string
    role: string
    twoFactorEnabled: boolean
  }
  message?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

class AuthService {
  private readonly baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  /**
   * Common request wrapper - DRY principle applied
   * Centralizes headers, credentials, and error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Request failed',
        error: `HTTP ${response.status}`
      }))
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
    }

    const result = await response.json()

    // Handle ApiResponse wrapper
    if (result && typeof result === 'object' && 'success' in result) {
      if (!result.success && result.error) {
        throw new Error(result.error)
      }
      return result.data
    }

    return result
  }

  /**
   * Fire-and-forget request for non-critical operations
   */
  private async requestSilent(endpoint: string, options: RequestInit = {}): Promise<void> {
    try {
      await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers
        }
      })
    } catch (error) {
      console.warn(`Silent request failed for ${endpoint}:`, error)
    }
  }

  async initializeGoogleSignIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google Sign-In not available in server environment'))
        return
      }

      // Check for existing script
      if (document.querySelector('script[src*="accounts.google.com"]')) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
      document.head.appendChild(script)
    })
  }

  async loginWithGoogle(credential: string, twoFactorCode?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ googleIdToken: credential, twoFactorCode })
    })
  }

  /**
   * Authenticate with GitHub using authorization code
   * The backend will exchange the code for access token and verify with GitHub
   */
  async loginWithGitHub(accessToken: string, twoFactorCode?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/github', {
      method: 'POST',
      body: JSON.stringify({ accessToken, twoFactorCode })
    })
  }

  async verifyTwoFactor(token: string): Promise<{
    user: any
    accessToken: string
    refreshToken: string
  }> {
    return this.request('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ token })
    })
  }

  async setupTwoFactor(): Promise<{ qrCodeUrl: string; secret: string }> {
    return this.request('/auth/2fa/setup', { method: 'POST' })
  }

  async confirmTwoFactorSetup(token: string): Promise<void> {
    await this.request('/auth/2fa/confirm', {
      method: 'POST',
      body: JSON.stringify({ token })
    })
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    return this.request('/auth/refresh', { method: 'POST' })
  }

  async storeRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.request('/auth/set-refresh-token', {
        method: 'POST',
        body: JSON.stringify({ token: refreshToken })
      })
    } catch {
      console.warn('Failed to store refresh token securely')
    }
  }

  async clearRefreshToken(): Promise<void> {
    await this.requestSilent('/auth/clear-refresh-token', { method: 'POST' })
  }

  async logout(): Promise<void> {
    await this.requestSilent('/auth/logout', { method: 'POST' })
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/auth/me', { method: 'GET' })
  }
}

export const authService = new AuthService()
