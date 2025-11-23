import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { LoadingSpinner } from './LoadingSpinner'
import theme from '@styles/theme'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('LoadingSpinner Component', () => {
  it('TC-FU-034: should render loading spinner', () => {
    renderWithTheme(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('TC-FU-035: should display loading message when provided', () => {
    renderWithTheme(<LoadingSpinner message="Loading projects..." />)
    expect(screen.getByText('Loading projects...')).toBeInTheDocument()
  })

  it('TC-FU-036: should have correct aria-label', () => {
    renderWithTheme(<LoadingSpinner aria-label="Loading content" />)
    const spinner = screen.getByLabelText('Loading content')
    expect(spinner).toBeInTheDocument()
  })
})

