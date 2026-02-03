import { useState, useEffect } from 'react'

const lerp = (a, b, t) => a + (b - a) * t

/**
 * Returns smooth-following global cursor position. Use for custom cursor UI or elements that follow the mouse.
 */
export function useGlobalCursor(options = {}) {
  const { smoothing = 0.12 } = options
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const current = { x: -100, y: -100, targetX: -100, targetY: -100 }

  useEffect(() => {
    const handleMove = (e) => {
      current.targetX = e.clientX
      current.targetY = e.clientY
    }

    let raf = null
    const tick = () => {
      current.x = lerp(current.x, current.targetX, smoothing)
      current.y = lerp(current.y, current.targetY, smoothing)
      setPosition({ x: current.x, y: current.y })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [smoothing])

  return position
}
