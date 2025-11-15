import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  FooterSection,
  BrandingContainer,
  LogoIcon,
  BrandName,
  BrandTagline,
  TechBadge
} from '@components/common/FooterComponents'

export function FooterBranding() {
  const { t } = useTranslation()

  return (
    <FooterSection>
      <BrandingContainer 
        to="/"
        aria-label={`${t('footer.branding.name')} - Return to homepage`}
      >
        <LogoIcon aria-hidden="true">MT</LogoIcon>
        <BrandName>{t('footer.branding.name')}</BrandName>
      </BrandingContainer>
      <BrandTagline>
        {t('footer.branding.tagline')}
      </BrandTagline>
      <TechBadge aria-label="Technology stack used to build this portfolio">
        <span aria-hidden="true">🚀</span>
        <span>{t('footer.branding.builtWith', 'Built with React & Spring Boot')}</span>
      </TechBadge>
    </FooterSection>
  )
}
