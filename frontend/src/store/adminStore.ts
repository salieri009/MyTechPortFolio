import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { adminApi } from '../services/admin/adminApi'

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'VIEWER'

export interface AdminUser {
  id: string
  username: string
  email: string
  fullName: string
  role: AdminRole
  enabled: boolean
  lastLoginAt?: string
}

interface AdminState {
  isAuthenticated: boolean
  user: AdminUser | null
  role: AdminRole | null
  permissions: string[]
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  checkPermission: (permission: string) => boolean
  hasRole: (role: AdminRole) => boolean
  canManageProjects: () => boolean
  canManageAcademics: () => boolean
  canManageMilestones: () => boolean
  clearError: () => void
  refreshUser: () => Promise<void>
}

/**
 * Check if a role has permission for a given action
 */
function hasPermissionForRole(role: AdminRole | null, permission: string): boolean {
  if (!role) return false
  
  switch (role) {
    case 'SUPER_ADMIN':
      return true // Super admin has all permissions
    case 'ADMIN':
      return !permission.startsWith('system.config') && !permission.startsWith('system.backup')
    case 'CONTENT_MANAGER':
      return permission.startsWith('content.') || 
             permission.startsWith('media.') || 
             permission.startsWith('project.') ||
             permission.startsWith('academic.') ||
             permission.startsWith('milestone.')
    case 'VIEWER':
      return permission.endsWith('.read') || permission.endsWith('.view')
    default:
      return false
  }
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      role: null,
      permissions: [],
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await adminApi.login(username, password)
          const { user, token } = response
          
          // Store token
          localStorage.setItem('adminToken', token)
          
          // Extract permissions based on role
          const permissions = getPermissionsForRole(user.role)
          
          set({
            isAuthenticated: true,
            user,
            role: user.role,
            permissions,
            isLoading: false,
            error: null
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed'
          set({
            isAuthenticated: false,
            user: null,
            role: null,
            permissions: [],
            isLoading: false,
            error: message
          })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('adminToken')
        set({
          isAuthenticated: false,
          user: null,
          role: null,
          permissions: [],
          error: null
        })
      },

      checkPermission: (permission: string) => {
        const state = get()
        return hasPermissionForRole(state.role, permission)
      },

      hasRole: (role: AdminRole) => {
        const state = get()
        return state.role === role
      },

      canManageProjects: () => {
        const state = get()
        return state.role === 'CONTENT_MANAGER' || 
               state.role === 'ADMIN' || 
               state.role === 'SUPER_ADMIN'
      },

      canManageAcademics: () => {
        const state = get()
        return state.role === 'CONTENT_MANAGER' || 
               state.role === 'ADMIN' || 
               state.role === 'SUPER_ADMIN'
      },

      canManageMilestones: () => {
        const state = get()
        return state.role === 'CONTENT_MANAGER' || 
               state.role === 'ADMIN' || 
               state.role === 'SUPER_ADMIN'
      },

      clearError: () => {
        set({ error: null })
      },

      refreshUser: async () => {
        try {
          const user = await adminApi.getCurrentUser()
          const permissions = getPermissionsForRole(user.role)
          set({
            user,
            role: user.role,
            permissions
          })
        } catch (error) {
          // If refresh fails, logout
          get().logout()
        }
      }
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated
        // Don't persist token - it's in localStorage separately
      })
    }
  )
)

/**
 * Get permissions list for a role
 */
function getPermissionsForRole(role: AdminRole): string[] {
  const permissions: string[] = []
  
  switch (role) {
    case 'SUPER_ADMIN':
      permissions.push(
        'system.config.read',
        'system.config.write',
        'system.backup.read',
        'system.backup.write',
        'content.*',
        'media.*',
        'project.*',
        'academic.*',
        'milestone.*'
      )
      break
    case 'ADMIN':
      permissions.push(
        'content.read',
        'content.write',
        'media.read',
        'media.write',
        'project.read',
        'project.write',
        'academic.read',
        'academic.write',
        'milestone.read',
        'milestone.write'
      )
      break
    case 'CONTENT_MANAGER':
      permissions.push(
        'content.read',
        'content.write',
        'media.read',
        'media.write',
        'project.read',
        'project.write',
        'academic.read',
        'academic.write',
        'milestone.read',
        'milestone.write'
      )
      break
    case 'VIEWER':
      permissions.push(
        'content.read',
        'media.read',
        'project.read',
        'academic.read',
        'milestone.read'
      )
      break
  }
  
  return permissions
}

