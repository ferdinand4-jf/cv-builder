import { useAuthStore } from '../store/authStore'
import api from './api'

export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated
}

export const isAdmin = (): boolean => {
  const user = useAuthStore.getState().user
  return user?.role === 'ADMIN'
}

export const getCurrentUser = () => {
  return useAuthStore.getState().user
}

export const getToken = () => {
  return useAuthStore.getState().token
}

export const logout = async () => {
  try {
    const refreshToken = useAuthStore.getState().refreshToken
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken })
    }
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    useAuthStore.getState().logout()
  }
}

export const requireAuth = (): boolean => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return false
  }
  return true
}

export const requireAdmin = (): boolean => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return false
  }
  
  if (!isAdmin()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
    return false
  }
  
  return true
}