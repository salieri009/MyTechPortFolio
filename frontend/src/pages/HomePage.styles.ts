import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { Container } from '@components/common'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const Hero = styled.section<{ $isDark: boolean }>`
  padding: ${props => props.theme.spacing[28]} 0 ${props => props.theme.spacing[24]} 0;
  min-height: 90vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[500]} 0%, ${props => props.theme.colors.primary[600]} 100%);
  color: white;
  transition: background 0.3s ease;
  margin-top: -1px; /* Remove gap with header */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
    pointer-events: none;
    z-index: 1;
  }
  
  > * {
    position: relative;
    z-index: 2;
  }
  
  ${Container} {
    max-width: 1200px;
    width: 100%;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[20]} 0 ${props => props.theme.spacing[16]} 0;
    min-height: 85vh;
  }
`

export const Greeting = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing[4]};
  opacity: 0.9;
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  letter-spacing: 0.02em;
  font-family: ${props => props.theme.typography.fontFamily.primary};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.base};
    margin-bottom: ${props => props.theme.spacing[3]};
  }
`

export const Name = styled.span`
  font-weight: 600;
  color: white;
  opacity: 0.95;
`

export const Headline = styled.h1`
  font-size: clamp(32px, 5vw, 64px);
  font-weight: ${props => props.theme.typography.fontWeight.extrabold};
  margin-bottom: ${props => props.theme.spacing[6]};
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;

  @media (max-width: 768px) {
    font-size: 40px;
    margin-bottom: ${props => props.theme.spacing[6]};
    line-height: 1.2;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
  }
`

export const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xl};
  margin-bottom: 0;
  opacity: 0.95;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  max-width: 600px;
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.lg};
    padding: 0;
  }
`

export const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  gap: ${props => props.theme.spacing[6]};
  align-items: start;
  min-height: 70vh;
  
  /* Z-패턴 레이아웃 최적화 */
  @media (min-width: 1025px) {
    grid-template-areas:
      "left right"
      "left right"
      "left right";
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: ${props => props.theme.spacing[8]};
    min-height: auto;
  }
`

export const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
  justify-content: center;
  
  /* Z-패턴: 좌하단에 서브타이틀, 우하단에 CTA 배치를 위한 레이아웃 */
  @media (min-width: 1025px) {
    max-width: 600px;
  }
`

export const HeroRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: ${props => props.theme.spacing[4]};
  
  /* Z-패턴: 우상단에 시각적 요소 배치 */
  @media (min-width: 1025px) {
    align-self: start;
  }
  
  @media (max-width: 1024px) {
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }
`

export const CTAButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  align-items: center;
  margin-bottom: 0;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
    width: 100%;
  }
`

export const PrimaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[8]};
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.radius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  border: 2px solid ${props => props.theme.colors.primary[500]};
  transition: background 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
  min-width: 200px;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
    border-color: ${props => props.theme.colors.primary[700]};
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
  
  &:active {
    background: ${props => props.theme.colors.primary[800]};
    border-color: ${props => props.theme.colors.primary[800]};
  }
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: 300px;
    padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[8]};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`

export const SecondaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[8]};
  background: transparent;
  color: ${props => props.theme.colors.hero.text};
  text-decoration: none;
  border-radius: ${props => props.theme.radius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  border: 2px solid ${props => props.theme.colors.hero.textSecondary};
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
  cursor: pointer;
  min-width: 200px;
  white-space: nowrap;

  &:hover {
    border-color: ${props => props.theme.colors.hero.text};
    background: ${props => props.theme.colors.hero.background};
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.hero.text};
    outline-offset: 2px;
  }
  
  &:active {
    background: ${props => props.theme.colors.hero.backgroundHover};
  }
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: 300px;
    padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[8]};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`

export const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[6]};
  align-items: center;
  margin-top: 0;
  
  @media (max-width: 640px) {
    gap: ${props => props.theme.spacing[4]};
  }
`

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.theme.colors.hero.background};
  color: ${props => props.theme.colors.hero.text};
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.hero.border};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.theme.colors.hero.backgroundHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.hero.outline};
    outline-offset: 2px;
  }
  
  @media (max-width: 640px) {
    padding: ${props => props.theme.spacing[1.5]} ${props => props.theme.spacing[3]};
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`

// FeaturedSection is now using Section component from ui/Section
// Keeping this for backward compatibility, but can be replaced with Section component
export const FeaturedSection = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.background};
  position: relative;
  
  /* 상단 구분선 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    opacity: 0.3;
  }
`

export const SectionTitle = styled.h2<{ $isVisible?: boolean }>`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

export const SectionSubtitle = styled.p<{ $isVisible?: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing[12]};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;
  max-width: 700px;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s,
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s;
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

export interface FeaturedGridItemProps {
  $gridColumn?: string
  $gridColumnTablet?: string
  $gridColumnMobile?: string
}

export const FeaturedGridItem = styled.div<FeaturedGridItemProps>`
  grid-column: ${props => props.$gridColumn || 'span 1'};
  
  @media (max-width: 1024px) {
    grid-column: ${props => props.$gridColumnTablet || 'span 3'};
  }
  
  @media (max-width: 768px) {
    grid-column: ${props => props.$gridColumnMobile || '1'};
  }
`

export const FeaturedGrid = styled.div<{ $isVisible?: boolean }>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[8]};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s,
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: ${props => props.theme.spacing[6]};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

export const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing[12]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.radius.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: ${props => props.theme.colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
`

// TestimonialSection is now using Section component from ui/Section
// Keeping this for backward compatibility, but can be replaced with Section component
export const TestimonialSection = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  position: relative;
  
  /* 상단 구분선 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    opacity: 0.3;
  }
`

export const TestimonialGrid = styled.div<{ $isVisible?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s,
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

// Scroll Indicator Component for Hero Section
const ScrollIndicatorContainer = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: ${props => props.theme.spacing[8]};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 3;
  pointer-events: none;
  
  @media (max-width: 768px) {
    bottom: ${props => props.theme.spacing[6]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const ScrollArrow = styled.div`
  width: 24px;
  height: 40px;
  border: 2px solid ${props => props.theme.colors.hero.textMuted};
  border-radius: 12px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 8px;
    background: ${props => props.theme.colors.hero.textMuted};
    border-radius: 2px;
    animation: scrollBounce 2s infinite;
  }
  
  @keyframes scrollBounce {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    50% {
      transform: translateX(-50%) translateY(12px);
      opacity: 0.5;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`

const ScrollText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.hero.textSecondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

// Export styled components for use in HomePage.tsx
export { ScrollIndicatorContainer, ScrollArrow, ScrollText }

