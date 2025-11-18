import { api } from '../apiClient'

const API_BASE = '/api/v1/testimonials'

export type TestimonialType = 'CLIENT' | 'COLLEAGUE' | 'MENTOR' | 'PROFESSOR' | 'OTHER'
export type TestimonialSource = 'LINKEDIN' | 'EMAIL' | 'MANUAL' | 'OTHER'

export interface Testimonial {
  id: string
  authorName: string
  authorTitle?: string
  authorCompany?: string
  authorLinkedInUrl?: string
  content: string
  rating?: number
  type: string // TestimonialType as string
  source: string // TestimonialSource as string
  isFeatured: boolean
  displayOrder?: number
  projectId?: string
  testimonialDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface TestimonialCreateRequest {
  authorName: string
  authorTitle?: string
  authorCompany?: string
  authorEmail?: string
  authorLinkedInUrl?: string
  content: string
  rating?: number
  type: TestimonialType
  source?: TestimonialSource
  isFeatured?: boolean
  displayOrder?: number
  projectId?: string
}

export interface TestimonialUpdateRequest extends Partial<TestimonialCreateRequest> {}

export interface TestimonialFilters {
  type?: TestimonialType
  minRating?: number
  isFeatured?: boolean
}

/**
 * Testimonials API service for admin operations
 */
export const testimonialsApi = {
  /**
   * Get all testimonials
   */
  async getAll(filters?: TestimonialFilters): Promise<Testimonial[]> {
    const params = new URLSearchParams()
    
    if (filters?.type) {
      params.append('type', filters.type)
    }
    if (filters?.minRating) {
      params.append('minRating', filters.minRating.toString())
    }
    if (filters?.isFeatured !== undefined) {
      params.append('isFeatured', filters.isFeatured.toString())
    }
    
    const queryString = params.toString()
    const url = queryString ? `${API_BASE}?${queryString}` : API_BASE
    const response = await api.get(url)
    return response.data.data
  },

  /**
   * Get testimonial by ID
   */
  async getById(id: string): Promise<Testimonial> {
    const response = await api.get(`${API_BASE}/${id}`)
    return response.data.data
  },

  /**
   * Get featured testimonials
   */
  async getFeatured(): Promise<Testimonial[]> {
    const response = await api.get(`${API_BASE}/featured`)
    return response.data.data
  },

  /**
   * Get testimonials by type
   */
  async getByType(type: TestimonialType): Promise<Testimonial[]> {
    const response = await api.get(`${API_BASE}/type/${type}`)
    return response.data.data
  },

  /**
   * Get testimonials by minimum rating
   */
  async getByRating(minRating: number): Promise<Testimonial[]> {
    const response = await api.get(`${API_BASE}/rating/${minRating}`)
    return response.data.data
  },

  /**
   * Create new testimonial
   */
  async create(data: TestimonialCreateRequest): Promise<Testimonial> {
    const response = await api.post(API_BASE, data)
    return response.data.data
  },

  /**
   * Update testimonial
   */
  async update(id: string, data: TestimonialUpdateRequest): Promise<Testimonial> {
    const response = await api.put(`${API_BASE}/${id}`, data)
    return response.data.data
  },

  /**
   * Delete testimonial
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${API_BASE}/${id}`)
  }
}

