import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckMarkIcon } from '@components/icons/CheckMarkIcon'

/**
 * Nielsen's Heuristics Compliance:
 * H1: Visibility of System Status - Shows current language and available options
 * H4: Consistency & Standards - Standard dropdown pattern
 * H6: Recognition Rather Than Recall - All options visible, no need to remember gestures
 * H7: Flexibility & Efficiency - Keyboard accessible
 * Accessibility: Full keyboard navigation, ARIA labels, screen reader support
 */

const SwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`

const CurrentLanguageButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${props => props.$isOpen 
    ? props.theme.colors.primary[600] 
    : props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  justify-content: space-between;
  
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[300]};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  /* GPU acceleration for smooth animations */
  will-change: transform, background-color;
  transform: translateZ(0);
`

const LanguageFlag = styled.span`
  font-size: 18px;
  line-height: 1;
`

const LanguageName = styled.span`
  flex: 1;
  text-align: left;
`

const DropdownIcon = styled(motion.span)`
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.lg};
  overflow: hidden;
  z-index: 1000;
  margin-top: 4px;
  
  /* GPU acceleration */
  will-change: transform, opacity;
  transform: translateZ(0);
`

const LanguageOption = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.$isActive 
    ? props.theme.colors.primary[50] 
    : 'transparent'};
  color: ${props => props.theme.colors.text};
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.$isActive 
      ? props.theme.colors.primary[100] 
      : props.theme.colors.neutral[50]};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: -2px;
    background: ${props => props.theme.colors.primary[50]};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  /* GPU acceleration */
  will-change: transform, background-color;
  transform: translateZ(0);
`

const LanguageOptionFlag = styled.span`
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
`

const LanguageOptionName = styled.span`
  flex: 1;
  font-weight: ${props => props.$isActive ? 600 : 400};
  color: ${props => props.$isActive 
    ? props.theme.colors.primary[700] 
    : props.theme.colors.text};
`

const CheckIconWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' }
]

interface LanguageSwitcherProps {
  className?: string
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      const currentIndex = languages.findIndex(lang => lang.code === i18n.language)
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          newIndex = (currentIndex + 1) % languages.length
          i18n.changeLanguage(languages[newIndex].code)
          break
        case 'ArrowUp':
          event.preventDefault()
          newIndex = currentIndex === 0 ? languages.length - 1 : currentIndex - 1
          i18n.changeLanguage(languages[newIndex].code)
          break
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          buttonRef.current?.focus()
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          setIsOpen(false)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, i18n])

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  const toggleDropdown = () => {
    setIsOpen(prev => !prev)
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  }

  return (
    <SwitcherContainer 
      ref={containerRef}
      className={className}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label="Language selector"
    >
      <CurrentLanguageButton
        ref={buttonRef}
        $isOpen={isOpen}
        onClick={toggleDropdown}
        aria-label={`Current language: ${currentLanguage.nativeName}. Click to change language.`}
        aria-expanded={isOpen}
        aria-controls="language-menu"
        id="language-button"
      >
        <LanguageFlag>{currentLanguage.flag}</LanguageFlag>
        <LanguageName>{currentLanguage.nativeName}</LanguageName>
        <DropdownIcon
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </DropdownIcon>
      </CurrentLanguageButton>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            id="language-menu"
            role="listbox"
            aria-labelledby="language-button"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
          >
            {languages.map((language) => (
              <LanguageOption
                key={language.code}
                $isActive={language.code === i18n.language}
                onClick={() => handleLanguageChange(language.code)}
                role="option"
                aria-selected={language.code === i18n.language}
                aria-label={`Select ${language.nativeName} (${language.name})`}
              >
                <LanguageOptionFlag>{language.flag}</LanguageOptionFlag>
                <LanguageOptionName $isActive={language.code === i18n.language}>
                  {language.nativeName}
                </LanguageOptionName>
                {language.code === i18n.language && (
                  <CheckIconWrapper aria-hidden="true">
                    <CheckMarkIcon size={16} />
                  </CheckIconWrapper>
                )}
              </LanguageOption>
            ))}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </SwitcherContainer>
  )
}

