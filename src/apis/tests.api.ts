import type { Test } from '@/models/Test/Test'
import type { TestResultResponse, StudentSubmissionResponse } from '@/models/Test/TestResult'
import type { TestVerifyResponse } from '@/models/Test/Question'
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
  },

  //Get test of student by StudentId
  getTestsByStudentId: async (studentId: number): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.get(`/history/student/${studentId}`, {
        params: { studentId }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching tests for student:', error)
      throw error
    }
  },

  //Auto_save test draft
  SaveTestProgress: async (): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.post(`/progress/submission/`)
      return response.data
    } catch (error) {
      console.error('Error saving test progress:', error)
      throw error
    }
  },

  // Get current test draft
  GetTestProgress: async (Query: { StudentId: number, testId: number }): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await fetcher.get(
      `/progress/current-progress`, 
      {
        params: {
          studentUserId: Query.StudentId, 
          testId: Query.testId
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching test progress:', error);
    throw error;
    }
  },

  //Verify passcode for test
  VerifyTestPasscode: async (passcode: string): Promise<TestVerifyResponse> => {
    try {
      console.log('API Call: Verifying passcode:', passcode)
      const url = `/test/verify_passcode/${passcode}`
      console.log('Full URL:', url)
      
      const response: AxiosResponse<TestVerifyResponse> = await fetcher.get(url)
      console.log('API Response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('Error verifying test passcode:', error)
      throw error
    }
  }
}