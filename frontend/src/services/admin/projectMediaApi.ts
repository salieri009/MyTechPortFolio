import { api } from '../apiClient'

export type MediaType = 'SCREENSHOT' | 'LOGO' | 'VIDEO' | 'DOCUMENT' | 'DIAGRAM' | 'OTHER'

export interface ProjectMedia {
  id: string
  projectId: string
  fileName: string
  fileUrl: string
  thumbnailUrl?: string
  fileType: string
  mimeType?: string
  fileSize?: number
  type: string // MediaType as string
  displayOrder?: number
  altText?: string
  caption?: string
  description?: string
  width?: number
  height?: number
  duration?: number
  isActive: boolean
  isPrimary: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MediaUploadRequest {
  projectId: string
  type: MediaType
  altText?: string
  caption?: string
  description?: string
  displayOrder?: number
  isPrimary?: boolean
}

export interface MediaUpdateRequest {
  altText?: string
  caption?: string
  displayOrder?: number
  isPrimary?: boolean
}

/**
 * Project Media API service for admin operations
 */
export const projectMediaApi = {
  /**
   * Get all media for a project
   */
  async getAll(projectId: string): Promise<ProjectMedia[]> {
    const response = await api.get(`/api/v1/projects/${projectId}/media`)
    return response.data.data
  },

  /**
   * Get active media for a project (gallery)
   */
  async getGallery(projectId: string): Promise<ProjectMedia[]> {
    const response = await api.get(`/api/v1/projects/${projectId}/media/gallery`)
    return response.data.data
  },

  /**
   * Get primary/featured media for a project
   */
  async getPrimary(projectId: string): Promise<ProjectMedia | null> {
    try {
      const response = await api.get(`/api/v1/projects/${projectId}/media/primary`)
      return response.data.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  /**
   * Upload media file for a project
   */
  async upload(
    projectId: string,
    file: File,
    request?: Partial<MediaUploadRequest>
  ): Promise<ProjectMedia> {
    const formData = new FormData()
    formData.append('file', file)
    
    // Add request metadata if provided
    if (request) {
      const requestBlob = new Blob([JSON.stringify({
        projectId,
        type: request.type || 'SCREENSHOT',
        altText: request.altText,
        caption: request.caption,
        description: request.description,
        displayOrder: request.displayOrder,
        isPrimary: request.isPrimary || false
      })], { type: 'application/json' })
      formData.append('request', requestBlob)
    }
    
    const response = await api.post(
      `/api/v1/projects/${projectId}/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.data
  },

  /**
   * Update media metadata
   */
  async update(
    projectId: string,
    mediaId: string,
    request: MediaUpdateRequest
  ): Promise<ProjectMedia> {
    const params = new URLSearchParams()
    
    if (request.altText !== undefined) {
      params.append('altText', request.altText)
    }
    if (request.caption !== undefined) {
      params.append('caption', request.caption)
    }
    if (request.displayOrder !== undefined) {
      params.append('displayOrder', request.displayOrder.toString())
    }
    if (request.isPrimary !== undefined) {
      params.append('isPrimary', request.isPrimary.toString())
    }
    
    const queryString = params.toString()
    const url = queryString 
      ? `/api/v1/projects/${projectId}/media/${mediaId}?${queryString}`
      : `/api/v1/projects/${projectId}/media/${mediaId}`
    
    const response = await api.put(url)
    return response.data.data
  },

  /**
   * Delete media
   */
  async delete(projectId: string, mediaId: string): Promise<void> {
    await api.delete(`/api/v1/projects/${projectId}/media/${mediaId}`)
  }
}

