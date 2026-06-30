// TemplateRenderer.tsx - Mise à jour avec les nouveaux modèles
import { CV } from '../../../types'
import { ModernTemplate } from './ModernTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { ATSTemplate } from './ATSTemplate'
import { CreativeTemplate } from './CreativeTemplate'
import { EditorialTemplate } from './EditorialTemplate'
import { MinimalTemplate } from './MinimalTemplate'

interface TemplateRendererProps {
  cv: CV
}

export function TemplateRenderer({ cv }: TemplateRendererProps) {
  type TemplateCategory =
    | 'MODERN'
    | 'CLASSIC'
    | 'ATS_FRIENDLY'
    | 'CREATIVE'
    | 'EDITORIAL'
    | 'MINIMAL'
    | undefined

  const category = cv.template?.category as TemplateCategory

  switch (category) {
    case 'CLASSIC':
      return <ClassicTemplate cv={cv} />
    case 'ATS_FRIENDLY':
      return <ATSTemplate cv={cv} />
    case 'CREATIVE':
      return <CreativeTemplate cv={cv} />
    case 'EDITORIAL':
      return <EditorialTemplate cv={cv} />
    case 'MINIMAL':
      return <MinimalTemplate cv={cv} />
    case 'MODERN':
    default:
      return <ModernTemplate cv={cv} />
  }
}