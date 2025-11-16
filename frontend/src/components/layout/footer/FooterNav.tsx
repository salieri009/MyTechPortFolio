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

  const handleJourneyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const journeySection = document.getElementById('journey') || document.querySelector('[id*="journey"]')
    if (journeySection) {
      journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 핵심 내비게이션 링크만 유지
  const navigationItems = [
    { key: 'home', path: '/' },
    { key: 'projects', path: '/projects' },
    { key: 'about', path: '/about' },
    { key: 'journey', path: '#journey', onClick: handleJourneyClick }
  ]

  return (
    <FooterSection>
      <FooterSectionTitle>
        {t('footer.sections.navigation', 'Navigation')}
      </FooterSectionTitle>
      <FooterList role="list" aria-label="Site navigation">
        {navigationItems.map(item => (
          <FooterListItem key={item.key} role="listitem">
            {item.onClick ? (
              <a 
                href={item.path}
                onClick={item.onClick}
                aria-label={`Navigate to ${t(`navigation.${item.key}`)} section`}
              >
                {t(`navigation.${item.key}`, item.key === 'journey' ? 'Journey' : '')}
              </a>
            ) : (
              <Link 
                to={item.path}
                aria-label={`Navigate to ${t(`navigation.${item.key}`)} page`}
              >
                {t(`navigation.${item.key}`)}
              </Link>
            )}
          </FooterListItem>
        ))}
      </FooterList>
    </FooterSection>
  )
}
