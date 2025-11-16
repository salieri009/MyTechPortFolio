import React from 'react'
import styled from 'styled-components'

/**
 * Section Component
 * Standardized section wrapper with consistent styling
 * Nielsen Heuristic #4: Consistency and Standards
 */

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'surface' | 'background'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  withDivider?: boolean
  children: React.ReactNode
}

const SectionBase = styled.section<SectionProps>`
  padding: ${props => {
    const paddings = {
      sm: '40px 0',
      md: '80px 0',
      lg: '120px 0',
      xl: '160px 0'
    }
    return paddings[props.padding || 'md']
  }};
  background: ${props => {
    switch (props.variant) {
      case 'surface':
        return props.theme.colors.surface
      case 'background':
        return props.theme.colors.background
      default:
        return props.theme.colors.background
    }
  }};
  position: relative;
  
  ${props => props.withDivider && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        ${props.theme.colors.primary[500]},
        transparent
      );
      opacity: 0.3;
    }
  `}
  
  @media (max-width: 768px) {
    padding: ${props => {
      const paddings = {
        sm: '32px 0',
        md: '60px 0',
        lg: '80px 0',
        xl: '100px 0'
      }
      return paddings[props.padding || 'md']
    }};
  }
`

export function Section({
  variant = 'default',
  padding = 'md',
  withDivider = false,
  children,
  ...props
}: SectionProps) {
  return (
    <SectionBase
      variant={variant}
      padding={padding}
      withDivider={withDivider}
      {...props}
    >
      {children}
    </SectionBase>
  )
}

