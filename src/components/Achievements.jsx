const badges = [
  'IEEE Hackathon Winner',
  'IBM Datathon Global Finalist',
  'IIT Madras AI/ML Challenge Participant',
]

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-anime-text mb-12 font-anime">
          Achievements
        </h2>
        <div className="flex flex-wrap gap-4">
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-anime-purple/20 border border-anime-purple/40 text-anime-lavender font-medium text-sm hover:bg-anime-pink/20 hover:border-anime-pink/40 transition-colors"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
