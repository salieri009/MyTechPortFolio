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

const MetricValue = styled.span<{ $isAnimating: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[600]};
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  transition: text-shadow 0.05s ease;
  
  ${props => props.$isAnimating && `
    text-shadow: 0 0 8px ${props.theme.colors.primary[500]};
  `}
  
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

const useCountUp = (target: number, duration: number = 2000, isVisible: boolean): { count: number; isAnimating: boolean } => {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastCountRef = useRef(0)

  useEffect(() => {
    if (!isVisible || target === 0) {
      setCount(0)
      setIsAnimating(false)
      return
    }

    setIsAnimating(true)
    lastCountRef.current = 0

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOut * target)
      
      // 숫자가 변경될 때만 깜빡임 효과
      if (currentCount !== lastCountRef.current) {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 50)
        lastCountRef.current = currentCount
      }
      
      setCount(currentCount)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(target)
        setIsAnimating(false)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      startTimeRef.current = null
      setIsAnimating(false)
    }
  }, [target, duration, isVisible])

  return { count, isAnimating }
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

  const projectsResult = useCountUp(projectCount, 1500, isVisible)
  const linesResult = useCountUp(codeMetrics?.linesOfCode || 0, 2000, isVisible)
  const commitsResult = useCountUp(codeMetrics?.commits || 0, 2000, isVisible)
  const reposResult = useCountUp(codeMetrics?.repositories || 0, 1500, isVisible)

  const hasMetrics = projectCount > 0 || codeMetrics

  if (!hasMetrics) {
    return null
  }

  return (
    <MetricsContainer ref={containerRef} className={className} role="group" aria-label="Milestone metrics">
      {projectCount > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${projectsResult.count} projects completed`}>
          <MetricIcon>📁</MetricIcon>
          <MetricValue $isAnimating={projectsResult.isAnimating}>{projectsResult.count}</MetricValue>
          <MetricLabel>Projects</MetricLabel>
        </MetricBadge>
      )}
      
      {codeMetrics?.linesOfCode && codeMetrics.linesOfCode > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${formatNumber(linesResult.count)} lines of code`}>
          <MetricIcon>💻</MetricIcon>
          <MetricValue $isAnimating={linesResult.isAnimating}>{formatNumber(linesResult.count)}</MetricValue>
          <MetricLabel>Lines</MetricLabel>
        </MetricBadge>
      )}
      
      {codeMetrics?.commits && codeMetrics.commits > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${formatNumber(commitsResult.count)} commits`}>
          <MetricIcon>📝</MetricIcon>
          <MetricValue $isAnimating={commitsResult.isAnimating}>{formatNumber(commitsResult.count)}</MetricValue>
          <MetricLabel>Commits</MetricLabel>
        </MetricBadge>
      )}
      
      {codeMetrics?.repositories && codeMetrics.repositories > 0 && (
        <MetricBadge $isVisible={isVisible} aria-label={`${reposResult.count} repositories`}>
          <MetricIcon>📦</MetricIcon>
          <MetricValue $isAnimating={reposResult.isAnimating}>{reposResult.count}</MetricValue>
          <MetricLabel>Repos</MetricLabel>
        </MetricBadge>
      )}
    </MetricsContainer>
  )
}

