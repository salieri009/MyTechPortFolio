import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Container, Tag, Button } from '@components/common'
import { getProject } from '@services/projects'
import type { ProjectDetail } from '@model/domain'

const BackLink = styled(Link)`
  color: ${props => props.theme.colors.primary[500]};
  text-decoration: none;
  margin-bottom: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  display: inline-block;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: all 0.3s ease;

  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    text-decoration: underline;
    transform: translateX(-${props => props.theme.spacing[1]}); /* 4-point system: 4px */
    color: ${props => props.theme.colors.primary[600]};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.sm};
  }
`

const ProjectHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing[12]}; /* 4-point system: 48px */
  padding-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  border-bottom: 2px solid ${props => props.theme.colors.border || '#E5E7EB'};
`

const ProjectTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']}; /* 4-point system: 40px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  color: ${props => props.theme.colors.text};
  line-height: ${props => props.theme.typography.lineHeight.tight};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 28px → 24px */
  }
`

const ProjectMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  margin-bottom: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  flex-wrap: wrap;
  font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 16px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};

  > span {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  }
`

const ProjectLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  flex-wrap: wrap;
`

const ProjectImage = styled.img`
  width: 100%;
  max-height: ${props => props.theme.spacing[100]}; /* 4-point system: 400px */
  object-fit: cover;
  border-radius: ${props => props.theme.radius.xl}; /* 4-point system: 12px */
  margin-bottom: ${props => props.theme.spacing[12]}; /* 4-point system: 48px */
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr ${props => props.theme.spacing[80]}; /* 4-point system: 320px */
  gap: ${props => props.theme.spacing[12]}; /* 4-point system: 48px */
  margin-bottom: ${props => props.theme.spacing[12]}; /* 4-point system: 48px */

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
  margin-bottom: ${props => props.theme.spacing[12]}; /* 4-point system: 48px */
  font-family: ${props => props.theme.typography.fontFamily.primary};

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */

  span {
    font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 28px → 24px */
  }
`

const SectionDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 16px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
`

const SolutionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: ${props => props.theme.typography.fontFamily.primary};

  li {
    padding: ${props => props.theme.spacing[3]} 0; /* 4-point system: 12px */
    padding-left: ${props => props.theme.spacing[7]}; /* 4-point system: 28px */
    position: relative;
    color: ${props => props.theme.colors.textSecondary};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.primary[500]};
      font-weight: ${props => props.theme.typography.fontWeight.bold};
      font-size: ${props => props.theme.typography.fontSize.lg}; /* 4-point system: 18px */
    }
  }
`

const OutcomeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: ${props => props.theme.typography.fontFamily.primary};

  li {
    padding: ${props => props.theme.spacing[3]} 0; /* 4-point system: 12px */
    padding-left: ${props => props.theme.spacing[7]}; /* 4-point system: 28px */
    position: relative;
    color: ${props => props.theme.colors.textSecondary};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.primary[500]};
      font-weight: ${props => props.theme.typography.fontWeight.bold};
      font-size: ${props => props.theme.typography.fontSize.lg}; /* 4-point system: 18px */
    }
  }
`

const SideCard = styled.div`
  background: ${props => props.theme.colors.card || '#FFFFFF'};
  border: 1px solid ${props => props.theme.colors.border || '#E5E7EB'};
  border-radius: ${props => props.theme.radius.xl}; /* 4-point system: 12px */
  padding: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  position: sticky;
  top: ${props => props.theme.spacing[25]}; /* 4-point system: 100px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const SideCardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 16px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
`

const TechTags = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  flex-wrap: wrap;
  margin: 0;
`

const OriginalDescription = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 16px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  color: ${props => props.theme.colors.textSecondary};

  h1,
  h2,
  h3 {
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    margin-top: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
    margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  }

  p {
    margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  }

  ul,
  ol {
    margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
    padding-left: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
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
          <span>{formatDate(project.startDate)} ~ {formatDate(project.endDate)}</span>
          {project.relatedAcademics?.length && (
            <span>{project.relatedAcademics.join(', ')}</span>
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
              <SectionTitle>Key Outcomes</SectionTitle>
              <OutcomeList>
                {project.keyOutcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </OutcomeList>
            </Section>
          )}

          <Section>
            <SectionTitle>Project Overview</SectionTitle>
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
