const skills = [
  { label: 'Languages', items: 'Python, C++, JavaScript / TypeScript, SQL' },
  { label: 'Backend', items: 'FastAPI, Flask, REST APIs, JWT Auth, PostgreSQL, ETL Pipelines' },
  { label: 'Frontend', items: 'React.js, HTML, CSS' },
  { label: 'AI/ML', items: 'Embeddings, RAG, NLP' },
  { label: 'Tools', items: 'Git, Linux, Selenium, OpenCV' },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-anime-text mb-12 font-anime">
          Technical Skills
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map(({ label, items }) => (
            <div
              key={label}
              className="p-5 rounded-xl bg-anime-card border border-anime-border shadow-sm hover:shadow-anime-glow hover:border-anime-purple/40 transition-all duration-300"
            >
              <h4 className="text-sm font-semibold text-anime-lavender uppercase tracking-wider">
                {label}
              </h4>
              <p className="mt-2 text-anime-text-dim text-sm">{items}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
