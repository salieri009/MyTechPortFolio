import React from 'react'
import styled from 'styled-components'

const PurposeContainer = styled.div`
  text-align: left;
  margin: -${props => props.theme.spacing[4]} 0 ${props => props.theme.spacing[6]} 0;
  max-width: 700px;
`

const PurposeText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.xs};
    padding: 0 ${props => props.theme.spacing[6]};
  }
`

const PurposeIcon = styled.span`
  display: inline-block;
  margin-right: ${props => props.theme.spacing[2]};
  opacity: 0.6;
  font-size: ${props => props.theme.typography.fontSize.xs};
`

interface SectionPurposeProps {
  text: string
  icon?: string
}

export function SectionPurpose({ text, icon }: SectionPurposeProps) {
  return (
    <PurposeContainer role="note" aria-label="Section purpose">
      <PurposeText>
        {icon && <PurposeIcon aria-hidden="true">{icon}</PurposeIcon>}
        {text}
      </PurposeText>
    </PurposeContainer>
  )
}

