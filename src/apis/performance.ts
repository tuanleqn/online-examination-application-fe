import type { AxiosResponse } from 'axios'
import { fetcher } from './fetcher'
import type { PerformanceSummary } from '@/models/Test/TestResult'

export const performanceApi = {
  getPerformanceMetrics: async (): Promise<PerformanceSummary[]> => {
    try {
      const response: AxiosResponse = await fetcher('/dashboard/instructor')
      return response.data
    } catch (error) {
      console.error('Error fetching performance metrics:', error)
      throw error
    }
  }
}
