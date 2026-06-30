import { CV } from '@/types'

interface TemplateProps {
  cv: CV
}

/**
 * CLASSIC — colonne unique centrée, séparateurs horizontaux, registre
 * "CV traditionnel". Pensé pour les candidatures dans des secteurs plus
 * formels (juridique, finance, administration).
 */
export function ClassicTemplate({ cv }: TemplateProps) {
  const primary = cv.styling?.primaryColor || '#E11D2E'
  const fontFamily = cv.styling?.fontFamily || 'Inter'
  const fontSize = cv.styling?.fontSize || 14

  return (
    <div
      className="pdf-content max-w-2xl mx-auto p-6 sm:p-10 bg-white text-ink"
      style={{ fontFamily, fontSize: `${fontSize}px` }}
    >
      <header className="text-center pb-6 border-b-2" style={{ borderColor: primary }}>
        <h1 className="text-3xl font-display font-semibold tracking-tight">
          {cv.personalInfo.firstName} {cv.personalInfo.lastName}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {cv.personalInfo.email}
          {cv.personalInfo.phone && ` · ${cv.personalInfo.phone}`}
          {cv.personalInfo.address && ` · ${cv.personalInfo.address}`}
        </p>
        <p className="text-sm mt-1">
          {cv.personalInfo.linkedin && (
            <a href={cv.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: primary }}>
              LinkedIn
            </a>
          )}
          {cv.personalInfo.linkedin && cv.personalInfo.portfolio && '  ·  '}
          {cv.personalInfo.portfolio && (
            <a href={cv.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: primary }}>
              Portfolio
            </a>
          )}
        </p>
      </header>

      {cv.personalInfo.summary && (
        <section className="mt-6 text-center">
          <p className="text-ink-soft italic leading-relaxed">{cv.personalInfo.summary}</p>
        </section>
      )}

      {cv.experience?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-center font-display text-sm uppercase tracking-[0.2em] mb-4" style={{ color: primary }}>
            Expérience professionnelle
          </h2>
          <div className="space-y-5">
            {cv.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{exp.position}, {exp.company}</h3>
                  <span className="text-xs text-ink-soft whitespace-nowrap ml-2">
                    {exp.startDate} – {exp.current ? 'Présent' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-ink-soft mt-1 leading-relaxed">{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm mt-1 text-ink-soft">
                    {exp.achievements.map((a, j) => <li key={j}>{a}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.education?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-center font-display text-sm uppercase tracking-[0.2em] mb-4" style={{ color: primary }}>
            Formation
          </h2>
          <div className="space-y-4">
            {cv.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{edu.degree} en {edu.field}</h3>
                  <span className="text-xs text-ink-soft whitespace-nowrap ml-2">
                    {edu.startDate} – {edu.current ? 'Présent' : edu.endDate}
                  </span>
                </div>
                <div className="text-sm text-ink-soft">{edu.institution}</div>
                {edu.gpa && <div className="text-xs text-ink-soft">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {cv.skills?.length > 0 && (
          <section>
            <h2 className="text-center font-display text-sm uppercase tracking-[0.2em] mb-3" style={{ color: primary }}>
              Compétences
            </h2>
            <p className="text-sm text-ink-soft text-center">
              {cv.skills.map(s => s.name).join(' · ')}
            </p>
          </section>
        )}
        {cv.languages?.length > 0 && (
          <section>
            <h2 className="text-center font-display text-sm uppercase tracking-[0.2em] mb-3" style={{ color: primary }}>
              Langues
            </h2>
            <p className="text-sm text-ink-soft text-center">
              {cv.languages.map(l => `${l.name} (${l.level})`).join(' · ')}
            </p>
          </section>
        )}
      </div>

      {cv.certifications?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-center font-display text-sm uppercase tracking-[0.2em] mb-3" style={{ color: primary }}>
            Certifications
          </h2>
          <p className="text-sm text-ink-soft text-center">
            {cv.certifications.map(c => `${c.name} — ${c.issuer} (${c.date})`).join(' · ')}
          </p>
        </section>
      )}

      {cv.projects?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-center font-display text-sm uppercase tracking-[0.2em] mb-4" style={{ color: primary }}>
            Projets
          </h2>
          <div className="space-y-3 text-center">
            {cv.projects.map((p, i) => (
              <div key={i}>
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <p className="text-sm text-ink-soft">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
