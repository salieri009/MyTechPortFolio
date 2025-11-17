import { api } from '../apiClient'
import type { AdminUser, AdminRole } from '../../store/adminStore'

const API_BASE = '/api/v1/auth/admin'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: AdminUser
  token: string
}

export interface AdminApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

/**
 * Admin API service for authentication and user management
 */
export const adminApi = {
  /**
   * Login as admin
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<AdminApiResponse<LoginResponse>>(
      `${API_BASE}/login`,
      { username, password }
    )
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Login failed')
  },

  /**
   * Logout (clear server-side session if needed)
   */
  async logout(): Promise<void> {
    try {
      await api.post(`${API_BASE}/logout`)
    } catch (error) {
      // Ignore errors on logout
      console.warn('Logout request failed:', error)
    }
  },

  /**
   * Get current admin user
   */
  async getCurrentUser(): Promise<AdminUser> {
    const response = await api.get<AdminApiResponse<AdminUser>>(
      `${API_BASE}/me`
    )
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to get current user')
  },

  /**
   * Get user permissions
   */
  async getPermissions(): Promise<string[]> {
    const response = await api.get<AdminApiResponse<string[]>>(
      `${API_BASE}/permissions`
    )
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    return []
  },

  /**
   * Refresh admin token
   */
  async refreshToken(): Promise<string> {
    const response = await api.post<AdminApiResponse<{ token: string }>>(
      `${API_BASE}/refresh`
    )
    
    if (response.data.success && response.data.data) {
      return response.data.data.token
    }
    
    throw new Error(response.data.message || 'Token refresh failed')
  }
}

