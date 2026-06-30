import { create } from 'zustand'
import { CV } from '../types'
import api from '../lib/api'
import toast from 'react-hot-toast'

interface CVState {
  cvs: CV[]
  currentCV: CV | null
  loading: boolean
  error: string | null
  fetchCVs: () => Promise<void>
  fetchCV: (id: string) => Promise<void>
  createCV: (data: Partial<CV>) => Promise<CV>
  updateCV: (id: string, data: Partial<CV>) => Promise<CV>
  deleteCV: (id: string) => Promise<void>
  duplicateCV: (id: string) => Promise<CV>
  generatePDF: (id: string) => Promise<Blob>
  setCurrentCV: (cv: CV | null) => void
  clearError: () => void
}

export const useCVStore = create<CVState>((set, get) => ({
  cvs: [],
  currentCV: null,
  loading: false,
  error: null,

  fetchCVs: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get('/cvs')
      set({ cvs: response.data, loading: false })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch CVs'
      set({ error: message, loading: false })
      toast.error(message)
    }
  },

  fetchCV: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/cvs/${id}`)
      set({ currentCV: response.data, loading: false })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch CV'
      set({ error: message, loading: false })
      toast.error(message)
    }
  },

  createCV: async (data: Partial<CV>) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/cvs', data)
      const newCV = response.data
      set((state) => ({
        cvs: [newCV, ...state.cvs],
        currentCV: newCV,
        loading: false,
      }))
      toast.success('CV created successfully')
      return newCV
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create CV'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  updateCV: async (id: string, data: Partial<CV>) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/cvs/${id}`, data)
      const updatedCV = response.data
      set((state) => ({
        cvs: state.cvs.map((cv) => (cv.id === id ? updatedCV : cv)),
        currentCV: updatedCV,
        loading: false,
      }))
      toast.success('CV updated successfully')
      return updatedCV
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update CV'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  deleteCV: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/cvs/${id}`)
      set((state) => ({
        cvs: state.cvs.filter((cv) => cv.id !== id),
        currentCV: state.currentCV?.id === id ? null : state.currentCV,
        loading: false,
      }))
      toast.success('CV deleted successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete CV'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  duplicateCV: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post(`/cvs/${id}/duplicate`)
      const duplicatedCV = response.data
      set((state) => ({
        cvs: [duplicatedCV, ...state.cvs],
        loading: false,
      }))
      toast.success('CV duplicated successfully')
      return duplicatedCV
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to duplicate CV'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  generatePDF: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/cvs/${id}/pdf`, {
        responseType: 'blob',
      })
      set({ loading: false })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to generate PDF'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  setCurrentCV: (cv) => set({ currentCV: cv }),

  clearError: () => set({ error: null }),
}))