import { useEffect, useRef } from 'react'
import MalevolentShrine from './MalevolentShrine'
import { drawSlashes, spawnSlashes } from './slashes'

const TAU = Math.PI * 2
const HORIZON = 0.8 // fraction of the viewport height where the blood pool begins

/**
 * Sukuna's domain behind the Projects page: blood-red sky, the Malevolent Shrine
 * mirrored in a pool of blood, ash rising and Dismantle/Cleave slashes cutting
 * through the air. Sticky, so it stays put while the page scrolls over it.
 */
export default function ShrineBackdrop() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0
    let H = 0
    let raf = 0
    let slashes = []
    let nextSlash = performance.now() + 500
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

    const spawnAsh = (initial) => ({
      x: Math.random() * W,
      y: initial ? Math.random() * H * HORIZON : H * HORIZON + Math.random() * 20,
      vy: -(15 + Math.random() * 45),
      vx: (Math.random() - 0.5) * 14,
      r: 0.6 + Math.random() * 1.8,
      ph: Math.random() * TAU,
    })
    const ash = Array.from({ length: 70 }, () => spawnAsh(true))

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, W, H)

      // ripples on the blood pool
      const py = H * HORIZON
      ctx.lineCap = 'round'
      for (let i = 0; i < 18; i++) {
        const y = py + 6 + ((i * 37) % Math.max(1, H - py - 6))
        const span = W + 200
        const x = ((((i * 211 + now * 0.012 * (i % 2 ? 1 : -1)) % span) + span) % span) - 100
        ctx.strokeStyle = `rgba(248, 113, 113, ${0.05 + (i % 3) * 0.03})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + 60 + (i % 4) * 30, y)
        ctx.stroke()
      }

      // ash and embers rising off the pool
      ctx.globalCompositeOperation = 'lighter'
      for (const a of ash) {
        a.y += a.vy * dt
        a.x += a.vx * dt + Math.sin(now * 0.001 + a.ph) * 0.3
        if (a.y < -10) Object.assign(a, spawnAsh(false))
        const flick = 0.35 + 0.3 * Math.sin(now * 0.006 + a.ph)
        ctx.fillStyle = `rgba(255, 120, 80, ${flick * 0.15})`
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r * 3.5, 0, TAU)
        ctx.fill()
        ctx.fillStyle = `rgba(255, 190, 150, ${flick})`
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, TAU)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      // the slashes never stop
      if (now >= nextSlash) {
        slashes.push(...spawnSlashes(W, H, now, { scale: 0.8 }))
        nextSlash = now + 280 + Math.random() * 750
      }
      slashes = drawSlashes(ctx, slashes, now, 0.6)

      if (!reduced) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="shrine-backdrop" aria-hidden>
      <div className="shrine-backdrop__sky" />
      <div className="shrine-backdrop__stage">
        <MalevolentShrine className="shrine-backdrop__shrine" />
        <div className="shrine-backdrop__reflection">
          <MalevolentShrine />
        </div>
      </div>
      <canvas ref={canvasRef} className="shrine-backdrop__fx" />
      <div className="shrine-backdrop__vignette" />
    </div>
  )
}
