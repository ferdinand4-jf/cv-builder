'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CV } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import {
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  Calendar,
  Layout,
  FilePlus
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useCVStore } from '@/store/cvStore'
import toast from 'react-hot-toast'

interface CVListProps {
  cvs: CV[]
  onEdit?: (cv: CV) => void
  onDelete?: (id: string) => void
}

const categorySwatch: Record<string, string> = {
  MODERN: 'from-ink to-sage',
  CLASSIC: 'from-ink-soft to-ink',
  ATS_FRIENDLY: 'from-white to-canvas',
  CREATIVE: 'from-redpen to-seal',
}

export function CVList({ cvs, onEdit, onDelete }: CVListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { deleteCV, duplicateCV, generatePDF } = useCVStore()

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce CV ?')) return

    try {
      setDeletingId(id)
      await deleteCV(id)
      if (onDelete) onDelete(id)
      toast.success('CV supprimé')
    } catch (error) {
      toast.error('La suppression a échoué')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateCV(id)
      toast.success('CV dupliqué')
    } catch (error) {
      toast.error('La duplication a échoué')
    }
  }

  const handleDownload = async (cv: CV) => {
    try {
      const pdfBlob = await generatePDF(cv.id)
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${cv.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('PDF téléchargé')
    } catch (error) {
      toast.error('Le téléchargement a échoué')
    }
  }

  if (cvs.length === 0) {
    return (
      <Card className="text-center py-16 border-dashed border-2 border-border bg-white">
        <CardContent>
          <div className="mx-auto w-14 h-14 rounded-full bg-redpen-light flex items-center justify-center mb-4">
            <FilePlus className="h-7 w-7 text-redpen" />
          </div>
          <h3 className="text-xl font-display font-semibold mb-2 text-ink">Aucun CV pour l'instant</h3>
          <p className="text-ink-soft mb-6 max-w-sm mx-auto">
            La première version n'a pas besoin d'être parfaite — commencez,
            on affine ensuite.
          </p>
          <Link href="/cvs/create">
            <Button className="bg-redpen hover:bg-redpen-dark text-white">Créer mon premier CV</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {cvs.map((cv) => (
        <Card key={cv.id} className="flex flex-col page-fold border-border hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display truncate text-ink">{cv.title}</CardTitle>
            <div className="flex flex-wrap gap-3 text-xs text-ink-soft font-mono">
              <span className="flex items-center">
                <Layout className="h-3 w-3 mr-1" />
                {cv.template?.name || 'Sans modèle'}
              </span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(cv.updatedAt)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div
              className={`aspect-[210/297] rounded-md overflow-hidden bg-gradient-to-br relative ${
                categorySwatch[cv.template?.category || 'MODERN']
              }`}
            >
              <div className="absolute inset-3 bg-white/90 rounded-sm p-2 flex flex-col gap-1.5">
                <div className="h-2 w-2/3 bg-ink/20 rounded-full" />
                <div className="h-1.5 w-1/3 bg-ink/10 rounded-full mb-1" />
                <div className="h-1 w-full bg-ink/10 rounded-full" />
                <div className="h-1 w-5/6 bg-ink/10 rounded-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 flex-wrap">
            <Link href={`/cvs/${cv.id}/edit`} className="flex-1 min-w-[88px]">
              <Button variant="outline" size="sm" className="w-full border-border">
                <Edit className="h-4 w-4 mr-1" />
                Éditer
              </Button>
            </Link>
            <Link href={`/cvs/${cv.id}/preview`} className="flex-1 min-w-[88px]">
              <Button variant="outline" size="sm" className="w-full border-border">
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-[88px] border-border"
              onClick={() => handleDuplicate(cv.id)}
            >
              <Copy className="h-4 w-4 mr-1" />
              Dupliquer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-[88px] border-border"
              onClick={() => handleDownload(cv)}
            >
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 min-w-[88px] bg-redpen hover:bg-redpen-dark"
              onClick={() => handleDelete(cv.id)}
              disabled={deletingId === cv.id}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {deletingId === cv.id ? 'Suppr...' : 'Supprimer'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
