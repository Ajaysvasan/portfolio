import { useEffect, useState } from 'react'
import { ROUTES, routeHref } from '../routes'
import * as sfx from '../lib/sfx'

const links = ROUTES.filter((r) => r.id !== 'home' && r.id !== 'contact')

export default function Nav({ current }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sound, setSound] = useState(sfx.isEnabled)

  useEffect(() => sfx.subscribe(setSound), [])

  // close the mobile menu and reset the backdrop whenever the page changes
  useEffect(() => {
    setOpen(false)
    setScrolled(false)
  }, [current])

  // pages scroll inside their own layers; listen in the capture phase to hear them
  useEffect(() => {
    const onScroll = (e) => {
      if (e.target.classList?.contains('page')) setScrolled(e.target.scrollTop > 40)
    }
    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => document.removeEventListener('scroll', onScroll, { capture: true })
  }, [])

  // the overlay menu closes on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled && !open ? 'border-void-line bg-void/85 backdrop-blur-md' : 'border-transparent bg-gradient-to-b from-void/80 to-transparent'
      }`}
    >
      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href={routeHref('home')} className="group flex items-center gap-3" aria-current={current === 'home' ? 'page' : undefined}>
          <span className="h-2.5 w-2.5 bg-hollow shadow-[0_0_14px_3px_rgba(168,85,247,0.6)] transition-transform group-hover:rotate-45" />
          <span className="font-display text-lg uppercase tracking-[0.12em] text-white">Ajay S Vasan</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={routeHref(id)}
              aria-current={current === id ? 'page' : undefined}
              className={`link-tear text-[11px] font-bold uppercase tracking-[0.22em] transition-colors ${current === id ? 'text-white' : 'text-ink-dim hover:text-white'}`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`sound-toggle ${sound ? 'is-on' : ''}`}
            aria-pressed={sound}
            aria-label={sound ? 'Mute sound effects' : 'Turn on sound effects'}
            title={sound ? 'Sound on' : 'Sound off'}
            onClick={() => sfx.setEnabled(!sound)}
          >
            <span />
            <span />
            <span />
            <span />
          </button>
          <a href={routeHref('contact')} className="btn-hollow hidden !px-4 !py-2.5 sm:inline-flex">
            Get in touch
          </a>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-void-line md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`h-px w-4 bg-white transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`h-px w-4 bg-white transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div id="site-menu" className="site-menu md:hidden">
          <ol className="mx-auto max-w-6xl px-6">
            {ROUTES.map(({ id, label, kanji }, i) => (
              <li key={id} className="site-menu__item" style={{ '--i': i }}>
                <a href={routeHref(id)} aria-current={current === id ? 'page' : undefined} className="site-menu__link">
                  <span className="site-menu__index">{String(i).padStart(2, '0')}</span>
                  <span className="site-menu__label">{label}</span>
                  <span lang="ja" className="site-menu__jp">
                    {kanji}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </nav>
  )
}
