import React from 'react'
import styled, { css } from 'styled-components'

/**
 * Card Component (Atom)
 * Nielsen Heuristic #4: Consistency and Standards
 * Reusable card component with consistent styling and hover effects
 */

const CardBase = styled.div<CardProps>`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => {
    const sizes = {
      sm: props.theme.spacing[4],
      md: props.theme.spacing[6],
      lg: props.theme.spacing[8]
    }
    return sizes[props.size || 'md']
  }};
  transition: all 0.3s ease;
  
  /* Hover effect */
  ${props => props.isHover && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${props.theme.shadows.lg};
      border-color: ${props.theme.colors.primary[300]};
    }
  `}
  
  /* Interactive card */
  ${props => props.interactive && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.md};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'elevated':
        return css`
          box-shadow: ${props.theme.shadows.md};
          border: none;
        `
      case 'outlined':
        return css`
          border: 2px solid ${props.theme.colors.border};
          box-shadow: none;
        `
      case 'filled':
        return css`
          background: ${props.theme.colors.primary[50]};
          border: none;
        `
      default:
        return css`
          box-shadow: ${props.theme.shadows.sm};
        `
    }
  }}
`

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  isHover?: boolean
  interactive?: boolean
  children: React.ReactNode
}

export function Card({
  variant = 'default',
  size = 'md',
  isHover = false,
  interactive = false,
  children,
  ...props
}: CardProps) {
  return (
    <CardBase
      variant={variant}
      size={size}
      isHover={isHover}
      interactive={interactive}
      {...props}
    >
      {children}
    </CardBase>
  )
}

