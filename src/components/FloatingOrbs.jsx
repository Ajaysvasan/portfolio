import { useEffect, useState, useRef } from 'react'
import { useGlobalCursor } from '../hooks/useGlobalCursor'

const lerp = (a, b, t) => a + (b - a) * t

const ORBS = [
  { id: 1, left: 8, top: 20, size: 14, delay: 0, color: 'curse' },
  { id: 2, left: 92, top: 15, size: 10, delay: 0.5, color: 'sukuna' },
  { id: 3, left: 15, top: 60, size: 12, delay: 1, color: 'infinity' },
  { id: 4, left: 85, top: 55, size: 16, delay: 0.2, color: 'curse' },
  { id: 5, left: 50, top: 85, size: 8, delay: 0.8, color: 'reverse' },
  { id: 6, left: 75, top: 35, size: 10, delay: 0.3, color: 'sukuna' },
  { id: 7, left: 25, top: 80, size: 12, delay: 0.6, color: 'curse' },
  { id: 8, left: 90, top: 75, size: 10, delay: 0.4, color: 'infinity' },
  { id: 9, left: 10, top: 40, size: 8, delay: 0.7, color: 'domain' },
  { id: 10, left: 60, top: 25, size: 14, delay: 0.1, color: 'curse' },
]

const colorMap = {
  curse: { bg: 'rgba(147, 51, 234, 0.25)', border: 'rgba(147, 51, 234, 0.4)', shadow: 'rgba(147, 51, 234, 0.25)' },
  sukuna: { bg: 'rgba(244, 63, 94, 0.2)', border: 'rgba(244, 63, 94, 0.35)', shadow: 'rgba(244, 63, 94, 0.2)' },
  infinity: { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.35)', shadow: 'rgba(59, 130, 246, 0.2)' },
  reverse: { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.35)', shadow: 'rgba(16, 185, 129, 0.2)' },
  domain: { bg: 'rgba(220, 38, 38, 0.2)', border: 'rgba(220, 38, 38, 0.35)', shadow: 'rgba(220, 38, 38, 0.2)' },
}

const ATTRACT_RADIUS = 140
const ATTRACT_STRENGTH = 0.06

export default function FloatingOrbs() {
  const { x: cursorX, y: cursorY } = useGlobalCursor({ smoothing: 0.08 })
  const cursorRef = useRef({ x: cursorX, y: cursorY })
  const [offsets, setOffsets] = useState(() => ORBS.map(() => ({ x: 0, y: 0 })))
  const currentRef = useRef(ORBS.map(() => ({ x: 0, y: 0 })))

  cursorRef.current = { x: cursorX, y: cursorY }

  useEffect(() => {
    let raf = null
    const tick = () => {
      const { x: cx, y: cy } = cursorRef.current
      const w = window.innerWidth
      const h = window.innerHeight
      const next = ORBS.map((orb, i) => {
        const baseX = (orb.left / 100) * w
        const baseY = (orb.top / 100) * h
        const dx = cx - baseX
        const dy = cy - baseY
        const dist = Math.hypot(dx, dy)
        const current = currentRef.current[i]
        let x = current.x
        let y = current.y
        if (dist < ATTRACT_RADIUS && dist > 0) {
          const pull = (1 - dist / ATTRACT_RADIUS) * ATTRACT_STRENGTH
          x = lerp(current.x, dx * pull, 0.12)
          y = lerp(current.y, dy * pull, 0.12)
        } else {
          x = lerp(current.x, 0, 0.06)
          y = lerp(current.y, 0, 0.06)
        }
        currentRef.current[i] = { x, y }
        return { x, y }
      })
      setOffsets(next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => raf && cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden" aria-hidden>
      {ORBS.map((orb, i) => {
        const colors = colorMap[orb.color]
        return (
          <div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              width: orb.size,
              height: orb.size,
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              transform: `translate(calc(-50% + ${offsets[i]?.x ?? 0}px), calc(-50% + ${offsets[i]?.y ?? 0}px))`,
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${orb.delay}s`,
              boxShadow: `0 0 20px ${colors.shadow}`,
            }}
          />
        )
      })}
    </div>
  )
}
