import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const TypingText = styled.span`
  &::after {
    content: '|';
    animation: blink 1s infinite;
    margin-left: 2px;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`

interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  className?: string
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 100, 
  delay = 0,
  className 
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      return
    }

    const timer = setTimeout(() => {
      setDisplayText(text.slice(0, currentIndex + 1))
      setCurrentIndex(currentIndex + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, isTyping])

  return (
    <TypingText className={className}>
      {displayText}
    </TypingText>
  )
}
