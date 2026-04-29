import React from 'react'
import styled from 'styled-components'
import { useThemeStore } from '../../store/themeStore'

const ThemeToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 44px;
  border-radius: ${props => props.theme.radius.full};
  background: ${props => props.theme.depth?.cardBackground ?? props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.depth?.cardBorder ?? props.theme.colors.border};
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
  box-shadow: none;
  
  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.theme.depth?.cardBorderHover ?? props.theme.colors.primary[500]};
  }
  
  &:active {
    transform: scale(0.95);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: border-color 0.2s ease;
    &:hover {
      transform: none;
    }
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
