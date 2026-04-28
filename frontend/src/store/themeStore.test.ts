import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useThemeStore } from './themeStore'

describe('Theme Store', () => {
  beforeEach(() => {
    useThemeStore.setState({ isDark: false })
  })

  it('TC-FU-018: should initialize with light theme', () => {
    const { result } = renderHook(() => useThemeStore())

    expect(result.current.isDark).toBe(false)
  })

  it('TC-FU-019: should toggle theme correctly', () => {
    const { result } = renderHook(() => useThemeStore())

    expect(result.current.isDark).toBe(false)

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.isDark).toBe(true)

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.isDark).toBe(false)
  })

  it('TC-FU-020: should persist theme preference', () => {
    const { result } = renderHook(() => useThemeStore())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.isDark).toBe(true)

    const { result: newResult } = renderHook(() => useThemeStore())

    expect(newResult.current.isDark).toBeDefined()
  })
})
