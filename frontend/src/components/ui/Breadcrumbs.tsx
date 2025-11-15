import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

/**
 * Breadcrumb Navigation Component
 * Nielsen Heuristic #6: Recognition Rather Than Recall
 * Helps users understand their location and navigate back
 */

const BreadcrumbNav = styled.nav`
  margin-bottom: ${props => props.theme.spacing[6]};
`

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
`

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`

const BreadcrumbLink = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    text-decoration: underline;
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${props => props.theme.radius.sm};
  }
`

const BreadcrumbCurrent = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`

const Separator = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  user-select: none;
  aria-hidden: true;
`

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  showHome?: boolean
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  const { t } = useTranslation()
  const location = useLocation()
  
  // Auto-generate breadcrumbs from path if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const paths = location.pathname.split('/').filter(Boolean)
    const result: BreadcrumbItem[] = []
    
    if (showHome) {
      result.push({ label: t('navigation.home', 'Home'), path: '/' })
    }
    
    paths.forEach((path, index) => {
      const fullPath = '/' + paths.slice(0, index + 1).join('/')
      const label = t(`navigation.${path}`, path.charAt(0).toUpperCase() + path.slice(1))
      result.push({ label, path: fullPath })
    })
    
    return result
  })()
  
  if (breadcrumbItems.length <= 1) {
    return null // Don't show breadcrumbs if only one item
  }
  
  return (
    <BreadcrumbNav aria-label="Breadcrumb">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <BreadcrumbItem key={index}>
              {isLast ? (
                <BreadcrumbCurrent aria-current="page">
                  {item.label}
                </BreadcrumbCurrent>
              ) : (
                <>
                  <BreadcrumbLink to={item.path || '#'}>
                    {item.label}
                  </BreadcrumbLink>
                  {!isLast && <Separator aria-hidden="true">/</Separator>}
                </>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </BreadcrumbNav>
  )
}

