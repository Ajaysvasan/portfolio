import { useState } from 'react'

/**
 * Shows primary text by default; on hover, reveals secondary text (e.g. "Experience" → "Where I've been").
 */
export default function HoverRevealText({ label, reveal, className = '' }) {
  const [hover, setHover] = useState(false)

  return (
    <h2
      className={`relative inline-block font-anime font-bold text-jjk-text cursor-default transition-all duration-300 ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className={`transition-opacity duration-300 ${hover ? 'opacity-0' : 'opacity-100'}`}>
        {label}
      </span>
      <span
        className={`absolute left-0 top-0 whitespace-nowrap bg-gradient-to-r from-jjk-curse via-jjk-curseLight to-jjk-sukuna bg-clip-text text-transparent transition-opacity duration-300 ${hover ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {reveal}
      </span>
    </h2>
  )
}
