// 모바일 최적화 푸터 컴포넌트
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../../../constants/contact'

const MobileFooterWrapper = styled.footer`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
    background: ${props => props.theme.colors.surface};
    border-top: 1px solid ${props => props.theme.colors.border};
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        ${props => props.theme.colors.primary}15 0%, 
        ${props => props.theme.colors.accent}10 100%
      );
      opacity: 0.5;
      pointer-events: none;
    }
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

const QuickActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]}px;
  margin-bottom: ${props => props.theme.spacing[4]}px;
  flex-wrap: wrap;
`

const QuickButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing[1]}px;
  padding: ${props => props.theme.spacing[2]}px ${props => props.theme.spacing[3]}px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 70px;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  span:first-child {
    font-size: 20px;
  }
  
  span:last-child {
    font-size: ${props => props.theme.typography.fontSize.xs}px;
    text-align: center;
    line-height: 1.2;
  }
`

const QuickIcon = styled.div`
  font-size: 20px;
  margin-bottom: 2px;
`

const ContactRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[4]}px;
  margin-bottom: ${props => props.theme.spacing[4]}px;
  flex-wrap: wrap;
`

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]}px;
  padding: ${props => props.theme.spacing[2]}px;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-1px);
  }
  
  span:first-child {
    font-size: 16px;
  }
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
        {/* 브랜드 섹션 */}
        <BrandSection>
          <LogoContainer to="/">
            <MobileLogo>MT</MobileLogo>
            <BrandName>{t('footer.branding.name')}</BrandName>
          </LogoContainer>
        </BrandSection>

        {/* 빠른 액션 버튼들 */}
        <QuickActions>
          <QuickButton to="/projects">
            <QuickIcon>💼</QuickIcon>
            <span>{t('navigation.projects')}</span>
          </QuickButton>
          <QuickButton to="/feedback">
            <QuickIcon>💌</QuickIcon>
            <span>{t('navigation.feedback')}</span>
          </QuickButton>
          <QuickButton to="/about">
            <QuickIcon>👋</QuickIcon>
            <span>{t('navigation.about')}</span>
          </QuickButton>
        </QuickActions>

        {/* 연락처 링크들 */}
        <ContactRow>
          <ContactLink href={`mailto:${CONTACT_INFO.email.student}`}>
            <span>📧</span>
            <span>Email</span>
          </ContactLink>
          <ContactLink 
            href={CONTACT_INFO.linkedin.url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span>💼</span>
            <span>LinkedIn</span>
          </ContactLink>
          <ContactLink 
            href={CONTACT_INFO.github.url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span>🐙</span>
            <span>GitHub</span>
          </ContactLink>
        </ContactRow>

        {/* 저작권 */}
        <Copyright>
          {t('footer.legal.copyright')}
        </Copyright>
      </MobileContent>
    </MobileFooterWrapper>
  )
}
