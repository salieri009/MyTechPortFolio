import { Navigate, useLocation } from 'react-router-dom'
import { useAdminStore, AdminRole } from '../../store/adminStore'
import { useEffect } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface AdminRouteProps {
  children: React.ReactNode
  requiredRole?: AdminRole
  requiredPermission?: string
}

/**
 * Protected route component for admin pages.
 * Checks authentication and role/permission requirements.
 */
export function AdminRoute({ 
  children, 
  requiredRole,
  requiredPermission 
}: AdminRouteProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    role,
    checkPermission,
    hasRole,
    refreshUser
  } = useAdminStore()
  const location = useLocation()

  useEffect(() => {
    // Refresh user data on mount if authenticated
    if (isAuthenticated && user) {
      refreshUser().catch(console.error)
    }
  }, [isAuthenticated, user, refreshUser])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <LoadingSpinner />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    // Check if user has a higher role
    const roleHierarchy: Record<AdminRole, number> = {
      'VIEWER': 1,
      'CONTENT_MANAGER': 2,
      'ADMIN': 3,
      'SUPER_ADMIN': 4
    }
    
    const userLevel = roleHierarchy[role || 'VIEWER']
    const requiredLevel = roleHierarchy[requiredRole]
    
    if (userLevel < requiredLevel) {
      return <Navigate to="/admin/unauthorized" replace />
    }
  }

  // Check permission requirement
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/admin/unauthorized" replace />
  }

  return <>{children}</>
}

