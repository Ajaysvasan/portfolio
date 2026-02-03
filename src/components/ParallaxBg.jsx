import { useEffect, useRef } from 'react'

export default function ParallaxBg() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const y = window.scrollY
      const layers = container.querySelectorAll('[data-speed]')
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed) || 0.2
        layer.style.transform = `translateY(${y * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <div
        data-speed="0.1"
        className="absolute inset-0 bg-gradient-to-b from-anime-bg via-anime-surface to-anime-bg"
      />
      <div
        data-speed="0.2"
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-anime-purple/20 blur-[120px]"
      />
      <div
        data-speed="0.15"
        className="absolute top-2/3 -right-32 w-80 h-80 rounded-full bg-anime-pink/15 blur-[100px]"
      />
      <div
        data-speed="0.25"
        className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-anime-cyan/10 blur-[80px]"
      />
    </div>
  )
}
