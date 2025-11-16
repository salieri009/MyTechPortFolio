import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'

// 최신 타이핑 효과들
const cursorBlink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`

const textShine = keyframes`
  0% {
    background-position: -500%;
  }
  100% {
    background-position: 500%;
  }
`

const charReveal = keyframes`
  0% {
    transform: translateY(100%) rotateX(-90deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) rotateX(0deg);
    opacity: 1;
  }
`

const Container = styled.span`
  display: inline-block;
  position: relative;
`

const TypewriterText = styled.span<{ isComplete: boolean }>`
  display: inline-block;
  background: ${props => props.isComplete ? `
    linear-gradient(
      90deg,
      ${props.theme.colors.primary[500]},
      ${props.theme.colors.primary[600]},
      ${props.theme.colors.primary[500]}
    )
  ` : 'transparent'};
  background-size: 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: ${props => props.isComplete ? 'transparent' : 'inherit'};
  background-clip: text;
  animation: ${props => props.isComplete ? textShine : 'none'} 3s ease-in-out infinite;
`

const Cursor = styled.span<{ isBlinking: boolean }>`
  display: inline-block;
  width: 3px;
  height: 1em;
  background: currentColor;
  margin-left: 2px;
  animation: ${props => props.isBlinking ? cursorBlink : 'none'} 1s infinite;
  vertical-align: text-bottom;
`

const CharSpan = styled.span<{ delay: number }>`
  display: inline-block;
  opacity: 0;
  animation: ${charReveal} 0.1s ease-out forwards;
  animation-delay: ${props => props.delay}ms;
  transform-origin: 50% 100%;
`

interface AdvancedTypewriterProps {
  text: string
  delay?: number
  speed?: number
  showCursor?: boolean
  onComplete?: () => void
  className?: string
  effect?: 'default' | 'reveal' | 'shine' | 'glitch'
}

export function AdvancedTypewriter({
  text,
  delay = 0,
  speed = 50,
  showCursor = true,
  onComplete,
  className,
  effect = 'reveal'
}: AdvancedTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showingCursor, setShowingCursor] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (text) {
      const timer = setTimeout(() => {
        let currentIndex = 0
        
        const typeNextChar = () => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.slice(0, currentIndex))
            currentIndex++
            
            if (currentIndex <= text.length) {
              timeoutRef.current = setTimeout(typeNextChar, speed)
            } else {
              setIsComplete(true)
              if (onComplete) {
                setTimeout(onComplete, 500)
              }
              // 완료 후 커서를 잠시 더 보여주다가 숨김
              setTimeout(() => setShowingCursor(false), 2000)
            }
          }
        }
        
        typeNextChar()
      }, delay)

      return () => {
        clearTimeout(timer)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [text, delay, speed, onComplete])

  const renderText = () => {
    if (effect === 'reveal') {
      return displayedText.split('').map((char, index) => (
        <CharSpan key={index} delay={index * speed}>
          {char === ' ' ? '\u00A0' : char}
        </CharSpan>
      ))
    }
    
    return displayedText
  }

  return (
    <Container className={className}>
      <TypewriterText isComplete={isComplete}>
        {renderText()}
      </TypewriterText>
      {showCursor && showingCursor && <Cursor isBlinking={isComplete} />}
    </Container>
  )
}
