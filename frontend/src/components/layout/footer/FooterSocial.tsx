import React from 'react'
import { useTranslation } from 'react-i18next'
import { CONTACT_INFO } from '../../../constants/contact'
import {
  FooterSection,
  FooterSectionTitle,
  SocialIconsGrid,
  SocialIcon
} from '@components/common/FooterComponents'

export function FooterSocial() {
  const { t } = useTranslation()

  // Only show actual social media links that exist
  const socialLinks = [
    {
      name: t('footer.social.github'),
      icon: '🐙',
      href: CONTACT_INFO.github.url,
      ariaLabel: `Visit ${CONTACT_INFO.name.full}'s GitHub profile`
    },
    {
      name: t('footer.social.linkedin'),
      icon: '💼',
      href: CONTACT_INFO.linkedin.url,
      ariaLabel: `Visit ${CONTACT_INFO.name.full}'s LinkedIn profile`
    }
  ]

  return (
    <FooterSection>
      <FooterSectionTitle>
        {t('footer.social.title')}
      </FooterSectionTitle>
      <SocialIconsGrid role="list" aria-label="Social media links">
        {socialLinks.map((social, index) => (
          <SocialIcon
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            aria-label={social.ariaLabel || social.name}
            role="listitem"
          >
            <span aria-hidden="true">{social.icon}</span>
          </SocialIcon>
        ))}
      </SocialIconsGrid>
    </FooterSection>
  )
}
