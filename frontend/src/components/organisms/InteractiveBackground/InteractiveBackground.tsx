import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

/**
 * InteractiveBackground Component (Organism)
 * Canvas-based interactive background animation
 * Inspired by hiremind.work landing page style
 * Nielsen Heuristic #1: Visibility of System Status - Subtle animation feedback
 * Nielsen Heuristic #8: Aesthetic and Minimalist Design - Non-intrusive background
 */

const CanvasContainer = styled.canvas<{ $isDark: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: ${props => props.$isDark ? 0.5 : 0.6};
  pointer-events: none;
  transition: opacity 0.3s ease;
`

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

interface InteractiveBackgroundProps {
  isDark?: boolean
  particleCount?: number
  connectionDistance?: number
  className?: string
}

export function InteractiveBackground({
  isDark = false,
  particleCount = 50,
  connectionDistance = 150,
  className
}: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      
      // Resize 시 파티클 재배치 (전체 화면에 고르게 분포)
      if (particlesRef.current.length > 0) {
        const colors = isDark 
          ? ['rgba(79, 172, 254, 0.8)', 'rgba(0, 242, 254, 0.8)', 'rgba(120, 119, 198, 0.8)']
          : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.7)']
        
        particlesRef.current = particlesRef.current.map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        }))
      }
    }

    // 초기 캔버스 크기 설정 (약간의 지연으로 확실히 설정)
    const initCanvas = () => {
      resizeCanvas()
      
      // Create particles - 전체 화면에 고르게 분포
      const colors = isDark 
        ? ['rgba(79, 172, 254, 0.8)', 'rgba(0, 242, 254, 0.8)', 'rgba(120, 119, 198, 0.8)']
        : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.7)']

      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 4 + 2, // 크기 범위를 2-6으로 확장
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    }

    // 다음 프레임에서 초기화하여 canvas 크기가 확실히 설정된 후 실행
    requestAnimationFrame(initCanvas)
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isDark, particleCount])

  // Animation loop with performance optimization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true // Better performance
    })
    if (!ctx) return

    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      // Throttle to target FPS
      if (currentTime - lastTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx -= (dx / distance) * force * 0.02
          particle.vy -= (dy / distance) * force * 0.02
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Draw connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * (isDark ? 0.5 : 0.5)
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = isDark 
              ? `rgba(79, 172, 254, ${opacity})`
              : `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = isDark ? 1.5 : 1.5
            ctx.stroke()
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    if (isVisible) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isDark, connectionDistance, isVisible])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Performance optimization: pause when not visible or tab is inactive
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting && !document.hidden)
        })
      },
      { threshold: 0 }
    )

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false)
      } else {
        const canvas = canvasRef.current
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          setIsVisible(rect.top < window.innerHeight && rect.bottom > 0)
        }
      }
    }

    const canvas = canvasRef.current
    if (canvas) {
      observer.observe(canvas)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (canvas) {
        observer.unobserve(canvas)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <CanvasContainer
      ref={canvasRef}
      $isDark={isDark}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  )
}

