import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const DEFAULT_API_URL = 'http://localhost/api'

const api = axios.create({
  // Utilise le port 80 global géré par Nginx
  baseURL: process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
        
        const response = await axios.post(
          `${baseUrl}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        )

        const { token, refreshToken: newRefreshToken } = response.data
        useAuthStore.getState().setTokens(token, newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api