import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ENGAGEMENT_UPDATE_SECRET_HEADER,
  trackProjectEngagement,
  updateProjectEngagement,
} from './engagementApi'
import * as apiClient from './apiClient'
import * as envUtils from '../utils/env'

vi.mock('./apiClient', () => ({
  api: {
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

vi.mock('../utils/env', () => ({
  getEnv: vi.fn(),
}))

describe('engagementApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(envUtils.getEnv).mockReturnValue('true')
  })

  it('posts track payload to /engagement/track', async () => {
    const row = { id: 'e1', projectId: '42', updateSecret: 'secret-xyz' }
    vi.mocked(apiClient.api.post).mockResolvedValue({ data: row })

    const out = await trackProjectEngagement({ projectId: '42' })

    expect(out).toEqual(row)
    expect(apiClient.api.post).toHaveBeenCalledWith('/engagement/track', { projectId: '42' })
  })

  it('sends X-Engagement-Update-Secret on patch', async () => {
    vi.mocked(apiClient.api.patch).mockResolvedValue({ data: null })

    await updateProjectEngagement('e1', 'my-secret', { scrollDepth: 80, viewDuration: 12 })

    expect(apiClient.api.patch).toHaveBeenCalledWith(
      '/engagement/e1',
      null,
      expect.objectContaining({
        params: { scrollDepth: 80, viewDuration: 12 },
        headers: { [ENGAGEMENT_UPDATE_SECRET_HEADER]: 'my-secret' },
      })
    )
  })
})
