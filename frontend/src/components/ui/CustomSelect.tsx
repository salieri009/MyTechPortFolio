import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { CheckMarkIcon } from '@components/icons/CheckMarkIcon'

/**
 * CustomSelect Component
 * 디자인 시스템에 맞는 커스텀 드롭다운 컴포넌트
 * A11y: 키보드 네비게이션, ARIA 속성 지원
 */

const SelectContainer = styled.div`
  position: relative;
  min-width: ${props => props.theme.spacing[40]}; /* 160px */
`

const SelectTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$isOpen'
})<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]}; /* 8px 12px */
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Hover */
  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    background: ${props => props.theme.colors.primary[50]};
  }
  
  /* Focus */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  /* Open state */
  ${props => props.$isOpen && `
    border-color: ${props.theme.colors.primary[500]};
    box-shadow: 0 0 0 ${props.theme.spacing[0.75]} ${props.theme.colors.primary[500]}20;
  `}
  
  @media (prefers-reduced-motion: reduce) {
    transition: border-color 0.2s ease, background 0.2s ease;
  }
`

const SelectValue = styled.span`
  flex: 1;
  text-align: left;
`

const SelectIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$isOpen'
})<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  margin-left: ${props => props.theme.spacing[2]}; /* 8px */
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  
  &::after {
    content: '▼';
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`

const SelectDropdown = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isOpen'
})<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${props => props.theme.spacing[1]}); /* 4px */
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: ${props => props.theme.zIndex?.popover || 1500}; /* theme.zIndex.popover 사용 (1500) - FilterBar(z-index: 100) 위에 표시 */
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : `translateY(-${props.theme.spacing[2]})`};
  transition: all 0.2s ease;
  max-height: ${props => props.theme.spacing[100]}; /* 400px */
  overflow-y: auto;
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.2s ease, visibility 0.2s ease;
    transform: none;
  }
`

const SelectOption = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$isSelected' && prop !== '$isFocused'
})<{ $isSelected?: boolean; $isFocused?: boolean }>`
  display: block;
  width: 100%;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]}; /* 8px 12px */
  text-align: left;
  border: none;
  background: ${props => {
    if (props.$isSelected) return props.theme.colors.primary[50]
    if (props.$isFocused) return props.theme.colors.primary[50]
    return 'transparent'
  }};
  color: ${props => props.$isSelected ? props.theme.colors.primary[700] : props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  cursor: pointer;
  transition: background 0.15s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: -2px;
  }
  
  /* Selected indicator - removed, using CheckMarkIcon component instead */
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.15s ease;
  }
`

interface CustomSelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  options: CustomSelectOption[]
  onChange: (value: string) => void
  ariaLabel?: string
  placeholder?: string
}

export function CustomSelect({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = 'Select...'
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)
  const displayValue = selectedOption?.label || placeholder

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(null)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
        setFocusedIndex(0)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev === null ? 0 : Math.min(prev + 1, options.length - 1)
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev === null ? options.length - 1 : Math.max(prev - 1, 0)
        )
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex !== null) {
          handleSelect(options[focusedIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(null)
        triggerRef.current?.focus()
        break
    }
  }

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setIsOpen(false)
    setFocusedIndex(null)
    triggerRef.current?.focus()
  }

  return (
    <SelectContainer ref={containerRef}>
      <SelectTrigger
        ref={triggerRef}
        $isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <SelectValue>{displayValue}</SelectValue>
        <SelectIcon $isOpen={isOpen} aria-hidden="true" />
      </SelectTrigger>
      
      <SelectDropdown
        ref={dropdownRef}
        $isOpen={isOpen}
        role="listbox"
        aria-label={ariaLabel}
      >
        {options.map((option, index) => (
          <SelectOption
            key={option.value}
            $isSelected={option.value === value}
            $isFocused={focusedIndex === index}
            onClick={() => handleSelect(option.value)}
            onMouseEnter={() => setFocusedIndex(index)}
            role="option"
            aria-selected={option.value === value}
            id={`option-${option.value}`}
          >
            {option.value === value && (
              <CheckMarkIcon size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
            )}
            {option.label}
          </SelectOption>
        ))}
      </SelectDropdown>
    </SelectContainer>
  )
}

