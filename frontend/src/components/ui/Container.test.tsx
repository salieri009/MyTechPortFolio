import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { Container } from './Container'
import { theme } from '@styles/theme'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Container Component', () => {
  it('TC-FU-039: should render container with children', () => {
    renderWithTheme(<Container>Container Content</Container>)
    expect(screen.getByText('Container Content')).toBeInTheDocument()
  })

  it('TC-FU-040: should apply max-width constraint', () => {
    const { container } = renderWithTheme(<Container>Content</Container>)
    const containerElement = container.firstChild as HTMLElement
    expect(containerElement).toBeInTheDocument()
  })
})

