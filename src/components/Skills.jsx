import PageShell from './PageShell'

const skills = [
  { label: 'Languages', items: ['Python', 'C++', 'JavaScript / TypeScript', 'SQL'] },
  { label: 'Backend', items: ['FastAPI', 'Flask', 'REST APIs', 'JWT Auth', 'PostgreSQL', 'ETL Pipelines'] },
  { label: 'Frontend', items: ['React.js', 'HTML', 'CSS'] },
  { label: 'AI/ML', items: ['Embeddings', 'RAG', 'NLP'] },
  { label: 'Tools', items: ['Git', 'Linux', 'Selenium', 'OpenCV'] },
]

/** Set like a film's end credits: the role on the left of the spine, the names on the right. */
export default function Skills() {
  return (
    <PageShell id="skills">
      <dl className="credits">
        {skills.map(({ label, items }, i) => (
          <div key={label} className="credits__block reveal" style={{ '--i': i + 3 }}>
            <dt className="credits__role">{label}</dt>
            <dd className="credits__names">
              {items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </PageShell>
  )
}
