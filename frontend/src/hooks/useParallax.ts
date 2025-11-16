import { useState, useRef, useEffect, RefObject } from 'react'

interface UseParallaxOptions {
  intensity?: number // 패럴랙스 강도 (0-1)
  direction?: 'x' | 'y' | 'both'
}

interface UseParallaxReturn {
  ref: RefObject<HTMLDivElement>
  style: React.CSSProperties
}

/**
 * Parallax Effect Hook
 * 마우스 움직임에 따라 이미지가 반응하는 효과
 */
export function useParallax(options: UseParallaxOptions = {}): UseParallaxReturn {
  const {
    intensity = 0.1,
    direction = 'both'
  } = options

  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const moveX = ((x - centerX) / centerX) * intensity * 20
      const moveY = ((y - centerY) / centerY) * intensity * 20
      
      let transformValue = ''
      if (direction === 'x' || direction === 'both') {
        transformValue += `translateX(${moveX}px) `
      }
      if (direction === 'y' || direction === 'both') {
        transformValue += `translateY(${moveY}px) `
      }
      
      setTransform(transformValue.trim())
    }

    const handleMouseLeave = () => {
      setTransform('')
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [intensity, direction])

  return {
    ref,
    style: {
      transform,
      transition: 'transform 0.2s ease-out',
      willChange: 'transform'
    }
  }
}

