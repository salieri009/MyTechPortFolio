import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, Tag } from '../common'
import { useProjectAnalytics } from '../../hooks/useAnalytics'

/**
 * ProjectCard Component (Molecule)
 * Nielsen Heuristic #1: Visibility of System Status - Hover states and transitions
 * Nielsen Heuristic #4: Consistency and Standards - Uniform card design
 * Nielsen Heuristic #6: Recognition Rather Than Recall - Visual tech stack indicators
 * Nielsen Heuristic #8: Aesthetic and Minimalist Design - Clean, focused layout
 */

const ProjectCardLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.lg};
  }
`

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
  ${ProjectCardLink}:hover & {
    transform: translateY(-${props => props.theme.spacing[1]}) translateZ(0); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.xl};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.2s ease;
    ${ProjectCardLink}:hover & {
      transform: none;
    }
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.theme.spacing[50]}; /* 4-point system: 200px */
  margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  border-radius: ${props => props.theme.radius.lg};
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
  
  ${ProjectCardWrapper}:hover & {
    transform: scale(1.08); /* 미묘한 줌인 (8%) */
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    ${ProjectCardWrapper}:hover & {
      transform: none;
    }
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary[500]} 0%,
    ${props => props.theme.colors.primary[600]} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.hero?.text || '#ffffff'};
  font-size: ${props => props.theme.spacing[12]}; /* 48px */
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
      // Convert primary[500] hex to rgba with 0.85 opacity
      const hex = props.theme.colors.primary[500].replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.85)`;
    }} 0%,
    ${props => {
      // Convert primary[600] hex to rgba with 0.9 opacity
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
  
  ${ProjectCardWrapper}:hover & {
    opacity: 1;
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.2s ease;
  }
`

// Magnifying glass icon for hover cue
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
  
  ${ProjectCardWrapper}:hover & {
    opacity: 1;
    transform: scale(1);
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.2s ease;
    transform: none;
    ${ProjectCardWrapper}:hover & {
      transform: none;
    }
  }
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

const MoreTag = styled(Tag)`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary[300]};
  color: ${props => props.theme.colors.primary[600]};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[400]};
    color: ${props => props.theme.colors.primary[700]};
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4px */
  }
  
  &::before {
    content: '+';
    margin-right: ${props => props.theme.spacing[0.5]}; /* 4px */
    font-weight: ${props => props.theme.typography.fontWeight.bold};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    &:hover {
      transform: none;
    }
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

  const handleLinkClick = () => {
    trackView(id, title, techStacks)
  }

  const handleTechStackClick = (e: React.MouseEvent, techStack: string) => {
    e.preventDefault()
    e.stopPropagation()
    trackTechStackClick(id, techStack)
  }

  return (
    <ProjectCardLink 
      to={`/projects/${id}`}
      onClick={handleLinkClick}
      aria-label={`View project: ${t(title)}`}
    >
    <ProjectCardWrapper 
      isHover 
      role="article" 
      aria-labelledby={`project-title-${id}`}
    >
      <ImageContainer>
        {imageUrl ? (
          <>
            <ProjectImage 
              src={imageUrl} 
              alt={t(title)} 
              loading="lazy"
              aria-hidden="false"
            />
            <ImageOverlay aria-hidden="true">
              <HoverIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </HoverIcon>
            </ImageOverlay>
          </>
        ) : (
          <ImagePlaceholder aria-hidden="true">
            <span style={{ fontSize: '48px', lineHeight: '1' }}>P</span>
          </ImagePlaceholder>
        )}
      </ImageContainer>
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
            <MoreTag aria-label={`${techStacks.length - 3} more technologies`}>
              {techStacks.length - 3}
            </MoreTag>
          )}
        </TechStacks>
      </ProjectContent>
    </ProjectCardWrapper>
    </ProjectCardLink>
  )
}
