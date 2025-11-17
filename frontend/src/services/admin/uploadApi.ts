import { api } from '../apiClient'

/**
 * Upload API service for file uploads
 */
export const uploadApi = {
  /**
   * Upload image for project
   */
  async uploadImage(
    projectId: string,
    file: File,
    type: 'project' | 'academic' | 'milestone' = 'project'
  ): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    
    // Use existing project media endpoint
    const response = await api.post(
      `/api/v1/projects/${projectId}/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    // Return the media URL
    return response.data.data.url || response.data.data.fileUrl
  },

  /**
   * Upload general image (returns URL)
   */
  async uploadGeneralImage(
    file: File,
    type: 'project' | 'academic' | 'milestone' = 'project'
  ): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    // This would need a general upload endpoint on the backend
    // For now, we'll use a placeholder
    const response = await api.post(
      `/api/v1/media/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    return response.data.data.url
  }
}

