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
      <BrandingContainer to="/">
        <LogoIcon>MT</LogoIcon>
        <BrandName>{t('footer.branding.name')}</BrandName>
      </BrandingContainer>
      <BrandTagline>
        {t('footer.branding.tagline')}
      </BrandTagline>
      <TechBadge>
        <span>🚀</span>
        <span>{t('footer.branding.builtWith')}</span>
      </TechBadge>
    </FooterSection>
  )
}
