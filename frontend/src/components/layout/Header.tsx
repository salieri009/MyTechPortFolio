import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { Container } from '../ui/Container'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { LanguageSwiper } from '../LanguageSwiper/LanguageSwiper'
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

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary[500]};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 120ms ease;

  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }
`

const BlogLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 120ms ease;

  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  
  &:hover {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.primary[500]};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.95);
    background: ${props => props.theme.colors.primary[100]};
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const MobileMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.lg};
  backdrop-filter: blur(20px);
  z-index: 1001;
  
  /* 애니메이션 개선 */
  max-height: ${props => props.isOpen ? '600px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  
  @media (min-width: 769px) {
    display: none !important;
  }
`

const MobileMenuContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 16px;
`

const MobileNavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  padding: 20px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-size: 16px;
  min-height: 56px;
  display: flex;
  align-items: center;
  
  &:hover, &:focus {
    background: ${props => props.theme.colors.primary[50]};
    color: ${props => props.theme.colors.primary[600]};
    transform: translateX(4px);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.98) translateX(4px);
    background: ${props => props.theme.colors.primary[100]};
  }
`

const MobileBlogLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  padding: 20px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-size: 16px;
  min-height: 56px;
  display: flex;
  align-items: center;
  
  &:hover, &:focus {
    background: ${props => props.theme.colors.primary[50]};
    color: ${props => props.theme.colors.primary[600]};
    transform: translateX(4px);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.98) translateX(4px);
    background: ${props => props.theme.colors.primary[100]};
  }
`

const MobileControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 20px 16px 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: 16px;
  background: ${props => props.theme.colors.surface};
  
  /* 각 컨트롤 요소들이 터치하기 쉽도록 */
  > * {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    display: none;
  }
`

export function Header() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // 모바일 메뉴가 열릴 때 스크롤 방지
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // 외부 클릭 시 메뉴 닫기
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <HeaderWrapper>
      <Container>
        <Nav>
          <Logo to="/">Jungwook Van</Logo>
          
          <NavLinks>
            <NavLink to="/">{t('navigation.home')}</NavLink>
            <NavLink to="/projects">{t('navigation.projects')}</NavLink>
            <NavLink to="/academics">{t('navigation.academics')}</NavLink>
            <BlogLink href="https://igewaedam630.tistory.com/" target="_blank" rel="noopener noreferrer">
              {t('navigation.blog')}
            </BlogLink>
            <NavLink to="/about">{t('navigation.about')}</NavLink>
            {!user && <NavLink to="/login">{t('navigation.login')}</NavLink>}
            
            <ControlsContainer>
              <LanguageSwiper showHint={false} />
              <ThemeToggle />
              {user && <GoogleLoginButton />}
            </ControlsContainer>
          </NavLinks>

          <MobileMenuButton 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')}
            aria-expanded={isMobileMenuOpen}
            data-mobile-menu
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </Nav>
        
        <MobileMenu isOpen={isMobileMenuOpen} data-mobile-menu>
          <MobileMenuContent>
            <MobileNavLink to="/" onClick={closeMobileMenu}>
              {t('navigation.home')}
            </MobileNavLink>
            <MobileNavLink to="/projects" onClick={closeMobileMenu}>
              {t('navigation.projects')}
            </MobileNavLink>
            <MobileNavLink to="/academics" onClick={closeMobileMenu}>
              {t('navigation.academics')}
            </MobileNavLink>
            <MobileBlogLink href="https://igewaedam630.tistory.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>
              {t('navigation.blog')}
            </MobileBlogLink>
            <MobileNavLink to="/about" onClick={closeMobileMenu}>
              {t('navigation.about')}
            </MobileNavLink>
            {!user && (
              <MobileNavLink to="/login" onClick={closeMobileMenu}>
                {t('navigation.login')}
              </MobileNavLink>
            )}
            
            <MobileControlsContainer>
              <LanguageSwiper showHint={true} />
              <ThemeToggle />
              {user && <GoogleLoginButton />}
            </MobileControlsContainer>
          </MobileMenuContent>
        </MobileMenu>
      </Container>
    </HeaderWrapper>
  )
}
