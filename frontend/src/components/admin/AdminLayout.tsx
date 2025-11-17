import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import styled from 'styled-components'
import { useState } from 'react'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`

const Sidebar = styled.aside<{ $isCollapsed: boolean }>`
  width: ${props => props.$isCollapsed ? '80px' : '260px'};
  background: ${props => props.theme.colors.surface || '#ffffff'};
  border-right: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;

  @media (max-width: 768px) {
    transform: ${props => props.$isCollapsed ? 'translateX(-100%)' : 'translateX(0)'};
    width: 260px;
    position: fixed;
  }
`

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SidebarTitle = styled.h2<{ $isCollapsed: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
  margin: 0;
`

const SidebarNav = styled.nav`
  flex: 1;
  padding: ${props => props.theme.spacing[4]};
`

const NavItem = styled(Link)<{ $isActive: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md || '8px'};
  color: ${props => props.$isActive 
    ? props.theme.colors.primary?.[600] || props.theme.colors.primary 
    : props.theme.colors.textSecondary || '#6b7280'};
  background: ${props => props.$isActive 
    ? props.theme.colors.primary?.[50] || 'rgba(59, 130, 246, 0.1)' 
    : 'transparent'};
  text-decoration: none;
  font-weight: ${props => props.$isActive 
    ? props.theme.typography.fontWeight.semibold || '600' 
    : props.theme.typography.fontWeight.normal || '400'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isActive 
      ? props.theme.colors.primary?.[50] || 'rgba(59, 130, 246, 0.1)' 
      : props.theme.colors.backgroundSecondary || '#f9fafb'};
    color: ${props => props.theme.colors.primary?.[600] || props.theme.colors.primary};
  }

  span {
    display: ${props => props.$isCollapsed ? 'none' : 'block'};
  }
`

const MainContent = styled.main<{ $sidebarWidth: number }>`
  flex: 1;
  margin-left: ${props => props.$sidebarWidth}px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const Header = styled.header`
  background: ${props => props.theme.colors.surface || '#ffffff'};
  border-bottom: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const HeaderTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
`

const UserName = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeight.medium || '500'};
`

const LogoutButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.error || '#ef4444'};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md || '8px'};
  cursor: pointer;
  font-weight: ${props => props.theme.typography.fontWeight.medium || '500'};
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.errorDark || '#dc2626'};
  }
`

const ContentArea = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing[6]};
  overflow-y: auto;
`

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.textSecondary || '#6b7280'};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`

interface NavItemConfig {
  path: string
  label: string
  icon?: string
  requiredRole?: string
}

const navItems: NavItemConfig[] = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/projects', label: 'Projects', icon: '💼' },
  { path: '/admin/academics', label: 'Academics', icon: '🎓' },
  { path: '/admin/milestones', label: 'Journey Milestones', icon: '🗺️' },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, canManageProjects, canManageAcademics, canManageMilestones } = useAdminStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const sidebarWidth = isCollapsed ? 80 : 260

  // Filter nav items based on permissions
  const visibleNavItems = navItems.filter(item => {
    if (item.path === '/admin/projects') return canManageProjects()
    if (item.path === '/admin/academics') return canManageAcademics()
    if (item.path === '/admin/milestones') return canManageMilestones()
    return true // Dashboard is always visible
  })

  return (
    <LayoutContainer>
      <MobileOverlay 
        $isOpen={isMobileMenuOpen} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
      <Sidebar $isCollapsed={isCollapsed}>
        <SidebarHeader>
          <SidebarTitle $isCollapsed={isCollapsed}>Admin</SidebarTitle>
          <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? '→' : '←'}
          </ToggleButton>
        </SidebarHeader>
        <SidebarNav>
          {visibleNavItems.map(item => (
            <NavItem
              key={item.path}
              to={item.path}
              $isActive={location.pathname === item.path || 
                         (item.path !== '/admin' && location.pathname.startsWith(item.path))}
              $isCollapsed={isCollapsed}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </SidebarNav>
      </Sidebar>
      <MainContent $sidebarWidth={sidebarWidth}>
        <Header>
          <HeaderTitle>Admin Dashboard</HeaderTitle>
          <UserInfo>
            <UserName>{user?.fullName || user?.username || 'Admin'}</UserName>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </UserInfo>
        </Header>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}

