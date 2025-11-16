import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: ${props => props.theme.colors.neutral[200] || props.theme.colors.neutral[100]};
  z-index: 1000;
  pointer-events: none;
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.neutral[800] || props.theme.colors.neutral[700]};
  `}
`

const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.primary[500]},
    ${props => props.theme.colors.primary[600]}
  );
  transition: width 0.1s ease-out;
  box-shadow: 0 0 10px ${props => props.theme.colors.primary[500]}40;
`

export function StoryProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      if (documentHeight <= windowHeight) {
        return 0
      }
      
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      return Math.min(100, Math.max(0, progress))
    }

    const handleScroll = () => {
      setProgress(calculateProgress())
    }

    // 초기 진행도 설정
    setProgress(calculateProgress())

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <ProgressBarContainer 
      role="progressbar" 
      aria-valuenow={Math.round(progress)} 
      aria-valuemin={0} 
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <ProgressBar $progress={progress} />
    </ProgressBarContainer>
  )
}

