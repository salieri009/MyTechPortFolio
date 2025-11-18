import React, { useEffect, useState, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Tag } from '@components/common'
import { getProject, getProjects } from '@services/projects'
import type { ProjectDetail, ProjectSummary } from '@model/domain'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(${props => props.theme.spacing[8]});
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Project Modal Overlay - Full screen immersive experience
const ProjectModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => {
    // Use theme-aware background color with 0.9 opacity
    const overlayColor = props.theme.mode === 'dark' 
      ? props.theme.colors.neutral[950] 
      : props.theme.colors.neutral[900]
    const hex = overlayColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, 0.9)`
  }};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[6]};
  animation: ${fadeIn} 300ms ease;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const ProjectModalContent = styled.div`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border-radius: ${props => props.theme.radius['2xl']};
  padding: ${props => props.theme.spacing[12]};
  max-width: ${props => props.theme.spacing[150] || '37.5rem'}; /* 600px */
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: ${slideUp} 300ms ease;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[8]};
    max-height: 95vh;
  }
`

const ProjectModalCloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing[6]};
  right: ${props => props.theme.spacing[6]};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.radius.md};
  transition: background-color 0.2s ease;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: ${props => props.theme.mode === 'dark' 
      ? props.theme.colors.neutral[800] 
      : props.theme.colors.neutral[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
  }
`

const CloseIcon = styled.svg`
  width: ${props => props.theme.spacing[6]};
  height: ${props => props.theme.spacing[6]};
  stroke: currentColor;
  stroke-width: 2;
`

const ProjectModalImage = styled.img`
  width: 100%;
  max-height: ${props => props.theme.spacing[100]}; /* 400px */
  object-fit: cover;
  border-radius: ${props => props.theme.radius.xl};
  margin-bottom: ${props => props.theme.spacing[8]};
  box-shadow: ${props => props.theme.shadows.xl};
  border: ${props => props.theme.spacing[1]} solid ${props => props.theme.colors.border};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: ${props => props.theme.shadows['2xl']};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`

const ProjectModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[6]};
  line-height: ${props => props.theme.typography.lineHeight.tight};
`

const ProjectModalDescription = styled.div`
  font-size: ${props => `calc(${props.theme.typography.fontSize.base} * 1.2)`}; /* 20% larger */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  margin-bottom: ${props => props.theme.spacing[6]};
  white-space: pre-wrap;
`

const ProjectModalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[6]};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
`

const ProjectModalTechStacks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[6]};
`

const ProjectModalLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing[6]};
`

const ProjectModalLink = styled.a`
  color: ${props => props.theme.colors.primary[600]};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary[700]};
    text-decoration: underline;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
    border-radius: ${props => props.theme.radius.sm};
  }
`

const ProjectModalRelatedAcademics = styled.div`
  margin-top: ${props => props.theme.spacing[6]};
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`

const RelatedAcademicsTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const RelatedAcademicsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`

const RelatedAcademicLink = styled.a`
  color: ${props => props.theme.colors.primary[600]};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  
  &:hover {
    color: ${props => props.theme.colors.primary[700]};
    text-decoration: underline;
  }
  
  &::after {
    content: '→';
    font-size: ${props => props.theme.typography.fontSize.sm};
    transition: transform 0.2s ease;
  }
  
  &:hover::after {
    transform: translateX(${props => props.theme.spacing[0.5]});
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
    border-radius: ${props => props.theme.radius.sm};
  }
  
  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
    &:hover::after {
      transform: none;
    }
  }
`

// T2: Immersive Modal Detail - Problem, Solution, Results sections
const ProjectModalSection = styled.div`
  margin-top: ${props => props.theme.spacing[8]};
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.mode === 'dark' 
    ? props.theme.colors.neutral[800] 
    : props.theme.colors.neutral[50]};
  border-radius: ${props => props.theme.radius.lg};
  border-left: 4px solid ${props => props.theme.colors.primary[500]};
`

const ProjectModalSectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`

const ProjectModalSectionContent = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  white-space: pre-wrap;
`

const ProjectModalSectionList = styled.ul`
  margin: 0;
  padding-left: ${props => props.theme.spacing[6]};
  list-style-type: disc;
  
  li {
    margin-bottom: ${props => props.theme.spacing[2]};
    color: ${props => props.theme.colors.text};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
  }
