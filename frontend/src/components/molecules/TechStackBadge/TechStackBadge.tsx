import React from 'react'
import styled from 'styled-components'
import { Tag } from '@components/ui/Tag'
import { TechIcon } from '@components/sections/TechIcon'

/**
 * TechStackBadge Component (Molecule)
 * Combines TechIcon and Tag to create a reusable tech stack badge
 * Nielsen Heuristic #4: Consistency and Standards
 * Nielsen Heuristic #6: Recognition Rather Than Recall
 */

const BadgeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export interface TechStackBadgeProps {
  name: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  clickable?: boolean
  onClick?: (e: React.MouseEvent, techName: string) => void
  className?: string
}

export function TechStackBadge({
  name,
  icon,
  variant = 'primary',
  size = 'md',
  showIcon = true,
  clickable = false,
  onClick,
  className
}: TechStackBadgeProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24

  const handleClick = (e: React.MouseEvent) => {
    if (clickable && onClick) {
      onClick(e, name)
    }
  }

  return (
    <BadgeContainer className={className}>
      <Tag
        variant={variant}
        size={size}
        clickable={clickable}
        onClick={handleClick}
        role={clickable ? 'button' : undefined}
        aria-label={clickable ? `Filter by ${name}` : undefined}
      >
        {showIcon && (
          <IconWrapper>
            <TechIcon name={icon || name.toLowerCase()} size={iconSize} />
          </IconWrapper>
        )}
        {name}
      </Tag>
    </BadgeContainer>
  )
}

