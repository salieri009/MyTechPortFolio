import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { ErrorMessage } from './ErrorMessage'
import theme from '@styles/theme'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ErrorMessage Component', () => {
  it('TC-FU-037: should render error message', () => {
    renderWithTheme(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('TC-FU-038: should render with title when provided', () => {
    renderWithTheme(
      <ErrorMessage title="Error" message="Something went wrong" />
    )
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})

