import React from 'react'
import styled, { keyframes } from 'styled-components'

/**
 * Loading Spinner Component
 * Nielsen Heuristic #1: Visibility of System Status
 * Provides clear visual feedback during async operations
 */

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerWrapper = styled.div<{ size?: 'sm' | 'md' | 'lg'; fullScreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props.theme.colors.background}CC;
    backdrop-filter: blur(4px);
    z-index: 9999;
  `}
  
  ${props => !props.fullScreen && `
    padding: ${props.theme.spacing[8]};
  `}
`

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  border: 3px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${props => {
    const sizes = {
      sm: '20px',
      md: '40px',
      lg: '60px'
    }
    return `
      width: ${sizes[props.size || 'md']};
      height: ${sizes[props.size || 'md']};
    `
  }}
`

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin: 0;
`

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
  'aria-label'?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  fullScreen = false, 
  message,
  'aria-label': ariaLabel = 'Loading'
}: LoadingSpinnerProps) {
  return (
    <SpinnerWrapper size={size} fullScreen={fullScreen} role="status" aria-live="polite">
      <Spinner size={size} aria-label={ariaLabel} />
      {message && <LoadingText>{message}</LoadingText>}
    </SpinnerWrapper>
  )
}

