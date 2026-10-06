import { useEffect, useRef, useState } from 'react'
import { routeHref } from '../routes'
import { useReveal } from '../lib/useReveal'
import { NUMERALS, projects } from '../data/projects'
import SectionLabel from './SectionLabel'
import PageFooter from './PageFooter'

const profile = [
  { label: 'Role', value: 'Software Engineer — AI & ML' },
  { label: 'Base', value: 'Chennai, India' },
  { label: 'Study', value: "B.Tech, Artificial Intelligence & Machine Learning — St. Joseph's College of Engineering, expected 2027" },
  { label: 'Recently', value: 'Full Stack Developer Intern, OneYes Infotech Solutions' },
  { label: 'Focus', value: 'Retrieval-augmented systems, persistent memory, backend APIs' },
  { label: 'Wins', value: 'IEEE Hackathon Winner, IBM Datathon Global Finalist' },
]

/** Asks App to play the opening again (it listens for this event). */
const replayIntro = () => window.dispatchEvent(new Event('replay-intro'))

export default function Home() {
  const [imgError, setImgError] = useState(false)
  const revealRef = useReveal()
  const heroRef = useRef(null)

  // slow parallax on the key visual as the page scrolls
  useEffect(() => {
    const hero = heroRef.current
    const page = hero?.closest('.page')
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => hero.style.setProperty('--hero-scroll', String(Math.min(page.scrollTop, 1200))))
    }
    page.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      page.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div ref={revealRef}>
      <section ref={heroRef} className="hero relative overflow-hidden">
        <figure className="key-visual reveal" style={{ '--i': 1 }}>
          {!imgError ? (
            <img src="/images/profile.jpg" alt="Ajay S Vasan" width="1280" height="1280" onError={() => setImgError(true)} />
          ) : (
            <div className="key-visual__placeholder">
              <span>KEY VISUAL — images/profile.jpg</span>
            </div>
          )}
          <span className="key-visual__tear" aria-hidden />
          <button type="button" className="pv-button" onClick={replayIntro}>
            <span className="pv-button__play" aria-hidden />
            <span className="flex flex-col items-start">
              <span>Replay intro</span>
              <span lang="ja" className="pv-button__jp">
                領域展開
              </span>
            </span>
          </button>
        </figure>

        <span aria-hidden lang="ja" className="hero__vertical">
          天上天下唯我独尊
        </span>

        <div className="hero__copy relative mx-auto max-w-6xl px-6">
          <div className="lg:max-w-[56%]">
            <p className="reveal text-[11px] font-bold uppercase tracking-[0.3em] text-ink-dim" style={{ '--i': 0 }}>
              Software engineer — AI &amp; ML — Chennai, India
            </p>
            <h1 className="hero__name mt-5">
              <span className="mask-line" style={{ '--i': 1 }}>
                <span>Ajay</span>
              </span>
              <span className="mask-line" style={{ '--i': 2 }}>
                <span>S Vasan</span>
              </span>
            </h1>
            <p lang="ja" className="reveal mt-3 text-sm tracking-[0.4em] text-ink-dim" style={{ '--i': 3 }}>
              アジェイ・S・ヴァサン
            </p>

            <div className="tear reveal mt-9 w-44" style={{ '--i': 3 }} />

            <p className="reveal mt-9 font-display text-3xl uppercase tracking-[0.02em] sm:text-4xl" style={{ '--i': 4 }}>
              <span className="hollow-ink">Build impact.</span>
            </p>
            <p className="reveal mt-4 max-w-md text-[17px] leading-relaxed text-ink-dim" style={{ '--i': 4 }}>
              Software Engineer & AI/ML enthusiast — building systems that scale and ideas that connect.
            </p>

            <div className="reveal mt-9 flex flex-wrap gap-3" style={{ '--i': 5 }}>
              <a href="mailto:ajay192006@gmail.com" className="btn-hollow">
                Email me
              </a>
              <a href="https://github.com/Ajaysvasan" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                GitHub
              </a>
              <a href="https://linkedin.com/in/ajay-s-vasan-584111291" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <span className="hero__scroll" aria-hidden>
          Scroll
        </span>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        {/* profile, set like a character sheet */}
        <section className="home-section">
          <SectionLabel index="01" en="Profile" jp="プロフィール" />
          <div className="mt-12 grid gap-12 md:grid-cols-12">
            <h2 className="profile__quote md:col-span-5">
              <span className="mask-line">
                <span>Systems that</span>
              </span>
              <span className="mask-line" style={{ '--i': 1 }}>
                <span>scale. Ideas</span>
              </span>
              <span className="mask-line" style={{ '--i': 2 }}>
                <span>that connect.</span>
              </span>
            </h2>
            <dl className="profile__sheet md:col-span-7">
              {profile.map(({ label, value }, i) => (
                <div key={label} className="reveal" style={{ '--i': i }}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* works index — into Sukuna's domain */}
        <section className="home-section">
          <SectionLabel index="02" en="Works" jp="作品" />
          <ol className="works mt-12">
            {projects.map((project, i) => (
              <li key={project.title} className="reveal" style={{ '--i': i }}>
                <a href={routeHref('projects')} className="works__row">
                  <span lang="ja" className="works__num">
                    {NUMERALS[i] ?? i + 1}
                  </span>
                  <span className="works__title">{project.title}</span>
                  <span className="works__tagline">{project.tagline}</span>
                  <span className="works__cut" aria-hidden />
                </a>
              </li>
            ))}
          </ol>
          <a href={routeHref('projects')} className="btn-ghost reveal mt-10">
            View all works
          </a>
        </section>

        {/* contact */}
        <section className="home-section">
          <SectionLabel index="03" en="Contact" jp="お問い合わせ" />
          <p className="cta-band__line mt-10">
            <span className="mask-line">
              <span>Have a project</span>
            </span>
            <span className="mask-line" style={{ '--i': 1 }}>
              <span>in mind?</span>
            </span>
          </p>
          <div className="reveal mt-10 flex flex-wrap gap-3" style={{ '--i': 2 }}>
            <a href={routeHref('contact')} className="btn-hollow">
              Get in touch
            </a>
            <a href="mailto:ajay192006@gmail.com" className="btn-ghost !normal-case !tracking-[0.06em]">
              ajay192006@gmail.com
            </a>
          </div>
        </section>

        <PageFooter id="home" />
      </div>
    </div>
  )
}
