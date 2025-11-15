import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '@components/ui/Button'
import {
  FooterSection,
  FooterSectionTitle
} from '@components/common/FooterComponents'

/**
 * Footer CTA Component (Molecule)
 * Portfolio-specific call-to-action section
 * Nielsen Heuristic #10: Help and Documentation
 * Provides clear next steps for recruiters and visitors
 */

const CTAContainer = styled(FooterSection)`
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[4]};
  text-align: center;
`

const CTATitle = styled(FooterSectionTitle)`
  color: white;
  margin-bottom: ${props => props.theme.spacing[2]};
  
  &::before {
    background: white;
  }
`

const CTADescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const CTAButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  justify-content: center;
  flex-wrap: wrap;
`

const DownloadButton = styled(Button)`
  background: white;
  color: ${props => props.theme.colors.primary[600]};
  
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    transform: translateY(-2px);
  }
`

export function FooterCTA() {
  const { t } = useTranslation()

  return (
    <CTAContainer role="region" aria-labelledby="footer-cta-title">
      <CTATitle id="footer-cta-title">
        {t('footer.cta.title', 'Ready to Connect?')}
      </CTATitle>
      <CTADescription>
        {t('footer.cta.description', 'Download my resume or reach out to discuss opportunities')}
      </CTADescription>
      <CTAButtons role="group" aria-label="Call to action buttons">
        <Link to="/resume/download" aria-label="Download resume in PDF format">
          <DownloadButton variant="secondary" size="md">
            <span aria-hidden="true">📄</span>{' '}
            {t('footer.cta.downloadResume', 'Download Resume')}
          </DownloadButton>
        </Link>
        <Link to="/feedback" aria-label="Get in touch via contact form">
          <Button variant="outline" size="md" style={{ 
            background: 'transparent', 
            borderColor: 'white', 
            color: 'white' 
          }}>
            <span aria-hidden="true">💬</span>{' '}
            {t('footer.cta.contact', 'Get in Touch')}
          </Button>
        </Link>
      </CTAButtons>
    </CTAContainer>
  )
}

