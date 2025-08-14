import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FooterSection,
  FooterSectionTitle,
  FooterList,
  FooterListItem
} from '@components/common/FooterComponents'

export function FooterNav() {
  const { t } = useTranslation()

  const navigationItems = [
    { key: 'home', path: '/' },
    { key: 'projects', path: '/projects' },
    { key: 'academics', path: '/academics' },
    { key: 'about', path: '/about' },
    { key: 'feedback', path: '/feedback' }
  ]

  return (
    <FooterSection>
      <FooterSectionTitle>
        {t('footer.sections.navigation')}
      </FooterSectionTitle>
      <FooterList>
        {navigationItems.map(item => (
          <FooterListItem key={item.key}>
            <Link to={item.path}>
              {t(`navigation.${item.key}`)}
            </Link>
          </FooterListItem>
        ))}
      </FooterList>
    </FooterSection>
  )
}
