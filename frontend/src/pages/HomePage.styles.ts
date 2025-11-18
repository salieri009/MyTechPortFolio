import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { Container } from '@components/common'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(${props => props.theme.spacing[8]}); /* 4-point system: 32px */
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
  color: ${props => props.theme.colors.hero.text};
  transition: background 0.3s ease;
  margin-top: 0; /* 4-point system: 0px (헤더와의 gap 제거, 4px 규칙 준수) */
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
  
  /* InteractiveBackground는 z-index: 0으로 배경에 위치 */
  /* Container와 HeroContent는 z-index: 2로 콘텐츠 위에 위치 */
  ${Container} {
    max-width: ${props => props.theme.spacing[300]}; /* 4-point system: 1200px */
    width: 100%;
    position: relative;
    z-index: 2;
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
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.hero.text};
  opacity: 0.95;
`

export const Headline = styled.h1`
  font-size: clamp(${props => props.theme.spacing[8]}, 5vw, ${props => props.theme.spacing[16]}); /* 4-point system: 32px, 64px */
  font-weight: ${props => props.theme.typography.fontWeight.extrabold};
  margin-bottom: 0; /* 그룹 내 응집력: HeroGroupA의 gap으로 여백 관리 */
  margin-top: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: ${props => props.theme.colors.hero.text};
  text-shadow: 0 ${props => props.theme.spacing[0.5]} ${props => props.theme.spacing[2]} rgba(0, 0, 0, 0.2); /* 4-point system: 0 2px 8px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;
  
  /* Z-Pattern Z1: Impact Statement - 그룹 A의 시작점 */
  /* T1: Strict Vertical Alignment - 좌측 정렬 엄격히 준수 */
  /* T2: 그룹 내 응집력 - Subtitle과 가까이 배치하여 하나의 메시지 그룹으로 */
  /* Visual Weight: 높은 시각적 무게로 Z-Pattern의 시작점 역할 */

  @media (max-width: 768px) {
    font-size: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
    line-height: 1.2;
  }
  
  @media (max-width: 480px) {
    font-size: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  }
`

export const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xl};
  margin-bottom: 0;
  margin-top: 0;
  opacity: 0.95;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  max-width: 600px;
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;
  
  /* Z-Pattern Z2: Authority Subtitle - Z1 바로 아래 배치 */
  /* T1: Strict Vertical Alignment - 좌측 정렬 엄격히 준수 */
  /* T2: 그룹 내 응집력 - Z1과 가까이 배치하여 하나의 메시지 그룹으로 */

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.lg};
    padding: 0;
  }
`

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[12]}; /* T2: 그룹 간 분리 - spacing[10] 이상 (spacing[12] = 48px) */
  min-height: 70vh;
  position: relative;
  z-index: 2;
  max-width: 800px; /* 좌측 정렬 블록의 최대 너비 제한 */
  
  /* Cohesion-Focused Z-Pattern: 모든 요소를 좌측 정렬로 통일 */
  /* 그룹 A와 그룹 B를 하나의 수직선을 따라 배치하여 응집력 강화 */
  /* T1: Strict Left Alignment - 하나의 수직 기준선을 따라 좌측 정렬 */
  
  /* R2: 모바일 환경 - 단일 컬럼, 좌측 정렬 유지, 전체 콘텐츠 블록 중앙 배치 */
  @media (max-width: 1024px) {
    gap: ${props => props.theme.spacing[10]}; /* T2: 그룹 간 분리 - spacing[10] 이상 유지 */
    min-height: auto;
    margin: 0 auto; /* R2: 모바일에서 중앙 배치 */
  }
`

/* 그룹 A: Primary Value Block (Z1 + Z2) */
export const HeroGroupA = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]}; /* 그룹 내 응집력: 여백 최소화 */
  animation: ${fadeInUp} 0.8s ease-out;
  
  /* T1: Strict Vertical Alignment - 좌측 정렬 엄격히 준수 */
  /* T2: Vertical Spacing Management - 그룹 내 여백 최소화 */
  /* 근접성의 원칙: Impact Statement와 Authority Subtitle을 하나의 메시지 그룹으로 */
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/* 그룹 B: Action Validation Block (Z3 + Z4) */
export const HeroGroupB = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[5]}; /* CohesionRule: Z3와 Z4 사이 여백 spacing[5] 이하 (20px) */
  animation: ${fadeInUp} 0.8s ease-out 0.2s;
  animation-fill-mode: both;
  
  /* T1: Strict Left Alignment - 좌측 정렬 엄격히 준수 */
  /* T2: Group Separation Management - 그룹 A와 그룹 B 사이 spacing[10] 이상 */
  /* T3: Action Tray Design - 아이콘만 사용, Primary CTA 시각적 무게 압도하지 않음 */
  /* 근접성의 원칙: Social Links와 CTA Buttons를 하나의 액션 그룹으로 */
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const CTAButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0;
  margin-top: 0;
  
  /* Z-Pattern Z4: CTA Buttons - Z3 바로 아래 배치 */
  /* T1: Strict Vertical Alignment - 좌측 정렬 엄격히 준수 */
  /* T2: 그룹 내 응집력 - Z3와 가까이 배치하여 하나의 액션 그룹으로 */

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
  min-width: ${props => props.theme.spacing[50]}; /* 4-point system: 200px */
  white-space: nowrap;

  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    background: ${props => props.theme.colors.primary[700]};
    border-color: ${props => props.theme.colors.primary[700]};
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]}; /* 4-point system: 4px */
  }
  
  /* H1: Visibility - Active state */
  &:active {
    background: ${props => props.theme.colors.primary[800]};
    border-color: ${props => props.theme.colors.primary[800]};
  }
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: ${props => props.theme.spacing[75]}; /* 4-point system: 300px */
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
  min-width: ${props => props.theme.spacing[50]}; /* 4-point system: 200px */
  white-space: nowrap;

  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    border-color: ${props => props.theme.colors.hero.text};
    background: ${props => props.theme.colors.hero.background};
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.hero.text};
    outline-offset: ${props => props.theme.spacing[0.5]}; /* 4-point system: 4px */
  }
  
  /* H1: Visibility - Active state */
  &:active {
    background: ${props => props.theme.colors.hero.backgroundHover};
  }
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: ${props => props.theme.spacing[75]}; /* 4-point system: 300px */
    padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[8]};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`

