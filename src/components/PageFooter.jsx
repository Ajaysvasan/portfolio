import { ROUTES, routeHref } from '../routes'

/** Previous / next page links and the credit line, at the foot of every page. */
export default function PageFooter({ id }) {
  const index = ROUTES.findIndex((r) => r.id === id)
  const prev = ROUTES[index - 1]
  const next = ROUTES[index + 1]

  return (
    <footer className="mt-28">
      <div className="tear opacity-70" />
      <nav className="mt-10 grid grid-cols-2 gap-6" aria-label="Pages">
        {prev ? (
          <a href={routeHref(prev.id)} className="page-step">
            <span className="page-step__caption">Previous</span>
            <span className="page-step__label">{prev.label}</span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={routeHref(next.id)} className="page-step page-step--next">
            <span className="page-step__caption">Next</span>
            <span className="page-step__label">{next.label}</span>
          </a>
        )}
      </nav>
      <p className="mt-16 text-[11px] uppercase tracking-[0.25em] text-ink-muted">
        © {new Date().getFullYear()} Ajay S Vasan — Chennai, India
      </p>
    </footer>
  )
}
