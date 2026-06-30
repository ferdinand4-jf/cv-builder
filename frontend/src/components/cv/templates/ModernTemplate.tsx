// ModernTemplate.tsx - Version avec titre (version optimisée sans barres)
import { CV } from '../../../types'

interface TemplateProps {
  cv: CV
}

export function ModernTemplate({ cv }: TemplateProps) {
  const primary = cv.styling?.primaryColor || '#1a1a2e'
  const secondary = cv.styling?.secondaryColor || '#16213e'
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

  return (
    <div
      className="pdf-content grid grid-cols-[240px_1fr] w-[794px] min-h-[1123px] overflow-hidden"
      style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight: 1.5 }}
    >
      {/* Sidebar */}
      <aside
        className="p-7 text-white flex flex-col"
        style={{ 
          backgroundColor: secondary,
          backgroundImage: `linear-gradient(180deg, ${secondary} 0%, ${primary} 100%)`
        }}
      >
        {/* Titre du CV dans la sidebar */}
        {cv.title && (
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 text-center">
              {cv.title}
            </div>
            <div className="w-8 h-0.5 mx-auto mt-2 rounded-full opacity-30" style={{ backgroundColor: primary }} />
          </div>
        )}

        <div className="mb-6">
          <div 
            className="w-28 h-28 rounded-full mx-auto flex items-center justify-center text-4xl font-light border-2 border-white/30"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            {cv.personalInfo.firstName?.[0]}{cv.personalInfo.lastName?.[0]}
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight leading-tight">
            {cv.personalInfo.firstName} {cv.personalInfo.lastName}
          </h1>
          <div 
            className="w-12 h-0.5 mx-auto mt-3 rounded-full"
            style={{ backgroundColor: primary }}
          />
        </div>

        <div className="space-y-2 text-sm mb-6">
          <h2 className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium mb-3">Contact</h2>
          {cv.personalInfo.email && <p className="text-sm opacity-90 break-all">{cv.personalInfo.email}</p>}
          {cv.personalInfo.phone && <p className="text-sm opacity-90">{cv.personalInfo.phone}</p>}
          {cv.personalInfo.address && <p className="text-sm opacity-70 text-xs">{cv.personalInfo.address}</p>}
          {cv.personalInfo.linkedin && (
            <a href={cv.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm opacity-90 hover:opacity-100 transition-opacity block truncate" style={{ color: primary }}>
              LinkedIn
            </a>
          )}
          {cv.personalInfo.portfolio && (
            <a href={cv.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm opacity-90 hover:opacity-100 transition-opacity block truncate" style={{ color: primary }}>
              Portfolio
            </a>
          )}
        </div>

        {cv.skills?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium mb-3">Compétences</h2>
            <div className="flex flex-wrap gap-1.5">
              {cv.skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-0.5 text-xs rounded-full bg-white/10 backdrop-blur-sm border border-white/5">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {cv.languages?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium mb-3">Langues</h2>
            <ul className="space-y-1.5 text-sm">
              {cv.languages.map((lang, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>{lang.name}</span>
                  <span className="text-xs opacity-60">{getLevelLabel(lang.level)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cv.certifications?.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium mb-3">Certifications</h2>
            <ul className="space-y-2 text-sm">
              {cv.certifications.map((cert, i) => (
                <li key={i}>
                  <div className="font-medium text-sm">{cert.name}</div>
                  <div className="text-xs opacity-60">{cert.issuer} · {formatDate(cert.date)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex-1" />
        <div className="pt-4 border-t border-white/10 mt-4">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 text-center">
            {cv.title || 'CV'} • {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* Main column */}
      <main className="p-8 bg-white text-[#1a1a2e] flex flex-col">
        {cv.personalInfo.summary && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: primary }}>Profil</h2>
            </div>
            <p className="text-sm leading-relaxed opacity-80 italic">{cv.personalInfo.summary}</p>
          </section>
        )}

        {cv.experience?.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: primary }}>Expériences</h2>
            </div>
            <div className="space-y-5">
              {cv.experience.map((exp, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-4 top-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h3 className="font-semibold text-[15px]">{exp.position}</h3>
                    <span className="text-xs opacity-60 font-mono">
                      {formatDate(exp.startDate)} — {exp.current ? 'Aujourd\'hui' : formatDate(exp.endDate || '')}
                    </span>
                  </div>
                  <div className="text-sm font-medium opacity-70 mb-1">{exp.company}</div>
                  <p className="text-sm leading-relaxed opacity-80">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5 text-sm opacity-75">
                      {exp.achievements.map((a, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-xs mt-0.5">•</span>
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

        {cv.education?.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: primary }}>Formation</h2>
            </div>
            <div className="space-y-4">
              {cv.education.map((edu, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-4 top-0.5 w-2 h-2 rounded-full border-2" style={{ borderColor: primary }} />
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h3 className="font-semibold text-[15px]">{edu.degree} · {edu.field}</h3>
                    <span className="text-xs opacity-60 font-mono">
                      {formatDate(edu.startDate)} — {edu.current ? 'Aujourd\'hui' : formatDate(edu.endDate || '')}
                    </span>
                  </div>
                  <div className="text-sm opacity-70">{edu.institution}</div>
                  {edu.gpa && <div className="text-xs opacity-50 mt-0.5">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.projects?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: primary }}>Projets</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cv.projects.map((p, i) => (
                <div key={i} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <p className="text-xs opacity-70 mt-0.5 leading-relaxed">{p.description}</p>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium mt-1 inline-block" style={{ color: primary }}>
                      Voir →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex-1" />
        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between text-[10px] opacity-30">
          <span>{cv.personalInfo.firstName} {cv.personalInfo.lastName}</span>
          <span>— {cv.title || 'CV'} · 1/1 —</span>
        </div>
      </main>
    </div>
  )
}