import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useProjectAnalytics } from '../../hooks/useAnalytics'

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

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  background: ${props => props.theme?.colors?.card || '#FFFFFF'};
  border: 1px solid ${props => props.theme?.colors?.border || '#E5E7EB'};
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme?.colors?.primary?.[500] || '#3B82F6'};
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
  background: #f0f0f0;

  @media (max-width: 768px) {
    height: 200px;
  }
`

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${FeaturedCardWrapper}:hover & {
    transform: scale(1.05);
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  padding: 4px 12px;
  background: ${props => props.theme?.colors?.background || '#F3F4F6'};
  color: ${props => props.theme?.colors?.text || '#1F2937'};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
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
  imageUrl
}: FeaturedProjectCardProps) {
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
    <FeaturedCardWrapper to={`/projects/${id}`} onClick={handleProjectClick}>
      <CardContainer>
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
          <CTA type="button">View Project →</CTA>
        </ContentContainer>
      </CardContainer>
    </FeaturedCardWrapper>
  )
}
