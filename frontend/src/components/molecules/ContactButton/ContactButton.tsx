import React from 'react'
import styled from 'styled-components'
import { Button } from '@components/ui/Button'

/**
 * ContactButton Component (Molecule)
 * Reusable contact button for various contact methods
 * Nielsen Heuristic #4: Consistency and Standards
 * Nielsen Heuristic #6: Recognition Rather Than Recall
 */

const ContactButtonContainer = styled(Button)<{ $variant?: 'default' | 'glass' | 'outline' }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  text-decoration: none;
  
  ${props => props.$variant === 'glass' && `
    background: ${props.theme.depth?.cardBackground ?? 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props.theme.depth?.cardBorder ?? 'rgba(255, 255, 255, 0.06)'};
    color: ${props.theme.colors.hero?.text ?? 'white'};

    &:hover {
      border-color: ${props.theme.depth?.cardBorderHover ?? 'rgba(255, 255, 255, 0.14)'};
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.$variant === 'outline' && `
    background: transparent;
    border: 2px solid ${props.theme.colors.primary[500]};
    color: ${props.theme.colors.primary[500]};
    
    &:hover {
      background: ${props.theme.colors.primary[500]};
      color: white;
    }
  `}
`

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  line-height: 1;
`

export interface ContactButtonProps {
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  label: string
  variant?: 'default' | 'glass' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  target?: '_blank' | '_self'
  rel?: string
  'aria-label'?: string
  className?: string
}

export function ContactButton({
  href,
  onClick,
  icon,
  label,
  variant = 'default',
  size = 'md',
  target = '_self',
  rel,
  'aria-label': ariaLabel,
  className
}: ContactButtonProps) {
  const buttonProps = {
    $variant: variant,
    size,
    onClick,
    className,
    'aria-label': ariaLabel || label,
    as: href ? 'a' : 'button',
    href: href || undefined,
    target: href ? target : undefined,
    rel: href && target === '_blank' ? (rel || 'noopener noreferrer') : undefined,
    type: !href ? 'button' : undefined
  }

  return (
    <ContactButtonContainer {...(buttonProps as unknown as React.ComponentProps<typeof ContactButtonContainer>)}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {label}
    </ContactButtonContainer>
  )
}

