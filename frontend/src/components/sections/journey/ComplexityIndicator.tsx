import React from 'react'
import styled from 'styled-components'

/**
 * ComplexityIndicator Component (Molecule)
 * Displays technical complexity level (1-5) as a progress bar
 * Nielsen Heuristic #1: Visibility of System Status
 */

interface ComplexityIndicatorProps {
  complexity: number // 1-5
  className?: string
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  
  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 8px;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
`

const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 80px;
  
  @media (max-width: 768px) {
    min-width: 60px;
    font-size: 11px;
  }
`

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 4px;
  background: ${props => props.theme.colors.neutral[200]};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`

const ProgressBar = styled.div<{ $level: number; $complexity: number }>`
  height: 100%;
  width: ${props => (props.$complexity / 5) * 100}%;
  background: ${props => {
    const { $complexity } = props
    if ($complexity <= 2) {
      return props.theme.colors.neutral[400] // 초급: 회색
    } else if ($complexity === 3) {
      return props.theme.colors.primary[500] // 중급: 파란색
    } else if ($complexity === 4) {
      return props.theme.colors.secondary[500] || '#8B5CF6' // 고급: 보라색
    } else {
      return '#F59E0B' // 전문가: 금색
    }
  }};
  border-radius: 2px;
  transition: width 0.6s ease, background 0.3s ease;
  will-change: width;
  transform: translateZ(0);
`

const LevelText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 40px;
  text-align: right;
`

const getComplexityLabel = (level: number): string => {
  switch (level) {
    case 1:
      return 'Beginner'
    case 2:
      return 'Basic'
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

export const ComplexityIndicator: React.FC<ComplexityIndicatorProps> = ({
  complexity,
  className
}) => {
  return (
    <Container className={className} aria-label={`Technical complexity: ${getComplexityLabel(complexity)}`}>
      <Label>Complexity</Label>
      <ProgressBarContainer role="progressbar" aria-valuenow={complexity} aria-valuemin={1} aria-valuemax={5}>
        <ProgressBar $level={complexity} $complexity={complexity} />
      </ProgressBarContainer>
      <LevelText>{getComplexityLabel(complexity)}</LevelText>
    </Container>
  )
}

