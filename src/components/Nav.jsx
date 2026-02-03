import { useState, useEffect } from 'react'

const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#achievements', label: 'Achievements' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-jjk-surface/90 backdrop-blur-md border-b border-jjk-border' : 'bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-xl font-semibold text-jjk-light hover:text-jjk-curse transition-colors font-anime">
          Ajay
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-jjk-text-dim hover:text-jjk-curseLight transition-colors text-highlight-hover"
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="text-sm font-medium px-4 py-2 rounded-full bg-jjk-curse/80 text-jjk-light hover:bg-jjk-sukuna hover:shadow-[0_0_24px_rgba(147,51,234,0.4)] transition-all duration-300"
        >
          Get in touch
        </a>
      </div>
    </nav>
  )
}
