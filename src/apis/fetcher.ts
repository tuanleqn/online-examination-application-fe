import axios from 'axios'

export const fetcher = axios.create({
  baseURL: import.meta.env.BE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})


fetcher.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

fetcher.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')

      if (accessToken && refreshToken) {
        try {
          const refreshResponse = await axios.post(`${import.meta.env.BE_API_BASE_URL}users/refresh-token`, {
            refresh_token: refreshToken
          })

          const newAccessToken = refreshResponse.data.access_token
          const newRefreshToken = refreshResponse.data.refresh_token

          if (newAccessToken) {
            localStorage.setItem('access_token', newAccessToken)
            localStorage.setItem('refresh_token', newRefreshToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return fetcher(originalRequest)
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          // Only clear storage and redirect if we're sure tokens are invalid
          // Check if the error is actually related to invalid refresh token
          if (
            axios.isAxiosError(refreshError) &&
            (refreshError.response?.status === 401 || refreshError.response?.status === 403)
          ) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user_role')

            // Avoid redirect loop - only redirect if not already on auth pages
            if (!window.location.pathname.startsWith('/auth')) {
              window.location.href = '/auth/login'
            }
          }
          return Promise.reject(refreshError)
        }
      } else {
        // If no tokens available and we're not on auth page, redirect to login
        if (!window.location.pathname.startsWith('/auth')) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_role')
          window.location.href = '/auth'
        }
      }
    }
    return Promise.reject(error)
  }
)
