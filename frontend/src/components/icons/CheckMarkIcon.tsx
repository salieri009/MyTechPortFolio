import React from 'react'
import styled from 'styled-components'

const IconContainer = styled.svg<{ $size?: number }>`
  width: ${props => props.$size || 48}px;
  height: ${props => props.$size || 48}px;
  stroke: ${props => props.theme.colors.success || props.theme.colors.primary[500]};
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
`

/**
 * CheckMark Icon Component
 * Stroke-based SVG icon for success/checkmark states
 * Replaces text-based icons (✓) per design system rules
 */
export const CheckMarkIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <IconContainer $size={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </IconContainer>
)

