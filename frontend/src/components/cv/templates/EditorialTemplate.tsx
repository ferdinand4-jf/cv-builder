// EditorialTemplate.tsx - Avec titre
import { CV } from '../../../types'

interface TemplateProps {
  cv: CV
}

/**
 * EDITORIAL — Design épuré sans sidebar, style magazine
 */
export function EditorialTemplate({ cv }: TemplateProps) {
  const primary = cv.styling?.primaryColor || '#2d2d2d'
  const accent = cv.styling?.secondaryColor || '#c0392b'
  const fontFamily = cv.styling?.fontFamily || 'Inter'
  const fontSize = cv.styling?.fontSize || 13

  const formatDate = (date: string) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  }

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      expert: 'Expert',
      native: 'Maternel'
    }
    return labels[level] || level
  }

  const hasManyExperiences = (cv.experience?.length || 0) > 2
  const hasManyProjects = (cv.projects?.length || 0) > 2

  return (
    <div
      className="pdf-content w-[794px] min-h-[1123px] bg-white text-[#1a1a1a] p-12"
      style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight: 1.6 }}
    >
      {/* Titre du CV */}
      {cv.title && (
        <div className="mb-6 pb-3 border-b border-gray-100">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">
            {cv.title}
          </h2>
        </div>
      )}

      {/* En-tête minimaliste */}
      <header className="mb-10 pb-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-light tracking-tight leading-tight">
              {cv.personalInfo.firstName}
              <br />
              <span className="font-semibold">{cv.personalInfo.lastName}</span>
            </h1>
          </div>
          <div className="text-right text-sm">
            <div className="text-gray-600">{cv.personalInfo.email}</div>
            {cv.personalInfo.phone && (
              <div className="text-gray-500 text-xs">{cv.personalInfo.phone}</div>
            )}
            <div className="flex gap-3 justify-end mt-2 text-xs">
              {cv.personalInfo.linkedin && (
                <a 
                  href={cv.personalInfo.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {cv.personalInfo.portfolio && (
                <a 
                  href={cv.personalInfo.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
        {cv.personalInfo.address && (
          <div className="text-xs text-gray-400 mt-2">{cv.personalInfo.address}</div>
        )}
      </header>

      {/* Résumé - en évidence */}
      {cv.personalInfo.summary && (
        <div className="mb-10">
          <p className="text-lg leading-relaxed text-gray-700 font-light italic border-l-4 pl-4" style={{ borderColor: accent }}>
            {cv.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Grille principale */}
      <div className="grid grid-cols-3 gap-8">
        {/* Colonne principale (2/3) */}
        <div className="col-span-2 space-y-8">
          {/* Expériences */}
          {cv.experience?.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
                Expériences professionnelles
              </h2>
              <div className="space-y-5">
                {cv.experience.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-[15px]">{exp.position}</h3>
                      <span className="text-xs text-gray-400 font-mono">
                        {formatDate(exp.startDate)} — {exp.current ? 'Présent' : formatDate(exp.endDate || '')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1.5">{exp.company}</div>
                    <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.achievements.map((a, j) => (
                          <li key={j} className="text-sm text-gray-500 flex items-start gap-2">
                            <span className="text-[10px] mt-1.5" style={{ color: accent }}>◆</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projets */}
          {cv.projects?.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
                Projets
              </h2>
              <div className={`grid ${hasManyProjects ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                {cv.projects.map((p, i) => (
                  <div 
                    key={i} 
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-medium text-sm">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.description}</p>
                    {p.link && (
                      <a 
                        href={p.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-medium mt-2 inline-block hover:underline"
                        style={{ color: accent }}
                      >
                        Voir le projet →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Colonne latérale (1/3) */}
        <div className="col-span-1 space-y-6">
          {/* Compétences */}
          {cv.skills?.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">
                Compétences
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {cv.languages?.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">
                Langues
              </h2>
              <ul className="space-y-1.5">
                {cv.languages.map((lang, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>{lang.name}</span>
                    <span className="text-xs text-gray-400">{getLevelLabel(lang.level)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {cv.certifications?.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">
                Certifications
              </h2>
              <ul className="space-y-2">
                {cv.certifications.map((cert, i) => (
                  <li key={i}>
                    <div className="text-sm font-medium">{cert.name}</div>
                    <div className="text-xs text-gray-400">{cert.issuer} · {formatDate(cert.date)}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Formation - parfois placée ici selon la quantité */}
          {cv.education?.length > 0 && !hasManyExperiences && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">
                Formation
              </h2>
              <ul className="space-y-3">
                {cv.education.map((edu, i) => (
                  <li key={i}>
                    <div className="font-medium text-sm">{edu.degree}</div>
                    <div className="text-sm text-gray-600">{edu.institution}</div>
                    <div className="text-xs text-gray-400">
                      {formatDate(edu.startDate)} — {edu.current ? 'Présent' : formatDate(edu.endDate || '')}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* Formation en bas si beaucoup d'expériences */}
      {cv.education?.length > 0 && hasManyExperiences && (
        <div className="mt-10 pt-6 border-t border-gray-100">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
            Formation
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {cv.education.map((edu, i) => (
              <div key={i}>
                <div className="font-medium text-sm">{edu.degree}</div>
                <div className="text-sm text-gray-600">{edu.institution}</div>
                <div className="text-xs text-gray-400">
                  {formatDate(edu.startDate)} — {edu.current ? 'Présent' : formatDate(edu.endDate || '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pied de page minimal */}
      <div className="mt-10 pt-4 border-t border-gray-100 flex justify-between text-[10px] text-gray-300">
        <span>{cv.personalInfo.firstName} {cv.personalInfo.lastName}</span>
        <span>— {cv.title || 'CV'} · {new Date().getFullYear()} —</span>
      </div>
    </div>
  )
}