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

/**
 * FooterContact Component (Molecule)
 * Utility Links section with contact information
 * NNG Guidelines: Utility Links - contact info, customer service
 */

export function FooterContact() {
  const { t } = useTranslation()

  // Utility links - contact information
  const contactItems = [
    {
      icon: '📧',
      label: t('footer.contact.email', 'Email'),
      href: `mailto:${CONTACT_INFO.email.student}`,
      value: CONTACT_INFO.email.display,
      ariaLabel: `Send email to ${CONTACT_INFO.email.display}`
    },
    {
      icon: '📱',
      label: t('footer.contact.phone', 'Phone'),
      href: CONTACT_INFO.phone.href,
      value: CONTACT_INFO.phone.display,
      ariaLabel: `Call ${CONTACT_INFO.phone.display}`
    },
    {
      icon: '📍',
      label: t('footer.contact.location', 'Location'),
      value: 'Sydney, Australia',
      ariaLabel: 'Location: Sydney, Australia'
    },
    {
      icon: '🏫',
      label: t('footer.contact.university', 'University'),
      value: CONTACT_INFO.university.shortName,
      ariaLabel: `Studying at ${CONTACT_INFO.university.name}`
    }
  ]

  return (
    <FooterSection>
      <FooterSectionTitle>
        {t('footer.contact.title', 'Contact')}
      </FooterSectionTitle>
      <FooterList role="list" aria-label="Contact information">
        {contactItems.map((item, index) => (
          <FooterListItem key={index} role="listitem">
            <FooterIcon aria-hidden="true">{item.icon}</FooterIcon>
            {item.href ? (
              <a 
                href={item.href}
                aria-label={item.ariaLabel || item.label}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.value}
              </a>
            ) : (
              <span aria-label={item.ariaLabel || item.label}>{item.value}</span>
            )}
          </FooterListItem>
        ))}
      </FooterList>
      
      <Link to="/feedback" aria-label="Send feedback or contact via form">
        <FooterButton>
          <span aria-hidden="true">💌</span>{' '}
          {t('footer.contact.feedbackButton', 'Send Feedback')}
        </FooterButton>
      </Link>
    </FooterSection>
  )
}
