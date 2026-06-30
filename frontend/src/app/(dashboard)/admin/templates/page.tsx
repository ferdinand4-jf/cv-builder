'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { TemplateManagement } from '@/components/admin/TemplateManagement'

export default function AdminTemplatesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, router, user])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Template Management</h1>
        <p className="text-muted-foreground">
          Manage all CV templates available on the platform
        </p>
      </div>
      <TemplateManagement />
    </div>
  )
}