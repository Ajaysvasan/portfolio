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
        className="absolute inset-0 bg-gradient-to-b from-jjk-bg via-jjk-surface to-jjk-bg"
      />
      {/* Curse energy glow - purple */}
      <div
        data-speed="0.2"
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-jjk-curse/15 blur-[120px]"
      />
      {/* Sukuna energy glow - red */}
      <div
        data-speed="0.15"
        className="absolute top-2/3 -right-32 w-80 h-80 rounded-full bg-jjk-sukuna/12 blur-[100px]"
      />
      {/* Infinity glow - blue */}
      <div
        data-speed="0.25"
        className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-jjk-infinity/10 blur-[80px]"
      />
      {/* Domain expansion ambient - dark red */}
      <div
        data-speed="0.18"
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-jjk-domain/8 blur-[90px]"
      />
      {/* Reverse curse technique - green */}
      <div
        data-speed="0.22"
        className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-jjk-reverse/8 blur-[70px]"
      />
    </div>
  )
}
