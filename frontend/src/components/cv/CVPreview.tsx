// CVPreview.tsx - Version sans navigation, centrée
'use client'

import { Button } from '../ui/button'
import { Download, Printer, FileText } from 'lucide-react'
import { CV } from '../../types'
import { useCVStore } from '../../store/cvStore'
import { TemplateRenderer } from './templates/TemplateRenderer'
import toast from 'react-hot-toast'

interface CVPreviewProps {
  cv: CV
  onEdit?: () => void
}

export function CVPreview({ cv, onEdit }: CVPreviewProps) {
  const { generatePDF } = useCVStore()

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await generatePDF(cv.id)
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${cv.title || 'CV'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('PDF téléchargé avec succès')
    } catch (error) {
      toast.error('Le téléchargement du PDF a échoué')
    }
  }

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center p-6">
      {/* Document */}
      <div className="w-full max-w-[850px] bg-white shadow-2xl shadow-black/5 rounded-xl overflow-hidden ring-1 ring-black/5">
        <TemplateRenderer cv={cv} />
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-mono text-gray-400 mr-2">
          {cv.template?.name || 'Moderne'}
        </span>
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-full px-4"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
        <Button
          onClick={handleDownloadPDF}
          size="sm"
          className="bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-full px-5"
        >
          <Download className="h-4 w-4 mr-2" />
          PDF
        </Button>
        {onEdit && (
          <Button
            onClick={onEdit}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 rounded-full"
          >
            Modifier
          </Button>
        )}
      </div>
    </div>
  )
}