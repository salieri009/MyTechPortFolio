import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Container, Tag, Button } from '@components/common'
import { getProject } from '@services/projects'
import type { ProjectDetail } from '@model/domain'

const BackLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
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
  color: ${props => props.theme.colors.text};
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
  color: ${props => props.theme.colors.textSecondary};

  h1,
  h2,
  h3 {
    color: ${props => props.theme.colors.text};
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
  const { t } = useTranslation()
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
        <p>{t('common.loading')}</p>
      </Container>
    )
  }

  if (error || !project) {
    return (
      <Container>
        <BackLink to="/projects">{t('projects.backToProjects')}</BackLink>
        <p>{t('projects.notFound')}</p>
      </Container>
    )
  }

  return (
    <Container>
      <BackLink to="/projects">{t('projects.backToProjects')}</BackLink>

      <ProjectHeader>
        <ProjectTitle>{t(project.title)}</ProjectTitle>
        <ProjectMeta>
          <span>{project.startDate} ~ {project.endDate}</span>
          {project.relatedAcademics?.length && (
            <span>{t('projects.sections.relatedAcademics')}: {project.relatedAcademics.join(', ')}</span>
          )}
        </ProjectMeta>
        <ProjectLinks>
          {project.githubUrl && (
            <Button as="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              {t('projects.links.github')}
            </Button>
          )}
          {project.demoUrl && (
            <Button as="a" href={project.demoUrl} target="_blank" rel="noopener noreferrer" variant="ghost">
              {t('projects.links.demo')}
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
