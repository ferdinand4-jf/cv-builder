'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../../store/authStore'
import { useCVStore } from '../../../../store/cvStore'
import { CVBuilder } from '../../../../components/cv/CVBuilder'
import { CV } from '../../../../types'

export default function CreateCVPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { createCV } = useCVStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleSave = async (data: Partial<CV>) => {
    const cv = await createCV(data)
    router.push(`/cvs/${cv.id}/preview`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CVBuilder onSave={handleSave} />
    </div>
  )
}