import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FooterSection,
  FooterSectionTitle,
  FooterList,
  FooterListItem
} from '@components/common/FooterComponents'

/**
 * FooterNav Component (Molecule)
 * Site Map style navigation with clear hierarchy
 * Nielsen Heuristic #6: Recognition Rather Than Recall
 * NNG Guidelines: Site Map footer pattern
 */

export function FooterNav() {
  const { t } = useTranslation()

  // Main navigation categories (matching global navigation)
  const mainNavigationItems = [
    { key: 'home', path: '/' },
    { key: 'projects', path: '/projects' },
    { key: 'academics', path: '/academics' },
    { key: 'about', path: '/about' }
  ]

  // Secondary navigation items
  const secondaryNavigationItems = [
    { key: 'feedback', path: '/feedback' }
  ]

  return (
    <FooterSection>
      <FooterSectionTitle>
        {t('footer.sections.navigation', 'Navigation')}
      </FooterSectionTitle>
      <FooterList role="list" aria-label="Site navigation">
        {/* Main navigation - bold for hierarchy */}
        {mainNavigationItems.map(item => (
          <FooterListItem key={item.key} role="listitem">
            <Link 
              to={item.path}
              aria-label={`Navigate to ${t(`navigation.${item.key}`)} page`}
              style={{ fontWeight: 600 }}
            >
              {t(`navigation.${item.key}`)}
            </Link>
          </FooterListItem>
        ))}
        {/* Secondary navigation - normal weight */}
        {secondaryNavigationItems.map(item => (
          <FooterListItem key={item.key} role="listitem">
            <Link 
              to={item.path}
              aria-label={`Navigate to ${t(`navigation.${item.key}`)} page`}
            >
              {t(`navigation.${item.key}`)}
            </Link>
          </FooterListItem>
        ))}
      </FooterList>
    </FooterSection>
  )
}