export const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[6]};
  align-items: center;
  margin-top: 0;
  margin-bottom: 0;
  
  /* Z-Pattern Z3: Social Validation Tray - 그룹 B의 시작점 */
  /* T1: Strict Vertical Alignment - 좌측 정렬 엄격히 준수 */
  /* T2: 그룹 내 응집력 - CTA Buttons와 가까이 배치하여 하나의 액션 그룹으로 */
  /* T3: Action Tray Integration - CTA 바로 위에 배치하여 논리적 액션 블록 완성 */
  
  @media (max-width: 640px) {
    gap: ${props => props.theme.spacing[4]};
  }
`

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[2]}; /* WCAG 최소 터치 영역: 44x44px 이상 */
  min-width: ${props => props.theme.spacing[11]}; /* 44px = spacing[11] */
  min-height: ${props => props.theme.spacing[11]}; /* 44px = spacing[11] */
  border-radius: ${props => props.theme.radius.md};
  background: transparent; /* T3: neutral-0 색상 (투명) */
  color: ${props => props.theme.colors.hero.text};
  text-decoration: none;
  transition: all 0.2s ease; /* T3: 미세한 호버 효과 */
  border: none;
  
  /* T3: Action Tray Design - 아이콘만 사용, 텍스트 라벨 없음 */
  /* T3: Primary CTA 버튼의 시각적 무게를 절대 압도하지 않도록 */
  
  /* H1: Visibility of System Status - 미세한 호버 효과 */
  &:hover {
    background: ${props => props.theme.colors.hero.background};
    opacity: 0.8;
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 2px */
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.hero.outline};
    outline-offset: ${props => props.theme.spacing[0.5]}; /* 4-point system: 2px */
    background: ${props => props.theme.colors.hero.background};
  }
  
  @media (max-width: 640px) {
    min-width: ${props => props.theme.spacing[11]}; /* WCAG 최소 터치 영역 유지 */
    min-height: ${props => props.theme.spacing[11]};
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
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`}; /* 4-point system: 32px */
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
  max-width: 704px; /* 4-point system: 700px → 704px (4의 배수) */
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`}; /* 4-point system: 32px */
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
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`}; /* 4-point system: 32px */
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
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]}; /* 4-point system: 4px */
  }
`

// TestimonialSection is now using Section component from ui/Section
// Keeping this for backward compatibility, but can be replaced with Section component
export const TestimonialSection = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  position: relative;
  
  /* H8: Aesthetic & Minimalist - Visual separator */
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
  
  /* H4: Consistency & Standards - Responsive padding */
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[12]} 0;
  }
`

export const TestimonialGrid = styled.div<{ $isVisible?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.theme.spacing[80]}, 1fr)); /* 4-point system: 320px = spacing[80] */
  gap: ${props => props.theme.spacing[8]};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`}; /* 4-point system: 32px */
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s,
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;

  /* H4: Consistency & Standards - Consistent grid spacing */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
  
  /* H8: Aesthetic & Minimalist - Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

// R1: Purposeful Scroll Indicator - Action-oriented text
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
  width: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  height: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
  border: 2px solid ${props => props.theme.colors.hero.textMuted};
  border-radius: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.theme.spacing[1]}; /* 4-point system: 4px */
    height: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
    background: ${props => props.theme.colors.hero.textMuted};
    border-radius: ${props => props.theme.spacing[0.5]}; /* 4-point system: 4px (2px → 4px) */
    animation: scrollBounce 2s infinite;
  }
  
  @keyframes scrollBounce {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    50% {
      transform: translateX(-50%) translateY(${props => props.theme.spacing[3]}); /* 4-point system: 12px */
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

