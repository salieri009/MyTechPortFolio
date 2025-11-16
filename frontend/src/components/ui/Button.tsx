import React from 'react'
import styled, { css } from 'styled-components'

/**
 * Button Component (Atom)
 * Nielsen Heuristic #1: Visibility of System Status
 * Nielsen Heuristic #4: Consistency and Standards
 * Reusable button component with consistent styling and clear states
 */

const ButtonBase = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => {
    const sizes = {
      sm: `${props.theme.spacing[2]} ${props.theme.spacing[3]}`,
      md: `${props.theme.spacing[3]} ${props.theme.spacing[4]}`,
      lg: `${props.theme.spacing[4]} ${props.theme.spacing[6]}`
    }
    return sizes[props.size || 'md']
  }};
  font-size: ${props => {
    const sizes = {
      sm: props.theme.typography.fontSize.sm,
      md: props.theme.typography.fontSize.base,
      lg: props.theme.typography.fontSize.lg
    }
    return sizes[props.size || 'md']
  }};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  border: none;
  border-radius: ${props => props.theme.radius.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  /* Focus styles for accessibility - 기계적 톤 강화 */
  &:focus-visible {
    border: 2px solid ${props => props.theme.colors.primary[500]};
    outline: none;
    outline-offset: 2px;
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  /* Loading state */
  ${props => props.loading && css`
    pointer-events: none;
    opacity: 0.7;
  `}
  
  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: ${props.theme.colors.primary[500]};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primary[600]};
            transform: translateY(-2px);
            box-shadow: ${props.theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            background: ${props.theme.colors.primary[700]};
            transform: translateY(0);
          }
        `
      case 'secondary':
        return css`
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.primary[600]};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primary[50]};
            border-color: ${props.theme.colors.primary[300]};
          }
        `
      case 'outline':
        return css`
          background: transparent;
          color: ${props.theme.colors.primary[600]};
          border: 2px solid ${props.theme.colors.primary[500]};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primary[500]};
            color: white;
          }
        `
      case 'ghost':
        return css`
          background: transparent;
          color: ${props.theme.colors.text};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.surface};
          }
        `
      case 'danger':
        return css`
          background: ${props.theme.colors.error[500]};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.error[600]};
            transform: translateY(-2px);
            box-shadow: ${props.theme.shadows.md};
          }
        `
      default:
        return css`
          background: ${props.theme.colors.primary[500]};
          color: white;
        `
    }
  }}
  
  /* Full width */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ButtonBase
      variant={variant}
      size={size}
      loading={loading}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <LoadingSpinner aria-hidden="true" />}
      {children}
    </ButtonBase>
  )
}

