import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ProjectCard } from '../project/ProjectCard'
import { getProjects } from '../../services/projects'
import type { ProjectSummary } from '../../types/domain'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[4]};
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.xl};
  box-shadow: ${props => props.theme.shadows['2xl']};
  max-width: ${props => props.theme.spacing[300]}; /* 1200px */
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(${props => props.theme.spacing[8]});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100vh;
    border-radius: ${props => props.theme.radius.xl} ${props => props.theme.radius.xl} 0 0;
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    color: ${props => props.theme.colors.text};
    margin: 0;
  }
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: ${props => props.theme.spacing[8]}; /* 32px */
  line-height: 1;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing[1]};
  border-radius: ${props => props.theme.radius.sm};
  transition: all 0.2s ease;
  width: ${props => props.theme.spacing[8]};
  height: ${props => props.theme.spacing[8]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.colors.neutral[100]};
    color: ${props => props.theme.colors.text};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, color 0.2s ease;
  }
`

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing[6]};
  overflow-y: auto;
  flex: 1;
`

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.theme.spacing[80]}, 1fr));
  gap: ${props => props.theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const LoadingText = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  padding: ${props => props.theme.spacing[10]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[10]};
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  p {
    margin: 0;
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`

interface TechStackModalProps {
  techStack: string
  onClose: () => void
}

export function TechStackModal({ techStack, onClose }: TechStackModalProps) {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        const response = await getProjects({
          techStacks: techStack,
          page: 0,
          size: 6,
          sort: 'endDate,desc'
        })
        
        if (response.success && response.data) {
          setProjects(response.data.items)
        } else {
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
  }, [techStack])

  // Focus management and keyboard navigation
  useEffect(() => {
    // Focus close button on mount
    closeButtonRef.current?.focus()

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleTab = (e: KeyboardEvent) => {
      if (!modalRef.current) return
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTab)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTab)
    }
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <ModalOverlay
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tech-stack-modal-title"
    >
      <ModalContent ref={modalRef}>
        <ModalHeader>
          <h2 id="tech-stack-modal-title">
            {t('about.background.techStackModal.title', 'Projects using {{tech}}', { tech: techStack })}
          </h2>
          <CloseButton
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t('common.close', 'Close modal')}
          >
            ×
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <LoadingText>{t('projects.loading', 'Loading projects...')}</LoadingText>
          ) : projects.length === 0 ? (
            <EmptyState>
              <p>{t('about.background.techStackModal.empty', 'No projects found using {{tech}}.', { tech: techStack })}</p>
            </EmptyState>
          ) : (
            <ProjectGrid role="list" aria-label={t('projects.list', 'Projects list')}>
              {projects.map((project) => (
                <div key={project.id} role="listitem">
                  <ProjectCard
                    id={project.id}
                    title={project.title}
                    summary={project.summary}
                    startDate={project.startDate}
                    endDate={project.endDate}
                    techStacks={project.techStacks}
                    imageUrl={project.imageUrl}
                  />
                </div>
              ))}
            </ProjectGrid>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  )
}

