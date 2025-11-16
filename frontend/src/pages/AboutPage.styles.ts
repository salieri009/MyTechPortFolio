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
  max-width: 704px; /* 4-point system */
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
export const BackgroundCard = styled(Card)`
  grid-column: span 4; /* 3-column grid */
  padding: ${props => props.theme.spacing[8]};
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
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
`

export const CardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]};
`

export const CardContent = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
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
export const ValueCard = styled(Card)`
  grid-column: span 4;
  padding: ${props => props.theme.spacing[8]};
  text-align: center;
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
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
`

export const ValueIcon = styled.div`
  font-size: ${props => props.theme.spacing[12]}; /* 48px */
  margin-bottom: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.primary[500]};
  line-height: 1;
`

export const MissionText = styled.div`
  max-width: ${props => props.theme.spacing[200]}; /* 800px */
  margin: 0 auto ${props => props.theme.spacing[8]};
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize.lg};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
`

// ContactSection - 기존 AboutPage.tsx 스타일 유지
export const ContactSection = styled(Card)`
  margin-top: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
  text-align: center;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
`

export const ContactTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  color: ${props => props.theme.colors.text};
`

export const ContactInfo = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  text-align: left;
  max-width: ${props => props.theme.spacing[100]}; /* 4-point system: 400px */
  margin-left: auto;
  margin-right: auto;
`

export const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[5]}; /* 4-point system: 16px 20px → 16px 24px */
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radius.xl}; /* 4-point system: 12px */
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography.fontFamily.primary};

  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
`

export const ContactLabel = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 15px → 16px */
`

export const ContactValue = styled.a`
  color: ${props => props.theme.colors.primary[500]};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  ${props => props.theme.hoverTransition()};
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.primary[600]};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.sm};
  }
`

export const ContactButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  justify-content: center;
  flex-wrap: wrap;
`

export const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[5]}; /* 4-point system: 12px 20px → 12px 24px */
  background: ${props => props.theme.colors.primary[500]};
  color: ${props => props.theme.colors.hero.text};
  text-decoration: none;
  border-radius: ${props => props.theme.radius.lg}; /* 4-point system: 8px */
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: all 0.2s ease;

  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    background: ${props => props.theme.colors.primary[600]};
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateY(0);
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
  max-width: 600px;
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
    color: ${props => props.theme.colors.hero?.text || '#ffffff'};
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


