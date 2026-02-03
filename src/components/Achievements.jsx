import HoverRevealText from './HoverRevealText'

const badges = [
  'IEEE Hackathon Winner',
  'IBM Datathon Global Finalist',
  'IIT Madras AI/ML Challenge Participant',
]

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <HoverRevealText
          label="Achievements"
          reveal="Wins"
          className="text-3xl sm:text-4xl mb-12 block"
        />
        <div className="flex flex-wrap gap-4">
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-jjk-curse/20 border border-jjk-curse/40 text-jjk-silver font-medium text-sm hover:bg-jjk-sukuna/20 hover:border-jjk-sukuna/50 transition-colors"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
