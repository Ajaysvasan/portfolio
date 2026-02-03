import { useRef, useEffect } from 'react'

const jobs = [
  {
    title: 'Full Stack Developer Intern',
    period: 'Dec 2025 – Jan 2026',
    company: 'OneYes Infotech Solutions Pvt. Ltd.',
    points: [
      'Developing a role-based online assessment platform with backend APIs.',
      'Implementing authentication, authorization, and frontend integration.',
    ],
  },
  {
    title: 'Data Scraping Intern',
    period: 'Jul 2025 – Sep 2025',
    company: 'Data Patterns, Chennai',
    points: [
      'Built automated scraping pipelines using Selenium and BeautifulSoup, processing 34,000+ records.',
      'Designed ETL workflows with validation and error handling; improved reliability and data quality.',
      'Optimized scraping performance by 25% using batching and retry logic.',
    ],
  },
]

function Card({ job, speed = 0.1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const y = window.scrollY
      const offset = (y - rect.top) * speed
      el.style.transform = `translateY(${Math.min(offset * 0.5, 20)}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return (
    <article
      ref={ref}
      className="p-6 sm:p-8 rounded-2xl bg-anime-card backdrop-blur border border-anime-border shadow-sm hover:shadow-anime-glow hover:border-anime-purple/40 transition-all duration-300"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-anime-text font-anime">{job.title}</h3>
        <span className="text-sm text-anime-muted whitespace-nowrap">{job.period}</span>
      </div>
      <p className="mt-2 text-anime-cyan font-medium">{job.company}</p>
      <ul className="mt-4 space-y-2 text-anime-text-dim text-sm">
        {job.points.map((point, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-anime-pink mt-1.5">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-anime-text mb-12 font-anime">
          Experience
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job, i) => (
            <Card key={job.title} job={job} speed={0.08 + i * 0.04} />
          ))}
        </div>
      </div>
    </section>
  )
}
