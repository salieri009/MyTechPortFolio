import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

/**
 * Tooltip Component (Atom)
 * Nielsen Heuristic #10: Help and Documentation
 * Provides contextual help and information
 */

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const TooltipContent = styled.div<{ $position: 'top' | 'bottom' | 'left' | 'right'; $visible: boolean }>`
  position: absolute;
  z-index: 1000;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.gray[900]};
  color: white;
  border-radius: ${props => props.theme.radius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  white-space: nowrap;
  box-shadow: ${props => props.theme.shadows.lg};
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: ${props => props.$visible ? 'scale(1)' : 'scale(0.95)'};
  transition: opacity 0.2s ease, transform 0.2s ease;
  
  ${props => {
    switch (props.$position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) ${props.$visible ? 'translateY(0)' : 'translateY(4px)'};
          margin-bottom: ${props.theme.spacing[1]};
        `
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%) ${props.$visible ? 'translateY(0)' : 'translateY(-4px)'};
          margin-top: ${props.theme.spacing[1]};
        `
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%) ${props.$visible ? 'translateX(0)' : 'translateX(4px)'};
          margin-right: ${props.theme.spacing[1]};
        `
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%) ${props.$visible ? 'translateX(0)' : 'translateX(-4px)'};
          margin-left: ${props.theme.spacing[1]};
        `
    }
  }}
  
  &::after {
    content: '';
    position: absolute;
    border: 6px solid transparent;
    ${props => {
      switch (props.$position) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: ${props.theme.colors.gray[900]};
          `
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: ${props.theme.colors.gray[900]};
          `
        case 'left':
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-left-color: ${props.theme.colors.gray[900]};
          `
        case 'right':
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-right-color: ${props.theme.colors.gray[900]};
          `
      }
    }}
  }
`

export interface TooltipProps {
  content: string | React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  children: React.ReactNode
  disabled?: boolean
  'aria-label'?: string
}

export function Tooltip({
  content,
  position = 'top',
  delay = 200,
  children,
  disabled = false,
  'aria-label': ariaLabel
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    if (disabled) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle keyboard focus
  useEffect(() => {
    const handleFocus = () => showTooltip()
    const handleBlur = () => hideTooltip()
    
    const element = wrapperRef.current?.querySelector('[tabindex], button, a, input, select, textarea')
    if (element) {
      element.addEventListener('focus', handleFocus)
      element.addEventListener('blur', handleBlur)
      return () => {
        element.removeEventListener('focus', handleFocus)
        element.removeEventListener('blur', handleBlur)
      }
    }
  }, [])

  return (
    <TooltipWrapper
      ref={wrapperRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      aria-label={ariaLabel}
    >
      {children}
      {!disabled && (
        <TooltipContent
          $position={position}
          $visible={visible}
          role="tooltip"
          aria-hidden={!visible}
        >
          {content}
        </TooltipContent>
      )}
    </TooltipWrapper>
  )
}

