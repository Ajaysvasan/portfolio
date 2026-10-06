import PageShell from './PageShell'
import ShrineBackdrop from './sukuna/ShrineBackdrop'
import * as sfx from '../lib/sfx'
import { NUMERALS, projects } from '../data/projects'

let lastSlash = 0
function cleave(e) {
  const now = performance.now()
  if (now - lastSlash < 250) return
  lastSlash = now
  const rect = e.currentTarget.getBoundingClientRect()
  sfx.slash({ gain: 0.2, pan: ((rect.left + rect.width / 2) / window.innerWidth) * 1.6 - 0.8 })
}

// Sukuna's face markings
function Marks({ className = '' }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden>
      <path d="M2 6 Q20 2 38 5 L36 8 Q20 6 4 9 Z" />
      <path d="M6 16 Q20 12 34 15 L32 18 Q20 16 8 19 Z" />
    </svg>
  )
}

function Rich({ text }) {
  return text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
}

function Section({ jp, label, paragraphs }) {
  return (
    <section>
      <h4 className="cursed-card__label">
        <span className="cursed-card__label-jp">{jp}</span>
        {label}
      </h4>
      <div className="cursed-card__prose">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 32)}>
            <Rich text={p} />
          </p>
        ))}
      </div>
    </section>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export default function Projects() {
  return (
    <PageShell id="projects" theme="sukuna" backdrop={<ShrineBackdrop />} domain="領域展開 · 伏魔御厨子 — Malevolent Shrine">
      {/* on wide screens the scrolls keep left so the shrine stands clear on the right */}
      <div className="grid gap-8 lg:max-w-[62%]">
        {projects.map((project, i) => (
          <article key={project.title} className="cursed-card reveal" style={{ '--i': i + 3 }} onMouseEnter={cleave}>
            <span className="cursed-card__slash" aria-hidden />
            <span className="cursed-card__slash cursed-card__slash--cross" aria-hidden />
            <div className="cursed-card__body">
              <header className="flex items-start gap-5">
                <span className="cursed-card__num">{NUMERALS[i] ?? i + 1}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.02em] text-[#f5ebe0] sm:text-4xl">{project.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#e4bcb4]">{project.tagline}</p>
                </div>
                <Marks className="cursed-card__marks hidden sm:block" />
              </header>
              <Section jp="課題" label="The problem" paragraphs={project.problem} />
              <Section jp="解法" label="How we solved it" paragraphs={project.solution} />
              <div className="mt-7 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="cursed-chip">
                    {tag}
                  </span>
                ))}
              </div>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="cursed-link">
                  <GithubIcon />
                  Source code
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
