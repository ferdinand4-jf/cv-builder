'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../../../store/authStore'
import { useCVStore } from '../../../../../store/cvStore'
import { CVPreview } from '../../../../../components/cv/CVPreview'
import { FileText, FileX } from 'lucide-react'

interface PreviewCVPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PreviewCVPage({ params }: PreviewCVPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { currentCV, fetchCV } = useCVStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const loadCV = async () => {
      await fetchCV(id)
      setLoading(false)
    }
    loadCV()
  }, [isAuthenticated, router, id, fetchCV])

  const handleEdit = () => {
    router.push(`/cvs/${id}/edit`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center text-ink-soft font-mono text-sm">
          <FileText className="h-6 w-6 mx-auto mb-2 text-redpen animate-pulse" />
          Chargement de l'aperçu...
        </div>
      </div>
    )
  }

  if (!currentCV) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas px-4">
        <div className="text-center">
          <FileX className="h-10 w-10 mx-auto mb-3 text-redpen" />
          <h1 className="text-2xl font-display font-bold text-ink">CV introuvable</h1>
          <p className="text-ink-soft mt-1">Le CV que vous cherchez n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    )
  }

  return <CVPreview cv={currentCV} onEdit={handleEdit} />
}
