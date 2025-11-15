import React from 'react'
import styled from 'styled-components'

/**
 * Typography Component (Atom)
 * Nielsen Heuristic #4: Consistency and Standards
 * Provides consistent typography across the application
 */

const TypographyBase = styled.div<TypographyProps>`
  margin: 0;
  color: ${props => {
    switch (props.color) {
      case 'primary':
        return props.theme.colors.primary[600]
      case 'secondary':
        return props.theme.colors.textSecondary
      case 'muted':
        return props.theme.colors.textMuted
      case 'error':
        return props.theme.colors.error[600]
      case 'success':
        return props.theme.colors.success[600]
      default:
        return props.theme.colors.text
    }
  }};
  
  ${props => {
    switch (props.variant) {
      case 'h1':
        return `
          font-size: ${props.theme.typography.fontSize['4xl']};
          font-weight: ${props.theme.typography.fontWeight.bold};
          line-height: ${props.theme.typography.lineHeight.tight};
        `
      case 'h2':
        return `
          font-size: ${props.theme.typography.fontSize['3xl']};
          font-weight: ${props.theme.typography.fontWeight.bold};
          line-height: ${props.theme.typography.lineHeight.tight};
        `
      case 'h3':
        return `
          font-size: ${props.theme.typography.fontSize['2xl']};
          font-weight: ${props.theme.typography.fontWeight.semibold};
          line-height: ${props.theme.typography.lineHeight.snug};
        `
      case 'h4':
        return `
          font-size: ${props.theme.typography.fontSize.xl};
          font-weight: ${props.theme.typography.fontWeight.semibold};
          line-height: ${props.theme.typography.lineHeight.snug};
        `
      case 'h5':
        return `
          font-size: ${props.theme.typography.fontSize.lg};
          font-weight: ${props.theme.typography.fontWeight.semibold};
          line-height: ${props.theme.typography.lineHeight.normal};
        `
      case 'h6':
        return `
          font-size: ${props.theme.typography.fontSize.base};
          font-weight: ${props.theme.typography.fontWeight.semibold};
          line-height: ${props.theme.typography.lineHeight.normal};
        `
      case 'body':
        return `
          font-size: ${props.theme.typography.fontSize.base};
          font-weight: ${props.theme.typography.fontWeight.normal};
          line-height: ${props.theme.typography.lineHeight.relaxed};
        `
      case 'bodySmall':
        return `
          font-size: ${props.theme.typography.fontSize.sm};
          font-weight: ${props.theme.typography.fontWeight.normal};
          line-height: ${props.theme.typography.lineHeight.relaxed};
        `
      case 'caption':
        return `
          font-size: ${props.theme.typography.fontSize.xs};
          font-weight: ${props.theme.typography.fontWeight.normal};
          line-height: ${props.theme.typography.lineHeight.relaxed};
        `
      default:
        return `
          font-size: ${props.theme.typography.fontSize.base};
          font-weight: ${props.theme.typography.fontWeight.normal};
          line-height: ${props.theme.typography.lineHeight.relaxed};
        `
    }
  }}
  
  ${props => props.align && `text-align: ${props.align};`}
  ${props => props.truncate && `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodySmall' | 'caption'
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'error' | 'success'
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
  as?: keyof JSX.IntrinsicElements
  children: React.ReactNode
  className?: string
}

export function Typography({
  variant = 'body',
  color = 'default',
  align,
  truncate = false,
  as,
  children,
  ...props
}: TypographyProps) {
  // Map variant to semantic HTML element
  const getElement = () => {
    if (as) return as
    if (variant.startsWith('h')) return variant as keyof JSX.IntrinsicElements
    return 'p'
  }

  return (
    <TypographyBase
      as={getElement()}
      variant={variant}
      color={color}
      align={align}
      truncate={truncate}
      {...props}
    >
      {children}
    </TypographyBase>
  )
}

