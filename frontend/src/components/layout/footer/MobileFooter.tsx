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
`

const MobileContent = styled.div`
  position: relative;
  z-index: 1;
  padding: ${props => props.theme.spacing[6]}px ${props => props.theme.spacing[4]}px;
  max-width: 100%;
`

const BrandSection = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[4]}px;
`

const LogoContainer = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]}px;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    color: ${props => props.theme.colors.primary};
  }
`

const MobileLogo = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.accent}
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

const BrandName = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.base}px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`

const MobileNav = styled.nav`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[6]}px;
  margin-bottom: ${props => props.theme.spacing[4]}px;
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    text-decoration: none;
    font-size: ${props => props.theme.typography.fontSize.sm}px;
    font-weight: 500;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary[500]};
    }
  }
`

const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[3]}px;
  margin-bottom: ${props => props.theme.spacing[4]}px;
`

const Copyright = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  margin: 0;
  padding-top: ${props => props.theme.spacing[2]}px;
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
