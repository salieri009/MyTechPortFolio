import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CONTACT_INFO } from '../../../constants/contact'
import {
  FooterSection,
  FooterSectionTitle,
  FooterList,
  FooterListItem,
  FooterIcon,
  FooterButton
} from '@components/common/FooterComponents'

export function FooterContact() {
  const { t } = useTranslation()

  const contactItems = [
    {
      icon: '📧',
      label: t('footer.contact.email'),
      href: `mailto:${CONTACT_INFO.email.student}`,
      value: CONTACT_INFO.email.student
    },
    {
      icon: '📱',
      label: t('footer.contact.phone'),
      href: 'tel:+82-10-1234-5678',
      value: '+82 10-1234-5678'
    },
    {
      icon: '📍',
      label: t('footer.contact.location'),
      value: 'Seoul, South Korea'
    },
    {
      icon: '💼',
      label: t('footer.contact.linkedin'),
      href: CONTACT_INFO.linkedin.url,
      value: 'LinkedIn Profile',
      external: true
    }
  ]

  return (
    <FooterSection>
      <FooterSectionTitle>
        {t('footer.contact.title')}
      </FooterSectionTitle>
      <FooterList>
        {contactItems.map((item, index) => (
          <FooterListItem key={index}>
            <FooterIcon>{item.icon}</FooterIcon>
            {item.href ? (
              <a 
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.value}
              </a>
            ) : (
              <span>{item.value}</span>
            )}
          </FooterListItem>
        ))}
      </FooterList>
      
      <Link to="/feedback">
        <FooterButton>
          💌 {t('footer.contact.feedbackButton')}
        </FooterButton>
      </Link>
    </FooterSection>
  )
}
