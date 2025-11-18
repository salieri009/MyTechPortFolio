import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

const SkeletonCardContainer = styled.div`
  background: #FFFFFF; /* neutral-0 */
  border: 1px solid #E5E7EB; /* neutral-200 */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const SkeletonLine = styled.div<{ $width?: string; $height?: string }>`
  background: linear-gradient(
    90deg,
    #F3F4F6 0%, /* neutral-100 equivalent */
    #E5E7EB 50%, /* neutral-200 */
    #F3F4F6 100% /* neutral-100 equivalent */
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${props => props.theme.borderRadius.md || '8px'};
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '1rem'};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const SkeletonCircle = styled.div<{ $size?: string }>`
  background: linear-gradient(
    90deg,
    #F3F4F6 0%,
    #E5E7EB 50%,
    #F3F4F6 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 50%;
  width: ${props => props.$size || '3rem'};
  height: ${props => props.$size || '3rem'};
`

/**
 * Skeleton Card Component
 * Implements H1: Visibility of System Status - Shows loading state instead of blank screen
 */
export function SkeletonCard() {
  return (
    <SkeletonCardContainer>
      <SkeletonLine $width="40%" $height="0.875rem" />
      <SkeletonLine $width="60%" $height="2rem" style={{ marginTop: '0.5rem' }} />
    </SkeletonCardContainer>
  )
}

