import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useThemeStore } from './themeStore'

describe('Theme Store', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'dark', isDark: true })
  })

  it('TC-FU-018: should initialize with dark mode', () => {
    const { result } = renderHook(() => useThemeStore())

    expect(result.current.mode).toBe('dark')
    expect(result.current.isDark).toBe(true)
  })

  it('TC-FU-019: should toggle between dark and eva modes', () => {
    const { result } = renderHook(() => useThemeStore())

    expect(result.current.mode).toBe('dark')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.mode).toBe('eva')
    expect(result.current.isDark).toBe(true)

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.mode).toBe('dark')
    expect(result.current.isDark).toBe(true)
  })

  it('TC-FU-020: should allow setMode', () => {
    const { result } = renderHook(() => useThemeStore())

    act(() => {
      result.current.setMode('eva')
    })

    expect(result.current.mode).toBe('eva')
    expect(result.current.isDark).toBe(true)

    const { result: second } = renderHook(() => useThemeStore())
    expect(second.current.mode).toBe('eva')
  })
})
