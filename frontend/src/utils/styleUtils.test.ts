import { describe, it, expect } from 'vitest'
import { getResponsiveValue, getResponsiveFontSize, getColor } from './styleUtils'
import theme from '@styles/theme'

describe('Style Utils', () => {
  it('TC-FU-021: should generate responsive CSS with mobile value', () => {
    const css = getResponsiveValue('10px')
    expect(css).toContain('10px')
  })

  it('TC-FU-022: should generate responsive CSS with tablet breakpoint', () => {
    const css = getResponsiveValue('10px', '20px')
    expect(css).toContain('@media (min-width: 768px)')
    expect(css).toContain('20px')
  })

  it('TC-FU-023: should generate responsive font size with clamp', () => {
    const fontSize = getResponsiveFontSize(14, 16, 18)
    expect(fontSize).toBe('clamp(14px, 16px, 18px)')
  })

  it('TC-FU-024: should get color from theme by path', () => {
    const color = getColor('primary.500', theme)
    expect(color).toBeDefined()
    expect(typeof color).toBe('string')
  })

  it('TC-FU-025: should return fallback color for invalid path', () => {
    const color = getColor('invalid.path', theme)
    expect(color).toBe('#000000')
  })
})

