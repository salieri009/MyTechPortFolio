import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useProjectAnalytics } from '../../hooks/useAnalytics'

const HeroCardWrapper = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  grid-column: 1 / -1;
  
  &:hover {
    text-decoration: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme?.colors?.primary?.[500] || '#3B82F6'};
    outline-offset: 2px;
    border-radius: 16px;
  }
  
  @media (max-width: 1024px) {
    grid-column: 1;
  }
`

const HeroCardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
  background: ${props => props.theme?.colors?.card || '#FFFFFF'};
  border: 1px solid ${props => props.theme?.colors?.border || '#E5E7EB'};
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 400px;
  position: relative;
  overflow: hidden;

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
        transparent 20px,
        ${props => props.theme?.colors?.neutral?.[200] || props.theme?.colors?.primary?.[50]} 20px,
        ${props => props.theme?.colors?.neutral?.[200] || props.theme?.colors?.primary?.[50]} 40px
      );
    opacity: 0.03;
    z-index: 0;
    background-size: 40px 40px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme?.colors?.primary?.[500] || '#3B82F6'};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 32px;
    min-height: auto;
  }
`

const HeroImageContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.theme.colors.neutral[200]};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    min-height: 200px;
  }
`

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform;
  transform: translateZ(0);

  ${HeroCardWrapper}:hover & {
    transform: scale(1.05);
  }
`

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`

const HeroBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  background: ${props => props.theme?.colors?.primary?.[500]} || '#3B82F6';
  color: white;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 16px;
  width: fit-content;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  letter-spacing: 0.1em;
`

const HeroTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 36px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#1F2937'};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const HeroSummary = styled.p`
  margin: 0 0 24px 0;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  font-size: 18px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const HeroMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
`

const HeroTechStacks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`

const HeroTechTag = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: ${props => props.theme?.colors?.background || '#F3F4F6'};
  color: ${props => props.theme?.colors?.text || '#1F2937'};
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  border: 1px solid ${props => props.theme?.colors?.border || '#E5E7EB'};
`

const HeroCTA = styled.div`
  padding: 12px 24px;
  background: transparent;
  color: ${props => props.theme?.colors?.primary?.[500] || '#3B82F6'};
  border: 2px solid ${props => props.theme?.colors?.primary?.[500] || '#3B82F6'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  transition: all 0.2s ease;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;

  ${HeroCardWrapper}:hover & {
    background: ${props => props.theme?.colors?.primary?.[500] || '#3B82F6'};
    color: white;
  }
`

interface HeroProjectCardProps {
  id: number
  title: string
  summary: string
  startDate: string
  endDate: string
  techStacks: string[]
  imageUrl?: string
}

export function HeroProjectCard({
  id,
  title,
  summary,
  startDate,
  endDate,
  techStacks,
  imageUrl
}: HeroProjectCardProps) {
  const { t } = useTranslation()
  const { trackView } = useProjectAnalytics()

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
    <HeroCardWrapper to={`/projects/${id}`} onClick={handleProjectClick}>
      <HeroCardContainer>
        {imageUrl && (
          <HeroImageContainer>
            <HeroImage src={imageUrl} alt={t(title)} loading="lazy" />
          </HeroImageContainer>
        )}
        <HeroContent>
          <div>
            <HeroBadge>Featured Project</HeroBadge>
            <HeroTitle>{t(title)}</HeroTitle>
            <HeroSummary>{t(summary)}</HeroSummary>
            <HeroMeta>
              <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
            </HeroMeta>
            <HeroTechStacks>
              {techStacks.slice(0, 6).map((tech) => (
                <HeroTechTag key={tech}>{tech}</HeroTechTag>
              ))}
              {techStacks.length > 6 && (
                <HeroTechTag>+{techStacks.length - 6}</HeroTechTag>
              )}
            </HeroTechStacks>
          </div>
          <HeroCTA>View Project</HeroCTA>
        </HeroContent>
      </HeroCardContainer>
    </HeroCardWrapper>
  )
}

