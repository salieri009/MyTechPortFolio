import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Container, Card } from '@components/common'
import {
  ScrollIndicatorContainer,
  ScrollArrow,
  ScrollText
} from './HomePage.styles'
// JourneyGrid and TextColumn - defined locally based on JourneyMilestoneSection pattern
export const JourneyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${props => props.theme.spacing[8]};
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

export const TextColumn = styled.div`
  grid-column: 1 / 8; /* 7 컬럼 */
  
  @media (max-width: 1024px) {
    grid-column: 1 / 4; /* 3 컬럼 */
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
`

// AboutHero - 완전히 독립적인 컴포넌트 (HomePage Hero와 차별화)
export const AboutHero = styled.section<{ $isDark: boolean }>`
  padding: ${props => props.theme.spacing[24]} 0 ${props => props.theme.spacing[20]} 0;
  min-height: 85vh;
  display: flex;
  align-items: center;
  /* 중립 배경 또는 부드러운 그라데이션 */
  background: ${props => props.$isDark 
    ? `linear-gradient(135deg, ${props.theme.colors.primary[950]} 0%, ${props.theme.colors.primary[900]} 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.primary[50]} 0%, ${props.theme.colors.primary[100]} 100%)`
  };
  color: ${props => props.theme.colors.text};
  transition: background 0.3s ease;
  margin-top: 0;
  position: relative;
  overflow: hidden;
  
  ${Container} {
    max-width: ${props => props.theme.spacing[300]};
    width: 100%;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[20]} 0 ${props => props.theme.spacing[16]} 0;
    min-height: auto;
  }
`

// AboutHero 전용 레이아웃 - 대칭 2-column (프로필 좌측, 텍스트 우측)
export const AboutHeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[12]};
  align-items: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[8]};
  }
`

export const AboutHeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 1024px) {
    order: 2;
  }
`

export const AboutHeroRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
  justify-content: center;
  
  @media (max-width: 1024px) {
    order: 1;
  }
`

export const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
`

export const ProfileImage = styled.img`
  width: ${props => props.theme.spacing[80]}; /* 320px - 프로필 강조 */
  height: ${props => props.theme.spacing[80]};
  border-radius: ${props => props.theme.radius.full};
  border: ${props => props.theme.spacing[2]} solid ${props => props.theme.colors.primary[500]};
  box-shadow: ${props => props.theme.shadows['2xl']};
  object-fit: cover;
  background: ${props => props.theme.colors.background};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    border-color: ${props => props.theme.colors.primary[600]};
    box-shadow: ${props => props.theme.shadows['2xl']}, 0 0 0 ${props => props.theme.spacing[1]} ${props => props.theme.colors.primary[500]};
  }
  
  @media (max-width: 1024px) {
    width: ${props => props.theme.spacing[60]}; /* 240px */
    height: ${props => props.theme.spacing[60]};
  }
  
  @media (max-width: 768px) {
    width: ${props => props.theme.spacing[48]}; /* 192px */
    height: ${props => props.theme.spacing[48]};
  }
`

// StorySection - FeaturedSection 스타일 패턴 재사용
export const StorySection = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.background};
  position: relative;
  
  /* FeaturedSection과 동일한 상단 구분선 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${props => props.theme.spacing[0.5]}; /* 4px (1px → 4px 배수로 조정) */
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    opacity: 0.3;
  }
`

// SectionTitle - HomePage.styles.ts와 동일한 스타일
export const SectionTitle = styled.h2<{ $isVisible?: boolean }>`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
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

// SectionSubtitle - HomePage.styles.ts와 동일한 스타일
export const SectionSubtitle = styled.p<{ $isVisible?: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing[12]};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;
  max-width: ${props => props.theme.spacing[176] || '44rem'}; /* 704px (4-point system: 176 * 4px) */
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s,
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s;
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

// StoryVisualColumn - JourneyMilestoneSection의 TimelineColumn 패턴 재사용
export const StoryVisualColumn = styled.div`
  grid-column: 8 / -1; /* 5 columns - JourneyMilestoneSection과 동일 */
  
  @media (max-width: 1024px) {
    grid-column: 4 / -1; /* 3 columns */
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
`

export const StoryImage = styled.img`
  width: 100%;
  border-radius: ${props => props.theme.radius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  object-fit: cover;
  max-height: ${props => props.theme.spacing[100]}; /* 400px */
`

export const StoryContent = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
  
  p {
    margin-bottom: ${props => props.theme.spacing[4]};
  }
`

// BackgroundSection - FeaturedSection 스타일 패턴 재사용
export const BackgroundSection = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  position: relative;
  
  /* FeaturedSection과 동일한 상단 구분선 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${props => props.theme.spacing[0.5]}; /* 4px (1px → 4px 배수로 조정) */
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    opacity: 0.3;
  }
`

