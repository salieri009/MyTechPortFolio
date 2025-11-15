import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

/**
 * MilestoneMetrics Component (Molecule)
 * Displays project count, code metrics, and GitHub activity statistics
 * Nielsen Heuristic #1: Visibility of System Status
 */

interface CodeMetrics {
  linesOfCode?: number
  commits?: number
  repositories?: number
}

interface MilestoneMetricsProps {
  projectCount: number
  codeMetrics?: CodeMetrics
  className?: string
}

const MetricsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 12px;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`

const MetricBadge = styled.div<{ $isVisible: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary[50]};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.primary[700]};
  transition: all 0.3s ease;
  will-change: transform, opacity;
  transform: translateZ(0);
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.primary[900]};
    color: ${props.theme.colors.primary[300]};
  `}
  
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(10px)'};
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
    gap: 6px;
  }
`

const MetricIcon = styled.span`
  font-size: 16px;
  line-height: 1;
`

const MetricValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[600]};
  
  ${props => props.theme.mode === 'dark' && `
    color: ${props.theme.colors.primary[400]};
  `}
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const MetricLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

const useCountUp = (target: number, duration: number = 2000, isVisible: boolean): number => {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isVisible || target === 0) {
      setCount(0)
      return
    }

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOut * target)
      
      setCount(currentCount)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      startTimeRef.current = null
    }
  }, [target, duration, isVisible])

  return count
}

export const MilestoneMetrics: React.FC<MilestoneMetricsProps> = ({
  projectCount,
  codeMetrics,
  className
}) => {
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
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const projectsCount = useCountUp(projectCount, 1500, isVisible)
  const linesCount = useCountUp(codeMetrics?.linesOfCode || 0, 2000, isVisible)
  const commitsCount = useCountUp(codeMetrics?.commits || 0, 2000, isVisible)
  const reposCount = useCountUp(codeMetrics?.repositories || 0, 1500, isVisible)

  const hasMetrics = projectCount > 0 || codeMetrics

  if (!hasMetrics) {
    return null
  }

  return (
    <MetricsContainer ref={containerRef} className={className} role="group" aria-label="Milestone metrics">
      {projectCount > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${projectsCount} projects completed`}>
          <MetricIcon>📁</MetricIcon>
          <MetricValue>{projectsCount}</MetricValue>
          <MetricLabel>Projects</MetricLabel>
        </MetricBadge>
      )}
      
      {codeMetrics?.linesOfCode && codeMetrics.linesOfCode > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${formatNumber(linesCount)} lines of code`}>
          <MetricIcon>💻</MetricIcon>
          <MetricValue>{formatNumber(linesCount)}</MetricValue>
          <MetricLabel>Lines</MetricLabel>
        </MetricBadge>
      )}
      
      {codeMetrics?.commits && codeMetrics.commits > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${formatNumber(commitsCount)} commits`}>
          <MetricIcon>📝</MetricIcon>
          <MetricValue>{formatNumber(commitsCount)}</MetricValue>
          <MetricLabel>Commits</MetricLabel>
        </MetricBadge>
      )}
      
      {codeMetrics?.repositories && codeMetrics.repositories > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${reposCount} repositories`}>
          <MetricIcon>📦</MetricIcon>
          <MetricValue>{reposCount}</MetricValue>
          <MetricLabel>Repos</MetricLabel>
        </MetricBadge>
      )}
    </MetricsContainer>
  )
}


      {codeMetrics?.repositories && codeMetrics.repositories > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${reposCount} repositories`}>
          <MetricIcon>📦</MetricIcon>
          <MetricValue>{reposCount}</MetricValue>
          <MetricLabel>Repos</MetricLabel>
        </MetricBadge>
      )}
    </MetricsContainer>
  )
}

