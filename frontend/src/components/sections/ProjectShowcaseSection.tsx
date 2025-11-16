import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Container } from '@components/common'
import { SectionPurpose } from './SectionPurpose'

/**
 * ProjectShowcaseSection Component (Organism)
 * Nielsen Heuristic #1: Visibility of System Status - Hover feedback and animations
 * Nielsen Heuristic #4: Consistency and Standards - Uniform column design
 * Nielsen Heuristic #6: Recognition Rather Than Recall - Visual tech stack display on hover
 * Nielsen Heuristic #8: Aesthetic and Minimalist Design - Clean, focused presentation
 */

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Section = styled.section`
  padding: 60px 0 40px 0;
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  position: relative;
  overflow: hidden;
  
  /* 상단 구분선 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    opacity: 0.3;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 80px;
  }
`


const ColumnCard = styled.div<{ $isHovered: boolean; $animationType: 'right' | 'both' | 'left' }>`
  /* Performance optimization */
  will-change: transform, opacity, width, height;
  transform: translateZ(0); /* Force GPU acceleration */
  position: ${props => props.$isHovered ? 'absolute' : 'relative'};
  width: ${props => props.$isHovered ? '120%' : '100%'};
  height: ${props => props.$isHovered ? 'auto' : '500px'};
  min-height: ${props => props.$isHovered ? '600px' : '500px'};
  background: ${props => props.theme.colors.surface};
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  z-index: ${props => props.$isHovered ? 10 : 1};
  opacity: ${props => props.$isHovered ? 1 : 0.4};
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(10px);
  left: ${props => props.$isHovered ? '-10%' : '0'};

  &:hover {
    transform: translateY(-8px) translateZ(0);
    box-shadow: ${props => props.theme.shadows['2xl']};
    border-color: ${props => props.theme.colors.primary[400]};
  }

  /* Background Pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        ${props => props.theme.colors.neutral[200] || props.theme.colors.primary[50]} 10px,
        ${props => props.theme.colors.neutral[200] || props.theme.colors.primary[50]} 20px
      );
    opacity: ${props => props.$isHovered ? 0.08 : 0.03};
    z-index: 1;
    background-size: 20px 20px;
    transition: opacity 0.4s ease, background-position 0.4s ease;
    background-position: ${props => props.$isHovered ? '10px 10px' : '0 0'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.gradient.primary};
    opacity: 0.05;
    z-index: 1;
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    height: ${props => props.$isHovered ? 'auto' : '420px'};
    min-height: ${props => props.$isHovered ? '500px' : '420px'};
    position: relative;
    width: 100%;
    left: 0;
    opacity: 1;
  }

  @media (max-width: 768px) {
    height: ${props => props.$isHovered ? 'auto' : '380px'};
    min-height: ${props => props.$isHovered ? '450px' : '380px'};
  }
`

const CardContent = styled.div<{ $isExpanded: boolean }>`
  position: relative;
  padding: ${props => props.$isExpanded ? '40px' : '48px'};
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.$isExpanded ? 'flex-start' : 'center'};
  align-items: center;
  text-align: center;
  z-index: 2;
  min-height: 100%;
  transition: padding 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @media (max-width: 768px) {
    padding: ${props => props.$isExpanded ? '32px' : '36px'};
  }
`

const CardTitle = styled.h3`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-family: ${props => props.theme.typography.fontFamily.display};

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 16px;
  }
`

const CardIcon = styled.div<{ $isExpanded: boolean }>`
  font-size: ${props => props.$isExpanded ? '48px' : '64px'};
  margin-bottom: ${props => props.$isExpanded ? '20px' : '32px'};
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: font-size 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              margin-bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @media (max-width: 768px) {
    font-size: ${props => props.$isExpanded ? '44px' : '56px'};
    margin-bottom: ${props => props.$isExpanded ? '16px' : '24px'};
  }
`

