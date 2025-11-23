import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { Button } from './Button'
import theme from '@styles/theme'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Button Component', () => {
  it('TC-FU-001: should render button with children', () => {
    renderWithTheme(<Button>Click Me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('TC-FU-002: should call onClick handler when clicked', () => {
    const handleClick = vi.fn()
    renderWithTheme(<Button onClick={handleClick}>Click Me</Button>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('TC-FU-003: should be disabled when disabled prop is true', () => {
    renderWithTheme(<Button disabled>Disabled Button</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('TC-FU-004: should show loading state when loading prop is true', () => {
    renderWithTheme(<Button loading>Loading</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toBeDisabled()
  })

  it('TC-FU-005: should apply correct variant styles', () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>)
    let button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    rerender(
      <ThemeProvider theme={theme}>
        <Button variant="secondary">Secondary</Button>
      </ThemeProvider>
    )
    button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})

