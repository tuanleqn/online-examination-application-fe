import { fetcher } from './fetcher'

export const authApi = {
  // Sign in API
  signIn: async (email: string, password: string) => {
    try {
      const response = await fetcher.post('/auth/sign-in', { email, password })
      return response.data
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  // Register API
  register: async (
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string,
    profileImg: string,
    roleId: number
  ) => {
    try {
      const response = await fetcher.post('/auth/sign-up', {
        fullName,
        email,
        phoneNumber,
        password,
        profileImg,
        roleId
      })
      return response.data
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    }
  }
}
