import { create } from 'zustand'
import { Template } from '../types'
import api from '../lib/api'
import toast from 'react-hot-toast'

interface TemplateState {
  templates: Template[]
  loading: boolean
  error: string | null
  fetchTemplates: () => Promise<void>
  fetchTemplate: (id: string) => Promise<Template>
  createTemplate: (data: Partial<Template>) => Promise<Template>
  updateTemplate: (id: string, data: Partial<Template>) => Promise<Template>
  deleteTemplate: (id: string) => Promise<void>
  clearError: () => void
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get('/templates')
      set({ templates: response.data, loading: false })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch templates'
      set({ error: message, loading: false })
      toast.error(message)
    }
  },

  fetchTemplate: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/templates/${id}`)
      set({ loading: false })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch template'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  createTemplate: async (data: Partial<Template>) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/admin/templates', data)
      const newTemplate = response.data
      set((state) => ({
        templates: [...state.templates, newTemplate],
        loading: false,
      }))
      toast.success('Template created successfully')
      return newTemplate
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create template'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  updateTemplate: async (id: string, data: Partial<Template>) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/admin/templates/${id}`, data)
      const updatedTemplate = response.data
      set((state) => ({
        templates: state.templates.map((t) => (t.id === id ? updatedTemplate : t)),
        loading: false,
      }))
      toast.success('Template updated successfully')
      return updatedTemplate
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update template'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  deleteTemplate: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/admin/templates/${id}`)
      set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
        loading: false,
      }))
      toast.success('Template deleted successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete template'
      set({ error: message, loading: false })
      toast.error(message)
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))