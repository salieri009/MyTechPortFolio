import React from 'react'
import styled from 'styled-components'
import { Card } from '@components/ui/Card'

/**
 * StatCard Component (Molecule)
 * Reusable statistics card for displaying metrics and achievements
 * Nielsen Heuristic #1: Visibility of System Status
 * Nielsen Heuristic #4: Consistency and Standards
 */

const StatCardContainer = styled(Card)<{ $variant?: 'default' | 'glass' | 'solid' }>`
  text-align: center;
  padding: ${props => props.theme.spacing[5]};
  transition: all 0.3s ease;
  
  ${props => props.$variant === 'glass' && `
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
  `}
  
  ${props => props.$variant === 'solid' && `
    background: ${props.theme.colors.surface};
    border: 1px solid ${props.theme.colors.border};
  `}
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`

const StatNumber = styled.div<{ $color?: string }>`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => {
    if (props.$color) return props.$color
    return props.theme.colors.primary[600]
  }};
  margin-bottom: ${props => props.theme.spacing[2]};
  line-height: 1.2;
`

const StatLabel = styled.div<{ $variant?: string }>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => {
    if (props.$variant === 'glass') return 'rgba(255, 255, 255, 0.9)'
    return props.theme.colors.textSecondary
  }};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin: 0;
`

const StatDescription = styled.p<{ $variant?: string }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => {
    if (props.$variant === 'glass') return 'rgba(255, 255, 255, 0.7)'
    return props.theme.colors.textMuted
  }};
  margin: ${props => props.theme.spacing[2]} 0 0 0;
  line-height: 1.4;
`

export interface StatCardProps {
  value: string | number
  label: string
  description?: string
  variant?: 'default' | 'glass' | 'solid'
  color?: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
  'aria-label'?: string
}

export function StatCard({
  value,
  label,
  description,
  variant = 'default',
  color,
  icon,
  onClick,
  className,
  'aria-label': ariaLabel
}: StatCardProps) {
  return (
    <StatCardContainer
      $variant={variant}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      aria-label={ariaLabel || `${label}: ${value}`}
      isHover={!!onClick}
    >
      {icon && <div style={{ marginBottom: '8px' }}>{icon}</div>}
      <StatNumber $color={color}>{value}</StatNumber>
      <StatLabel $variant={variant}>{label}</StatLabel>
      {description && (
        <StatDescription $variant={variant}>{description}</StatDescription>
      )}
    </StatCardContainer>
  )
}

