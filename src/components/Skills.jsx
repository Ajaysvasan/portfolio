import HoverRevealText from './HoverRevealText'

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
        <HoverRevealText
          label="Technical Skills"
          reveal="What I use"
          className="text-3xl sm:text-4xl mb-12 block"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map(({ label, items }) => (
            <div
              key={label}
              className="p-5 rounded-xl bg-jjk-card border border-jjk-border shadow-sm hover:shadow-[0_0_32px_rgba(147,51,234,0.25)] hover:border-jjk-curse/50 transition-all duration-300 curse-card"
            >
              <h4 className="text-sm font-semibold text-jjk-silver uppercase tracking-wider">
                {label}
              </h4>
              <p className="mt-2 text-jjk-text-dim text-sm">{items}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
