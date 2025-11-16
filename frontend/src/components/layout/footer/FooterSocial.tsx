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
      name: t('footer.social.linkedin'),
      label: 'LinkedIn',
      href: CONTACT_INFO.linkedin.url,
      ariaLabel: `Visit ${CONTACT_INFO.name.full}'s LinkedIn profile`
    },
    {
      name: t('footer.social.github'),
      label: 'GitHub',
      href: CONTACT_INFO.github.url,
      ariaLabel: `Visit ${CONTACT_INFO.name.full}'s GitHub profile`
    },
    {
      name: 'Email',
      label: 'Email',
      href: `mailto:${CONTACT_INFO.email.student}`,
      ariaLabel: `Send email to ${CONTACT_INFO.name.full}`
    }
  ]

  return (
    <FooterSection>
      <FooterSectionTitle>
        {t('footer.social.title', 'Connect')}
      </FooterSectionTitle>
      <SocialIconsGrid role="list" aria-label="Social media links">
        {socialLinks.map((social, index) => (
          <SocialIcon
            key={index}
            href={social.href}
            target={social.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            title={social.name}
            aria-label={social.ariaLabel || social.name}
            role="listitem"
          >
            {social.label}
          </SocialIcon>
        ))}
      </SocialIconsGrid>
    </FooterSection>
  )
}
