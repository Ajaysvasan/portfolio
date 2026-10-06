import PageShell from './PageShell'

const jobs = [
  {
    title: 'Full Stack Developer Intern',
    from: '2025.12',
    to: '2026.01',
    kind: 'Internship',
    company: 'OneYes Infotech Solutions Pvt. Ltd.',
    points: [
      'Developing a role-based online assessment platform with backend APIs.',
      'Implementing authentication, authorization, and frontend integration.',
    ],
  },
  {
    title: 'Data Scraping Intern',
    from: '2025.07',
    to: '2025.09',
    kind: 'Internship',
    company: 'Data Patterns, Chennai',
    points: [
      'Built automated scraping pipelines using Selenium and BeautifulSoup, processing 34,000+ records.',
      'Designed ETL workflows with validation and error handling; improved reliability and data quality.',
      'Optimized scraping performance by 25% using batching and retry logic.',
    ],
  },
]

export default function Experience() {
  return (
    <PageShell id="experience">
      <ol className="border-t border-void-line">
        {jobs.map((job, i) => (
          <li key={job.title} className="reveal grid gap-x-10 gap-y-5 border-b border-void-line py-10 md:grid-cols-12" style={{ '--i': i + 3 }}>
            <div className="md:col-span-3">
              <p className="font-display text-2xl tracking-[0.04em] text-ink">
                {job.from} <span className="text-ink-muted">—</span> {job.to}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-ink-muted">{job.kind}</p>
            </div>
            <div className="md:col-span-9">
              <h3 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-white sm:text-4xl">{job.title}</h3>
              <p className="mt-2 font-bold text-sixeyes">{job.company}</p>
              <ul className="mt-6 max-w-2xl space-y-3 text-[15px] leading-relaxed text-ink-dim">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-4">
                    <span className="tear mt-[0.7em] w-4 shrink-0" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </PageShell>
  )
}
