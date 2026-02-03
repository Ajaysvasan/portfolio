import { useState, useEffect, useRef } from 'react'

/**
 * Returns normalized cursor position (-1 to 1) relative to a section element.
 * Use in sections where you want elements to follow/track cursor movement
 * (e.g. subtle parallax, glow, or tilt effects like on Antigravity-style sites).
 * @param {Object} options
 * @param {number} options.smoothing - Lerp factor 0–1 (higher = smoother, slower)
 * @param {number} options.maxOffset - Max px movement for derived values
 */
export function useCursorFollow(options = {}) {
  const { smoothing = 0.08, maxOffset = 24 } = options
  const sectionRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleMove = (e) => {
      const rect = section.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      // Normalized -1 to 1 relative to section center
      const x = (e.clientX - centerX) / (rect.width / 2)
      const y = (e.clientY - centerY) / (rect.height / 2)
      currentRef.current.targetX = Math.max(-1, Math.min(1, x))
      currentRef.current.targetY = Math.max(-1, Math.min(1, y))
    }

    let raf = null
    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      const { targetX = 0, targetY = 0 } = currentRef.current
      const current = currentRef.current
      current.x = lerp(current.x ?? 0, targetX, smoothing)
      current.y = lerp(current.y ?? 0, targetY, smoothing)
      setPosition({
        x: current.x,
        y: current.y,
        offsetX: current.x * maxOffset,
        offsetY: current.y * maxOffset,
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    section.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      section.removeEventListener('mousemove', handleMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [smoothing, maxOffset])

  return { sectionRef, position }
}