const CardDescription = styled.p<{ $isExpanded: boolean }>`
  font-size: 18px;
  line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.$isExpanded ? '24px' : '32px'};
  max-width: ${props => props.$isExpanded ? '100%' : '280px'};
  transition: max-width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              margin-bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: ${props => props.$isExpanded ? '20px' : '24px'};
  }
`

const ExpandIndicator = styled.div<{ $isExpanded: boolean }>`
  font-size: 12px;
  color: ${props => props.theme.colors.textTertiary || props.theme.colors.textSecondary};
  margin-top: ${props => props.$isExpanded ? '0' : '16px'};
  opacity: ${props => props.$isExpanded ? 0 : 0.6};
  transition: opacity 0.3s ease, margin-top 0.3s ease;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  
  &::before {
    content: '...';
    letter-spacing: 4px;
  }
`

const TechStackSection = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  margin-top: ${props => props.$isVisible ? '24px' : '0'};
  padding-top: ${props => props.$isVisible ? '24px' : '0'};
  border-top: ${props => props.$isVisible ? `1px solid ${props.theme.colors.border}` : 'none'};
  opacity: ${props => props.$isVisible ? 1 : 0};
  max-height: ${props => props.$isVisible ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

const TechStackGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
`

const TechTag = styled.span<{ $index: number; $isVisible: boolean }>`
  display: inline-block;
  padding: 6px 12px;
  background: ${props => props.theme.colors.surface || props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  border: 1px solid ${props => props.theme.colors.border};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(10px)'};
  transition: opacity 0.3s ease ${props => props.$index * 0.05}s,
              transform 0.3s ease ${props => props.$index * 0.05}s;
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.neutral[800] || props.theme.colors.surface};
    border-color: ${props.theme.colors.neutral[700]};
  `}
`

const CTAButton = styled.button<{ $isVisible: boolean }>`
  margin-top: 20px;
  padding: 10px 24px;
  background: transparent;
  color: ${props => props.theme.colors.primary[500]};
  border: 2px solid ${props => props.theme.colors.primary[500]};
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.3s ease ${props => props.$isVisible ? '0.2s' : '0s'};
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  
  &:hover {
    background: ${props => props.theme.colors.primary[500]};
    color: white;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
`

const SectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 64px;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.display};
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 48px;
  }
`

const SectionSubtitle = styled.p`
  font-size: 20px;
  text-align: center;
  margin-bottom: 80px;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 60px;
  }
