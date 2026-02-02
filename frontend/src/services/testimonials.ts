import { api } from './apiClient'
import type { ApiResponse } from '../types/api'
import type { TestimonialCreateRequest } from '../types/domain'
import * as dataService from '../mocks/testimonials'

const USE_BACKEND_API = (import.meta as any).env.VITE_USE_BACKEND_API === 'true'

/**
 * Testimonial response interface matching backend TestimonialResponse
 */
export interface TestimonialResponse {
  id: string
  authorName: string
  authorTitle?: string
  authorCompany?: string
  authorLinkedInUrl?: string
  content: string
  rating: number
  type: 'CLIENT' | 'COLLEAGUE' | 'MENTOR' | 'PROFESSOR' | 'OTHER'
  source?: 'MANUAL' | 'LINKEDIN' | 'GITHUB'
  isFeatured?: boolean
  displayOrder?: number
  projectId?: string
  testimonialDate?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Get all testimonials
 */
export async function getTestimonials(): Promise<ApiResponse<TestimonialResponse[]>> {
  if (USE_BACKEND_API) {
    const res = await api.get<ApiResponse<TestimonialResponse[]>>('/testimonials')
    return res.data
  }
  // Mock fallback
  const mockTestimonials = await dataService.getTestimonials()
  // Convert mock format to backend format
  const converted: TestimonialResponse[] = mockTestimonials.map((t, index) => ({
    id: String(t.id),
    authorName: t.author,
    authorTitle: t.position,
    authorCompany: t.company,
    content: t.quote,
    rating: 5,
    type: 'OTHER' as const,
    source: 'MANUAL' as const,
    isFeatured: index < 3,
    displayOrder: index,
  }))
  return {
    success: true,
    data: converted,
    message: 'Testimonials retrieved successfully',
    error: null,
    metadata: {
      timestamp: new Date().toISOString(),
      version: 'v1',
    },
  }
}

/**
 * Get featured testimonials
 */
export async function getFeaturedTestimonials(): Promise<ApiResponse<TestimonialResponse[]>> {
  if (USE_BACKEND_API) {
    const res = await api.get<ApiResponse<TestimonialResponse[]>>('/testimonials/featured')
    return res.data
  }
  // Mock fallback - return all as featured
  return getTestimonials()
}

/**
 * Get a single testimonial by ID
 */
export async function getTestimonial(id: string): Promise<ApiResponse<TestimonialResponse>> {
  if (USE_BACKEND_API) {
    const res = await api.get<ApiResponse<TestimonialResponse>>(`/testimonials/${id}`)
    return res.data
  }
  // Mock fallback
  const mockTestimonial = await dataService.getTestimonial(Number(id))
  if (!mockTestimonial) {
    throw new Error(`Testimonial with ID ${id} not found`)
  }
  const converted: TestimonialResponse = {
    id: String(mockTestimonial.id),
    authorName: mockTestimonial.author,
    authorTitle: mockTestimonial.position,
    authorCompany: mockTestimonial.company,
    content: mockTestimonial.quote,
    rating: 5,
    type: 'OTHER' as const,
    source: 'MANUAL' as const,
    isFeatured: true,
    displayOrder: 0,
  }
  return {
    success: true,
    data: converted,
    message: 'Testimonial retrieved successfully',
    error: null,
    metadata: {
      timestamp: new Date().toISOString(),
      version: 'v1',
    },
  }
}

/**
 * Create a new testimonial
 */
export async function createTestimonial(request: TestimonialCreateRequest): Promise<ApiResponse<TestimonialResponse>> {
  if (USE_BACKEND_API) {
    const res = await api.post<ApiResponse<TestimonialResponse>>('/testimonials', request)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for creating testimonials')
}

/**
 * Update an existing testimonial
 */
export async function updateTestimonial(id: string, request: TestimonialCreateRequest): Promise<ApiResponse<TestimonialResponse>> {
  if (USE_BACKEND_API) {
    const res = await api.put<ApiResponse<TestimonialResponse>>(`/testimonials/${id}`, request)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for updating testimonials')
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonial(id: string): Promise<ApiResponse<void>> {
  if (USE_BACKEND_API) {
    const res = await api.delete<ApiResponse<void>>(`/testimonials/${id}`)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for deleting testimonials')
}

