import { useEffect, useRef } from 'react'

const TAU = Math.PI * 2

/**
 * Canvas effects for the intro.
 * - `embers`: cursed energy drifting upward
 * - `focus`: 集中線 — anime focus/speed lines rushing at the centre
 */
export default function IntroFx({ mode, color = '255,255,255', density = 90, inner = 0.34, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let W = 0
    let H = 0
    let raf = 0
    let frame = 0
    let last = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (initial) => ({
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + 10,
      vy: -(25 + Math.random() * 70),
      vx: (Math.random() - 0.5) * 18,
      r: 0.6 + Math.random() * 2.2,
      ph: Math.random() * TAU,
    })
    const embers = mode === 'embers' ? Array.from({ length: 80 }, () => spawn(true)) : []

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      frame++
      if (mode === 'embers') {
        ctx.clearRect(0, 0, W, H)
        ctx.globalCompositeOperation = 'lighter'
        for (const e of embers) {
          e.y += e.vy * dt
          e.x += e.vx * dt + Math.sin(now * 0.0012 + e.ph) * 0.4
          if (e.y < -20) Object.assign(e, spawn(false))
          const a = 0.35 + 0.3 * Math.sin(now * 0.005 + e.ph)
          ctx.fillStyle = `rgba(120, 200, 255, ${a * 0.18})`
          ctx.beginPath()
          ctx.arc(e.x, e.y, e.r * 4, 0, TAU)
          ctx.fill()
          ctx.fillStyle = `rgba(220, 245, 255, ${a})`
          ctx.beginPath()
          ctx.arc(e.x, e.y, e.r, 0, TAU)
          ctx.fill()
        }
      } else if (frame % 2 === 0) {
        // redrawn every other frame for a hand-drawn, jittery feel
        ctx.clearRect(0, 0, W, H)
        const cx = W / 2
        const cy = H / 2
        const maxR = Math.hypot(W, H) / 2 + 20
        const minR = Math.min(W, H) * inner
        ctx.fillStyle = `rgba(${color}, 0.85)`
        for (let i = 0; i < density; i++) {
          const a = Math.random() * TAU
          const w = 0.002 + Math.random() * 0.012
          const r0 = minR * (0.85 + Math.random() * 0.7)
          ctx.beginPath()
          ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0)
          ctx.lineTo(cx + Math.cos(a - w) * maxR, cy + Math.sin(a - w) * maxR)
          ctx.lineTo(cx + Math.cos(a + w) * maxR, cy + Math.sin(a + w) * maxR)
          ctx.closePath()
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [mode, color, density, inner])

  return <canvas ref={ref} aria-hidden className={`intro-fx ${className}`} />
}
