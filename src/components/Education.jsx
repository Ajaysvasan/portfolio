import PageShell from './PageShell'

export default function Education() {
  return (
    <PageShell id="education">
      <div className="grid gap-12 border-t border-void-line pt-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="reveal text-[11px] font-bold uppercase tracking-[0.25em] text-ink-muted" style={{ '--i': 3 }}>
            B.Tech · Expected 2027.05
          </p>
          <h3 className="mt-5 font-display text-[clamp(2.6rem,6.5vw,5.5rem)] uppercase leading-[0.92] tracking-[0.01em] text-white">
            <span className="mask-line" style={{ '--i': 3 }}>
              <span>Artificial Intelligence</span>
            </span>
            <span className="mask-line" style={{ '--i': 4 }}>
              <span>&amp; Machine Learning</span>
            </span>
          </h3>
          <p className="reveal mt-7 text-lg font-bold text-sixeyes" style={{ '--i': 5 }}>
            St. Joseph's College of Engineering, Chennai
          </p>
        </div>
        <div className="reveal md:col-span-4 md:border-l md:border-void-line md:pl-10" style={{ '--i': 5 }}>
          <span className="block font-display text-[clamp(5.5rem,13vw,10rem)] leading-[0.85] hollow-ink">8.11</span>
          <span className="mt-4 block text-[11px] font-bold uppercase tracking-[0.25em] text-ink-muted">CGPA out of 10</span>
        </div>
      </div>
    </PageShell>
  )
}
