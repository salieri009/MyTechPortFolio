import { useCallback, useEffect, useRef, type RefObject } from 'react'
import {
  isEngagementApiEnabled,
  trackProjectEngagement,
  updateProjectEngagement,
} from '../services/engagementApi'
import type { ProjectEngagement, ProjectEngagementTrackPayload } from '../types/engagement'

const engagementStorageKey = (projectId: string) => `pf_engagement:${projectId}`

function getOrCreateVisitorId(): string {
  try {
    let v = sessionStorage.getItem('pf_visitor_id')
    if (!v) {
      v = crypto.randomUUID()
      sessionStorage.setItem('pf_visitor_id', v)
    }
    return v
  } catch {
    return ''
  }
}

function getOrCreateSessionId(): string {
  try {
    let s = sessionStorage.getItem('pf_session_id')
    if (!s) {
      s = crypto.randomUUID()
      sessionStorage.setItem('pf_session_id', s)
    }
    return s
  } catch {
    return crypto.randomUUID()
  }
}

function readStored(projectId: string): { id: string; secret: string } | null {
  try {
    const raw = sessionStorage.getItem(engagementStorageKey(projectId))
    if (!raw) return null
    const o = JSON.parse(raw) as { id: string; secret: string }
    if (o?.id && o?.secret) return o
  } catch {
    /* ignore */
  }
  return null
}

function writeStored(projectId: string, id: string, secret: string) {
  try {
    sessionStorage.setItem(engagementStorageKey(projectId), JSON.stringify({ id, secret }))
  } catch {
    /* ignore */
  }
}

function scrollDepthPercent(scrollRoot: Element): number {
  const scrollTop = scrollRoot.scrollTop
  const scrollHeight = scrollRoot.scrollHeight - scrollRoot.clientHeight
  if (scrollHeight <= 0) return 100
  return Math.min(100, Math.round((scrollTop / scrollHeight) * 100))
}

export interface UseProjectEngagementOptions {
  /** Scrollable element (e.g. modal body). If omitted, uses document.documentElement. */
  scrollContainerRef?: RefObject<HTMLElement | null>
  /** Bump when the scroll container ref attaches (e.g. modal mount) so listeners rebind. */
  scrollMountVersion?: number
}

/**
 * Tracks project view via POST /engagement/track and PATCH updates (scroll, duration, outbound clicks).
 * No-ops when VITE_USE_BACKEND_API is not true.
 */
export function useProjectEngagement(
  projectId: number | string | null | undefined,
  options?: UseProjectEngagementOptions
) {
  const pid = projectId != null ? String(projectId) : null
  const scrollRef = options?.scrollContainerRef
  const scrollMountVersion = options?.scrollMountVersion ?? 0

  const engagementRef = useRef<{ id: string; secret: string } | null>(null)
  const maxScrollRef = useRef(0)
  const startRef = useRef<number | null>(null)
  const githubRef = useRef(false)
  const demoRef = useRef(false)
  const flushInFlight = useRef(false)

  const flush = useCallback(async () => {
    const pair = engagementRef.current
    if (!pair || flushInFlight.current) return
    flushInFlight.current = true
    const viewDuration =
      startRef.current != null ? Math.max(0, Math.round((Date.now() - startRef.current) / 1000)) : undefined
    try {
      await updateProjectEngagement(pair.id, pair.secret, {
        viewDuration,
        scrollDepth: maxScrollRef.current > 0 ? maxScrollRef.current : undefined,
        githubLinkClicked: githubRef.current ? true : undefined,
        demoLinkClicked: demoRef.current ? true : undefined,
      })
    } catch (e) {
      console.warn('engagement update failed', e)
    } finally {
      flushInFlight.current = false
    }
  }, [])

  useEffect(() => {
    if (!pid || !isEngagementApiEnabled()) return

    let cancelled = false

    const run = async () => {
      startRef.current = Date.now()
      maxScrollRef.current = 0
      githubRef.current = false
      demoRef.current = false

      const existing = readStored(pid)
      if (existing) {
        engagementRef.current = existing
        return
      }

      try {
        const body: ProjectEngagementTrackPayload = {
          projectId: pid,
          sessionId: getOrCreateSessionId(),
          visitorId: getOrCreateVisitorId() || undefined,
          referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
          source: 'direct',
          deviceType:
            typeof window !== 'undefined' && window.matchMedia?.('(max-width: 768px)').matches
              ? 'mobile'
              : 'desktop',
        }
        const saved: ProjectEngagement = await trackProjectEngagement(body)
        if (cancelled || !saved?.id || !saved?.updateSecret) return
        engagementRef.current = { id: saved.id, secret: saved.updateSecret }
        writeStored(pid, saved.id, saved.updateSecret)
      } catch (e) {
        console.warn('engagement track failed', e)
      }
    }

    void run()

    return () => {
      cancelled = true
      void flush()
    }
  }, [pid, flush])

  useEffect(() => {
    if (!pid || !isEngagementApiEnabled()) return

    let throttleTimer: ReturnType<typeof setTimeout> | undefined

    const getRoot = (): Element => {
      const custom = scrollRef?.current
      if (custom) return custom
      return document.documentElement
    }

    const onScroll = () => {
      if (throttleTimer) return
      throttleTimer = setTimeout(() => {
        throttleTimer = undefined
        const depth = scrollDepthPercent(getRoot())
        if (depth > maxScrollRef.current) maxScrollRef.current = depth
      }, 120)
    }

    const root = getRoot()
    root.addEventListener('scroll', onScroll, { passive: true })
    if (root !== document.documentElement) {
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') void flush()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (throttleTimer) clearTimeout(throttleTimer)
      root.removeEventListener('scroll', onScroll)
      if (root !== document.documentElement) {
        window.removeEventListener('scroll', onScroll)
      }
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [pid, flush, scrollMountVersion, scrollRef])

  const markGithubClicked = useCallback(() => {
    githubRef.current = true
    void flush()
  }, [flush])

  const markDemoClicked = useCallback(() => {
    demoRef.current = true
    void flush()
  }, [flush])

  return { markGithubClicked, markDemoClicked }
}
