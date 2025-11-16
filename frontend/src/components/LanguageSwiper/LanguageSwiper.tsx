import React from 'react'
import { useSwipeable } from 'react-swipeable'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const SwipeContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
`

const LanguageIndicator = styled(motion.div)`
  padding: 8px 16px;
  border-radius: 20px;
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 500;
  font-size: 14px;
  min-width: 60px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.md};
`

const SwipeHint = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: ${props => props.theme.colors.neutral[500]};
  opacity: 0.8;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 11px;
    top: -28px;
  }
`

const HintArrow = styled.span`
  color: ${props => props.theme.colors.primary[500]};
  font-weight: 600;
`

interface LanguageSwiperProps {
  className?: string
  showHint?: boolean
}

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
]

export const LanguageSwiper: React.FC<LanguageSwiperProps> = ({ 
  className, 
  showHint = true 
}) => {
  const { i18n, t } = useTranslation()
  
  const currentLanguageIndex = languages.findIndex(lang => lang.code === i18n.language)
  const currentLanguage = languages[currentLanguageIndex] || languages[0]

  const changeLanguage = (direction: 'left' | 'right') => {
    const currentIndex = languages.findIndex(lang => lang.code === i18n.language)
    let newIndex
    
    if (direction === 'right') {
      newIndex = (currentIndex + 1) % languages.length
    } else {
      newIndex = currentIndex === 0 ? languages.length - 1 : currentIndex - 1
    }
    
    i18n.changeLanguage(languages[newIndex].code)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => changeLanguage('right'),
    onSwipedRight: () => changeLanguage('left'),
    trackMouse: true,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: true
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      changeLanguage('left')
    } else if (e.key === 'ArrowRight') {
      changeLanguage('right')
    }
  }

  return (
    <SwipeContainer 
      className={className}
      {...handlers}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${t('common.swipeToChange')}: ${currentLanguage.name}`}
    >
      {showHint && (
        <SwipeHint>
          {currentLanguage.flag} {currentLanguage.name} <HintArrow>←</HintArrow> {t('common.swipeToChange')} <HintArrow>→</HintArrow>
        </SwipeHint>
      )}
      
      <AnimatePresence mode="wait">
        <LanguageIndicator
          key={currentLanguage.code}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          aria-live="polite"
          aria-atomic="true"
        >
          {currentLanguage.flag} {currentLanguage.name}
        </LanguageIndicator>
      </AnimatePresence>
    </SwipeContainer>
  )
}
