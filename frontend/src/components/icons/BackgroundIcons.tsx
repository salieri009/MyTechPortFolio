import React from 'react'
import styled from 'styled-components'

const IconContainer = styled.svg`
  width: ${props => props.theme.spacing[8]}; /* 32px */
  height: ${props => props.theme.spacing[8]}; /* 32px */
  stroke: ${props => props.theme.colors.primary[500]};
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`

// Graduation Cap Icon (🎓)
export const GraduationCapIcon: React.FC = () => (
  <IconContainer viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </IconContainer>
)

// Briefcase Icon (💼)
export const BriefcaseIcon: React.FC = () => (
  <IconContainer viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </IconContainer>
)

// Settings Icon (⚙️)
export const SettingsIcon: React.FC = () => (
  <IconContainer viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
  </IconContainer>
)

