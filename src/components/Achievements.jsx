import PageShell from './PageShell'

const badges = [
  { event: 'IEEE Hackathon', result: 'Winner', kanji: '優勝' },
  { event: 'IBM Datathon', result: 'Global Finalist', kanji: '決勝' },
  { event: 'IIT Madras AI/ML Challenge', result: 'Participant', kanji: '挑戦' },
]

export default function Achievements() {
  return (
    <PageShell id="achievements">
      <ul className="border-t border-void-line">
        {badges.map(({ event, result, kanji }, i) => (
          <li
            key={event}
            className="reveal grid grid-cols-[auto_1fr] items-baseline gap-x-8 gap-y-2 border-b border-void-line py-9 sm:grid-cols-[7rem_1fr_auto]"
            style={{ '--i': i + 3 }}
          >
            <span lang="ja" className="font-jp text-2xl font-black hollow-ink sm:text-3xl">
              {kanji}
            </span>
            <span className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-white sm:text-5xl">{event}</span>
            <span className="col-start-2 text-[11px] font-bold uppercase tracking-[0.25em] text-ink-dim sm:col-start-auto">{result}</span>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}
