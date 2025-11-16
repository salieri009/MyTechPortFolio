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
        <LogoIcon aria-hidden="true">JB</LogoIcon>
        <BrandName>{t('footer.branding.name', '정욱 반')}</BrandName>
      </BrandingContainer>
      <BrandTagline>
        {t('footer.branding.tagline', '풀스택 개발자')}
      </BrandTagline>
      <TechBadge aria-label="Technology stack used to build this portfolio">
        {t('footer.branding.builtWith', 'Built with: [React] [Spring Boot] [Three.js]')}
      </TechBadge>
    </FooterSection>
  )
}
