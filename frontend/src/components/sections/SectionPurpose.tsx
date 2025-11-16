import React from 'react'
import styled from 'styled-components'

const PurposeContainer = styled.div`
  text-align: center;
  margin: -16px 0 24px 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`

const PurposeText = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  font-weight: 400;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0 24px;
  }
`

const PurposeIcon = styled.span`
  display: inline-block;
  margin-right: 6px;
  opacity: 0.6;
  font-size: 12px;
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

