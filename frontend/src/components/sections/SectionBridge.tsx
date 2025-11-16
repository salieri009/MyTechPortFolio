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

const BridgeContainer = styled.div<{ $isVisible: boolean; $variant: 'primary' | 'secondary' }>`
  padding: 60px 0;
  text-align: center;
  position: relative;
  background: ${props => props.theme.colors.background};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* 상단 수직선 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 40px;
    background: ${props => props.theme.colors.primary[500]};
    opacity: ${props => props.$variant === 'primary' ? 1 : 0.6};
  }

  @media (max-width: 768px) {
    padding: 40px 0;
    
    &::before {
      height: 30px;
    }
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
    padding: 0 24px;
  }
`

const BridgeIcon = styled.span`
  display: inline-block;
  margin-right: 8px;
  opacity: 0.7;
`

interface SectionBridgeProps {
  text: string
  variant?: 'primary' | 'secondary'
  icon?: string
}

export function SectionBridge({ 
  text, 
  variant = 'secondary',
  icon 
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

