import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

/**
 * TechStackProgression Component (Molecule)
 * Visualizes skill progression over time with progress bars grouped by category
 * Nielsen Heuristic #1: Visibility of System Status
 * Nielsen Heuristic #6: Recognition Rather Than Recall
 */

interface SkillLevel {
  name: string
  level: number // 1-5
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Other'
}

interface TechStackProgressionProps {
  skills: SkillLevel[]
  className?: string
}

const Container = styled.div`
  margin-top: 16px;
  
  @media (max-width: 768px) {
    margin-top: 12px;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const SkillItem = styled.div<{ $isHovered: boolean; $isVisible: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  transition: all 0.2s ease;
  cursor: pointer;
  will-change: transform, background-color;
  transform: translateZ(0);
  
  ${props => props.$isHovered && `
    background: ${props.theme.colors.primary[50]};
    padding-left: 4px;
    padding-right: 4px;
  `}
  
  ${props => props.theme.mode === 'dark' && props.$isHovered && `
    background: ${props.theme.colors.primary[900]};
  `}
`

const SkillName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  min-width: 120px;
  flex-shrink: 0;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  @media (max-width: 768px) {
    min-width: 100px;
    font-size: 11px;
  }
`

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 8px;
  background: ${props => props.theme.colors.neutral[200]};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.neutral[700]};
  `}
`

const ProgressBar = styled.div<{ $level: number; $isHovered: boolean; $isVisible: boolean }>`
  height: 100%;
  width: ${props => props.$isVisible ? (props.$level / 5) * 100 : 0}%;
  background: ${props => {
    const { $level } = props
    // 색상 농도로 proficiency 표현
    if ($level <= 2) {
      return props.theme.colors.primary[300]
    } else if ($level === 3) {
      return props.theme.colors.primary[500]
    } else if ($level === 4) {
      return props.theme.colors.primary[600]
    } else {
      return props.theme.colors.primary[700]
    }
  }};
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.3s ease;
  will-change: width;
  transform: translateZ(0);
`

const SkillLevel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 35px;
  text-align: right;
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const getLevelLabel = (level: number): string => {
  switch (level) {
    case 1:
      return 'Novice'
    case 2:
      return 'Beginner'
    case 3:
      return 'Intermediate'
    case 4:
      return 'Advanced'
    case 5:
      return 'Expert'
    default:
      return 'Unknown'
  }
}

export const TechStackProgression: React.FC<TechStackProgressionProps> = ({
  skills,
  className
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!skills || skills.length === 0) {
    return null
  }

  // Sort skills by level (descending) for better visual hierarchy
  const sortedSkills = [...skills].sort((a, b) => b.level - a.level)

  return (
    <Container ref={containerRef} className={className} aria-label="Technology skill progression">
      <SkillList role="list">
        {sortedSkills.map((skill) => {
          const skillId = skill.name
          const isHovered = hoveredSkill === skillId

          return (
            <SkillItem
              key={skillId}
              $isHovered={isHovered}
              $isVisible={isVisible}
              role="listitem"
              onMouseEnter={() => setHoveredSkill(skillId)}
              onMouseLeave={() => setHoveredSkill(null)}
              aria-label={`${skill.name}: ${getLevelLabel(skill.level)} (${skill.level}/5)`}
            >
              <SkillName>{skill.name}</SkillName>
              <ProgressBarContainer>
                <ProgressBar 
                  $level={skill.level} 
                  $isHovered={isHovered} 
                  $isVisible={isVisible}
                />
              </ProgressBarContainer>
              <SkillLevel>{skill.level}/5</SkillLevel>
            </SkillItem>
          )
        })}
      </SkillList>
    </Container>
  )
}

