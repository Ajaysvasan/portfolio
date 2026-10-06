import { useEffect, useRef } from 'react'
import { drawSlashes, spawnSlashes } from './slashes'
import * as sfx from '../../lib/sfx'

const DURATION = 1700

/**
 * Sukuna answers Gojo: "Domain Expansion — Malevolent Shrine" slams onto the
 * screen, is cut in half, and slashes rain everywhere. Non-blocking overlay.
 */
export default function ShrineStamp({ onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    // deferred so a StrictMode double-mount in dev doesn't play it twice
    const sound = setTimeout(() => sfx.malevolentShrine(), 0)
    const done = setTimeout(onDone, DURATION)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const t0 = performance.now()
    let slashes = []
    for (let i = 0; i < 14; i++) {
      const kind = i % 4 === 0 ? 'grid' : i % 3 === 0 ? 'cross' : 'single'
      slashes.push(...spawnSlashes(W, H, t0 + 40 + Math.pow(Math.random(), 1.4) * 900, { scale: 1.3, kind }))
    }
    let raf = 0
    const frame = (now) => {
      ctx.clearRect(0, 0, W, H)
      slashes = drawSlashes(ctx, slashes, now, 1)
      if (now - t0 < DURATION) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      clearTimeout(sound)
      clearTimeout(done)
      cancelAnimationFrame(raf)
    }
    // onDone is a fresh closure each render; the stamp only runs once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="shrine-stamp" aria-hidden>
      <div className="shrine-stamp__flash" />
      <canvas ref={canvasRef} className="shrine-stamp__fx" />
      <div className="shrine-stamp__title">
        <span className="shrine-stamp__small">領域展開</span>
        <span className="shrine-stamp__jp" data-text="伏魔御厨子">
          伏魔御厨子
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="shrine-stamp__cut">
            <line x1="-5" y1="88" x2="105" y2="12" vectorEffect="non-scaling-stroke" />
          </svg>
        </span>
        <span className="shrine-stamp__en">Fukuma Mizushi · Malevolent Shrine</span>
      </div>
    </div>
  )
}
