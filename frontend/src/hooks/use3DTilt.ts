import { useState, useRef, useEffect, RefObject } from 'react'

interface Use3DTiltOptions {
  maxTilt?: number // 최대 기울기 각도 (도)
  perspective?: number // 3D 원근감
  scale?: number // 호버 시 확대 비율
}

interface Use3DTiltReturn {
  ref: (node: HTMLDivElement | null) => void
  style: React.CSSProperties
}

/**
 * 3D Tilt Effect Hook
 * 마우스 위치에 따라 카드가 미세하게 기울어지는 효과
 */
export function use3DTilt(options: Use3DTiltOptions = {}): Use3DTiltReturn {
  const {
    maxTilt = 5,
    perspective = 1000,
    scale = 1.02
  } = options

  const elementRef = useRef<HTMLDivElement | null>(null)
  const [transform, setTransform] = useState('')

  const ref = (node: HTMLDivElement | null) => {
    elementRef.current = node
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = ((y - centerY) / centerY) * -maxTilt
      const rotateY = ((x - centerX) / centerX) * maxTilt
      
      setTransform(
        `perspective(${perspective}px) ` +
        `rotateX(${rotateX}deg) ` +
        `rotateY(${rotateY}deg) ` +
        `scale(${scale}) ` +
        `translateZ(0)`
      )
    }

    const handleMouseLeave = () => {
      setTransform(
        `perspective(${perspective}px) ` +
        `rotateX(0deg) ` +
        `rotateY(0deg) ` +
        `scale(1) ` +
        `translateZ(0)`
      )
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [maxTilt, perspective, scale])

  return {
    ref,
    style: {
      transform,
      transition: 'transform 0.1s ease-out',
      willChange: 'transform'
    }
  }
}

