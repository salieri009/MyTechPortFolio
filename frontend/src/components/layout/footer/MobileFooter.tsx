// 모바일 최적화 푸터 컴포넌트
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../../../constants/contact'
import { SocialIcon } from '@components/common/FooterComponents'

const MobileFooterWrapper = styled.footer`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
    background: ${props => props.theme.colors.surface};
    border-top: 1px solid ${props => props.theme.colors.border};
    position: relative;
    overflow: hidden;
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: -${props => props.theme.spacing[0.5]}; /* 4-point system: 4px */
  }
`

const MobileContent = styled.div`
  position: relative;
  z-index: 1;
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  max-width: 100%;
`

const BrandSection = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[4]};
`

const LogoContainer = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    color: ${props => props.theme.colors.primary[500]};
  }
`

const MobileLogo = styled.div`
  width: ${props => props.theme.spacing[9]};
  height: ${props => props.theme.spacing[9]};
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: ${props => props.theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.hero.text};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.base};
  box-shadow: ${props => props.theme.shadows.sm};
`

const BrandName = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const MobileNav = styled.nav`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[4]};
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    text-decoration: none;
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    transition: color 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary[500]};
    }
    
    &:focus-visible {
      outline: 2px solid ${props => props.theme.colors.primary[500]};
      outline-offset: ${props => props.theme.spacing[0.5]}; /* 4-point system: 4px */
    }
  }
`

const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const Copyright = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin: 0;
  padding-top: ${props => props.theme.spacing[2]};
  border-top: 1px solid ${props => props.theme.colors.border};
  opacity: 0.8;
`

export function MobileFooter() {
  const { t } = useTranslation()

  return (
    <MobileFooterWrapper>
      <MobileContent>
        <BrandSection>
          <LogoContainer to="/">
            <MobileLogo>MT</MobileLogo>
            <BrandName>{t('footer.branding.name')}</BrandName>
          </LogoContainer>
        </BrandSection>

        <MobileNav>
          <Link to="/projects">{t('navigation.projects')}</Link>
          <Link to="/about">{t('navigation.about')}</Link>
          <Link to="/feedback">{t('navigation.feedback')}</Link>
        </MobileNav>

        <SocialRow>
          <SocialIcon href={`mailto:${CONTACT_INFO.email.student}`}>✉️</SocialIcon>
          <SocialIcon href={CONTACT_INFO.linkedin.url} target="_blank" rel="noopener noreferrer">in</SocialIcon>
          <SocialIcon href={CONTACT_INFO.github.url} target="_blank" rel="noopener noreferrer">🐙</SocialIcon>
        </SocialRow>

        <Copyright>
          {t('footer.legal.copyright')}
        </Copyright>
      </MobileContent>
    </MobileFooterWrapper>
  )
}
