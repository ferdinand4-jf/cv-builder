'use client'

import { Template } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Check, Crown } from 'lucide-react'

interface CVTemplateProps {
  template: Template
  selected?: boolean
  onSelect?: (template: Template) => void
  onPreview?: (template: Template) => void
}

const categoryStyles: Record<Template['category'], { badge: string; swatch: string; label: string }> = {
  MODERN: { badge: 'bg-sage-light text-sage-dark', swatch: 'from-ink to-sage', label: 'Moderne' },
  CLASSIC: { badge: 'bg-canvas text-ink-soft border border-border', swatch: 'from-ink-soft to-ink', label: 'Classique' },
  ATS_FRIENDLY: { badge: 'bg-canvas text-ink-soft border border-border', swatch: 'from-white to-canvas', label: 'ATS' },
  CREATIVE: { badge: 'bg-redpen-light text-redpen-dark', swatch: 'from-redpen to-seal', label: 'Créatif' },
}

export function CVTemplate({ template, selected, onSelect, onPreview }: CVTemplateProps) {
  const style = categoryStyles[template.category]

  return (
    <Card
      className={`relative page-fold transition-all hover:shadow-lg hover:-translate-y-0.5 ${
        selected ? 'ring-2 ring-redpen' : 'border-border'
      }`}
    >
      {template.isPremium && (
        <div className="absolute top-2 right-2 z-10 bg-seal text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <CardTitle className="text-lg font-display truncate">{template.name}</CardTitle>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-mono ${style.badge}`}>
              {style.label}
            </span>
          </div>
          {selected && (
            <span className="shrink-0 bg-redpen text-white rounded-full p-1">
              <Check className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`aspect-[210/297] rounded-md overflow-hidden mb-3 bg-gradient-to-br ${style.swatch} relative`}>
          <div className="absolute inset-3 sm:inset-4 bg-white/90 rounded-sm p-2 sm:p-3 flex flex-col gap-1.5">
            <div className="h-2 w-2/3 bg-ink/20 rounded-full" />
            <div className="h-1.5 w-1/3 bg-ink/10 rounded-full mb-1" />
            <div className="h-1 w-full bg-ink/10 rounded-full" />
            <div className="h-1 w-5/6 bg-ink/10 rounded-full" />
            <div className="h-1 w-full bg-ink/10 rounded-full" />
          </div>
        </div>
        <p className="text-sm text-ink-soft mb-3 line-clamp-2">{template.description}</p>
        <div className="flex gap-2">
          {onSelect && (
            <Button
              onClick={() => onSelect(template)}
              variant={selected ? 'default' : 'outline'}
              className={`flex-1 ${selected ? 'bg-redpen hover:bg-redpen-dark text-white' : 'border-border'}`}
            >
              {selected ? 'Sélectionné' : 'Choisir'}
            </Button>
          )}
          {onPreview && (
            <Button onClick={() => onPreview(template)} variant="ghost" size="sm" className="text-ink-soft hover:text-redpen">
              Aperçu
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
