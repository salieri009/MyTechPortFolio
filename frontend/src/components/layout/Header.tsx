import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/common'
import { LanguageSwiper } from '../LanguageSwiper'
import { ThemeToggle } from '../ThemeToggle'

const HeaderWrapper = styled.header`
  background: ${props => props.theme.colors.bg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
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
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
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
    color: ${props => props.theme.colors.primary};
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-size: 20px;
  padding: 8px;
  
  @media (max-width: 768px) {
    display: block;
  }
`

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.bg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  transform: translateY(${props => props.isOpen ? '0' : '-100%'});
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: flex;
  }
`

const MobileNavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const MobileLanguageSwiper = styled(LanguageSwiper)`
  margin-top: 16px;
`

export function Header() {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <HeaderWrapper>
      <Container>
        <Nav>
          <Logo to="/">Jungwook Van</Logo>
          
          <NavLinks>
            <NavLink to="/">{t('navigation.home')}</NavLink>
            <NavLink to="/projects">{t('navigation.projects')}</NavLink>
            <NavLink to="/academics">{t('navigation.academics')}</NavLink>
            <NavLink to="/about">{t('navigation.about')}</NavLink>
            
            <ControlsContainer>
              <LanguageSwiper showHint={false} />
              <ThemeToggle />
            </ControlsContainer>
          </NavLinks>

          <MobileMenuButton onClick={toggleMobileMenu}>
            ☰
          </MobileMenuButton>
        </Nav>
        
        <MobileMenu isOpen={isMobileMenuOpen}>
          <MobileNavLink to="/" onClick={closeMobileMenu}>
            {t('navigation.home')}
          </MobileNavLink>
          <MobileNavLink to="/projects" onClick={closeMobileMenu}>
            {t('navigation.projects')}
          </MobileNavLink>
          <MobileNavLink to="/academics" onClick={closeMobileMenu}>
            {t('navigation.academics')}
          </MobileNavLink>
          <MobileNavLink to="/about" onClick={closeMobileMenu}>
            {t('navigation.about')}
          </MobileNavLink>
          
          <ControlsContainer>
            <MobileLanguageSwiper showHint={true} />
            <ThemeToggle />
          </ControlsContainer>
        </MobileMenu>
      </Container>
    </HeaderWrapper>
  )
}
