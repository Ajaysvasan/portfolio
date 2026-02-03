import { useRef, useEffect } from 'react'
import CursorFollowSection from './CursorFollowSection'

const projects = [
  {
    tags: 'Python, PostgreSQL, React',
    title: 'Discord + Codeforces Integrated Coding Platform',
    description:
      'Collaborative competitive programming platform with Discord-based workflows. Python backend, PostgreSQL for users, contests, and submissions. Secure coding rooms and role-based access control.',
  },
  {
    tags: 'C++, Windows System Programming',
    title: 'Focus Guard',
    description:
      'Windows utility to block distracting applications during focus sessions. Real-time process monitoring and termination using OS APIs.',
  },
  {
    tags: 'Python, RAG, React',
    title: 'Memory Retrieval System',
    description:
      'Semantic memory retrieval using embeddings and vector search. React frontend for querying documents and logs.',
  },
]

function ProjectCard({ project, speed }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const y = window.scrollY
      const offset = (y - rect.top) * speed
      el.style.transform = `translateY(${Math.min(offset * 0.3, 15)}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return (
    <article
      ref={ref}
      className="p-6 sm:p-8 rounded-2xl bg-anime-card backdrop-blur border border-anime-border shadow-sm hover:shadow-anime-glow-cyan hover:border-anime-cyan/40 transition-all duration-300"
    >
      <p className="text-xs font-medium text-anime-pink uppercase tracking-wider">
        {project.tags}
      </p>
      <h3 className="mt-3 text-lg font-semibold text-anime-text font-anime">{project.title}</h3>
      <p className="mt-3 text-anime-text-dim text-sm leading-relaxed">{project.description}</p>
    </article>
  )
}

export default function Projects() {
  return (
    <CursorFollowSection id="projects" className="py-24 sm:py-32 scroll-mt-20 bg-anime-surface/30">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-anime-text mb-12 font-anime">
          Projects
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} speed={0.06 + i * 0.02} />
          ))}
        </div>
      </div>
    </CursorFollowSection>
  )
}
