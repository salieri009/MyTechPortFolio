import React from 'react'
import styled from 'styled-components'
import { useThemeStore } from '../../stores/themeStore'

const ThemeToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: ${props => props.theme.colors.bgSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const Icon = styled.span`
  font-size: 20px;
  transition: transform 0.3s ease;
`

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <ThemeToggleButton 
      className={className}
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Icon>{isDark ? '☀️' : '🌙'}</Icon>
    </ThemeToggleButton>
  )
}
