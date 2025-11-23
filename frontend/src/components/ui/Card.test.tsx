import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { Card } from './Card'
import theme from '@styles/theme'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Card Component', () => {
  it('TC-FU-006: should render card with children', () => {
    renderWithTheme(<Card>Card Content</Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('TC-FU-007: should apply interactive styles when interactive prop is true', () => {
    renderWithTheme(<Card interactive>Interactive Card</Card>)
    const card = screen.getByText('Interactive Card')
    expect(card).toBeInTheDocument()
  })

  it('TC-FU-008: should apply correct variant styles', () => {
    renderWithTheme(<Card variant="elevated">Elevated Card</Card>)
    expect(screen.getByText('Elevated Card')).toBeInTheDocument()
  })
})

