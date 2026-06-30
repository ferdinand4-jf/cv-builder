// src/components/providers/AuthHydrator.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  const { hydrate, isHydrated, checkAuth } = useAuthStore()

  useEffect(() => {
    setIsMounted(true)
    // Hydrater le store
    hydrate()
    
    // Vérifier l'authentification
    const verifyAuth = async () => {
      await checkAuth()
    }
    verifyAuth()
  }, [hydrate, checkAuth])

  // Ne pas rendre tant que l'hydratation n'est pas terminée
  if (!isMounted || !isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}