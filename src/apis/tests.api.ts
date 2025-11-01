import type { Test } from '@/models/Test/Test'
import { fetcher } from './fetcher'
import type { AxiosResponse } from 'axios'

export const testsApi = {
  getAllTests: async (): Promise<Test[]> => {
    try {
      const response: AxiosResponse<Test[]> = await fetcher.get('/query?function=TOP_GAINERS_LOSERS&apikey=demo')
      return response.data
    } catch (error) {
      console.error('Error fetching tests:', error)
      throw error
    }
  }
}
