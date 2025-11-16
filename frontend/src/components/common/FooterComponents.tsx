import styled from 'styled-components'
import { Link } from 'react-router-dom'

// 글로벌 테마를 활용한 Footer 공통 컴포넌트들

export const FooterWrapper = styled.footer`
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.neutral[600] || props.theme.colors.border};
  margin-top: auto;
  position: relative;
  overflow: hidden;
`

export const FooterContent = styled.div`
  padding: ${props => props.theme.spacing[12]} 0 ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[8]} 0 ${props => props.theme.spacing[6]};
  }
`

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
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
    /* 모바일 순서: 소셜 링크 → 내비게이션 → 브랜딩 */
    order: 3;
    
    > *:nth-child(1) {
      order: 3; /* FooterBranding */
    }
    > *:nth-child(2) {
      order: 2; /* FooterNav */
    }
    > *:nth-child(3) {
      order: 1; /* FooterSocial */
    }
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
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin: 0;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  
  /* H6: Recognition Rather Than Recall - Visual indicator */
  &::before {
    content: '';
    width: ${props => props.theme.spacing[1]}; /* 4-point system: 4px */
    height: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
    background: ${props => props.theme.colors.primary[500]};
    border-radius: ${props => props.theme.borderRadius.sm};
    flex-shrink: 0;
  }
  
  /* H4: Consistency & Standards - Responsive font size */
  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`

export const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
  
  /* H1: Visibility of System Status - Clear visual feedback */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.sm};
  }
`

export const FooterListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    text-decoration: none;
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    ${props => props.theme.hoverTransition()};
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: ${props => props.theme.spacing[1]} 0;
    
    /* H1: Visibility of System Status - Hover feedback */
    &:hover {
      color: ${props => props.theme.colors.primary[500]};
      transform: translateX(${props => props.theme.spacing[1]});
    }
    
    /* H3: User Control & Freedom - Clear focus indicator */
    &:focus-visible {
      outline: 2px solid ${props => props.theme.colors.primary[500]};
      outline-offset: ${props => props.theme.spacing[1]};
      border-radius: ${props => props.theme.radius.sm};
      color: ${props => props.theme.colors.primary[500]};
    }
    
    /* H1: Visibility - Active state */
    &:active {
      transform: translateX(${props => props.theme.spacing[0.5]});
    }
  }
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.xs};
    
    a {
      font-size: ${props => props.theme.typography.fontSize.xs};
    }
  }
`

export const FooterIcon = styled.span`
  width: ${props => props.theme.spacing[5]};
  height: ${props => props.theme.spacing[5]};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[600]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.primary[900]};
    color: ${props.theme.colors.primary[400]};
  `}
`

export const FooterButton = styled.button`
  margin-top: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[500]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.hero.text};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  ${props => props.theme.hoverTransition()};
  
  /* H1: Visibility of System Status - Loading/active feedback */
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
      ${props => props.theme.colors.glass.medium},
      transparent
    );
    transition: left 0.5s ease;
  }
  
  /* H1: Visibility - Hover state */
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]});
    box-shadow: ${props => props.theme.shadows.md};
    background: ${props => props.theme.colors.primary[600]};
    
    &::before {
      left: 100%;
    }
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  /* H5: Error Prevention - Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateY(0);
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
  
  /* H4: Consistency & Standards - Responsive layout */
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
    gap: ${props => props.theme.spacing[3]};
  }
`

export const FooterCopyright = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  opacity: 0.6;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
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
  font-family: ${props => props.theme.typography.fontFamily.primary};
  ${props => props.theme.hoverTransition()};
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing[1]} 0;
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    transform: translateX(${props => props.theme.spacing[0.5]});
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.sm};
    color: ${props => props.theme.colors.primary[500]};
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateX(0);
  }
`

export const BrandingContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  ${props => props.theme.hoverTransition()};
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    transform: translateX(${props => props.theme.spacing[0.5]});
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.sm};
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateX(0);
  }
`

export const LogoIcon = styled.div`
  width: ${props => props.theme.spacing[10]};
  height: ${props => props.theme.spacing[10]};
  background: ${props => props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.hero.text};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -${props => props.theme.spacing[0.5]};
    background: ${props => props.theme.colors.primary[500]};
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
  color: ${props => props.theme.colors.primary[500]};
`

export const BrandTagline = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  margin: 0;
  max-width: 252px; /* 4-point system: 250px → 252px (4의 배수) */
`

export const TechBadge = styled.div`
  display: inline-block;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-top: ${props => props.theme.spacing[2]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
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
  min-width: ${props => props.theme.spacing[20]};
  height: ${props => props.theme.spacing[9]};
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  position: relative;
  padding: 0 ${props => props.theme.spacing[3]};
  ${props => props.theme.hoverTransition()};
  cursor: pointer;
  
  /* H1: Visibility of System Status - Visual feedback indicator */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: ${props => props.theme.spacing[0.5]}; /* 4-point system: 4px (2px → 4px) */
    background: ${props => props.theme.colors.primary[500]};
    transition: width 0.2s ease, height 0.2s ease;
    border-radius: ${props => props.theme.radius.full};
  }
  
  /* H1: Visibility - Hover state with clear feedback */
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    border-color: ${props => props.theme.colors.primary[500]};
    background: ${props => props.theme.colors.primary[50]};
    transform: translateY(-${props => props.theme.spacing[0.5]});
    box-shadow: ${props => props.theme.shadows.sm};
    
    &::after {
      width: 80%;
    }
  }
  
  /* H3: User Control & Freedom - Clear focus indicator */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-color: ${props => props.theme.colors.primary[500]};
    color: ${props => props.theme.colors.primary[500]};
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  /* H7: Flexibility - Keyboard navigation support */
  &:focus-visible::after {
    width: 80%;
  }
`
