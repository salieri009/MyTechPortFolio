import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('TC-FU-009: should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('TC-FU-010: should debounce value updates', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 }
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 300 })
    expect(result.current).toBe('initial')

    vi.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(result.current).toBe('updated')
    })
  })

  it('TC-FU-011: should cancel previous timeout when value changes rapidly', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    )

    rerender({ value: 'second' })
    vi.advanceTimersByTime(100)
    
    rerender({ value: 'third' })
    vi.advanceTimersByTime(100)
    
    rerender({ value: 'fourth' })
    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(result.current).toBe('fourth')
    })
  })
})

