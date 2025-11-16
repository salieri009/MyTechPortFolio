import React from 'react'
import styled, { keyframes } from 'styled-components'

/**
 * Skeleton Component (Atom)
 * Loading placeholder with scanline animation
 * Nielsen Heuristic #1: Visibility of System Status
 */

const scanline = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const SkeletonBase = styled.div<{ $width?: string; $height?: string; $borderRadius?: string }>`
  background: ${props => props.theme.colors.neutral[300]};
  background-image: linear-gradient(
    90deg,
    ${props => props.theme.colors.neutral[300]} 0%,
    ${props => props.theme.colors.neutral[200]} 50%,
    ${props => props.theme.colors.neutral[300]} 100%
  );
  background-size: 200% 100%;
  animation: ${scanline} 1.5s ease-in-out infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '1em'};
  border-radius: ${props => props.$borderRadius || '4px'};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.neutral[700]};
    background-image: linear-gradient(
      90deg,
      ${props.theme.colors.neutral[700]} 0%,
      ${props.theme.colors.neutral[600]} 50%,
      ${props.theme.colors.neutral[700]} 100%
    );
  `}
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background-image: none;
  }
`

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className
}) => {
  return (
    <SkeletonBase
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      className={className}
      aria-label="Loading"
      aria-live="polite"
    />
  )
}

const SkeletonCard = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SkeletonImage = styled(Skeleton)`
  width: 100%;
  height: 200px;
  border-radius: 8px;
`

const SkeletonText = styled(Skeleton)`
  height: 16px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const SkeletonTitle = styled(Skeleton)`
  height: 24px;
  width: 60%;
  margin-bottom: 12px;
`

const SkeletonBadge = styled(Skeleton)`
  width: 120px;
  height: 24px;
  border-radius: 12px;
`

export const SkeletonProjectCard: React.FC = () => {
  return (
    <SkeletonCard>
      <SkeletonImage />
      <SkeletonBadge />
      <SkeletonTitle />
      <SkeletonText width="100%" />
      <SkeletonText width="90%" />
      <SkeletonText width="80%" />
    </SkeletonCard>
  )
}

export const SkeletonTestimonialCard: React.FC = () => {
  return (
    <SkeletonCard>
      <SkeletonText width="100%" />
      <SkeletonText width="95%" />
      <SkeletonText width="85%" />
      <SkeletonTitle width="40%" height="20px" />
      <SkeletonText width="30%" height="14px" />
    </SkeletonCard>
  )
}