// BackgroundGrid - FeaturedGrid 패턴 재사용
export const BackgroundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${props => props.theme.spacing[6]}; /* FeaturedGrid와 동일 */
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

// BackgroundCard - Card 컴포넌트 재사용 + ContactItem 호버 효과
export const BackgroundCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => prop !== '$isHighlighted'
})<{ $isHighlighted?: boolean }>`
  grid-column: span 4; /* 3-column grid */
  padding: ${props => props.theme.spacing[8]};
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: center;
  
  /* Highlighted state */
  ${props => props.$isHighlighted && `
    background: ${props.theme.colors.primary[50]};
    border-color: ${props.theme.colors.primary[500]};
    box-shadow: 0 0 0 ${props.theme.spacing[0.5]} ${props.theme.colors.primary[200]};
  `}
  
  /* ContactItem 호버 효과 정확히 재사용 */
  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-${props => props.theme.spacing[0.5]});
  }
  
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  @media (max-width: 1024px) {
    grid-column: span 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: none;
    }
  }
`

export const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[2]}; /* 8px */
  text-align: center;
  line-height: 1;
  
  svg {
    width: ${props => props.theme.spacing[8]}; /* 32px */
    height: ${props => props.theme.spacing[8]}; /* 32px */
  }
`

export const CardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]};
  text-align: center;
`

export const CardContent = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[4]};
`

export const DetailLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.neutral[500]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: ${props => props.theme.spacing[0.5]}; /* 4px */
`

export const DetailValue = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
  display: block;
  margin-bottom: ${props => props.theme.spacing[2]}; /* 8px */
`

export const TechStackTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]}; /* 8px */
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[4]}; /* 16px */
`

export const TechStackTag = styled.a`
  display: inline-block;
  padding: ${props => props.theme.spacing[1.5]} ${props => props.theme.spacing[3]}; /* 8px 12px */
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  background: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[700]};
  border: 1px solid ${props => props.theme.colors.primary[200]};
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* -2px */
    box-shadow: ${props => props.theme.shadows.sm};
    background: ${props => props.theme.colors.primary[200]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: none;
    }
  }
`

export const TechStackCTA = styled.a`
  display: inline-block;
  margin-top: ${props => props.theme.spacing[4]}; /* 16px */
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]}; /* 8px 16px */
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.primary[600]};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary[700]};
    text-decoration: underline;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
    border-radius: ${props => props.theme.radius.sm};
  }
`

// MissionVisionSection - FeaturedSection 스타일 패턴 재사용
export const MissionVisionSection = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.background};
  position: relative;
  
  /* FeaturedSection과 동일한 상단 구분선 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${props => props.theme.spacing[0.5]}; /* 4px (1px → 4px 배수로 조정) */
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    opacity: 0.3;
  }
`

// ValuesGrid - FeaturedGrid 패턴 재사용
export const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${props => props.theme.spacing[6]}; /* FeaturedGrid와 동일 */
  margin-bottom: ${props => props.theme.spacing[12]};
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

// ValueCard - BackgroundCard와 동일한 패턴
export const ValueCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => prop !== '$isHighlighted'
})<{ $isHighlighted?: boolean }>`
  grid-column: span 4;
  padding: ${props => props.theme.spacing[8]};
  text-align: center;
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  position: relative;
  cursor: pointer;
  
  /* Highlighted state */
  ${props => props.$isHighlighted && `
    background: ${props.theme.colors.primary[50]};
    border-color: ${props.theme.colors.primary[500]};
    box-shadow: 0 0 0 ${props.theme.spacing[0.5]} ${props.theme.colors.primary[200]};
  `}
  
  &:hover {
    background: ${props => props.theme.colors.primary[100]};
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-${props => props.theme.spacing[0.5]});
    
    ${props => `
      ${ValueCardHoverIndicator} {
        opacity: 1;
        transform: translateY(0);
      }
    `}
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  @media (max-width: 1024px) {
    grid-column: span 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: none;
    }
  }
`

export const ValueIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[4]};
  width: ${props => props.theme.spacing[16]}; /* 64px */
  height: ${props => props.theme.spacing[16]}; /* 64px */
`

export const ValueCardHoverIndicator = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing[4]};
  right: ${props => props.theme.spacing[4]};
  opacity: 0;
  transform: translateY(${props => props.theme.spacing[2]});
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.2s ease;
    transform: none;
  }
`

export const HoverIcon = styled.svg`
  width: ${props => props.theme.spacing[5]}; /* 20px */
  height: ${props => props.theme.spacing[5]}; /* 20px */
  color: ${props => props.theme.colors.primary[500]};
  stroke: currentColor;