`

// T3: Interconnected Discovery - Related Projects section
const ProjectModalRelatedProjects = styled.div`
  margin-top: ${props => props.theme.spacing[6]};
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`

const RelatedProjectsTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const RelatedProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`

const RelatedProjectLink = styled(Link)`
  color: ${props => props.theme.colors.primary[600]};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  
  &:hover {
    color: ${props => props.theme.colors.primary[700]};
    text-decoration: underline;
  }
  
  &::after {
    content: '→';
    font-size: ${props => props.theme.typography.fontSize.sm};
    transition: transform 0.2s ease;
  }
  
  &:hover::after {
    transform: translateX(${props => props.theme.spacing[0.5]});
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
    border-radius: ${props => props.theme.radius.sm};
  }
  
  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
    &:hover::after {
      transform: none;
    }
  }
`

/**
 * ProjectDetailOverlay Component
 * Hybrid Routing: Route-based modal overlay for project details
 * Renders as child route of /projects, providing immersive experience with shareable URL
 */
export function ProjectDetailOverlay() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projectId = id ? parseInt(id, 10) : null
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null)
  const [isLoadingProject, setIsLoadingProject] = useState(false)
  const [relatedProjects, setRelatedProjects] = useState<ProjectSummary[]>([])
  const [isLoadingRelated, setIsLoadingRelated] = useState(false)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef<number>(0)

  // Save scroll position when modal opens
  useEffect(() => {
    if (projectId) {
      scrollPositionRef.current = window.scrollY
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll position when modal closes
      if (scrollPositionRef.current !== 0) {
        window.scrollTo(0, scrollPositionRef.current)
        scrollPositionRef.current = 0
      }
      document.body.style.overflow = ''
    }
  }, [projectId])

  // Load project details when route param changes
  useEffect(() => {
    if (!projectId) {
      setSelectedProject(null)
      setRelatedProjects([])
      return
    }

    setIsLoadingProject(true)
    getProject(projectId)
      .then((response) => {
        if (response.success && response.data) {
          setSelectedProject(response.data)
        }
      })
      .catch((error) => {
        console.error('Failed to load project details:', error)
      })
      .finally(() => {
        setIsLoadingProject(false)
      })
  }, [projectId])

  // T3: Load related projects (same tech stacks) when project is loaded
  useEffect(() => {
    if (!selectedProject || !selectedProject.techStacks || selectedProject.techStacks.length === 0) {
      setRelatedProjects([])
      return
    }

    setIsLoadingRelated(true)
    // Get projects with at least one matching tech stack, excluding current project
    getProjects({
      techStacks: selectedProject.techStacks.slice(0, 3), // Use top 3 tech stacks for better relevance
      page: 0,
      size: 5,
      sort: 'endDate,desc'
    })
      .then((response) => {
        if (response.success && response.data) {
          // Filter out current project and limit to 3 related projects
          const filtered = response.data.items
            .filter(p => p.id !== selectedProject.id)
            .slice(0, 3)
          setRelatedProjects(filtered)
        }
      })
      .catch((error) => {
        console.error('Failed to load related projects:', error)
        setRelatedProjects([])
      })
      .finally(() => {
        setIsLoadingRelated(false)
      })
  }, [selectedProject])

  // Close modal handler - navigate back to /projects
  const handleClose = () => {
    navigate('/projects')
  }

  // Esc key handler (R2: A11y Dismissal)
  useEffect(() => {
    if (!projectId) return

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [projectId])

  // Focus trap: Focus first focusable element when modal opens
  useEffect(() => {
    if (projectId && modalContentRef.current) {
      const firstButton = modalContentRef.current.querySelector('button') as HTMLElement
      if (firstButton) {
        setTimeout(() => firstButton.focus(), 100)
      }
    }
  }, [projectId])

  if (!projectId) return null

  return (
    <ProjectModalOverlay
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-modal-title-${projectId}`}
    >
      <ProjectModalContent
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <ProjectModalCloseButton
          onClick={handleClose}
          aria-label={t('projects.modal.close', 'Close modal')}
        >
          <CloseIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </CloseIcon>
        </ProjectModalCloseButton>
        
        {isLoadingProject ? (
          <div>{t('projects.modal.loading', 'Loading project details...')}</div>
        ) : selectedProject ? (
          <>
            {selectedProject.imageUrl && (
              <ProjectModalImage 
                src={selectedProject.imageUrl} 
                alt={t(selectedProject.title)} 
              />
            )}
            <ProjectModalTitle id={`project-modal-title-${projectId}`}>
              {t(selectedProject.title)}
            </ProjectModalTitle>
            <ProjectModalMeta>
              <span>
                {new Date(selectedProject.startDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short'
                })} - {new Date(selectedProject.endDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short'
                })}
              </span>
            </ProjectModalMeta>
            <ProjectModalDescription>
              {t(selectedProject.description || selectedProject.summary)}
            </ProjectModalDescription>
            {selectedProject.techStacks && selectedProject.techStacks.length > 0 && (
              <ProjectModalTechStacks>
                {selectedProject.techStacks.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </ProjectModalTechStacks>
            )}
            {(selectedProject.githubUrl || selectedProject.demoUrl) && (
              <ProjectModalLinks>
                {selectedProject.githubUrl && (
                  <ProjectModalLink 
                    href={selectedProject.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`${t(selectedProject.title)} GitHub repository`}
                  >
                    GitHub →
                  </ProjectModalLink>
                )}
                {selectedProject.demoUrl && (
                  <ProjectModalLink 
                    href={selectedProject.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`${t(selectedProject.title)} demo`}
                  >
                    Demo →
                  </ProjectModalLink>
                )}
              </ProjectModalLinks>
            )}

            {/* T2: Immersive Modal Detail - Problem, Solution, Results sections */}
            {selectedProject.challenge && (
              <ProjectModalSection>
                <ProjectModalSectionTitle>
                  <span>🎯</span>
                  {t('projects.modal.challenge', 'Challenge')}
                </ProjectModalSectionTitle>
                <ProjectModalSectionContent>
                  {t(selectedProject.challenge)}
                </ProjectModalSectionContent>
              </ProjectModalSection>
            )}

            {selectedProject.solution && selectedProject.solution.length > 0 && (
              <ProjectModalSection>
                <ProjectModalSectionTitle>
                  <span>💡</span>
                  {t('projects.modal.solution', 'Solution')}
                </ProjectModalSectionTitle>
                <ProjectModalSectionList>
                  {selectedProject.solution.map((item, index) => (
                    <li key={index}>{t(item)}</li>
                  ))}
                </ProjectModalSectionList>
              </ProjectModalSection>
            )}

            {selectedProject.keyOutcomes && selectedProject.keyOutcomes.length > 0 && (
              <ProjectModalSection>
                <ProjectModalSectionTitle>
                  <span>✨</span>
                  {t('projects.modal.keyOutcomes', 'Key Outcomes')}
                </ProjectModalSectionTitle>
                <ProjectModalSectionList>
                  {selectedProject.keyOutcomes.map((item, index) => (
                    <li key={index}>{t(item)}</li>
                  ))}
                </ProjectModalSectionList>
              </ProjectModalSection>
            )}
            
            {/* Related Academics Section */}
            {selectedProject.relatedAcademics && selectedProject.relatedAcademics.length > 0 && (
              <ProjectModalRelatedAcademics>
                <RelatedAcademicsTitle>
                  {t('projects.modal.relatedAcademics', 'Related Academic Subjects')}
                </RelatedAcademicsTitle>
                <RelatedAcademicsList>
                  {selectedProject.relatedAcademics.map((academicName, index) => (
                    <RelatedAcademicLink
                      key={index}
                      href={`/academics?search=${encodeURIComponent(academicName)}`}
                      aria-label={`View academic subject: ${academicName}`}
                    >
                      {academicName}
                    </RelatedAcademicLink>
                  ))}
                </RelatedAcademicsList>
              </ProjectModalRelatedAcademics>
            )}

            {/* T3: Interconnected Discovery - Related Projects Section */}
            {relatedProjects.length > 0 && (
              <ProjectModalRelatedProjects>
                <RelatedProjectsTitle>
                  {t('projects.modal.relatedProjects', 'Related Projects')}
                </RelatedProjectsTitle>
                <RelatedProjectsList>
                  {relatedProjects.map((project) => (
                    <RelatedProjectLink
                      key={project.id}
                      to={`/projects/${project.id}`}
                      onClick={handleClose}
                      aria-label={`View project: ${t(project.title)}`}
                    >
                      {t(project.title)}
                    </RelatedProjectLink>
                  ))}
                </RelatedProjectsList>
              </ProjectModalRelatedProjects>
            )}
          </>
        ) : (
          <div>{t('projects.modal.error', 'Failed to load project details')}</div>
        )}
      </ProjectModalContent>
    </ProjectModalOverlay>
  )
}

