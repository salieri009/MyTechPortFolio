import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transform: translateY(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    z-index: 999;
  }
`

const NavLink = styled(Link)`
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #667eea;
  }

  &.active {
    color: #667eea;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 2px;
      background: #667eea;
      border-radius: 1px;
    }
  }
`

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const LoginButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '🔐';
    font-size: 16px;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 14px;
`

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
`

const AdminBadge = styled.span`
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`

const LogoutButton = styled.button`
  background: transparent;
  color: #e53e3e;
  border: 1px solid #e53e3e;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e53e3e;
    color: white;
  }
`

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #4a5568;

  @media (max-width: 768px) {
    display: block;
  }
`

const MobileMenuOverlay = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, clearAuth } = useAuthStore()

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      clearAuth()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      // Force logout even if API call fails
      clearAuth()
      navigate('/')
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo to="/" onClick={closeMenu}>
            MyTech Portfolio
          </Logo>

          <Nav isOpen={isMenuOpen}>
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/about" onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/projects" onClick={closeMenu}>
              Projects
            </NavLink>
            <NavLink to="/blog" onClick={closeMenu}>
              Blog
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu}>
              Contact
            </NavLink>

            <AuthSection>
              {isAuthenticated && user ? (
                <>
                  <UserInfo>
                    {user.pictureUrl && (
                      <UserAvatar src={user.pictureUrl} alt={user.name} />
                    )}
                    <div>
                      <div>{user.name}</div>
                      {user.isAdmin && <AdminBadge>Admin</AdminBadge>}
                    </div>
                  </UserInfo>
                  <LogoutButton onClick={handleLogout}>
                    Logout
                  </LogoutButton>
                </>
              ) : (
                <LoginButton onClick={handleLoginClick}>
                  Admin Login
                </LoginButton>
              )}
            </AuthSection>
          </Nav>

          <MenuToggle onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </MenuToggle>
        </HeaderContent>
      </HeaderContainer>

      <MobileMenuOverlay isOpen={isMenuOpen} onClick={closeMenu} />
    </>
  )
}