`

interface ProjectColumn {
  id: string
  icon: string
  title: string
  description: string
  techStack: string[]
  animationType: 'right' | 'both' | 'left'
  category: string
  onHover?: () => void
  onLeave?: () => void
  onClick?: () => void
}

export function ProjectShowcaseSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [tappedColumn, setTappedColumn] = useState<string | null>(null)

  const handleCardClick = (category: string, columnId: string) => {
    // 모바일: 첫 번째 탭은 hover 상태, 두 번째 탭은 링크 이동
    if (window.innerWidth <= 768) {
      if (tappedColumn === columnId) {
        // 두 번째 탭 - 링크 이동
        navigate(`/projects?category=${category}`)
        setTappedColumn(null)
      } else {
        // 첫 번째 탭 - hover 상태 표시
        setTappedColumn(columnId)
        setHoveredColumn(columnId)
      }
    } else {
      // 데스크톱: 바로 링크 이동
      navigate(`/projects?category=${category}`)
    }
  }

  const handleCardKeyDown = (e: React.KeyboardEvent, category: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(`/projects?category=${category}`)
    }
  }

  const handleCardMouseLeave = (columnId: string) => {
    // 모바일에서는 hover 상태 유지
    if (window.innerWidth > 768) {
      setHoveredColumn(null)
      setTappedColumn(null)
    }
  }

  const projectData: ProjectColumn[] = [
    {
      id: 'threejs',
      icon: '🎮',
      title: t('showcase.threejs.title'),
      description: t('showcase.threejs.description'),
      techStack: ['Three.js', 'WebGL', 'GLSL', 'Blender', 'React Three Fiber', 'GSAP', 'Cannon.js', 'Post-processing'],
      animationType: 'right',
      category: 'threejs',
      onHover: () => setHoveredColumn('threejs'),
      onLeave: () => setHoveredColumn(null),
      onClick: () => handleCardClick('threejs')
    },
    {
      id: 'software',
      icon: '💻',
      title: t('showcase.software.title'),
      description: t('showcase.software.description'),
      techStack: ['React', 'TypeScript', 'Node.js', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'Docker', 'Azure', 'REST API', 'GraphQL'],
      animationType: 'both',
      category: 'software',
      onHover: () => setHoveredColumn('software'),
      onLeave: () => setHoveredColumn(null),
      onClick: () => handleCardClick('software')
    },
    {
      id: 'gamedev',
      icon: '🎯',
      title: t('showcase.gamedev.title'),
      description: t('showcase.gamedev.description'),
      techStack: ['Unity', 'C#', 'Unreal Engine', 'JavaScript', 'Phaser.js', 'WebRTC', 'Socket.io', 'Photon'],
      animationType: 'left',
      category: 'gamedev',
      onHover: () => setHoveredColumn('gamedev'),
      onLeave: () => setHoveredColumn(null),
      onClick: () => handleCardClick('gamedev')
    }
  ]


  return (
    <Section>
      <Container>
        <SectionTitle>
          {t('showcase.title')}
        </SectionTitle>
        <SectionPurpose 
          text={t('storytelling.showcasePurpose')}
          icon="🔍"
        />
        <SectionSubtitle>
          {t('showcase.subtitle')}
        </SectionSubtitle>
        
        <Grid role="list" aria-label="Project showcase categories">
          {projectData.map((project, index) => {
            const isExpanded = hoveredColumn === project.id || tappedColumn === project.id
            return (
              <ColumnCard
                key={project.id}
                $isHovered={isExpanded}
                $animationType={project.animationType}
                onMouseEnter={project.onHover}
                onMouseLeave={() => handleCardMouseLeave(project.id)}
                onFocus={project.onHover}
                onBlur={project.onLeave}
                onClick={() => handleCardClick(project.category, project.id)}
                onKeyDown={(e) => handleCardKeyDown(e, project.category)}
                role="button"
                tabIndex={0}
                aria-label={`${project.title}: ${project.description}. ${tappedColumn === project.id ? 'Double tap' : 'Click'} to view ${project.title} projects.`}
                aria-expanded={isExpanded}
              >
                <CardContent $isExpanded={isExpanded}>
                  <CardIcon $isExpanded={isExpanded} aria-hidden="true">{project.icon}</CardIcon>
                  <CardTitle>
                    {project.title}
                  </CardTitle>
                  <CardDescription $isExpanded={isExpanded}>{project.description}</CardDescription>
                  
                  {!isExpanded && <ExpandIndicator $isExpanded={false} aria-hidden="true" />}
                  
                  <TechStackSection $isVisible={isExpanded}>
                    <TechStackGrid role="list" aria-label="Technologies">
                      {project.techStack.map((tech, techIndex) => (
                        <TechTag
                          key={`${project.id}-${tech}-${techIndex}`}
                          $index={techIndex}
                          $isVisible={isExpanded}
                          role="listitem"
                          aria-label={tech}
                        >
                          {tech}
                        </TechTag>
                      ))}
                    </TechStackGrid>
                    <CTAButton
                      $isVisible={isExpanded}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/projects?category=${project.category}`)
                      }}
                      aria-label={`View ${project.title} projects`}
                    >
                      View Projects →
                    </CTAButton>
                  </TechStackSection>
                </CardContent>
              </ColumnCard>
            )
          })}
        </Grid>
      </Container>
    </Section>
  )
}
