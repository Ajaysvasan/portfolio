import { useEffect, useRef } from 'react'
import { createVoidScene, drawBlackHole } from '../lib/voidScene'

/**
 * Infinite Void (無量空処) background: slow warp star field, nebula haze and a
 * faint black-hole ring that drifts with the cursor. Runs outside React state.
 * `paused` stops rendering while a page fully covers it.
 */
export default function InfiniteVoidBg({ paused = false }) {
  const canvasRef = useRef(null)
  const pausedRef = useRef(paused)
  const resumeRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = createVoidScene(canvas, { starCount: 180, dprCap: 1.25 })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: 0, y: 0 }
    const par = { x: 0, y: 0 }
    let raf = 0
    let last = performance.now()

    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth - 0.5
      target.y = e.clientY / window.innerHeight - 0.5
    }

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      par.x += (target.x - par.x) * 0.04
      par.y += (target.y - par.y) * 0.04
      const W = scene.width
      const H = scene.height
      scene.render(reduced ? 0 : dt, {
        cx: W * 0.5 - par.x * 60,
        cy: H * 0.52 - par.y * 40,
        speed: 0.05,
        streak: 2,
        starAlpha: 0.7,
        ring: 0,
        time: now,
      })
      // a distant black hole hanging in the void, clear of the content column
      drawBlackHole(scene.ctx, W * 0.84 - par.x * 25, H * 0.2 - par.y * 15, Math.min(W, H) * 0.055, 0.45, now)
      raf = !reduced && !pausedRef.current ? requestAnimationFrame(frame) : 0
    }
    resumeRef.current = () => {
      if (raf || reduced) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => {
      scene.resize()
      if (reduced) frame(performance.now())
    }

    scene.resize()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  useEffect(() => {
    pausedRef.current = paused
    if (!paused) resumeRef.current?.()
  }, [paused])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" />
}
