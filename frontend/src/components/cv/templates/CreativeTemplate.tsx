import { CV } from '../../../types'

interface TemplateProps {
  cv: CV
}

/**
 * CREATIVE — bandeau de couleur en en-tête, pastilles pour les compétences,
 * grille deux colonnes pour le contenu secondaire. Pour les profils design /
 * communication qui veulent un CV qui sort visuellement du lot.
 */
export function CreativeTemplate({ cv }: TemplateProps) {
  const primary = cv.styling?.primaryColor || '#E11D2E'
  const secondary = cv.styling?.secondaryColor || '#101828'
  const fontFamily = cv.styling?.fontFamily || 'Inter'
  const fontSize = cv.styling?.fontSize || 14

  return (
    <div className="pdf-content bg-white text-ink" style={{ fontFamily, fontSize: `${fontSize}px` }}>
      <header
        className="p-6 sm:p-10 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
      >
        <div
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-20"
          style={{ backgroundColor: '#fff' }}
        />
        <h1 className="text-3xl sm:text-4xl font-display font-bold relative z-10">
          {cv.personalInfo.firstName}<br />{cv.personalInfo.lastName}
        </h1>
        <p className="mt-3 text-sm opacity-90 relative z-10">
          {cv.personalInfo.email}
          {cv.personalInfo.phone && ` · ${cv.personalInfo.phone}`}
        </p>
        <p className="text-sm opacity-90 relative z-10">
          {cv.personalInfo.linkedin && (
            <a href={cv.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="underline">
              LinkedIn
            </a>
          )}
          {cv.personalInfo.linkedin && cv.personalInfo.portfolio && '  ·  '}
          {cv.personalInfo.portfolio && (
            <a href={cv.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="underline">
              Portfolio
            </a>
          )}
        </p>
      </header>

      <div className="p-6 sm:p-10 space-y-8">
        {cv.personalInfo.summary && (
          <section>
            <p className="text-lg text-ink-soft leading-relaxed font-display">{cv.personalInfo.summary}</p>
          </section>
        )}

        {cv.skills?.length > 0 && (
          <section>
            <h2 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: primary }}>
              Compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: i % 2 === 0 ? primary : secondary }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8">
            {cv.experience?.length > 0 && (
              <section>
                <h2 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: primary }}>
                  Expérience
                </h2>
                <div className="space-y-5">
                  {cv.experience.map((exp, i) => (
                    <div key={i} className="relative pl-5">
                      <span
                        className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: primary }}
                      />
                      <div className="flex flex-wrap justify-between gap-1">
                        <h3 className="font-semibold">{exp.position}</h3>
                        <span className="text-xs text-ink-soft font-mono">
                          {exp.startDate} – {exp.current ? 'Présent' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-sm font-medium" style={{ color: secondary }}>{exp.company}</div>
                      <p className="text-sm mt-1 text-ink-soft leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {cv.projects?.length > 0 && (
              <section>
                <h2 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: primary }}>
                  Projets
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cv.projects.map((p, i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <h3 className="font-semibold text-sm">{p.name}</h3>
                      <p className="text-sm text-ink-soft">{p.description}</p>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: primary }}>
                          Voir le projet
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {cv.education?.length > 0 && (
              <section>
                <h2 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: primary }}>
                  Formation
                </h2>
                <div className="space-y-3">
                  {cv.education.map((edu, i) => (
                    <div key={i} className="text-sm">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <div className="text-ink-soft">{edu.institution}</div>
                      <div className="text-xs text-ink-soft font-mono">
                        {edu.startDate} – {edu.current ? 'Présent' : edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {cv.languages?.length > 0 && (
              <section>
                <h2 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: primary }}>
                  Langues
                </h2>
                <ul className="text-sm space-y-1">
                  {cv.languages.map((lang, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{lang.name}</span>
                      <span className="text-ink-soft">{lang.level}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {cv.certifications?.length > 0 && (
              <section>
                <h2 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: primary }}>
                  Certifications
                </h2>
                <ul className="text-sm space-y-2">
                  {cv.certifications.map((cert, i) => (
                    <li key={i}>
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-xs text-ink-soft">{cert.issuer} · {cert.date}</div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