`

// Value Modal Overlay - Full screen immersive experience
export const ValueModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => {
    // Use theme-aware background color with 0.9 opacity
    const overlayColor = props.theme.mode === 'dark' 
      ? props.theme.colors.neutral[950] 
      : props.theme.colors.neutral[900]
    const hex = overlayColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, 0.9)`
  }};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[6]};
  animation: fadeIn 300ms ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

// T1: Immersive Value Modal - Full screen immersive reading experience
export const ValueModalContent = styled.div`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border-radius: ${props => props.theme.radius['2xl']};
  padding: ${props => props.theme.spacing[16]};
  max-width: ${props => props.theme.spacing[200] || '50rem'}; /* 800px - wider for immersive reading */
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 300ms ease;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(${props => props.theme.spacing[8]});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[8]};
    max-height: 95vh;
  }
`

export const ValueModalCloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing[6]};
  right: ${props => props.theme.spacing[6]};
  width: ${props => props.theme.spacing[10]}; /* 40px */
  height: ${props => props.theme.spacing[10]}; /* 40px */
  border-radius: ${props => props.theme.radius.full};
  border: none;
  background: ${props => props.theme.mode === 'dark' 
    ? props.theme.colors.neutral[800] 
    : props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.mode === 'dark' 
      ? props.theme.colors.neutral[700] 
      : props.theme.colors.neutral[200]};
    transform: scale(1.1);
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease;
    &:hover {
      transform: none;
    }
  }
`

export const CloseIcon = styled.svg`
  width: ${props => props.theme.spacing[5]}; /* 20px */
  height: ${props => props.theme.spacing[5]}; /* 20px */
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`

export const ValueModalIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[8]};
  width: ${props => props.theme.spacing[20]}; /* 80px (30% larger than 48px) */
  height: ${props => props.theme.spacing[20]}; /* 80px */
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.radius.full};
  background: ${props => props.theme.colors.primary[50]};
  border: ${props => props.theme.spacing[1]} solid ${props => props.theme.colors.primary[500]};
  box-shadow: 0 0 0 ${props => props.theme.spacing[0.5]} ${props => props.theme.colors.primary[200]};
`

export const ValueModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[4]};
`

export const ValueModalDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

// T1: Immersive reading experience - larger text, better spacing
export const ValueModalDetail = styled.div`
  font-size: ${props => `calc(${props.theme.typography.fontSize.base} * 1.25)`}; /* 25% larger for immersive reading */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  line-height: ${props => props.theme.typography.lineHeight.relaxed || 1.75}; /* Increased line height for readability */
  text-align: left;
  padding: ${props => props.theme.spacing[8]};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  margin-top: ${props => props.theme.spacing[6]};
`

export const MissionVisionTextContainer = styled.div<{ $isVisible: boolean }>`
  max-width: ${props => props.theme.spacing[200]}; /* 800px */
  margin: ${props => props.theme.spacing[12]} auto 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[8]};
  opacity: ${props => props.$isVisible ? 1 : 0};
  animation: ${props => props.$isVisible ? 'fadeInUp' : 'none'} 0.6s ease-out 0.3s forwards;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(${props => props.theme.spacing[8]});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`

export const MissionText = styled.div<{ $isVisible: boolean }>`
  text-align: center;
  font-size: ${props => props.theme.spacing[5]}; /* 20px - minimum as per requirements */
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.xl};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  
  /* Underline animation for first MissionText */
  &:first-child::after {
    content: '';
    position: absolute;
    bottom: ${props => props.theme.spacing[4]}; /* 16px */
    left: 0;
    height: ${props => props.theme.spacing[0.5]}; /* 2px */
    background: ${props => props.theme.colors.primary[500]};
    width: ${props => props.$isVisible ? '100%' : '0%'};
    transition: width 0.6s ease-out 0.5s;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    &::after {
      transition: none;
      width: 100%;
    }
  }
`

export const MissionLabel = styled.span`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.primary[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${props => props.theme.spacing[2]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

// ContactSection - Primary gradient background for maximum visual weight
export const ContactSection = styled(Card)`
  margin-top: ${props => props.theme.spacing[10]};
  text-align: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[500]} 0%, ${props => props.theme.colors.primary[800]} 100%);
  border: none;
  color: ${props => props.theme.colors.hero?.text || props.theme.colors.neutral[0]};
  padding: ${props => props.theme.spacing[12]} ${props => props.theme.spacing[6]};
  border-radius: ${props => props.theme.radius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`

export const ContactTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.hero?.text || props.theme.colors.neutral[0]};
`

export const ContactClosingMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.hero?.text || props.theme.colors.neutral[0]};
  margin-bottom: ${props => props.theme.spacing[8]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

export const ContactInfo = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[10]};
  text-align: left;
  max-width: ${props => props.theme.spacing[100]};
  margin-left: auto;
  margin-right: auto;
`

export const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[5]};
  background: ${props => props.theme.colors.primary[600]}40; /* Primary[600] with opacity */
  border-radius: ${props => props.theme.radius.xl};
  border: 2px solid ${props => props.theme.colors.primary[500]};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.hero?.text || props.theme.colors.neutral[0]};

  /* H1: Visibility of System Status - Hover feedback with Primary[50] overlay */
  &:hover {
    background: ${props => props.theme.colors.primary[500]}60;
    border-color: ${props => props.theme.colors.primary[400]};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-${props => props.theme.spacing[0.5]});
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[200]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.lg};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    &:hover { transform: none; }
  }
