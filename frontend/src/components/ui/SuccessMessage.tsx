import React, { useEffect } from 'react'
import styled from 'styled-components'

/**
 * Success Message Component
 * Nielsen Heuristic #1: Visibility of System Status
 * Provides clear feedback for successful actions
 */

const SuccessContainer = styled.div<{ variant?: 'inline' | 'block' | 'toast'; autoHide?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.theme.colors.success[50]};
  border: 1px solid ${props => props.theme.colors.success[200]};
  color: ${props => props.theme.colors.success[700]};
  
  ${props => props.variant === 'inline' && `
    padding: ${props.theme.spacing[2]};
    font-size: ${props.theme.typography.fontSize.sm};
  `}
  
  ${props => props.variant === 'toast' && `
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 400px;
    box-shadow: ${props.theme.shadows.lg};
    z-index: 10000;
    animation: slideIn 0.3s ease;
    
    ${props.autoHide && `
      animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s forwards;
    `}
  `}
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`

const SuccessIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
  line-height: 1;
`

const SuccessContent = styled.div`
  flex: 1;
`

const SuccessTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing[1]};
`

const SuccessText = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.success[700]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[1]};
  font-size: 18px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.success[500]};
    outline-offset: 2px;
  }
`

interface SuccessMessageProps {
  title?: string
  message: string
  variant?: 'inline' | 'block' | 'toast'
  autoHide?: boolean
  autoHideDuration?: number
  onClose?: () => void
  'aria-live'?: 'polite' | 'assertive'
}

export function SuccessMessage({
  title,
  message,
  variant = 'block',
  autoHide = false,
  autoHideDuration = 3000,
  onClose,
  'aria-live': ariaLive = 'polite'
}: SuccessMessageProps) {
  useEffect(() => {
    if (autoHide && variant === 'toast' && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoHideDuration)
      
      return () => clearTimeout(timer)
    }
  }, [autoHide, variant, autoHideDuration, onClose])

  return (
    <SuccessContainer variant={variant} autoHide={autoHide} role="status" aria-live={ariaLive}>
      <SuccessIcon aria-hidden="true">✅</SuccessIcon>
      <SuccessContent>
        {title && <SuccessTitle>{title}</SuccessTitle>}
        <SuccessText>{message}</SuccessText>
      </SuccessContent>
      {onClose && (
        <CloseButton 
          onClick={onClose}
          aria-label="Close success message"
          type="button"
        >
          ×
        </CloseButton>
      )}
    </SuccessContainer>
  )
}

