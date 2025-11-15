/**
 * Performance Utilities
 * Helper functions for performance monitoring and optimization
 */

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Measure performance of a function
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  if (typeof performance === 'undefined' || !performance.mark) {
    return fn()
  }

  const startMark = `${name}-start`
  const endMark = `${name}-end`
  const measureName = `${name}-measure`

  performance.mark(startMark)
  const result = fn()
  performance.mark(endMark)
  performance.measure(measureName, startMark, endMark)

  const measure = performance.getEntriesByName(measureName)[0]
  console.log(`${name} took ${measure.duration.toFixed(2)}ms`)

  performance.clearMarks(startMark)
  performance.clearMarks(endMark)
  performance.clearMeasures(measureName)

  return result
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src
            observer.unobserve(img)
          }
        })
      },
      { rootMargin: '50px' }
    )
    observer.observe(img)
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = src
  }
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

/**
 * Prefetch resources for faster navigation
 */
export function prefetchResource(href: string): void {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

