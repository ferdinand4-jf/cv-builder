// MinimalTemplate.tsx - Avec titre
import { CV } from '../../../types'

interface TemplateProps {
  cv: CV
}

/**
 * MINIMAL — Design ultra-épuré
 */
export function MinimalTemplate({ cv }: TemplateProps) {
  const primary = cv.styling?.primaryColor || '#1a1a1a'
  const fontFamily = cv.styling?.fontFamily || 'Inter'
  const fontSize = cv.styling?.fontSize || 13

  const formatDate = (date: string) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  }

  return (
    <div
      className="pdf-content w-[794px] min-h-[1123px] bg-white text-[#1a1a1a] p-12"
      style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight: 1.7 }}
    >
      {/* Titre du CV */}
      {cv.title && (
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full">
            {cv.title}
          </span>
        </div>
      )}

      {/* En-tête ultra-minimal */}
      <header className="text-center mb-10 pb-6 border-b" style={{ borderColor: primary }}>
        <h1 className="text-3xl font-light tracking-widest uppercase">
          {cv.personalInfo.firstName} <span className="font-semibold">{cv.personalInfo.lastName}</span>
        </h1>
        <div className="text-sm text-gray-500 mt-2 space-x-3">
          <span>{cv.personalInfo.email}</span>
          {cv.personalInfo.phone && <span>· {cv.personalInfo.phone}</span>}
          {cv.personalInfo.address && <span>· {cv.personalInfo.address}</span>}
        </div>
        <div className="flex justify-center gap-4 mt-1 text-xs text-gray-400">
          {cv.personalInfo.linkedin && (
            <a href={cv.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
              LinkedIn
            </a>
          )}
          {cv.personalInfo.portfolio && (
            <a href={cv.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Résumé */}
      {cv.personalInfo.summary && (
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm text-gray-600 leading-relaxed">{cv.personalInfo.summary}</p>
        </div>
      )}

      {/* Contenu en une seule colonne */}
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Expériences */}
        {cv.experience?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center mb-4">
              Expériences
            </h2>
            <div className="space-y-4">
              {cv.experience.map((exp, i) => (
                <div key={i} className="text-center">
                  <div className="font-semibold">{exp.position}</div>
                  <div className="text-sm text-gray-500">{exp.company}</div>
                  <div className="text-xs text-gray-400">
                    {formatDate(exp.startDate)} — {exp.current ? 'Présent' : formatDate(exp.endDate || '')}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 max-w-lg mx-auto">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formation */}
        {cv.education?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center mb-4">
              Formation
            </h2>
            <div className="space-y-3">
              {cv.education.map((edu, i) => (
                <div key={i} className="text-center">
                  <div className="font-semibold">{edu.degree}</div>
                  <div className="text-sm text-gray-500">{edu.institution}</div>
                  <div className="text-xs text-gray-400">
                    {formatDate(edu.startDate)} — {edu.current ? 'Présent' : formatDate(edu.endDate || '')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compétences et Langues en ligne */}
        <div className="grid grid-cols-2 gap-8">
          {cv.skills?.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center mb-3">
                Compétences
              </h2>
              <div className="flex flex-wrap justify-center gap-1.5">
                {cv.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          {cv.languages?.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center mb-3">
                Langues
              </h2>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                {cv.languages.map((lang, i) => (
                  <span key={i}>{lang.name} <span className="text-xs text-gray-400">({lang.level})</span></span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certifications */}
        {cv.certifications?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center mb-3">
              Certifications
            </h2>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {cv.certifications.map((cert, i) => (
                <span key={i}>{cert.name} <span className="text-xs text-gray-400">· {cert.issuer}</span></span>
              ))}
            </div>
          </section>
        )}

        {/* Projets */}
        {cv.projects?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center mb-3">
              Projets
            </h2>
            <div className="space-y-2 text-center">
              {cv.projects.map((p, i) => (
                <div key={i}>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-gray-500 ml-2">— {p.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-10 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-300">
        {cv.personalInfo.firstName} {cv.personalInfo.lastName} · {cv.title || 'CV'} · {new Date().getFullYear()}
      </div>
    </div>
  )
}