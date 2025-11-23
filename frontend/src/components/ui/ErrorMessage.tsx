import React from 'react'
import styled from 'styled-components'
import { analyzeError, isRetryableError } from '../../utils/errorHandler'

/**
 * Error Message Component
 * Nielsen Heuristic #9: Help users recognize, diagnose, and recover from errors
 * Provides clear, actionable error messages with recovery suggestions
 */

interface ErrorMessageProps {
  error?: unknown
  title?: string
  message?: string
  suggestion?: string
  variant?: 'inline' | 'block' | 'toast'
  onRetry?: () => void
  onClose?: () => void
  'aria-live'?: 'polite' | 'assertive'
}

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

const ErrorMessageText = styled.div`
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

const RetryButton = styled.button`
  margin-top: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.error[600]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.error[700]};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.error[500]};
    outline-offset: 2px;
  }
`

export function ErrorMessage({
  error,
  title,
  message,
  suggestion,
  variant = 'block',
  onRetry,
  onClose,
  'aria-live': ariaLive = 'assertive'
}: ErrorMessageProps) {
  // If error is provided, analyze it
  const errorInfo = error ? analyzeError(error) : null
  const displayMessage = message || errorInfo?.message || 'An error occurred'
  const displayTitle = title || (errorInfo ? getErrorTitle(errorInfo.type) : undefined)
  const displaySuggestion = suggestion || (errorInfo ? getErrorSuggestion(errorInfo) : undefined)
  const canRetry = errorInfo ? isRetryableError(error) : false

  return (
    <ErrorContainer variant={variant} role="alert" aria-live={ariaLive}>
      <ErrorIcon aria-hidden="true">⚠️</ErrorIcon>
      <ErrorContent>
        {displayTitle && <ErrorTitle>{displayTitle}</ErrorTitle>}
        <ErrorMessageText>{displayMessage}</ErrorMessageText>
        {displaySuggestion && (
          <ErrorSuggestion>
            <strong>Tip:</strong> {displaySuggestion}
          </ErrorSuggestion>
        )}
        {canRetry && onRetry && (
          <RetryButton onClick={onRetry} type="button">
            Try Again
          </RetryButton>
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

function getErrorTitle(type: string): string {
  switch (type) {
    case 'network':
      return 'Connection Error'
    case 'timeout':
      return 'Request Timeout'
    case 'auth':
      return 'Authentication Error'
    case 'validation':
      return 'Validation Error'
    case 'server':
      return 'Server Error'
    default:
      return 'Error'
  }
}

function getErrorSuggestion(errorInfo: ReturnType<typeof analyzeError>): string {
  switch (errorInfo.type) {
    case 'network':
      return 'Please check your internet connection and try again.'
    case 'timeout':
      return 'The request took too long. Please try again.'
    case 'auth':
      return 'Please log in again to continue.'
    case 'validation':
      return 'Please check your input and try again.'
    case 'server':
      return 'The server is experiencing issues. Please try again in a moment.'
    default:
      return 'Please try again. If the problem persists, contact support.'
  }
}

