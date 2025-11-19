import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { TechStackBadge } from './TechStackBadge'
import { theme } from '@styles/theme'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('TechStackBadge Component', () => {
  it('TC-FU-026: should render tech stack badge with name', () => {
    renderWithTheme(<TechStackBadge name="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('TC-FU-027: should call onClick when clickable and clicked', () => {
    const handleClick = vi.fn()
    renderWithTheme(
      <TechStackBadge 
        name="React" 
        clickable 
        onClick={handleClick} 
      />
    )
    
    const badge = screen.getByRole('button')
    fireEvent.click(badge)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('TC-FU-028: should not be clickable when clickable is false', () => {
    renderWithTheme(<TechStackBadge name="React" clickable={false} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

