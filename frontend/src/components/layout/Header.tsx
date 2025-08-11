import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTheme } from '@store/theme'
import { Container } from '@components/common'

const HeaderWrapper = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
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
  color: #4f46e5;
  text-decoration: none;
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
  color: #334155;
  text-decoration: none;
  font-weight: 500;
  transition: color 120ms ease;

  &:hover {
    color: #4f46e5;
  }
`

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px;
  border-radius: 8px;
  transition: background 120ms ease;

  &:hover {
    background: #f1f5f9;
  }
`

export function Header() {
  const { isDarkMode, toggle } = useTheme()

  return (
    <HeaderWrapper>
      <Container>
        <Nav>
          <Logo to="/">My Portfolio</Logo>
          <NavLinks>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/academics">Academics</NavLink>
            <NavLink to="/about">About</NavLink>
            <ThemeToggle onClick={toggle} aria-label="Toggle theme">
              {isDarkMode ? '☀️' : '🌙'}
            </ThemeToggle>
          </NavLinks>
        </Nav>
      </Container>
    </HeaderWrapper>
  )
}
