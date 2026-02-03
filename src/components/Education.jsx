import HoverRevealText from './HoverRevealText'

export default function Education() {
  return (
    <section id="education" className="py-24 sm:py-32 scroll-mt-20 bg-jjk-surface/30">
      <div className="max-w-6xl mx-auto px-6">
        <HoverRevealText
          label="Education"
          reveal="Where I learned"
          className="text-3xl sm:text-4xl mb-12 block"
        />
        <div className="p-8 rounded-2xl bg-jjk-card border border-jjk-border shadow-sm max-w-2xl hover:shadow-[0_0_32px_rgba(147,51,234,0.25)] transition-all duration-300 curse-card">
          <h3 className="text-xl font-semibold text-jjk-text font-anime">
            B.Tech – Artificial Intelligence & Machine Learning
          </h3>
          <p className="mt-2 text-jjk-infinity font-medium">
            St. Joseph's College of Engineering, Chennai
          </p>
          <p className="mt-1 text-sm text-jjk-muted">Expected May 2027 · CGPA: 8.11 / 10</p>
        </div>
      </div>
    </section>
  )
}
