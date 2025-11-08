import type { TestResultResponse, StudentSubmissionResponse } from '@/models/Test/TestResult'
import { fetcher } from './fetcher'
import type { AxiosResponse } from 'axios'

export const testsApi = {
  // Get all tests created by the instructor
  getAllTests: async () => {
    try {
      const response = await fetcher.get('/test/tests')
      return response.data
    } catch (error) {
      console.error('Error fetching tests:', error)
      throw error
    }
  },

  // Create a new test
  createTest: async (testData: any): Promise<any> => {
    try {
      const response: AxiosResponse = await fetcher.post('/test/', testData)
      return response.data
    } catch (error) {
      console.error('Error creating test:', error)
      throw error
    }
  },

  // Get all results for a test
  getTestResults: async (testId: number): Promise<TestResultResponse[]> => {
    try {
      const response: AxiosResponse<TestResultResponse[]> = await fetcher.get(`/history/test/${testId}`, {
        params: { testId }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching test results:', error)
      throw error
    }
  },

  // Get detailed submission for a specific student
  getStudentSubmission: async (params: {
    testId: number
    studentUserId: number
  }): Promise<StudentSubmissionResponse> => {
    try {
      const response: AxiosResponse<StudentSubmissionResponse> = await fetcher.post(`/history/student/details`, params)
      return response.data
    } catch (error) {
      console.error('Error fetching student submission:', error)
      throw error
    }
  }
}
