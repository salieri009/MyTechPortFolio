import { api } from '../apiClient'
import { projectMediaApi } from './projectMediaApi'

/**
 * Upload API service for file uploads
 * @deprecated Use projectMediaApi.upload() instead for project media
 */
export const uploadApi = {
  /**
   * Upload image for project
   * @deprecated Use projectMediaApi.upload() instead
   */
  async uploadImage(
    projectId: string,
    file: File,
    type: 'project' | 'academic' | 'milestone' = 'project'
  ): Promise<string> {
    // Use projectMediaApi for consistency
    const media = await projectMediaApi.upload(projectId, file, {
      type: 'SCREENSHOT'
    })
    return media.fileUrl
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

