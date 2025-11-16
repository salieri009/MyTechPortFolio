import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { Container } from '../ui/Container'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { GoogleLoginButton } from '../GoogleLoginButton'

const HeaderWrapper = styled.header`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  flex: 1;
`

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[500]};
  text-decoration: none;
  transition: color 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }
`

const NavLinks = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: ${props => props.theme.colors.surface};
    flex-direction: column;
    padding: 24px 20px;
    gap: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: ${props => props.$isOpen ? '400px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease;
    z-index: 999;
  }
`

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }

  &.active::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    padding: 8px 0;
  }
`

const NavExternalLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    padding: 8px 0;
  }
`

const RightSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 12px;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  padding: 8px;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    display: block;
  }
`

const UserMenu = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
`

const UserInfo = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`

const LogoutButton = styled.button`
  padding: 6px 12px;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    border-color: ${props => props.theme.colors.primary[500]};
  }
`

interface MainHeaderProps {
  pathname?: string
}

export function MainHeader({ pathname = '' }: MainHeaderProps) {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path ? 'active' : ''
  }

  const handleLogout = async () => {
    await authService.logout()
    logout()
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <HeaderWrapper>
      <Container>
        <HeaderContent>
          <LogoSection>
            <Logo to="/" onClick={closeMobileMenu}>
              Portfolio
            </Logo>

            <NavLinks 
              $isOpen={mobileMenuOpen}
              role="navigation"
              aria-label="Main navigation"
            >
              <NavLink 
                to="/" 
                className={isActive('/')}
                onClick={closeMobileMenu}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                {t('navigation.home')}
              </NavLink>
              <NavLink 
                to="/projects" 
                className={isActive('/projects')}
                onClick={closeMobileMenu}
                aria-current={isActive('/projects') ? 'page' : undefined}
              >
                {t('navigation.projects')}
              </NavLink>
              <NavLink 
                to="/about" 
                className={isActive('/about')}
                onClick={closeMobileMenu}
                aria-current={isActive('/about') ? 'page' : undefined}
              >
                {t('navigation.about')}
              </NavLink>
              <NavLink 
                to="/academics" 
                className={isActive('/academics')}
                onClick={closeMobileMenu}
                aria-current={isActive('/academics') ? 'page' : undefined}
              >
                {t('navigation.academics')}
              </NavLink>
              <NavExternalLink
                href="https://blog.salieri009.studio"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                aria-label={`${t('navigation.blog')} - Opens in new tab`}
              >
                {t('navigation.blog')}
              </NavExternalLink>
            </NavLinks>
          </LogoSection>

          <RightSection>
            <LanguageSwitcher />
            <ThemeToggle />
            
            <UserMenu>
              {isAuthenticated && user ? (
                <>
                  <UserInfo>
                    {user.name}
                  </UserInfo>
                  <LogoutButton onClick={handleLogout}>
                    {t('navigation.logout') || 'Logout'}
                  </LogoutButton>
                </>
              ) : (
                <GoogleLoginButton />
              )}
            </UserMenu>

            <MobileMenuButton 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>
          </RightSection>
        </HeaderContent>
      </Container>
    </HeaderWrapper>
  )
}
