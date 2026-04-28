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
   * Authenticate with GitHub using authorization code.
   * Backend exchanges code to access token and verifies with GitHub.
   */
  async loginWithGitHub(code: string, twoFactorCode?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/github', {
      method: 'POST',
      body: JSON.stringify({ code, twoFactorCode })
    })
  }

  async verifyTwoFactor(code: string, sessionId?: string): Promise<AuthResponse> {
    return this.request('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code, sessionId })
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

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
  }

  async logout(): Promise<void> {
    await this.requestSilent('/auth/logout', { method: 'POST' })
  }

  async getCurrentUser(accessToken: string): Promise<any> {
    return this.request('/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export const authService = new AuthService()
