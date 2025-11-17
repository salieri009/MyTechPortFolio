import React from 'react'
import styled from 'styled-components'

const IconContainer = styled.svg<{ $size?: number; $highlighted?: boolean }>`
  width: ${props => props.$size || 48}px;
  height: ${props => props.$size || 48}px;
  stroke: ${props => props.theme.colors.primary[500]};
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  
  ${props => props.$highlighted && `
    stroke: ${props.theme.colors.primary[600]};
    stroke-width: 2.5;
    filter: drop-shadow(0 0 4px ${props.theme.colors.primary[500]}40);
  `}
`

// Innovation Icon: Lightbulb
export const InnovationIcon: React.FC<{ size?: number; highlighted?: boolean }> = ({ size = 48, highlighted = false }) => (
  <IconContainer $size={size} $highlighted={highlighted} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6M12 3a6 6 0 0 0-6 6c0 2.5 1.5 4.5 3 6M12 3v18M8 15h8" />
  </IconContainer>
)

// Collaboration Icon: Overlapping circles
export const CollaborationIcon: React.FC<{ size?: number; highlighted?: boolean }> = ({ size = 48, highlighted = false }) => (
  <IconContainer $size={size} $highlighted={highlighted} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="9" cy="12" r="4" />
    <circle cx="15" cy="12" r="4" />
    <path d="M9 12a4 4 0 0 1 6 0" />
  </IconContainer>
)

// Growth Icon: Upward trending graph
export const GrowthIcon: React.FC<{ size?: number; highlighted?: boolean }> = ({ size = 48, highlighted = false }) => (
  <IconContainer $size={size} $highlighted={highlighted} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 18l6-6 4 4 8-10" />
    <path d="M21 12h-4" />
    <path d="M17 8v4" />
  </IconContainer>
)

