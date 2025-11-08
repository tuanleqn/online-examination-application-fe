import type { AssessmentRequest } from '@/models/Test/AI'
import { fetcher } from './fetcher'
import type { AxiosResponse } from 'axios'

export const aiApi = {
  assessAnswer: async (params: AssessmentRequest): Promise<string> => {
    try {
      const response: AxiosResponse<string> = await fetcher.post('/ai/assessment', params)
      return response.data
    } catch (error) {
      console.error('Error getting AI assessment:', error)
      throw error
    }
  }
}
