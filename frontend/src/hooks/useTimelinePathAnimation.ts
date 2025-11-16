import { useState, useEffect, RefObject } from 'react'

interface UseTimelinePathAnimationOptions {
  containerRef: RefObject<HTMLElement>
  milestones: Array<{ id: string; element: HTMLElement | null }>
  prefersReducedMotion?: boolean
}

export function useTimelinePathAnimation({
  containerRef,
  milestones,
  prefersReducedMotion = false
}: UseTimelinePathAnimationOptions) {
  const [pathLength, setPathLength] = useState(0)
  const [dashOffset, setDashOffset] = useState(0)
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) {
      setDashOffset(0)
      return
    }

    const calculateProgress = () => {
      if (!containerRef.current) return

      const progressPath = containerRef.current.querySelector('#timeline-progress') as SVGPathElement
      if (!progressPath) return

      const pathLengthValue = progressPath.getTotalLength()
      if (pathLengthValue === 0) return

      if (pathLength === 0) {
        setPathLength(pathLengthValue)
        progressPath.style.strokeDasharray = `${pathLengthValue}`
        progressPath.style.strokeDashoffset = `${pathLengthValue}`
        setDashOffset(pathLengthValue)
      }

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top + window.scrollY
      const containerHeight = container.scrollHeight
      const viewportTop = window.scrollY
      const viewportHeight = window.innerHeight

      let closestMilestone: { id: string; element: HTMLElement } | null = null
      let closestDistance = Infinity

      milestones.forEach(({ id, element }) => {
        if (!element) return
        const rect = element.getBoundingClientRect()
        const milestoneTop = rect.top + window.scrollY
        const distance = Math.abs(milestoneTop - (viewportTop + viewportHeight * 0.3))

        if (distance < closestDistance && milestoneTop <= viewportTop + viewportHeight * 0.5) {
          closestDistance = distance
          closestMilestone = { id, element }
        }
      })

      if (closestMilestone) {
        const milestoneRect = closestMilestone.element.getBoundingClientRect()
        const milestoneTop = milestoneRect.top + window.scrollY
        const progress = Math.max(0, Math.min(1, ((milestoneTop - containerTop) / containerHeight)))
        setDashOffset(pathLengthValue * (1 - progress))
        setActiveMilestone(closestMilestone.id)
      } else {
        const scrollProgress = Math.max(0, Math.min(1, ((viewportTop - containerTop + viewportHeight * 0.3) / containerHeight)))
        setDashOffset(pathLengthValue * (1 - scrollProgress))
      }
    }

    const intervalId = setInterval(() => {
      calculateProgress()
    }, 100)

    window.addEventListener('scroll', calculateProgress, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })

    calculateProgress()

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('scroll', calculateProgress)
      window.removeEventListener('resize', calculateProgress)
    }
  }, [containerRef, milestones, prefersReducedMotion, pathLength])

  return { pathLength, dashOffset, activeMilestone }
}

