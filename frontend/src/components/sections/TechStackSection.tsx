import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { TechCategory, TechIcon } from './TechIcon'

const TechStackContainer = styled.section`
  padding: 100px 0 120px 0;
  text-align: center;
  background: ${props => props.theme.colors.background};
  transition: background-color 0.3s ease;
  min-height: 100vh;
`

const SectionTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  font-weight: 700;
`

const SectionSubtitle = styled.p`
  font-size: 18px;
  margin-bottom: 48px;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
`

const CategorySection = styled.div`
  text-align: left;
`

const CategoryTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: ${props => props.theme.colors.primary[500]};
    border-radius: 2px;
  }
`

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
`

const TechItem = styled.div`
  padding: 20px 16px;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[200]};
  }

  .tech-name {
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    line-height: 1.3;
  }
  
  @media (max-width: 768px) {
    padding: 16px 12px;
    
    .tech-name {
      font-size: 13px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
    
    .tech-name {
      font-size: 12px;
    }
  }
`

// Categorized tech stacks with proper organization
const TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: '🎨',
    technologies: [
      { name: 'React', icon: 'react' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'HTML5', icon: 'html' },
      { name: 'CSS3', icon: 'css' },
      { name: 'Vite', icon: 'vite' },
      { name: 'styled-components', icon: 'styled-components' },
      { name: 'Zustand', icon: 'state-management' },
      { name: 'React Router', icon: 'react-router' },
      { name: 'Three.js', icon: 'threejs' },
      { name: 'i18next', icon: 'i18n' }
    ]
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: '⚙️',
    technologies: [
      { name: 'Spring Boot', icon: 'spring' },
      { name: 'Java', icon: 'java' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'Express.js', icon: 'express' },
      { name: 'REST API', icon: 'api' },
      { name: 'Spring Security', icon: 'security' },
      { name: 'JWT', icon: 'jwt' },
      { name: 'OAuth 2.0', icon: 'oauth' }
    ]
  },
  {
    id: 'database',
    title: 'Database & Storage',
    icon: '💾',
    technologies: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'H2 Database', icon: 'h2' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'JPA/Hibernate', icon: 'hibernate' }
    ]
  },
  {
    id: 'devops',
    title: 'DevOps & Tools',
    icon: '🛠️',
    technologies: [
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Docker', icon: 'docker' },
      { name: 'AWS', icon: 'aws' },
      { name: 'Gradle', icon: 'gradle' },
      { name: 'Maven', icon: 'maven' },
      { name: 'CI/CD', icon: 'cicd' }
    ]
  },
  {
    id: 'tools',
    title: 'Development Tools',
    icon: '🖥️',
    technologies: [
      { name: 'VSCode', icon: 'vscode' },
      { name: 'IntelliJ IDEA', icon: 'intellij' },
      { name: 'Postman', icon: 'postman' },
      { name: 'WebStorm', icon: 'webstorm' },
      { name: 'Figma', icon: 'figma' }
    ]
  }
]

interface TechStackSectionProps {
  className?: string
}

export function TechStackSection({ className }: TechStackSectionProps) {
  const { t } = useTranslation()

  return (
    <TechStackContainer className={className}>
      <SectionTitle>{t('techStack.title', 'Technology Stack')}</SectionTitle>
      <SectionSubtitle>
        {t('techStack.subtitle', 'Technologies and tools I use to build exceptional digital experiences')}
      </SectionSubtitle>
      
      <CategoriesContainer>
        {TECH_CATEGORIES.map((category) => (
          <CategorySection key={category.id}>
            <CategoryTitle>
              <span>{category.icon}</span>
              {t(`techStack.categories.${category.id}`, category.title)}
            </CategoryTitle>
            <TechGrid>
              {category.technologies.map((tech) => (
                <TechItem key={tech.name}>
                  <TechIcon name={tech.icon} size={32} />
                  <span className="tech-name">{tech.name}</span>
                </TechItem>
              ))}
            </TechGrid>
          </CategorySection>
        ))}
      </CategoriesContainer>
    </TechStackContainer>
  )
}
