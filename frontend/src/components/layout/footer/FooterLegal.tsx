import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  FooterCopyright,
  FooterLegalLinks,
  FooterLegalLink
} from '@components/common/FooterComponents'

export function FooterLegal() {
  const { t } = useTranslation()

  const legalLinks = [
    { key: 'privacy', path: '/privacy' },
    { key: 'terms', path: '/terms' },
    { key: 'licenses', path: '/licenses' }
  ]

  return (
    <>
      <FooterCopyright>
        {t('footer.legal.copyright')}
      </FooterCopyright>
      <FooterLegalLinks>
        {legalLinks.map(link => (
          <FooterLegalLink key={link.key} to={link.path}>
            {t(`footer.legal.${link.key}`)}
          </FooterLegalLink>
        ))}
      </FooterLegalLinks>
    </>
  )
}
