import styled from 'styled-components'

export const Button = styled.button<{ variant?: 'primary' | 'ghost'; size?: 'sm' | 'md' | 'lg' }>`
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: all 120ms ease;

  /* Variants */
  ${(props) => {
    const variant = props.variant || 'primary'
    if (variant === 'primary') {
      return `
        background: ${props.theme.colors.primary[500]};
        color: white;
        &:hover {
          background: ${props.theme.colors.primary[600]};
        }
      `
    }
    return `
      background: transparent;
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover {
        background: ${props.theme.colors.surface};
      }
    `
  }}

  /* Sizes */
  ${(props) => {
    const size = props.size || 'md'
    switch (size) {
      case 'sm':
        return 'padding: 8px 16px; font-size: 14px;'
      case 'lg':
        return 'padding: 16px 32px; font-size: 18px;'
      default:
        return 'padding: 12px 24px; font-size: 16px;'
    }
  }}

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Card = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHover'
})<{ isHover?: boolean }>`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  padding: 24px;
  cursor: ${(props) => (props.isHover ? 'pointer' : 'default')};
  transition: all 120ms ease;
  border: 1px solid ${(props) => props.theme.colors.border};

  ${(props) =>
    props.isHover &&
    `
    &:hover {
      transform: scale(1.02);
      box-shadow: ${props.theme.shadows.lg};
    }
  `}
`

export const Tag = styled.span.withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'isDisabled', 'count'].includes(prop)
})<{ 
  isSelected?: boolean
  isDisabled?: boolean
  count?: number
}>`
  display: inline-block;
  padding: ${props => props.theme.spacing[1.5]} ${props => props.theme.spacing[3]}; /* 6px 12px → 4-point: 8px 12px */
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: all 0.2s ease;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  
  /* 기본: Available (선택 가능) */
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  
  /* Selected: Primary 배경 */
  ${props => props.isSelected && `
    background: ${props.theme.colors.primary[500]};
    border-color: ${props.theme.colors.primary[500]};
    color: ${props.theme.colors.hero?.text || props.theme.colors.neutral[0]};
    font-weight: ${props.theme.typography.fontWeight.semibold};
    box-shadow: 0 0 0 ${props.theme.spacing[0.5]} ${props.theme.colors.primary[200]};
  `}
  
  /* Disabled: 반투명 (결과 0개) */
  ${props => props.isDisabled && `
    opacity: 0.4;
    pointer-events: none;
  `}
  
  /* Hover: Available 상태에서만 */
  ${props => !props.isSelected && !props.isDisabled && `
    &:hover {
      border-color: ${props.theme.colors.primary[300]};
      background: ${props.theme.colors.primary[50]};
      color: ${props.theme.colors.primary[700]};
      transform: translateY(-${props.theme.spacing[0.5]}); /* 4px */
    }
  `}
  
  /* 카운트 표시 (선택적) */
  ${props => props.count !== undefined && `
    &::after {
      content: ' (${props.count})';
      font-size: ${props.theme.typography.fontSize.xs};
      opacity: 0.7;
      margin-left: ${props.theme.spacing[1]};
    }
  `}
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    &:hover {
      transform: none;
    }
  }
`

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`

// Footer 컴포넌트들 re-export
export * from './FooterComponents'

// Skeleton 컴포넌트 re-export
export * from './Skeleton'

// StoryProgressBar 컴포넌트 re-export
export * from './StoryProgressBar'