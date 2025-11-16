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
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
    transform: translateX(-4px);
  }
`

const ProjectHeader = styled.div`
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 2px solid ${props => props.theme.colors.border || '#E5E7EB'};
`

const ProjectTitle = styled.h1`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const ProjectMeta = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};

  > span {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`

const ProjectLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const ProjectImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 48px;
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;
  margin-bottom: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const MainContent = styled.div`
  order: 1;

  @media (max-width: 1024px) {
    order: 0;
  }
`

const SideContent = styled.div`
  order: 2;

  @media (max-width: 1024px) {
    order: 1;
  }
`

const Section = styled.div`
  margin-bottom: 48px;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;

  span {
    font-size: 28px;
  }
`

const SectionDescription = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
`

const SolutionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 12px 0;
    padding-left: 28px;
    position: relative;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.primary?.[500]} || '#3B82F6';
      font-weight: bold;
      font-size: 18px;
    }
  }
`

const OutcomeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 12px 0;
    padding-left: 28px;
    position: relative;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;

    &:before {
      content: '🎯';
      position: absolute;
      left: 0;
    }
  }
`

const SideCard = styled.div`
  background: ${props => props.theme.colors.card || '#FFFFFF'};
  border: 1px solid ${props => props.theme.colors.border || '#E5E7EB'};
  border-radius: 12px;
  padding: 24px;
  position: sticky;
  top: 100px;
`

const SideCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
`

const TechTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 0;
`

const OriginalDescription = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};

  h1,
  h2,
  h3 {
    color: ${props => props.theme.colors.text};
    margin-top: 24px;
    margin-bottom: 12px;
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
        <BackLink to="/projects">← {t('projects.backToProjects')}</BackLink>
        <p>{t('projects.notFound')}</p>
      </Container>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Container>
      <BackLink to="/projects">← {t('projects.backToProjects')}</BackLink>

      <ProjectHeader>
        <ProjectTitle>{t(project.title)}</ProjectTitle>
        <ProjectMeta>
          <span>📅 {formatDate(project.startDate)} ~ {formatDate(project.endDate)}</span>
          {project.relatedAcademics?.length && (
            <span>🎓 {project.relatedAcademics.join(', ')}</span>
          )}
        </ProjectMeta>
        <ProjectLinks>
          {project.githubUrl && (
            <Button as="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              🔗 GitHub
            </Button>
          )}
          {project.demoUrl && (
            <Button as="a" href={project.demoUrl} target="_blank" rel="noopener noreferrer" variant="ghost">
              🌐 Live Demo
            </Button>
          )}
        </ProjectLinks>
      </ProjectHeader>

      {project.imageUrl && (
        <ProjectImage src={project.imageUrl} alt={t(project.title)} />
      )}

      <ContentWrapper>
        <MainContent>
          {project.challenge && (
            <Section>
              <SectionTitle>The Challenge</SectionTitle>
              <SectionDescription>{project.challenge}</SectionDescription>
            </Section>
          )}

          {project.solution && project.solution.length > 0 && (
            <Section>
              <SectionTitle>My Solution</SectionTitle>
              <SolutionList>
                {project.solution.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </SolutionList>
            </Section>
          )}

          {project.keyOutcomes && project.keyOutcomes.length > 0 && (
            <Section>
              <SectionTitle><span>📊</span> Key Outcomes</SectionTitle>
              <OutcomeList>
                {project.keyOutcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </OutcomeList>
            </Section>
          )}

          <Section>
            <SectionTitle><span>📝</span> Project Overview</SectionTitle>
            <OriginalDescription>
              <div dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }} />
            </OriginalDescription>
          </Section>
        </MainContent>

        <SideContent>
          <SideCard>
            <SideCardTitle>Technologies Used</SideCardTitle>
            <TechTags>
              {project.techStacks.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </TechTags>
          </SideCard>
        </SideContent>
      </ContentWrapper>
    </Container>
  )
}
