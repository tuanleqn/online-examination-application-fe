import type { Test } from '@/models/Test/Test'
import { fetcher } from './fetcher'
import type { AxiosResponse } from 'axios'

export const testsApi = {
  getAllTests: async () => {
    try {
      const response = await fetcher.get('/get_all_tests')
      return response.data
    } catch (error) {
      console.error('Error fetching tests:', error)
      throw error
    }
  },

  createTest: async (testData: any): Promise<Test> => {
    try {
      const response: AxiosResponse = await fetcher.post('/create_new_test', testData)
      return response.data
    } catch (error) {
      console.error('Error creating test:', error)
      throw error
    }
  }
}