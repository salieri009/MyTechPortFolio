import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProjects, getProject } from './projects'
import * as apiClient from './apiClient'
import * as dataService from '../mocks/projects'

// Mock dependencies
vi.mock('./apiClient', () => ({
  api: {
    get: vi.fn()
  }
}))

vi.mock('../mocks/projects', () => ({
  getProjects: vi.fn(),
  getProject: vi.fn()
}))

describe('Projects Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('TC-FU-029: should fetch projects from backend API when enabled', async () => {
    const mockResponse = {
      success: true,
      data: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        page: 1,
        size: 10
      }
    }

    vi.mocked(apiClient.api.get).mockResolvedValue({ data: mockResponse })
    
    // Mock environment variable
    import.meta.env.VITE_USE_BACKEND_API = 'true'
    
    const result = await getProjects({ page: 1, size: 10 })
    
    expect(result.success).toBe(true)
    expect(apiClient.api.get).toHaveBeenCalledWith('/projects', expect.any(Object))
  })

  it('TC-FU-030: should use mock data when backend API is disabled', async () => {
    const mockData = {
      success: true,
      data: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        page: 1,
        size: 10
      }
    }

    vi.mocked(dataService.getProjects).mockResolvedValue(mockData)
    
    // Mock environment variable
    import.meta.env.VITE_USE_BACKEND_API = 'false'
    
    const result = await getProjects({ page: 1, size: 10 })
    
    expect(result.success).toBe(true)
    expect(dataService.getProjects).toHaveBeenCalled()
  })
})

