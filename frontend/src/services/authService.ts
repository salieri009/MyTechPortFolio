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

const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'
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
  private baseUrl = API_BASE_URL

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

    const response = await fetch(`${this.baseUrl}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

  async setupTwoFactor(): Promise<AuthResponse['twoFactorSetup']> {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('No access token found')
    }

    const response = await fetch(`${this.baseUrl}/auth/2fa/setup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const apiResponse: ApiResponse<AuthResponse['twoFactorSetup']> = await response.json()
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || '2FA setup failed')
    }

    return apiResponse.data
  }

  async enableTwoFactor(code: string, secret: string): Promise<AuthResponse> {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('No access token found')
    }

    const response = await fetch(`${this.baseUrl}/auth/2fa/enable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, secret })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const apiResponse: ApiResponse<AuthResponse> = await response.json()
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || '2FA enable failed')
    }

    return apiResponse.data
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const apiResponse: ApiResponse<AuthResponse> = await response.json()
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'Token refresh failed')
    }

    return apiResponse.data
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('accessToken')
    
    if (token) {
      try {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.warn('Logout request failed:', error)
        // Continue with local logout even if server request fails
      }
    }

    // Clear local storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export const authService = new AuthService()
