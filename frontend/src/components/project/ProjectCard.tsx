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

  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    transform: translateY(-${props => props.theme.spacing[1]}) translateZ(0); /* 4-point system: 4px */
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.lg};
  }
`

const ProjectImage = styled.img`
  width: 100%;
  height: ${props => props.theme.spacing[50]}; /* 4-point system: 200px */
  object-fit: cover;
  margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  border-radius: ${props => props.theme.radius.lg};
`

const ProjectContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`

const ProjectTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing[3]} 0; /* 4-point system: 12px */
  font-size: ${props => props.theme.typography.fontSize.xl}; /* 4-point system: 20px */
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
`

const ProjectSummary = styled.p`
  margin: 0 0 ${props => props.theme.spacing[4]} 0; /* 4-point system: 16px */
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  flex: 1;
`

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
`

const TechStacks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
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
