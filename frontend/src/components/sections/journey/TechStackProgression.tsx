import React, { useState } from 'react'
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

const CategoryGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const CategoryTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SkillItem = styled.div<{ $isHovered: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  will-change: transform, background-color;
  transform: translateZ(0);
  
  ${props => props.$isHovered && `
    background: ${props.theme.colors.primary[50]};
    transform: translateX(4px);
  `}
  
  ${props => props.theme.mode === 'dark' && props.$isHovered && `
    background: ${props.theme.colors.primary[900]};
  `}
`

const SkillName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  min-width: 100px;
  flex-shrink: 0;
`

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 6px;
  background: ${props => props.theme.colors.neutral[200]};
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`

const ProgressBar = styled.div<{ $level: number; $isHovered: boolean }>`
  height: 100%;
  width: ${props => (props.$level / 5) * 100}%;
  background: ${props => {
    const { $level } = props
    if ($level <= 2) {
      return props.theme.colors.neutral[400]
    } else if ($level === 3) {
      return props.theme.colors.primary[500]
    } else if ($level === 4) {
      return props.theme.colors.primary[600]
    } else {
      return props.theme.colors.primary[700]
    }
  }};
  border-radius: 3px;
  transition: width 0.6s ease, background 0.3s ease, transform 0.2s ease;
  will-change: width, transform;
  transform: translateZ(0);
  
  ${props => props.$isHovered && `
    transform: scaleY(1.2);
  `}
`

const SkillLevel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 30px;
  text-align: right;
`

const Tooltip = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  box-shadow: ${props => props.theme.shadows.md};
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  transition: opacity 0.2s ease;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${props => props.theme.colors.surface};
  }
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

const groupSkillsByCategory = (skills: SkillLevel[]): Record<string, SkillLevel[]> => {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, SkillLevel[]>)
}

const categoryOrder: SkillLevel['category'][] = ['Frontend', 'Backend', 'Database', 'DevOps', 'Other']

export const TechStackProgression: React.FC<TechStackProgressionProps> = ({
  skills,
  className
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  if (!skills || skills.length === 0) {
    return null
  }

  const groupedSkills = groupSkillsByCategory(skills)

  return (
    <Container className={className} aria-label="Technology skill progression">
      {categoryOrder.map((category) => {
        const categorySkills = groupedSkills[category]
        if (!categorySkills || categorySkills.length === 0) {
          return null
        }

        return (
          <CategoryGroup key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            <SkillList role="list">
              {categorySkills.map((skill) => {
                const skillId = `${category}-${skill.name}`
                const isHovered = hoveredSkill === skillId

                return (
                  <SkillItem
                    key={skillId}
                    $isHovered={isHovered}
                    role="listitem"
                    onMouseEnter={() => setHoveredSkill(skillId)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    aria-label={`${skill.name}: ${getLevelLabel(skill.level)} (${skill.level}/5)`}
                  >
                    <SkillName>{skill.name}</SkillName>
                    <ProgressBarContainer>
                      <ProgressBar $level={skill.level} $isHovered={isHovered} />
                      <Tooltip $isVisible={isHovered}>
                        {skill.name}: {getLevelLabel(skill.level)} ({skill.level}/5)
                      </Tooltip>
                    </ProgressBarContainer>
                    <SkillLevel>{skill.level}/5</SkillLevel>
                  </SkillItem>
                )
              })}
            </SkillList>
          </CategoryGroup>
        )
      })}
    </Container>
  )
}



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

const CategoryGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const CategoryTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SkillItem = styled.div<{ $isHovered: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  will-change: transform, background-color;
  transform: translateZ(0);
  
  ${props => props.$isHovered && `
    background: ${props.theme.colors.primary[50]};
    transform: translateX(4px);
  `}
  
  ${props => props.theme.mode === 'dark' && props.$isHovered && `
    background: ${props.theme.colors.primary[900]};
  `}
`

const SkillName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  min-width: 100px;
  flex-shrink: 0;
`

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 6px;
  background: ${props => props.theme.colors.neutral[200]};
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`

const ProgressBar = styled.div<{ $level: number; $isHovered: boolean }>`
  height: 100%;
  width: ${props => (props.$level / 5) * 100}%;
  background: ${props => {
    const { $level } = props
    if ($level <= 2) {
      return props.theme.colors.neutral[400]
    } else if ($level === 3) {
      return props.theme.colors.primary[500]
    } else if ($level === 4) {
      return props.theme.colors.primary[600]
    } else {
      return props.theme.colors.primary[700]
    }
  }};
  border-radius: 3px;
  transition: width 0.6s ease, background 0.3s ease, transform 0.2s ease;
  will-change: width, transform;
  transform: translateZ(0);
  
  ${props => props.$isHovered && `
    transform: scaleY(1.2);
  `}
`

const SkillLevel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 30px;
  text-align: right;
`

const Tooltip = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  box-shadow: ${props => props.theme.shadows.md};
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  transition: opacity 0.2s ease;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${props => props.theme.colors.surface};
  }
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

const groupSkillsByCategory = (skills: SkillLevel[]): Record<string, SkillLevel[]> => {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, SkillLevel[]>)
}

const categoryOrder: SkillLevel['category'][] = ['Frontend', 'Backend', 'Database', 'DevOps', 'Other']

export const TechStackProgression: React.FC<TechStackProgressionProps> = ({
  skills,
  className
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  if (!skills || skills.length === 0) {
    return null
  }

  const groupedSkills = groupSkillsByCategory(skills)

  return (
    <Container className={className} aria-label="Technology skill progression">
      {categoryOrder.map((category) => {
        const categorySkills = groupedSkills[category]
        if (!categorySkills || categorySkills.length === 0) {
          return null
        }

        return (
          <CategoryGroup key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            <SkillList role="list">
              {categorySkills.map((skill) => {
                const skillId = `${category}-${skill.name}`
                const isHovered = hoveredSkill === skillId

                return (
                  <SkillItem
                    key={skillId}
                    $isHovered={isHovered}
                    role="listitem"
                    onMouseEnter={() => setHoveredSkill(skillId)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    aria-label={`${skill.name}: ${getLevelLabel(skill.level)} (${skill.level}/5)`}
                  >
                    <SkillName>{skill.name}</SkillName>
                    <ProgressBarContainer>
                      <ProgressBar $level={skill.level} $isHovered={isHovered} />
                      <Tooltip $isVisible={isHovered}>
                        {skill.name}: {getLevelLabel(skill.level)} ({skill.level}/5)
                      </Tooltip>
                    </ProgressBarContainer>
                    <SkillLevel>{skill.level}/5</SkillLevel>
                  </SkillItem>
                )
              })}
            </SkillList>
          </CategoryGroup>
        )
      })}
    </Container>
  )
}

