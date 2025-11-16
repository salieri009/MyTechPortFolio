import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useProjectAnalytics } from '../../hooks/useAnalytics'
import { use3DTilt } from '../../hooks/use3DTilt'

const FeaturedCardWrapper = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  
  &:hover {
    text-decoration: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme?.colors?.primary?.[500] || '#3B82F6'};
    outline-offset: 2px;
    border-radius: 12px;
  }
`

const CardContainer = styled.div<{ $isVisible: boolean; $index: number }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  background: ${props => props.theme?.colors?.card || '#FFFFFF'};
  border: 1px solid ${props => props.theme?.colors?.border || '#E5E7EB'};
  border-radius: 12px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease,
              opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  height: 100%;
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
        ${props => props.theme?.colors?.neutral?.[200] || props.theme?.colors?.primary?.[50]} 15px,
        ${props => props.theme?.colors?.neutral?.[200] || props.theme?.colors?.primary?.[50]} 30px
      );
    opacity: 0.03;
    z-index: 0;
    background-size: 30px 30px;
  }

  &:hover {
    border-color: ${props => props.theme?.colors?.primary?.[500] || '#3B82F6'};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

const ImageContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.theme.colors.neutral[200]};

  @media (max-width: 768px) {
    height: 200px;
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

  ${FeaturedCardWrapper}:hover & {
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
  padding: 4px 12px;
  background: ${props => props.theme?.colors?.primary?.[500]} || '#3B82F6';
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
  width: fit-content;
`

const ProjectTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#1F2937'};
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`

const ProjectSummary = styled.p`
  margin: 0 0 16px 0;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  font-size: 16px;
  line-height: 1.6;
`

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
`

const TechStacks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
`

const TechTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: ${props => props.theme?.colors?.surface || props.theme?.colors?.background || '#F3F4F6'};
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  border: 1px solid ${props => props.theme?.colors?.border || '#E5E7EB'};
`

const CTA = styled.button`
  margin-top: 16px;
  padding: 10px 20px;
  background: ${props => props.theme?.colors?.primary?.[500]} || '#3B82F6';
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme?.colors?.primary?.[600]} || '#2563EB';
    transform: translateX(4px);
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

  const handleProjectClick = () => {
    trackView(id, title, techStacks)
  }

  return (
    <FeaturedCardWrapper to={`/projects/${id}`} onClick={handleProjectClick}>
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
            {techStacks.slice(0, 4).map((tech) => (
              <TechTag key={tech}>{tech}</TechTag>
            ))}
            {techStacks.length > 4 && (
              <TechTag>+{techStacks.length - 4}</TechTag>
            )}
          </TechStacks>
          <CTA type="button">View Project</CTA>
        </ContentContainer>
      </CardContainer>
    </FeaturedCardWrapper>
  )
}
