import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Container, Card, Tag, Button } from '@components/common'
import { useFilters } from '@store/filters'
import { getProjects } from '@services/projects'
import type { ProjectSummary } from '@model/domain'

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;
  padding: 20px;
  background: ${props => props.theme.colors.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};

  label {
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-right: 8px;
  }
`

const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: ${props => props.theme.colors.textSecondary};
`

const PageTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 32px;
  color: ${props => props.theme.colors.text};
  text-align: center;
`

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`

const ProjectCard = styled(Card)`
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.lg};
  }
`

const ProjectTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
  font-weight: 700;
`

const ProjectSummary = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 14px;
`

const ProjectTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`

const ProjectDates = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
`

export function ProjectsPage() {
  const { t } = useTranslation()
  const { techStacks, year, sort, setTechStacks, setSort } = useFilters()
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      try {
        const response = await getProjects({ techStacks, year, sort })
        if (response.success) {
          setProjects(response.data.items)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [techStacks, year, sort])

  const toggleTechStack = (tech: string) => {
    const newTechStacks = techStacks.includes(tech)
      ? techStacks.filter((t) => t !== tech)
      : [...techStacks, tech]
    setTechStacks(newTechStacks)
  }

  if (loading) {
    return (
      <Container>
        <PageTitle>{t('projects.title')}</PageTitle>
        <LoadingText>{t('common.loading')}</LoadingText>
      </Container>
    )
  }

  return (
    <Container>
      <PageTitle>{t('projects.title')}</PageTitle>

      <FilterBar>
        <div>
          <label>{t('projects.filters.techStack')}: </label>
          {['React', 'TypeScript', 'Spring Boot', 'MySQL', 'Java', 'Python'].map((tech) => (
            <Tag
              key={tech}
              isSelected={techStacks.includes(tech)}
              onClick={() => toggleTechStack(tech)}
              style={{ cursor: 'pointer', margin: '4px' }}
            >
              {tech}
            </Tag>
          ))}
        </div>
        <div>
          <label>{t('projects.filters.sort')}: </label>
          <Button
            variant={sort === 'endDate,desc' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSort('endDate,desc')}
          >
            {t('projects.filters.latest')}
          </Button>
          <Button
            variant={sort === 'endDate,asc' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSort('endDate,asc')}
          >
            {t('projects.filters.oldest')}
          </Button>
        </div>
      </FilterBar>

      <ProjectGrid>
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
            <ProjectCard isHover>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectSummary>{project.summary}</ProjectSummary>
              <ProjectDates>
                {project.startDate} ~ {project.endDate}
              </ProjectDates>
              <ProjectTags>
                {project.techStacks.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </ProjectTags>
            </ProjectCard>
          </Link>
        ))}
      </ProjectGrid>

      {projects.length === 0 && <p>{t('projects.notFound')}</p>}
    </Container>
  )
}
