import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
`

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`

const ProjectCard = styled(Card)`
  &:hover {
    transform: scale(1.02);
  }
`

const ProjectTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 8px;
  color: #0f172a;
`

const ProjectSummary = styled.p`
  color: #334155;
  margin-bottom: 16px;
  line-height: 1.5;
`

const ProjectTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`

const ProjectDates = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 16px;
`

export function ProjectsPage() {
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
        <h1>프로젝트</h1>
        <p>로딩 중...</p>
      </Container>
    )
  }

  return (
    <Container>
      <h1>프로젝트</h1>

      <FilterBar>
        <div>
          <label>기술 스택: </label>
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
          <label>정렬: </label>
          <Button
            variant={sort === 'endDate,desc' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSort('endDate,desc')}
          >
            최신순
          </Button>
          <Button
            variant={sort === 'endDate,asc' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSort('endDate,asc')}
          >
            오래된순
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

      {projects.length === 0 && <p>해당 조건의 프로젝트가 없습니다.</p>}
    </Container>
  )
}
