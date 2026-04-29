/**
 * Project engagement REST API — aligned with backend ProjectEngagementController.
 * When VITE_USE_BACKEND_API !== 'true', callers should skip (see useProjectEngagement).
 */
import { api } from './apiClient'
import { getEnv } from '../utils/env'
import type { ProjectEngagement, ProjectEngagementTrackPayload, ProjectEngagementUpdateParams } from '../types/engagement'

export const ENGAGEMENT_UPDATE_SECRET_HEADER = 'X-Engagement-Update-Secret'

const BASE = '/engagement'

export function isEngagementApiEnabled(): boolean {
  return getEnv('VITE_USE_BACKEND_API') === 'true'
}

export async function trackProjectEngagement(body: ProjectEngagementTrackPayload): Promise<ProjectEngagement> {
  const res = await api.post<ProjectEngagement>(`${BASE}/track`, body)
  return res.data
}

export async function updateProjectEngagement(
  engagementId: string,
  updateSecret: string,
  params: ProjectEngagementUpdateParams
): Promise<void> {
  await api.patch(`${BASE}/${encodeURIComponent(engagementId)}`, null, {
    params,
    headers: {
      [ENGAGEMENT_UPDATE_SECRET_HEADER]: updateSecret,
    },
  })
}
