import styled from 'styled-components'
import { Link } from 'react-router-dom'

// 글로벌 테마를 활용한 Footer 공통 컴포넌트들

export const FooterWrapper = styled.footer`
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: auto;
  position: relative;
  overflow: hidden;
  
  /* 미래지향적 그라데이션 배경 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.theme.colors.gradient.primary};
    opacity: 0.6;
  }
  
  /* 미세한 애니메이션 효과 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[400]},
      transparent
    );
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }
`

export const FooterContent = styled.div`
  padding: ${props => props.theme.spacing[12]} 0 ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[8]} 0 ${props => props.theme.spacing[6]};
  }
`

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.spacing[12]};
  margin-bottom: ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing[8]};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[8]};
    text-align: center;
  }
`

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

export const FooterSectionTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin: 0;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  
  &::before {
    content: '';
    width: 3px;
    height: 16px;
    background: ${props => props.theme.colors.primary[500]};
    border-radius: ${props => props.theme.borderRadius.sm};
  }
`

export const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`

export const FooterListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  a {
    color: inherit;
    text-decoration: none;
    ${props => props.theme.hoverTransition()};
    
    &:hover {
      color: ${props => props.theme.colors.primary[500]};
    }
  }
`

export const FooterIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[600]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.primary[900]};
    color: ${props.theme.colors.primary[400]};
  `}
`

export const FooterButton = styled.button`
  margin-top: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.gradient.secondary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  ${props => props.theme.hoverTransition()};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
    
    &::before {
      left: 100%;
    }
  }
`

export const FooterBottom = styled.div`
  padding-top: ${props => props.theme.spacing[8]};
  border-top: 1px solid ${props => props.theme.colors.divider};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[4]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`

export const FooterCopyright = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

export const FooterLegalLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
  }
`

export const FooterLegalLink = styled(Link)`
  color: ${props => props.theme.colors.textMuted};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm};
  ${props => props.theme.hoverTransition()};
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }
`

export const BrandingContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  ${props => props.theme.hoverTransition()};
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }
`

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: ${props => props.theme.colors.gradient.primary};
    border-radius: ${props => props.theme.borderRadius.lg};
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${BrandingContainer}:hover &::after {
    opacity: 0.3;
  }
`

export const BrandName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0;
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const BrandTagline = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  margin: 0;
  max-width: 250px;
`

export const TechBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-top: ${props => props.theme.spacing[2]};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.primary[900]};
    color: ${props.theme.colors.primary[300]};
  `}
`

export const SocialIconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing[3]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[600]};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.lg};
  ${props => props.theme.hoverTransition()};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.primary[900]};
    color: ${props.theme.colors.primary[400]};
  `}
  
  &:hover {
    background: ${props => props.theme.colors.primary[500]};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`
