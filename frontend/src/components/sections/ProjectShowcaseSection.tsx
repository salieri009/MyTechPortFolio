import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Container } from '@components/common'

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
  background: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 80px;
  }
`

const TechStackContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible: boolean }>`
  margin-top: 40px;
  padding: 48px;
  background: ${props => props.theme.colors.surface};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(20px);
  box-shadow: ${props => props.theme.shadows.lg};
  
  ${props => props.isVisible && `
    border-color: ${props.theme.colors.primary[400]};
    box-shadow: ${props.theme.shadows['2xl']};
  `}
`

const TechStackTitle = styled.h4`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 32px;
  text-align: center;
  font-family: ${props => props.theme.typography.fontFamily.display};
  letter-spacing: -0.01em;
`

const TechStackGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  max-width: 1000px;
  transition: all 0.4s ease;
`

const TechItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.gradient.primary};
  color: white;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.theme.shadows.md};
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`

const TechStackContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible: boolean }>`
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? 0 : 20}px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${props => props.isVisible ? fadeInUp : 'none'} 0.6s ease-out;
`

const ColumnCard = styled.div<{ $isHovered: boolean; $animationType: 'right' | 'both' | 'left' }>`
  /* Performance optimization */
  will-change: transform;
  transform: translateZ(0); /* Force GPU acceleration */
  position: relative;
  height: 500px;
  background: ${props => props.theme.colors.surface};
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-12px) scale(1.02) translateZ(0);
    box-shadow: ${props => props.theme.shadows['2xl']};
    border-color: ${props => props.theme.colors.primary[400]};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.gradient.primary};
    opacity: 0.05;
    z-index: 1;
  }

  @media (max-width: 1024px) {
    height: 420px;
  }

  @media (max-width: 768px) {
    height: 380px;
  }
`

const CardContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 2;
  background: ${props => props.theme.colors.glass.light};
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 36px;
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

const CardIcon = styled.div`
  font-size: 64px;
  margin-bottom: 32px;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 56px;
    margin-bottom: 24px;
  }
`

const CardDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 32px;
  max-width: 280px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 24px;
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

  const getCurrentTechStack = () => {
    if (!hoveredColumn) return []
    const column = projectData.find(p => p.id === hoveredColumn)
    return column?.techStack || []
  }

  const getCurrentTitle = () => {
    if (!hoveredColumn) return t('showcase.techStack.default')
    const column = projectData.find(p => p.id === hoveredColumn)
    return t(`showcase.techStack.${column?.id}`)
  }

  return (
    <Section>
      <Container>
        <SectionTitle>
          {t('showcase.title')}
        </SectionTitle>
        <SectionSubtitle>
          {t('showcase.subtitle')}
        </SectionSubtitle>
        
        <Grid role="list" aria-label="Project showcase categories">
          {projectData.map((project, index) => (
            <ColumnCard
              key={project.id}
              $isHovered={hoveredColumn === project.id || tappedColumn === project.id}
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
              aria-expanded={hoveredColumn === project.id || tappedColumn === project.id}
            >
              <CardContent>
                <CardIcon aria-hidden="true">{project.icon}</CardIcon>
                <CardTitle>
                  {project.title}
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardContent>
            </ColumnCard>
          ))}
        </Grid>

        <TechStackContainer 
          isVisible={hoveredColumn !== null}
          role="region"
          aria-label="Technology stack"
          aria-live="polite"
        >
          <TechStackContent isVisible={hoveredColumn !== null}>
            <TechStackTitle>{getCurrentTitle()}</TechStackTitle>
            <TechStackGrid role="list" aria-label="Technologies">
              {getCurrentTechStack().map((tech, index) => (
                <TechItem 
                  key={`${hoveredColumn}-${tech}-${index}`}
                  role="listitem"
                  aria-label={tech}
                >
                  {tech}
                </TechItem>
              ))}
            </TechStackGrid>
          </TechStackContent>
        </TechStackContainer>
      </Container>
    </Section>
  )
}
