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
    outline: 2px solid ${(props) => props.theme.colors.secondary[500]};
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
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected?: boolean }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 14px;
  font-weight: 500;
  transition: all 120ms ease;
  cursor: pointer;

  ${(props) => {
    if (props.isSelected) {
      return `
        background: ${props.theme.colors.primary[500]};
        color: white;
        border: 1px solid ${props.theme.colors.primary[500]};
      `
    }
    // 다크모드 대응을 위한 더 나은 대비
    return `
      background: ${props.theme.colors.surface};
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover {
        background: ${props.theme.colors.primary[500]};
        color: white;
        border-color: ${props.theme.colors.primary[500]};
        transform: translateY(-1px);
      }
    `
  }}
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