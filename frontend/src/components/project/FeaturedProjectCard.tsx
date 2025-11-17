import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useProjectAnalytics } from '../../hooks/useAnalytics'
import { use3DTilt } from '../../hooks/use3DTilt'

const FeaturedCardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  
  &:hover {
    text-decoration: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${props => props.theme.radius.lg};
  }
`

const CardContainer = styled.div<{ $isVisible: boolean; $index: number }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  padding: ${props => props.theme.spacing[8]};
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  transition: border-color 0.3s ease, box-shadow 0.3s ease,
              opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  height: 100%;
  min-height: 350px;
  position: relative;
  overflow: hidden;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition-delay: ${props => props.$index * 0.1}s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 15px,
        ${props => props.theme.colors.neutral[props.theme.mode === 'dark' ? 700 : 200]} 15px,
        ${props => props.theme.colors.neutral[props.theme.mode === 'dark' ? 700 : 200]} 30px
      );
    opacity: ${props => props.theme.mode === 'dark' ? 0.05 : 0.03};
    z-index: 0;
    background-size: 30px 30px;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: ${props => props.theme.shadows['2xl']};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
    padding: ${props => props.theme.spacing[6]};
    min-height: auto;
  }
`

const ImageContainer = styled.div`
  width: 100%;
  height: 280px;
  border-radius: ${props => props.theme.radius.lg};
  overflow: hidden;
  background: ${props => props.theme.colors.neutral[props.theme.mode === 'dark' ? 800 : 200]};
  position: relative;

  @media (max-width: 768px) {
    height: 200px;
  }
`

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    ${props => {
      const hex = props.theme.colors.primary[500].replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.85)`;
    }} 0%,
    ${props => {
      const hex = props.theme.colors.primary[600].replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.9)`;
    }} 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${FeaturedCardLink}:hover & {
    opacity: 1;
  }
`

const HoverIcon = styled.svg`
  width: ${props => props.theme.spacing[12]}; /* 48px */
  height: ${props => props.theme.spacing[12]}; /* 48px */
  color: ${props => props.theme.colors.primary[500]};
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  pointer-events: none;
  
  ${FeaturedCardLink}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform;
  transform: translateZ(0);
  position: relative;
  z-index: 1;

  ${FeaturedCardLink}:hover & {
    transform: scale(1.05) translateZ(0);
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`

const Badge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.radius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-transform: uppercase;
  margin-bottom: ${props => props.theme.spacing[3]};
  width: fit-content;
`

const ProjectTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  line-height: ${props => props.theme.typography.lineHeight.tight};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }
`

const ProjectSummary = styled.p`
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
`

const TechStacks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
  margin-top: auto;
`

const TechTag = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => props.theme.mode === 'dark' 
    ? props.theme.colors.neutral[800] 
    : props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  border: 1px solid ${props => props.theme.colors.border};
`

const CTA = styled.div`
  margin-top: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: center;
  transition: all 0.3s ease;

  ${FeaturedCardLink}:hover & {
    background: ${props => props.theme.colors.primary[600]};
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`

interface FeaturedProjectCardProps {
  id: number
  title: string
  summary: string
  startDate: string
  endDate: string
  techStacks: string[]
  imageUrl?: string
}

export function FeaturedProjectCard({
  id,
  title,
  summary,
  startDate,
  endDate,
  techStacks,
  imageUrl,
  index = 0
}: FeaturedProjectCardProps & { index?: number }) {
  const { t } = useTranslation()
  const { trackView } = useProjectAnalytics()
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { ref: tiltRef, style: tiltStyle } = use3DTilt({ maxTilt: 3, scale: 1.01 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const element = cardRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short'
    })
  }

  const handleLinkClick = () => {
    trackView(id, title, techStacks)
  }

  return (
    <FeaturedCardLink 
      to={`/projects/${id}`}
      onClick={handleLinkClick}
      aria-label={`View project: ${t(title)}`}
    >
      <CardContainer
        ref={(node) => {
          cardRef.current = node
          tiltRef(node)
        }}
        $isVisible={isVisible}
        $index={index}
        style={tiltStyle}
      >
        {imageUrl && (
          <ImageContainer>
            <ProjectImage src={imageUrl} alt={t(title)} loading="lazy" />
            <ImageOverlay>
              <HoverIcon viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </HoverIcon>
            </ImageOverlay>
          </ImageContainer>
        )}
        <ContentContainer>
          <Badge>Featured Project</Badge>
          <ProjectTitle>{t(title)}</ProjectTitle>
          <ProjectSummary>{t(summary)}</ProjectSummary>
          <ProjectMeta>
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </ProjectMeta>
          <TechStacks>
            {techStacks.slice(0, 3).map((tech) => (
              <TechTag key={tech}>{tech}</TechTag>
            ))}
            {techStacks.length > 3 && (
              <TechTag aria-label={`${techStacks.length - 3} more technologies`}>
                +{techStacks.length - 3}
              </TechTag>
            )}
          </TechStacks>
          <CTA>View Project</CTA>
        </ContentContainer>
      </CardContainer>
    </FeaturedCardLink>
  )
}
