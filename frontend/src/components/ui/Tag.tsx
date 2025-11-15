import React from 'react'
import styled, { css } from 'styled-components'

/**
 * Tag Component (Atom)
 * Nielsen Heuristic #4: Consistency and Standards
 * Reusable tag component for labels, categories, and filters
 */

const TagBase = styled.span<TagProps>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => {
    const sizes = {
      sm: `${props.theme.spacing[1]} ${props.theme.spacing[2]}`,
      md: `${props.theme.spacing[2]} ${props.theme.spacing[3]}`,
      lg: `${props.theme.spacing[2]} ${props.theme.spacing[4]}`
    }
    return sizes[props.size || 'md']
  }};
  font-size: ${props => {
    const sizes = {
      sm: props.theme.typography.fontSize.xs,
      md: props.theme.typography.fontSize.sm,
      lg: props.theme.typography.fontSize.base
    }
    return sizes[props.size || 'md']
  }};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border-radius: ${props => props.theme.radius.full};
  transition: all 0.2s ease;
  
  /* Interactive tag */
  ${props => props.clickable && css`
    cursor: pointer;
    user-select: none;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${props.theme.shadows.sm};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: ${props.theme.colors.primary[100]};
          color: ${props.theme.colors.primary[700]};
          border: 1px solid ${props.theme.colors.primary[300]};
        `
      case 'secondary':
        return css`
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
        `
      case 'success':
        return css`
          background: ${props.theme.colors.success[100]};
          color: ${props.theme.colors.success[700]};
          border: 1px solid ${props.theme.colors.success[300]};
        `
      case 'warning':
        return css`
          background: ${props.theme.colors.warning[100]};
          color: ${props.theme.colors.warning[700]};
          border: 1px solid ${props.theme.colors.warning[300]};
        `
      case 'error':
        return css`
          background: ${props.theme.colors.error[100]};
          color: ${props.theme.colors.error[700]};
          border: 1px solid ${props.theme.colors.error[300]};
        `
      case 'outline':
        return css`
          background: transparent;
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
        `
      default:
        return css`
          background: ${props.theme.colors.primary[100]};
          color: ${props.theme.colors.primary[700]};
          border: 1px solid ${props.theme.colors.primary[300]};
        `
    }
  }}
  
  /* Selected state */
  ${props => props.selected && css`
    background: ${props.theme.colors.primary[500]};
    color: white;
    border-color: ${props.theme.colors.primary[500]};
  `}
`

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
  clickable?: boolean
  children: React.ReactNode
}

export function Tag({
  variant = 'primary',
  size = 'md',
  selected = false,
  clickable = false,
  children,
  ...props
}: TagProps) {
  return (
    <TagBase
      variant={variant}
      size={size}
      selected={selected}
      clickable={clickable}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </TagBase>
  )
}

