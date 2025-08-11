import styled from 'styled-components'

export const Button = styled.button<{ variant?: 'primary' | 'ghost'; size?: 'sm' | 'md' | 'lg' }>`
  border: none;
  border-radius: ${(props) => props.theme?.radius?.md || 12}px;
  cursor: pointer;
  font-weight: 500;
  transition: all 120ms ease;

  /* Variants */
  ${(props) => {
    const variant = props.variant || 'primary'
    if (variant === 'primary') {
      return `
        background: ${props.theme?.colors?.primary || '#4F46E5'};
        color: white;
        &:hover {
          background: ${props.theme?.colors?.primaryHover || '#4338CA'};
        }
      `
    }
    return `
      background: transparent;
      color: ${props.theme?.colors?.text || '#0F172A'};
      border: 1px solid ${props.theme?.colors?.border || '#E2E8F0'};
      &:hover {
        background: ${props.theme?.colors?.border || '#E2E8F0'};
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
    outline: 2px solid ${(props) => props.theme?.colors?.accent || '#06B6D4'};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Card = styled.div<{ isHover?: boolean }>`
  background: white;
  border-radius: ${(props) => props.theme?.radius?.md || 12}px;
  box-shadow: ${(props) => props.theme?.shadow?.[1] || '0 2px 8px rgba(0,0,0,.06)'};
  padding: 24px;
  cursor: ${(props) => (props.isHover ? 'pointer' : 'default')};
  transition: all 120ms ease;

  ${(props) =>
    props.isHover &&
    `
    &:hover {
      transform: scale(1.02);
      box-shadow: ${props.theme?.shadow?.[2] || '0 6px 20px rgba(0,0,0,.08)'};
    }
  `}
`

export const Tag = styled.span<{ isSelected?: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${(props) => props.theme?.radius?.sm || 8}px;
  font-size: 14px;
  font-weight: 500;
  transition: all 120ms ease;

  ${(props) => {
    if (props.isSelected) {
      return `
        background: ${props.theme?.colors?.primary || '#4F46E5'};
        color: white;
      `
    }
    return `
      background: ${props.theme?.colors?.border || '#E2E8F0'};
      color: ${props.theme?.colors?.textSecondary || '#334155'};
    `
  }}
`

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: ${(props) => props.theme?.breakpoints?.md || 768}px) {
    padding: 0 16px;
  }
`
