import React from 'react'
import styled from 'styled-components'

/**
 * SkipToContent Component (Atom)
 * Provides keyboard navigation shortcut to skip to main content
 * WCAG 2.1 Level A - Keyboard Accessible
 * Nielsen Heuristic #7: Flexibility and Efficiency of Use
 */

const SkipLink = styled.a`
  position: absolute;
  top: -100px;
  left: 0;
  background: ${props => props.theme.colors.primary[600]};
  color: white;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  z-index: 10000;
  border-radius: 0 0 ${props => props.theme.radius.md} 0;
  
  &:focus {
    top: 0;
    outline: 3px solid ${props => props.theme.colors.primary[300]};
    outline-offset: 2px;
  }
  
  &:focus:not(:focus-visible) {
    top: -100px;
  }
`

export function SkipToContent() {
  return (
    <SkipLink href="#main-content">
      Skip to main content
    </SkipLink>
  )
}

