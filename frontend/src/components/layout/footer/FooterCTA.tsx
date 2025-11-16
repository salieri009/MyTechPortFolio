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
  background: ${props => props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing[8]};
  margin-top: ${props => props.theme.spacing[4]};
  text-align: center;
  
  /* H1: Visibility of System Status - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[300]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
`

const CTATitle = styled(FooterSectionTitle)`
  color: ${props => props.theme.colors.hero.text};
  margin-bottom: ${props => props.theme.spacing[2]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  &::before {
    background: ${props => props.theme.colors.hero.text};
  }
`

const CTADescription = styled.p`
  color: ${props => props.theme.colors.hero.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const CTAButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  justify-content: center;
  flex-wrap: wrap;
  
  /* H4: Consistency & Standards - Consistent spacing */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const StyledOutlineButton = styled(Button)`
  background: transparent;
  border-color: ${props => props.theme.colors.hero.text};
  color: ${props => props.theme.colors.hero.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    background: ${props => props.theme.colors.hero.background};
    border-color: ${props => props.theme.colors.hero.text};
    color: ${props => props.theme.colors.hero.text};
    transform: translateY(-${props => props.theme.spacing[0.5]});
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[300]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateY(0);
    background: ${props => props.theme.colors.hero.backgroundHover};
  }
`

const DownloadButton = styled(Button)`
  background: ${props => props.theme.colors.hero.text};
  color: ${props => props.theme.colors.primary[600]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    transform: translateY(-${props => props.theme.spacing[0.5]});
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[300]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateY(0);
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
            {t('footer.cta.downloadResume', 'Download Resume')}
          </DownloadButton>
        </Link>
        <Link to="/feedback" aria-label="Get in touch via contact form">
          <StyledOutlineButton variant="outline" size="md">
            {t('footer.cta.contact', 'Get in Touch')}
          </StyledOutlineButton>
        </Link>
      </CTAButtons>
    </CTAContainer>
  )
}

