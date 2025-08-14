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

  const socialLinks = [
    {
      name: t('footer.social.github'),
      icon: '🐙',
      href: CONTACT_INFO.github.url
    },
    {
      name: t('footer.social.linkedin'),
      icon: '💼',
      href: CONTACT_INFO.linkedin.url
    },
    {
      name: t('footer.social.twitter'),
      icon: '🐦',
      href: 'https://twitter.com/yourhandle'
    },
    {
      name: t('footer.social.instagram'),
      icon: '📷',
      href: 'https://instagram.com/yourhandle'
    }
  ]

  return (
    <FooterSection>
      <FooterSectionTitle>
        {t('footer.social.title')}
      </FooterSectionTitle>
      <SocialIconsGrid>
        {socialLinks.map((social, index) => (
          <SocialIcon
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
          >
            {social.icon}
          </SocialIcon>
        ))}
      </SocialIconsGrid>
    </FooterSection>
  )
}
