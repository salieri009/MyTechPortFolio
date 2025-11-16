import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Card, Tag } from '../common'
import { useProjectAnalytics } from '../../hooks/useAnalytics'

/**
 * ProjectCard Component (Molecule)
 * Nielsen Heuristic #1: Visibility of System Status - Hover states and transitions
 * Nielsen Heuristic #4: Consistency and Standards - Uniform card design
 * Nielsen Heuristic #6: Recognition Rather Than Recall - Visual tech stack indicators
 * Nielsen Heuristic #8: Aesthetic and Minimalist Design - Clean, focused layout
 */

const ProjectCardWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  /* Performance optimization */
  will-change: transform;
  transform: translateZ(0); /* Force GPU acceleration */

  &:hover {
    transform: translateY(-4px) translateZ(0);
  }
`

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 12px;
  border-radius: ${props => props.theme.radius.lg};
`

const ProjectContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`

const ProjectTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`

const ProjectSummary = styled.p`
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  flex: 1;
`

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`

const TechStacks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  
  &:hover {
    text-decoration: none;
  }
`

interface ProjectCardProps {
  id: number
  title: string
  summary: string
  startDate: string
  endDate: string
  techStacks: string[]
  imageUrl?: string
}

export function ProjectCard({ 
  id, 
  title, 
  summary, 
  startDate, 
  endDate, 
  techStacks,
  imageUrl
}: ProjectCardProps) {
  const { t } = useTranslation()
  const { trackView, trackTechStackClick } = useProjectAnalytics()
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short'
    })
  }

  const handleProjectClick = () => {
    trackView(id, title, techStacks)
  }

  const handleTechStackClick = (e: React.MouseEvent, techStack: string) => {
    e.preventDefault()
    e.stopPropagation()
    trackTechStackClick(id, techStack)
  }

  return (
    <StyledLink 
      to={`/projects/${id}`} 
      onClick={handleProjectClick}
      aria-label={`View project: ${t(title)}`}
    >
      <ProjectCardWrapper isHover role="article" aria-labelledby={`project-title-${id}`}>
        {imageUrl && (
          <ProjectImage 
            src={imageUrl} 
            alt={t(title)} 
            loading="lazy"
            aria-hidden="false"
          />
        )}
        <ProjectContent>
          <ProjectTitle id={`project-title-${id}`}>{t(title)}</ProjectTitle>
          <ProjectSummary>{t(summary)}</ProjectSummary>
          <ProjectMeta aria-label={`Project duration: ${formatDate(startDate)} to ${formatDate(endDate)}`}>
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </ProjectMeta>
          <TechStacks aria-label="Technologies used">
            {techStacks.slice(0, 3).map((tech) => (
              <Tag 
                key={tech}
                onClick={(e) => handleTechStackClick(e, tech)}
                clickable
                aria-label={`Filter projects by ${tech}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleTechStackClick(e as any, tech)
                  }
                }}
              >
                {tech}
              </Tag>
            ))}
            {techStacks.length > 3 && (
              <Tag aria-label={`${techStacks.length - 3} more technologies`}>
                +{techStacks.length - 3}
              </Tag>
            )}
          </TechStacks>
        </ProjectContent>
      </ProjectCardWrapper>
    </StyledLink>
  )
}