`

export const ContactLabel = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.hero?.text || props.theme.colors.neutral[0]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

export const ContactValue = styled.a`
  color: ${props => props.theme.colors.hero?.text || props.theme.colors.neutral[0]};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.base};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  transition: color 0.2s ease;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    color: ${props => props.theme.colors.primary[200]};
  }
  
  /* Arrow icon instead of underline */
  &::after {
    content: '➔';
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.primary[300]};
    margin-left: ${props => props.theme.spacing[1]};
    transition: transform 0.2s ease;
  }
  
  &:hover::after {
    transform: translateX(${props => props.theme.spacing[0.5]});
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[200]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.sm};
  }
  
  @media (prefers-reduced-motion: reduce) {
    &::after { transition: none; }
    &:hover::after { transform: none; }
  }
`

export const ContactButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[10]};
  
  @media (max-width: 767px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
    button, a {
      width: 100%;
    }
  }
`

export const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.neutral[0]}; /* Solid White */
  color: ${props => props.theme.colors.primary[700]};
  border: 1px solid ${props => props.theme.colors.neutral[0]};
  border-radius: ${props => props.theme.radius.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.md};

  /* H1: Visibility of System Status - Hover feedback with enhanced shadow */
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-${props => props.theme.spacing[0.5]});
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[200]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateY(0);
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, box-shadow 0.2s ease;
    &:hover { transform: none; }
  }
`

// AboutHero 전용 텍스트 스타일
export const AboutHeroGreeting = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  letter-spacing: 0.02em;
  font-family: ${props => props.theme.typography.fontFamily.primary};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.base};
    margin-bottom: ${props => props.theme.spacing[3]};
  }
`

export const AboutHeroName = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.primary[700]};
`

export const AboutHeroHeadline = styled.h1`
  font-size: clamp(${props => props.theme.spacing[8]}, 4vw, ${props => props.theme.spacing[12]}); /* HomePage보다 작게: 32px, 48px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing[6]};
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: ${props => props.theme.colors.primary[700]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;

  @media (max-width: 768px) {
    font-size: ${props => props.theme.spacing[8]}; /* 32px */
    margin-bottom: ${props => props.theme.spacing[4]};
  }
`

export const AboutHeroSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing[8]};
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  max-width: ${props => props.theme.spacing[150] || '37.5rem'}; /* 600px (4-point system: 150 * 4px) */
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: left;

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.base};
    margin-bottom: ${props => props.theme.spacing[6]};
  }
`

// AboutHero 전용 CTA 버튼 - Outline/Ghost 스타일
export const AboutHeroCTAButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`

export const AboutHeroPrimaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: transparent;
  color: ${props => props.theme.colors.primary[500]};
  border: 2px solid ${props => props.theme.colors.primary[500]};
  text-decoration: none;
  border-radius: ${props => props.theme.radius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: all 0.2s ease;
  min-width: ${props => props.theme.spacing[50]};
  
  &:hover {
    background: ${props => props.theme.colors.primary[500]};
    color: ${props => props.theme.colors.hero?.text || props.theme.colors.neutral[0]};
    transform: translateY(-${props => props.theme.spacing[0.5]});
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
  }
`

export const AboutHeroSecondaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: transparent;
  color: ${props => props.theme.colors.primary[500]};
  border: none;
  text-decoration: none;
  border-radius: ${props => props.theme.radius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: all 0.2s ease;
  min-width: ${props => props.theme.spacing[50]};
  
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    color: ${props => props.theme.colors.primary[600]};
    transform: translateY(-${props => props.theme.spacing[0.5]});
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    background: ${props => props.theme.colors.primary[50]};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
  }
`

export const AboutHeroSocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[4]};
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`

export const AboutHeroSocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.theme.spacing[10]};
  height: ${props => props.theme.spacing[10]};
  border-radius: ${props => props.theme.radius.full};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[500]};
    color: ${props => props.theme.colors.primary[600]};
    transform: translateY(-${props => props.theme.spacing[0.5]});
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  @media (max-width: 768px) {
    width: ${props => props.theme.spacing[12]};
    height: ${props => props.theme.spacing[12]};
  }
`


