import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Container, Tag, Button } from '@components/common'
import { getProject } from '@services/projects'
import type { ProjectDetail } from '@model/domain'

const BackLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  margin-bottom: 24px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`

const ProjectHeader = styled.div`
  margin-bottom: 32px;
`

const ProjectTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
  color: #0f172a;
`

const ProjectMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

const ProjectLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`

const ProjectContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #334155;

  h1,
  h2,
  h3 {
    color: #0f172a;
    margin-top: 32px;
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 16px;
  }

  ul,
  ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }
`

const TechTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 24px;
`

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      if (!id) return
      setLoading(true)
      try {
        const response = await getProject(parseInt(id))
        if (response.success) {
          setProject(response.data)
        } else {
          setError(response.error || 'Project not found')
        }
      } catch (err) {
        setError('Failed to fetch project')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  if (loading) {
    return (
      <Container>
        <p>로딩 중...</p>
      </Container>
    )
  }

  if (error || !project) {
    return (
      <Container>
        <BackLink to="/projects">← 프로젝트 목록</BackLink>
        <p>프로젝트를 찾을 수 없습니다.</p>
      </Container>
    )
  }

  return (
    <Container>
      <BackLink to="/projects">← 프로젝트 목록</BackLink>

      <ProjectHeader>
        <ProjectTitle>{project.title}</ProjectTitle>
        <ProjectMeta>
          <span>기간: {project.startDate} ~ {project.endDate}</span>
          {project.relatedAcademics?.length && (
            <span>관련 과목: {project.relatedAcademics.join(', ')}</span>
          )}
        </ProjectMeta>
        <ProjectLinks>
          {project.githubUrl && (
            <Button as="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </Button>
          )}
          {project.demoUrl && (
            <Button as="a" href={project.demoUrl} target="_blank" rel="noopener noreferrer" variant="ghost">
              Live Demo
            </Button>
          )}
        </ProjectLinks>
      </ProjectHeader>

      <ProjectContent>
        {/* For demo, just showing as plain text. In real app, you'd use a markdown renderer */}
        <div dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }} />
      </ProjectContent>

      <TechTags>
        {project.techStacks.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </TechTags>
    </Container>
  )
}
