import { ROUTES } from '../routes'
import { useReveal } from '../lib/useReveal'
import PageFooter from './PageFooter'

/**
 * Shared page frame: chapter header with a giant kanji watermark, and prev/next footer.
 * `backdrop` renders behind everything (e.g. a sticky domain scene); `theme` restyles the accents;
 * `domain` adds a line under the tagline.
 */
export default function PageShell({ id, children, backdrop, theme, domain }) {
  const index = ROUTES.findIndex((r) => r.id === id)
  const route = ROUTES[index]
  const revealRef = useReveal()

  return (
    <div ref={revealRef} className={`relative min-h-full ${theme ? `page-shell--${theme}` : ''}`}>
      {backdrop}
      <span
        aria-hidden
        lang="ja"
        className="kanji-outline pointer-events-none absolute -right-[4vw] top-16 text-[38vw] sm:text-[26vw] lg:text-[20vw]"
      >
        {route.kanji}
      </span>

      <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-32 sm:pt-36">
        <header className="mb-16 sm:mb-24">
          <p className="page-shell__eyebrow reveal flex items-center gap-4 text-ink-dim" style={{ '--i': 0 }}>
            <span className="font-display text-lg tracking-[0.08em] text-ink">{String(index).padStart(2, '0')}</span>
            <span className="page-shell__rule tear w-12" />
            <span lang="ja" className="font-jp text-sm font-semibold tracking-[0.25em]">
              {route.kanji}
            </span>
          </p>
          <h1 className="page-title mt-4">
            <span className="mask-line" style={{ '--i': 1 }}>
              <span>{route.label}</span>
            </span>
          </h1>
          {route.tagline && (
            <p className="reveal mt-5 text-lg text-ink-dim" style={{ '--i': 2 }}>
              {route.tagline}
            </p>
          )}
          {domain && (
            <p className="page-shell__domain reveal mt-5" style={{ '--i': 2 }}>
              {domain}
            </p>
          )}
        </header>

        {children}

        <PageFooter id={id} />
      </div>
    </div>
  )
}
