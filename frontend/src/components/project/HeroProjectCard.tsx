import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useProjectAnalytics } from '../../hooks/useAnalytics'

const HeroCardWrapper = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  grid-column: 1 / -1;
  
  &:hover {
    text-decoration: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${props => props.theme.radius['2xl']};
  }
  
  @media (max-width: 1024px) {
    grid-column: 1;
  }
`

const HeroCardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  padding: ${props => props.theme.spacing[8]};
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all 0.3s ease;
  height: 100%;
  min-height: 400px;
  position: relative;
  overflow: hidden;

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
        transparent 20px,
        ${props => props.theme.colors.neutral[props.theme.mode === 'dark' ? 700 : 200]} 20px,
        ${props => props.theme.colors.neutral[props.theme.mode === 'dark' ? 700 : 200]} 40px
      );
    opacity: ${props => props.theme.mode === 'dark' ? 0.05 : 0.03};
    z-index: 0;
    background-size: 40px 40px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows['2xl']};
    border-color: ${props => props.theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
    padding: ${props => props.theme.spacing[6]};
    min-height: auto;
  }
`

const HeroImageContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: ${props => props.theme.radius.lg};
  overflow: hidden;
  background: ${props => props.theme.colors.neutral[props.theme.mode === 'dark' ? 800 : 200]};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    min-height: 200px;
  }
`

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform;
  transform: translateZ(0);

  ${HeroCardWrapper}:hover & {
    transform: scale(1.05);
  }
`

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`

const HeroBadge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-transform: uppercase;
  margin-bottom: ${props => props.theme.spacing[4]};
  width: fit-content;
  letter-spacing: 0.1em;
`

const HeroTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  line-height: ${props => props.theme.typography.lineHeight.tight};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
  }
`

const HeroSummary = styled.p`
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`

const HeroMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[6]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
`

const HeroTechStacks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[6]};
`

const HeroTechTag = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.mode === 'dark' 
    ? props.theme.colors.neutral[800] 
    : props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  border: 1px solid ${props => props.theme.colors.border};
`

const HeroCTA = styled.div`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: transparent;
  color: ${props => props.theme.colors.primary[500]};
  border: 2px solid ${props => props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.radius.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  text-align: center;
  transition: all 0.2s ease;

  ${HeroCardWrapper}:hover & {
    background: ${props => props.theme.colors.primary[500]};
    color: white;
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
`

interface HeroProjectCardProps {
  id: number
  title: string
  summary: string
  startDate: string
  endDate: string
  techStacks: string[]
  imageUrl?: string
}

export function HeroProjectCard({
  id,
  title,
  summary,
  startDate,
  endDate,
  techStacks,
  imageUrl
}: HeroProjectCardProps) {
  const { t } = useTranslation()
  const { trackView } = useProjectAnalytics()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short'
    })
  }

  const handleProjectClick = () => {
    trackView(id, title, techStacks)
  }

  return (
    <HeroCardWrapper to={`/projects/${id}`} onClick={handleProjectClick}>
      <HeroCardContainer>
        {imageUrl && (
          <HeroImageContainer>
            <HeroImage src={imageUrl} alt={t(title)} loading="lazy" />
          </HeroImageContainer>
        )}
        <HeroContent>
          <div>
            <HeroBadge>Featured Project</HeroBadge>
            <HeroTitle>{t(title)}</HeroTitle>
            <HeroSummary>{t(summary)}</HeroSummary>
            <HeroMeta>
              <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
            </HeroMeta>
            <HeroTechStacks>
            {techStacks.slice(0, 3).map((tech) => (
              <HeroTechTag key={tech}>{tech}</HeroTechTag>
            ))}
            {techStacks.length > 3 && (
              <HeroTechTag aria-label={`${techStacks.length - 3} more technologies`}>
                +{techStacks.length - 3}
              </HeroTechTag>
            )}
            </HeroTechStacks>
          </div>
          <HeroCTA>View Project</HeroCTA>
        </HeroContent>
      </HeroCardContainer>
    </HeroCardWrapper>
  )
}

