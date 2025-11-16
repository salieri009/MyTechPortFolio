import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Container, Card, Tag } from '../components/common'
import { ProjectCard } from '../components/project/ProjectCard'
import { useFilters } from '../stores/filters'
import { getProjects } from '../services/projects'
import type { ProjectSummary } from '../types/domain'

// Category to tech stack mapping
const CATEGORY_TECH_MAP: Record<string, string[]> = {
  threejs: ['Three.js', 'WebGL', 'GLSL', 'Blender', 'React Three Fiber', 'GSAP', 'Cannon.js', 'Post-processing'],
  software: ['React', 'TypeScript', 'Node.js', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'Docker', 'Azure', 'REST API', 'GraphQL'],
  gamedev: ['Unity', 'C#', 'Unreal Engine', 'JavaScript', 'Phaser.js', 'WebRTC', 'Socket.io', 'Photon']
}

// Styled Components with proper theme properties
const FilterBar = styled(Card)`
  display: flex;
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  flex-wrap: wrap;
  align-items: center;
  padding: ${props => props.theme.spacing[5]}; /* 4-point system: 20px → 24px */
  font-family: ${props => props.theme.typography.fontFamily.primary};

  .filter-label {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    margin-right: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  }
`

const LoadingText = styled.p`
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  padding: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
  font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 16px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']}; /* 4-point system: 2.5rem → 40px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme?.colors?.text || '#1F2937'};
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  text-align: center;
`

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.theme.spacing[80]}, 1fr)); /* 4-point system: 320px */
  gap: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  margin-bottom: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
`

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  flex-wrap: wrap;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  .filter-label {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    color: ${props => props.theme?.colors?.text || '#1F2937'};
    font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
    margin-right: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  }
`

const SelectWrapper = styled.div`
  position: relative;
  
  select {
    padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]}; /* 4-point system: 8px 12px */
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.md};
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
    font-family: ${props => props.theme.typography.fontFamily.primary};
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;
    
    /* H3: User Control & Freedom - Focus state */
    &:focus {
      border-color: ${props => props.theme.colors.primary[500]};
      box-shadow: 0 0 0 ${props => props.theme.spacing[0.75]} ${props => props.theme.colors.primary[500]}20; /* 4-point system: 3px → 12px */
    }
  }
`

const TechStackFilters = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  flex-wrap: wrap;
`

const SortFilters = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  flex-wrap: wrap;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[15]} ${props => props.theme.spacing[5]}; /* 4-point system: 60px 20px → 60px 24px */
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  h3 {
    font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px (1.5rem) */
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
    color: ${props => props.theme?.colors?.text || '#1F2937'};
  }
  
  p {
    font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 16px */
    font-family: ${props => props.theme.typography.fontFamily.primary};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
  }
`

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
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

  // Handle category from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    if (category && CATEGORY_TECH_MAP[category]) {
      // Set tech stacks based on category
      setTechStacks(CATEGORY_TECH_MAP[category])
    }
  }, [searchParams, setTechStacks])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        // 실제 GitHub 기반 프로젝트 데이터 로드
        const response = await getProjects({
          page: 0,
          size: 50,
          sort: 'endDate,desc'
        })
        
        if (response.success && response.data) {
          setProjects(response.data.items)
        } else {
          console.error('Failed to load projects:', response.error)
          setProjects([])
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
        setProjects([])
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
