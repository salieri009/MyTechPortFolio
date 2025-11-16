import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { Container } from '../ui/Container'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { GoogleLoginButton } from '../GoogleLoginButton'

const HeaderWrapper = styled.header`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
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

  &.active {
    color: ${props => props.theme.colors.primary[500]};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${props => props.theme.colors.primary[500]};
      animation: slideIn 0.3s ease;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
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
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  // ScrollSpy: IntersectionObserver로 활성 섹션 감지
  useEffect(() => {
    // HomePage에서만 ScrollSpy 작동
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    const sections = ['hero', 'journey', 'projects', 'testimonials']
    const observers: IntersectionObserver[] = []
    const sectionElements: Map<string, HTMLElement> = new Map()

    // 각 섹션 요소 찾기
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        sectionElements.set(sectionId, element)
      }
    })

    if (sectionElements.size === 0) return

    // IntersectionObserver 생성 및 설정
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // 섹션이 뷰포트 상단 20% 지점에 도달하면 활성화
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          if (sections.includes(sectionId)) {
            setActiveSection(sectionId)
          }
        }
      })
    }, observerOptions)

    // 각 섹션 관찰 시작
    sectionElements.forEach((element) => {
      observer.observe(element)
    })

    // 초기 활성 섹션 설정 (Hero 섹션이 보이면)
    const heroElement = sectionElements.get('hero')
    if (heroElement) {
      const rect = heroElement.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
        setActiveSection('hero')
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [location.pathname])

  const isActive = (path: string) => {
    // HomePage에서 ScrollSpy 사용
    if (location.pathname === '/' && path === '/') {
      return activeSection === 'hero' ? 'active' : ''
    }
    // 다른 페이지에서는 기존 로직 사용
    return pathname === path ? 'active' : ''
  }

  const isSectionActive = (sectionId: string) => {
    return location.pathname === '/' && activeSection === sectionId
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
                className={isActive('/') || isSectionActive('hero') ? 'active' : ''}
                onClick={(e) => {
                  closeMobileMenu()
                  if (location.pathname === '/') {
                    e.preventDefault()
                    const heroSection = document.getElementById('hero')
                    if (heroSection) {
                      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }
                }}
                aria-current={isActive('/') || isSectionActive('hero') ? 'page' : undefined}
              >
                {t('navigation.home')}
              </NavLink>
              <NavLink 
                to="/projects" 
                className={isActive('/projects') || isSectionActive('projects') ? 'active' : ''}
                onClick={(e) => {
                  closeMobileMenu()
                  if (location.pathname === '/') {
                    e.preventDefault()
                    const projectsSection = document.getElementById('projects')
                    if (projectsSection) {
                      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }
                }}
                aria-current={isActive('/projects') || isSectionActive('projects') ? 'page' : undefined}
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
