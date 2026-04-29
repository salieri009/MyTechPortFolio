/**
 * Mirrors backend {@code ProjectEngagement} for track/update payloads and responses.
 * IP/userAgent are set server-side on POST /engagement/track.
 */
export interface ProjectEngagement {
  id?: string
  projectId: string
  sessionId?: string
  visitorId?: string
  viewDuration?: number
  scrollDepth?: number
  githubLinkClicked?: boolean
  demoLinkClicked?: boolean
  timesViewed?: number
  referrer?: string
  source?: string
  deviceType?: string
  browser?: string
  country?: string
  city?: string
  ipAddress?: string
  /** Returned on track; required on PATCH via X-Engagement-Update-Secret */
  updateSecret?: string
  viewedAt?: string
  lastInteractionAt?: string
}

export type ProjectEngagementTrackPayload = Pick<
  ProjectEngagement,
  'projectId' | 'sessionId' | 'visitorId' | 'referrer' | 'source' | 'deviceType' | 'browser'
>

export interface ProjectEngagementUpdateParams {
  viewDuration?: number
  scrollDepth?: number
  githubLinkClicked?: boolean
  demoLinkClicked?: boolean
}
