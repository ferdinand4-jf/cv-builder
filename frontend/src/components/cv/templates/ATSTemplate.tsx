import { CV } from '../../../types'

interface TemplateProps {
  cv: CV
}

/**
 * ATS_FRIENDLY — zéro mise en page complexe, zéro tableau, zéro icône.
 * Texte brut hiérarchisé par du gras et des majuscules, pour passer les
 * parseurs de candidature (ATS) sans perte d'information. La couleur de
 * marque n'est utilisée qu'en un seul endroit, à dessein.
 */
export function ATSTemplate({ cv }: TemplateProps) {
  const primary = cv.styling?.primaryColor || '#101828'
  const fontSize = cv.styling?.fontSize || 14

  return (
    <div
      className="pdf-content max-w-2xl mx-auto p-6 sm:p-10 bg-white text-ink font-body"
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
    >
      <header>
        <h1 className="text-2xl font-bold" style={{ color: primary }}>
          {cv.personalInfo.firstName} {cv.personalInfo.lastName}
        </h1>
        <p className="text-sm mt-1">
          {cv.personalInfo.email}
          {cv.personalInfo.phone && ` | ${cv.personalInfo.phone}`}
          {cv.personalInfo.address && ` | ${cv.personalInfo.address}`}
        </p>
        <p className="text-sm">
          {cv.personalInfo.linkedin && <span>{cv.personalInfo.linkedin}</span>}
          {cv.personalInfo.linkedin && cv.personalInfo.portfolio && ' | '}
          {cv.personalInfo.portfolio && <span>{cv.personalInfo.portfolio}</span>}
        </p>
      </header>

      {cv.personalInfo.summary && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase border-b border-ink pb-1 mb-2">Résumé</h2>
          <p className="text-sm">{cv.personalInfo.summary}</p>
        </section>
      )}

      {cv.experience?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase border-b border-ink pb-1 mb-2">Expérience professionnelle</h2>
          <div className="space-y-4">
            {cv.experience.map((exp, i) => (
              <div key={i} className="text-sm">
                <p className="font-bold">
                  {exp.position} — {exp.company}
                </p>
                <p>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</p>
                <p className="mt-1">{exp.description}</p>
                {(exp.achievements?.length ?? 0) > 0 && (
                  <ul className="list-disc list-inside mt-1">
                    {(exp.achievements || []).map((a, j) => <li key={j}>{a}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.education?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase border-b border-ink pb-1 mb-2">Formation</h2>
          <div className="space-y-3">
            {cv.education.map((edu, i) => (
              <div key={i} className="text-sm">
                <p className="font-bold">{edu.degree} en {edu.field} — {edu.institution}</p>
                <p>{edu.startDate} - {edu.current ? 'Présent' : edu.endDate}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.skills?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase border-b border-ink pb-1 mb-2">Compétences</h2>
          <p className="text-sm">{cv.skills.map(s => `${s.name} (${s.level})`).join(', ')}</p>
        </section>
      )}

      {cv.languages?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase border-b border-ink pb-1 mb-2">Langues</h2>
          <p className="text-sm">{cv.languages.map(l => `${l.name} (${l.level})`).join(', ')}</p>
        </section>
      )}

      {cv.certifications?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase border-b border-ink pb-1 mb-2">Certifications</h2>
          <ul className="text-sm list-disc list-inside">
            {cv.certifications.map((c, i) => <li key={i}>{c.name} — {c.issuer} ({c.date})</li>)}
          </ul>
        </section>
      )}

      {cv.projects?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase border-b border-ink pb-1 mb-2">Projets</h2>
          <div className="space-y-2 text-sm">
            {cv.projects.map((p, i) => (
              <p key={i}><span className="font-bold">{p.name}.</span> {p.description}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
