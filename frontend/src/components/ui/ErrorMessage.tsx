import React from 'react'
import styled from 'styled-components'

/**
 * Error Message Component
 * Nielsen Heuristic #9: Help users recognize, diagnose, and recover from errors
 * Provides clear, actionable error messages with recovery suggestions
 */

const ErrorContainer = styled.div<{ variant?: 'inline' | 'block' | 'toast' }>`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.theme.colors.error[50]};
  border: 1px solid ${props => props.theme.colors.error[200]};
  color: ${props => props.theme.colors.error[700]};
  
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
`

const ErrorIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
  line-height: 1;
`

const ErrorContent = styled.div`
  flex: 1;
`

const ErrorTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing[1]};
`

const ErrorMessage = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const ErrorSuggestion = styled.div`
  margin-top: ${props => props.theme.spacing[2]};
  padding-top: ${props => props.theme.spacing[2]};
  border-top: 1px solid ${props => props.theme.colors.error[200]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.error[600]};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error[700]};
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
    outline: 2px solid ${props => props.theme.colors.error[500]};
    outline-offset: 2px;
  }
`

interface ErrorMessageProps {
  title?: string
  message: string
  suggestion?: string
  variant?: 'inline' | 'block' | 'toast'
  onClose?: () => void
  'aria-live'?: 'polite' | 'assertive'
}

export function ErrorMessage({
  title,
  message,
  suggestion,
  variant = 'block',
  onClose,
  'aria-live': ariaLive = 'assertive'
}: ErrorMessageProps) {
  return (
    <ErrorContainer variant={variant} role="alert" aria-live={ariaLive}>
      <ErrorIcon aria-hidden="true">⚠️</ErrorIcon>
      <ErrorContent>
        {title && <ErrorTitle>{title}</ErrorTitle>}
        <ErrorMessage>{message}</ErrorMessage>
        {suggestion && (
          <ErrorSuggestion>
            <strong>Tip:</strong> {suggestion}
          </ErrorSuggestion>
        )}
      </ErrorContent>
      {onClose && (
        <CloseButton 
          onClick={onClose}
          aria-label="Close error message"
          type="button"
        >
          ×
        </CloseButton>
      )}
    </ErrorContainer>
  )
}

