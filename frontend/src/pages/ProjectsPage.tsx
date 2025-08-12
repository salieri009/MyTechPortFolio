import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Container, Card, Tag } from '../components/common'
import { ProjectCard } from '../components/project/ProjectCard'
import { useFilters } from '../stores/filters'
import { getProjects } from '../services/projects'
import type { ProjectSummary } from '../types/domain'

// Styled Components with proper theme properties
const FilterBar = styled(Card)`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;
  padding: 20px;

  .filter-label {
    font-weight: 600;
    margin-right: 8px;
  }
`

const LoadingText = styled.p`
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  padding: 40px;
  font-size: 16px;
`

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#1F2937'};
  margin-bottom: 32px;
  text-align: center;
`

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  
  .filter-label {
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#1F2937'};
    font-size: 14px;
    margin-right: 8px;
  }
`

const SelectWrapper = styled.div`
  position: relative;
  
  select {
    padding: 8px 12px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.md};
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;
    
    &:focus {
      border-color: ${props => props.theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[500]}20;
    }
  }
`

const TechStackFilters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const SortFilters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 12px;
    color: ${props => props.theme?.colors?.text || '#1F2937'};
  }
  
  p {
    font-size: 16px;
    line-height: 1.6;
  }
`

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const {
    techStacks,
    year,
    sort,
    setTechStacks,
    setYear,
    setSort
  } = useFilters()

  // Mock data for development
  const mockProjects: ProjectSummary[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      summary: 'Full-stack e-commerce solution with React and Spring Boot',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      techStacks: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL']
    },
    {
      id: 2,
      title: 'AI Chat Application',
      summary: 'Real-time chat application with AI integration',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      techStacks: ['Next.js', 'Node.js', 'OpenAI', 'Socket.io']
    },
    {
      id: 3,
      title: 'Portfolio Website',
      summary: 'Personal portfolio built with modern web technologies',
      startDate: '2023-09-01',
      endDate: '2023-12-31',
      techStacks: ['React', 'TypeScript', 'Styled Components']
    }
  ]

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would fetch from the API
        // const data = await getProjects()
        setProjects(mockProjects)
      } catch (error) {
        console.error('Failed to load projects:', error)
        setProjects(mockProjects) // Fallback to mock data
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  useEffect(() => {
    let filtered = [...projects]

    // Filter by tech stack
    if (techStacks.length > 0) {
      filtered = filtered.filter(project =>
        techStacks.some((tech: string) => project.techStacks.includes(tech))
      )
    }

    // Filter by year
    if (year !== null) {
      filtered = filtered.filter(project => {
        const endYear = new Date(project.endDate).getFullYear()
        return endYear === year
      })
    }

    // Sort projects
    switch (sort) {
      case 'endDate,desc':
        filtered.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
        break
      case 'endDate,asc':
        filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
        break
    }

    setFilteredProjects(filtered)
  }, [projects, techStacks, year, sort])

  // Get unique tech stacks for filter options
  const allTechStacks = [...new Set(projects.flatMap(p => p.techStacks))].sort()
  
  // Get unique years for filter options
  const allYears = [...new Set(projects.map(p => new Date(p.endDate).getFullYear()))].sort((a, b) => b - a)

  const handleTechStackToggle = (tech: string) => {
    if (techStacks.includes(tech)) {
      setTechStacks(techStacks.filter((t: string) => t !== tech))
    } else {
      setTechStacks([...techStacks, tech])
    }
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingText>{t('projects.loading', 'Loading projects...')}</LoadingText>
      </Container>
    )
  }

  return (
    <Container>
      <PageTitle>{t('projects.title', 'My Projects')}</PageTitle>

      <FilterBar>
        <FilterSection>
          <span className="filter-label">{t('projects.filters.techStack', 'Tech Stack:')}</span>
          <TechStackFilters>
            {allTechStacks.map(tech => (
              <Tag
                key={tech}
                isSelected={techStacks.includes(tech)}
                onClick={() => handleTechStackToggle(tech)}
                style={{ cursor: 'pointer' }}
              >
                {tech}
              </Tag>
            ))}
          </TechStackFilters>
        </FilterSection>

        <FilterSection>
          <span className="filter-label">{t('projects.filters.year', 'Year:')}</span>
          <SelectWrapper>
            <select
              value={year ?? 'all'}
              onChange={(e) => setYear(e.target.value === 'all' ? null : parseInt(e.target.value))}
              aria-label="Filter by year"
            >
              <option value="all">{t('projects.filters.allYears', 'All Years')}</option>
              {allYears.map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </SelectWrapper>
        </FilterSection>

        <FilterSection>
          <span className="filter-label">{t('projects.filters.sort', 'Sort:')}</span>
          <SortFilters>
            {[
              { value: 'endDate,desc', label: t('projects.sort.newest', 'Newest First') },
              { value: 'endDate,asc', label: t('projects.sort.oldest', 'Oldest First') }
            ].map(option => (
              <Tag
                key={option.value}
                isSelected={sort === option.value}
                onClick={() => setSort(option.value as 'endDate,desc' | 'endDate,asc')}
                style={{ cursor: 'pointer' }}
              >
                {option.label}
              </Tag>
            ))}
          </SortFilters>
        </FilterSection>
      </FilterBar>

      {filteredProjects.length === 0 ? (
        <EmptyState>
          <h3>{t('projects.empty.title', 'No projects found')}</h3>
          <p>{t('projects.empty.description', 'Try adjusting your filters to see more projects.')}</p>
        </EmptyState>
      ) : (
        <ProjectGrid>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              id={project.id}
              title={project.title}
              summary={project.summary}
              startDate={project.startDate}
              endDate={project.endDate}
              techStacks={project.techStacks}
            />
          ))}
        </ProjectGrid>
      )}
    </Container>
  )
}

export default ProjectsPage
export { ProjectsPage }
