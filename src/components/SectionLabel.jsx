/** Bilingual section label: index, the erasure line, English name, Japanese name. */
export default function SectionLabel({ index, en, jp, className = '' }) {
  return (
    <p className={`section-label reveal ${className}`}>
      <span className="section-label__index">{index}</span>
      <span className="tear w-10" aria-hidden />
      <span>{en}</span>
      <span lang="ja" className="section-label__jp">
        {jp}
      </span>
    </p>
  )
}
