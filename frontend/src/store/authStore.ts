
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '../types'
import api from '../lib/api'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean
  setUser: (user: User | null) => void
  setTokens: (token: string, refreshToken: string) => void
  setLoading: (isLoading: boolean) => void
  setHydrated: (isHydrated: boolean) => void
  logout: () => void
  login: (user: User, token: string, refreshToken: string) => void
  hydrate: () => void
  checkAuth: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
        if (user && get().token) {
          // Mettre à jour l'en-tête Authorization
          api.defaults.headers.common['Authorization'] = `Bearer ${get().token}`
        }
      },

      setTokens: (token, refreshToken) => {
        set({ token, refreshToken, isAuthenticated: true })
        // Mettre à jour l'en-tête Authorization
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // Stocker dans localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', refreshToken)
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      
      setHydrated: (isHydrated) => set({ isHydrated }),

      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        })
        // Mettre à jour l'en-tête Authorization
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // Stocker dans localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', refreshToken)
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
        // Supprimer l'en-tête Authorization
        delete api.defaults.headers.common['Authorization']
        // Supprimer du localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          // Ne pas supprimer le persist storage tout de suite
          // localStorage.removeItem('auth-storage')
        }
      },

      hydrate: () => {
        if (typeof window !== 'undefined') {
          try {
            const token = localStorage.getItem('token')
            const refreshToken = localStorage.getItem('refreshToken')
            
            if (token) {
              // Récupérer l'utilisateur depuis le store persisté
              const stored = localStorage.getItem('auth-storage')
              if (stored) {
                const { state } = JSON.parse(stored)
                if (state.user) {
                  set({
                    user: state.user,
                    token: token,
                    refreshToken: refreshToken || null,
                    isAuthenticated: true,
                    isLoading: false,
                    isHydrated: true,
                  })
                  // Mettre à jour l'en-tête Authorization
                  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                  return
                }
              }
            }
            
            // Si pas de token, réinitialiser
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              isHydrated: true,
            })
          } catch (e) {
            console.error('Failed to hydrate auth state:', e)
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              isHydrated: true,
            })
          }
        }
      },

      checkAuth: async () => {
        const state = get()
        const token = state.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
        
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return false
        }

        try {
          // Vérifier le token avec le backend
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          
          if (response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              token: token,
            })
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            return true
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          // Token invalide, déconnecter
          get().logout()
          return false
        }
        
        return false
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true
          // Mettre à jour l'en-tête Authorization après réhydratation
          if (state.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
          }
          console.log('Auth store hydrated:', state)
        }
      },
    }
  )
)