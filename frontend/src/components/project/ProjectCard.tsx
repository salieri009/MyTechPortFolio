import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Card, Tag } from '../common'

const ProjectCardWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ProjectTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1F2937'};
`

const ProjectSummary = styled.p`
  margin: 0 0 16px 0;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  line-height: 1.5;
  flex: 1;
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
}

export function ProjectCard({ 
  id, 
  title, 
  summary, 
  startDate, 
  endDate, 
  techStacks 
}: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <StyledLink to={`/projects/${id}`}>
      <ProjectCardWrapper isHover>
        <ProjectTitle>{title}</ProjectTitle>
        <ProjectSummary>{summary}</ProjectSummary>
        <ProjectMeta>
          <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
        </ProjectMeta>
        <TechStacks>
          {techStacks.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </TechStacks>
      </ProjectCardWrapper>
    </StyledLink>
  )
}
