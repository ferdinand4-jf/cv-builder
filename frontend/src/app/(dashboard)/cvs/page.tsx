'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../store/authStore'
import { useCVStore } from '../../../store/cvStore'
import { CVList } from '../../../components/cv/CVList'
import { Button } from '../../../components/ui/button'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'

export default function CVsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { cvs, loading, fetchCVs } = useCVStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchCVs()
  }, [isAuthenticated, router, fetchCVs])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center text-ink-soft font-mono text-sm">
          <FileText className="h-6 w-6 mx-auto mb-2 text-redpen animate-pulse" />
          Chargement de vos CV...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink">Mes CV</h1>
            <p className="text-ink-soft mt-1">
              {cvs.length > 0
                ? `${cvs.length} CV enregistré${cvs.length > 1 ? 's' : ''}`
                : 'Gérez tous vos CV au même endroit'}
            </p>
          </div>
          <Link href="/cvs/create">
            <Button className="bg-redpen hover:bg-redpen-dark text-white w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Créer un nouveau CV
            </Button>
          </Link>
        </div>

        <CVList cvs={cvs} />
      </div>
    </div>
  )
}
