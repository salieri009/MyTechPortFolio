import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const BridgeContainer = styled.div<{ 
  $isVisible: boolean
  $variant: 'primary' | 'secondary'
  $diagonal?: boolean
  $overlap?: boolean
}>`
  padding: ${props => props.$overlap 
    ? `${props.theme.spacing[20]} 0 ${props.theme.spacing[10]}` 
    : `${props.theme.spacing[16]} 0`};
  text-align: center;
  position: relative;
  background: ${props => props.theme.colors.background};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* 오버랩 효과를 위한 negative margin */
  ${props => props.$overlap && `
    margin-top: -${props.theme.spacing[16]};
    z-index: 1;
  `}
  
  /* 대각선 구분자 */
  ${props => props.$diagonal && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: ${props.theme.spacing[16]};
      background: ${props.theme.colors.background};
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 80%);
      z-index: -1;
    }
  `}
  
  /* 상단 수직선 (대각선이 아닐 때만) */
  ${props => !props.$diagonal && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 40px;
      background: ${props.theme.colors.primary[500]};
      opacity: ${props.$variant === 'primary' ? 1 : 0.6};
    }
  `}

  @media (max-width: 768px) {
    padding: ${props => props.$overlap 
      ? `${props.theme.spacing[16]} 0 ${props.theme.spacing[8]}` 
      : `${props.theme.spacing[10]} 0`};
    ${props => props.$overlap && `
      margin-top: -${props.theme.spacing[10]};
    `}
    
    ${props => !props.$diagonal && `
      &::before {
        height: ${props.theme.spacing[8]};
      }
    `}
    
    ${props => props.$diagonal && `
      &::after {
        height: ${props.theme.spacing[10]};
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 85%);
      }
    `}
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

const BridgeText = styled.p<{ $variant: 'primary' | 'secondary' }>`
  font-size: 18px;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
  font-weight: 400;
  
  ${props => props.$variant === 'primary' && `
    color: ${props.theme.colors.text};
    font-weight: 500;
  `}

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 0 ${props => props.theme.spacing[6]};
  }
`

const BridgeIcon = styled.span`
  display: inline-block;
  margin-right: ${props => props.theme.spacing[2]};
  opacity: 0.7;
`

interface SectionBridgeProps {
  text: string
  variant?: 'primary' | 'secondary'
  icon?: string
  diagonal?: boolean // 대각선 구분자 사용 여부
  overlap?: boolean // 오버랩 효과 사용 여부
}

export function SectionBridge({ 
  text, 
  variant = 'secondary',
  icon,
  diagonal = false,
  overlap = false
}: SectionBridgeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <BridgeContainer 
      ref={containerRef}
      $isVisible={isVisible}
      $variant={variant}
      $diagonal={diagonal}
      $overlap={overlap}
      role="region"
      aria-label="Section transition"
    >
      <BridgeText $variant={variant}>
        {icon && <BridgeIcon aria-hidden="true">{icon}</BridgeIcon>}
        {text}
      </BridgeText>
    </BridgeContainer>
  )
}

