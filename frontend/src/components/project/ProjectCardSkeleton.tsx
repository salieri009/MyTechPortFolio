import styled, { keyframes } from 'styled-components'
import { Card } from '../common'

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

export const ProjectCardSkeleton = styled(Card)`
  height: ${props => props.theme.spacing[100]}; /* 400px */
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.surface} 0%,
    ${props => props.theme.colors.background} 50%,
    ${props => props.theme.colors.surface} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  pointer-events: none;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: ${props => props.theme.colors.surface};
  }
`

