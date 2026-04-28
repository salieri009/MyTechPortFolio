import React from 'react'
import styled from 'styled-components'
import { useThemeStore } from '../../store/themeStore'

const ThemeToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 44px;
  border: none;
  border-radius: ${props => props.theme.radius.full};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary[500]};
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const Icon = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  letter-spacing: 0.08em;
  transition: opacity 0.2s ease;
`

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { mode, toggleTheme } = useThemeStore()
  const nextMode = mode === 'dark' ? 'EVA' : 'Dark'
  const currentLabel = mode === 'dark' ? 'Dark' : 'EVA'

  return (
    <ThemeToggleButton 
      className={className}
      onClick={toggleTheme}
      title={`Switch to ${nextMode} mode`}
      aria-label={`Current mode ${currentLabel}. Switch to ${nextMode} mode`}
    >
      <Icon>{currentLabel}</Icon>
    </ThemeToggleButton>
  )
}
