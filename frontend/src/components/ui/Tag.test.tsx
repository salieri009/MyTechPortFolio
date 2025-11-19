import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { Tag } from './Tag'
import { theme } from '@styles/theme'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Tag Component', () => {
  it('TC-FU-031: should render tag with text', () => {
    renderWithTheme(<Tag>React</Tag>)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('TC-FU-032: should call onClick when provided', () => {
    const handleClick = vi.fn()
    renderWithTheme(<Tag onClick={handleClick}>Clickable Tag</Tag>)
    
    const tag = screen.getByText('Clickable Tag')
    fireEvent.click(tag)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('TC-FU-033: should apply correct variant', () => {
    renderWithTheme(<Tag variant="primary">Primary Tag</Tag>)
    expect(screen.getByText('Primary Tag')).toBeInTheDocument()
  })
})

