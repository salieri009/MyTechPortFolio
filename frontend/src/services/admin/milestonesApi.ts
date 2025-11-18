import { api } from '../apiClient'

const API_BASE = '/journey-milestones'

export interface JourneyMilestone {
  id: string
  year: string
  title: string
  description: string
  icon?: string
  techStack: string[]
  status: 'COMPLETED' | 'CURRENT' | 'PLANNED'
  technicalComplexity: number
  projectCount: number
  codeMetrics?: {
    linesOfCode?: number
    commits?: number
    repositories?: number
  }
  keyAchievements?: Array<{
    title: string
    description: string
    impact?: string
  }>
  skillProgression?: Array<{
    name: string
    level: number
    category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'OTHER'
  }>
  createdAt?: string
  updatedAt?: string
}

export interface JourneyMilestoneCreateRequest {
  year: string
  title: string
  description: string
  icon?: string
  techStack?: string[]
  status: 'COMPLETED' | 'CURRENT' | 'PLANNED'
  technicalComplexity?: number
  projectCount?: number
  codeMetrics?: {
    linesOfCode?: number
    commits?: number
    repositories?: number
  }
  keyAchievements?: Array<{
    title: string
    description: string
    impact?: string
  }>
  skillProgression?: Array<{
    name: string
    level: number
    category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'OTHER'
  }>
}

export interface JourneyMilestoneUpdateRequest extends Partial<JourneyMilestoneCreateRequest> {}

/**
 * Journey Milestones API service for admin operations
 */
export const milestonesApi = {
  /**
   * Get all milestones (ordered by year)
   */
  async getAll(): Promise<JourneyMilestone[]> {
    const response = await api.get(API_BASE)
    return response.data.data
  },

  /**
   * Get milestone by ID
   */
  async getById(id: string): Promise<JourneyMilestone> {
    const response = await api.get(`${API_BASE}/${id}`)
    return response.data.data
  },

  /**
   * Create new milestone
   */
  async create(data: JourneyMilestoneCreateRequest): Promise<JourneyMilestone> {
    const response = await api.post(API_BASE, data)
    return response.data.data
  },

  /**
   * Update milestone
   */
  async update(id: string, data: JourneyMilestoneUpdateRequest): Promise<JourneyMilestone> {
    const response = await api.put(`${API_BASE}/${id}`, data)
    return response.data.data
  },

  /**
   * Delete milestone
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${API_BASE}/${id}`)
  },

  /**
   * Get milestones by status
   */
  async getByStatus(status: 'COMPLETED' | 'CURRENT' | 'PLANNED'): Promise<JourneyMilestone[]> {
    const response = await api.get(`${API_BASE}/status/${status}`)
    return response.data.data
  }
}

