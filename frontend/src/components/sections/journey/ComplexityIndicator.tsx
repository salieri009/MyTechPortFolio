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
  gap: 12px;
  margin-top: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
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

const BarGraphContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  flex: 1;
`

const BarSegment = styled.div<{ $isActive: boolean }>`
  flex: 1;
  height: 16px;
  background: ${props => props.$isActive 
    ? props.theme.colors.primary[500] 
    : props.theme.colors.neutral[200]};
  transition: background 0.3s ease;
  border-radius: 0;
  
  ${props => props.theme.mode === 'dark' && !props.$isActive && `
    background: ${props.theme.colors.neutral[700]};
  `}
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
      <BarGraphContainer role="progressbar" aria-valuenow={complexity} aria-valuemin={1} aria-valuemax={5}>
        {[1, 2, 3, 4, 5].map((level) => (
          <BarSegment 
            key={level} 
            $isActive={level <= complexity}
            aria-label={level <= complexity ? 'Active' : 'Inactive'}
          />
        ))}
      </BarGraphContainer>
    </Container>
  )
}

