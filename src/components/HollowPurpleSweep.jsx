import { forwardRef, useImperativeHandle, useRef } from 'react'
import { drawFlash, drawHollowPurple, drawOrb } from '../lib/hollowPurple'
import * as sfx from '../lib/sfx'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const easeOutBack = (p) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2)
// accelerates out of the launch, then cruises across the screen
const easeTravel = (p) => (p < 0.3 ? 1.6667 * p * p : 0.15 + (p - 0.3) * 1.2143)

/**
 * Full-screen overlay that charges Hollow Purple and fires it across the screen.
 * `fire()` reports the wipe edge every frame — the distance travelled from the
 * side it was fired from — so callers can clip the outgoing layer and reveal
 * what's underneath.
 */
const HollowPurpleSweep = forwardRef(function HollowPurpleSweep(_, ref) {
  const canvasRef = useRef(null)
  const runRef = useRef(null)

  useImperativeHandle(ref, () => ({
    /**
     * @param {object} o
     * @param {1 | -1} [o.dir] 1: left → right, -1: right → left
     * @param {number} [o.originX] x where the sphere forms, measured from the side it's fired from
     * @param {number} [o.originY] y it forms and flies at (default: mid-screen)
     * @param {{x: number, y: number}} [o.from] fingertips it forms against (overrides originX/Y)
     * @param {number} [o.chargeScale] size it forms at, relative to its full flying size
     * @param {number} [o.launchFlash] strength of the full-screen white flash at launch
     * @param {number} [o.handFlash] strength of the burst at the fingertips (with `from`)
     * @param {number} [o.intensity] sound intensity (0-1)
     * @param {boolean} [o.wall] true: erase a full-height wall (page transitions);
     *   false: bore a tunnel the size of the sphere (fired from Gojo's hand)
     * @param {number} [o.chargeMs] Red + Blue convergence time before launch
     * @param {number} [o.travelMs] time to cross the screen
     * @param {number} [o.orbitRadius] how far apart Red and Blue start
     * @param {boolean} [o.reduced] prefers-reduced-motion: plain crossfade instead
     * @param {() => void} [o.onFire]
     * @param {(f: {edge: number, opacity: number, shakeX: number, shakeY: number,
     *   sphere: {x: number, y: number, r: number} | null}) => void} [o.onFrame]
     *   `sphere` is set once it is in flight
     * @param {() => void} [o.onDone]
     * @returns {() => void} cancel
     */
    fire(o = {}) {
      runRef.current?.cancel()
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const W = window.innerWidth
      const H = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      // everything is drawn as if fired left → right; right → left just mirrors the canvas
      const dir = o.dir ?? 1
      ctx.setTransform(dpr * dir, 0, 0, dpr, dir === 1 ? 0 : canvas.width, 0)
      const from = o.from && { x: dir === 1 ? o.from.x : W - o.from.x, y: o.from.y }

      const R = Math.max(80, Math.min(H * 0.36, W * 0.3))
      const r0 = R * (o.chargeScale ?? 1)
      const cy = from ? from.y : (o.originY ?? H / 2)
      const x0 = from ? from.x + r0 * 0.92 : (o.originX ?? R * 0.3)
      const intensity = o.intensity ?? 0.55
      const x1 = W + R * 2.6
      const chargeMs = o.reduced ? 0 : (o.chargeMs ?? 340)
      const travelMs = o.reduced ? 280 : (o.travelMs ?? 900)
      const orbit = o.orbitRadius ?? r0 * 1.3 + (R - r0) * 0.6
      // a strong flash only when launching mid-screen (hides the wipe edge jumping to x0)
      const launchFlash = o.launchFlash ?? (x0 > R ? 0.85 : 0.18)
      const wall = o.wall ?? true
      const bore = [] // the sphere's path, for drawing the tunnel
      const sparks = []
      let fired = false
      let raf = 0
      let last = performance.now()
      const start = last

      const finish = () => {
        cancelAnimationFrame(raf)
        ctx.clearRect(0, 0, W, H)
        runRef.current = null
        o.onDone?.()
      }

      const frame = (now) => {
        const t = now - start
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        ctx.clearRect(0, 0, W, H)

        if (o.reduced) {
          const p = clamp(t / travelMs, 0, 1)
          o.onFrame?.({ edge: 0, opacity: 1 - p, shakeX: 0, shakeY: 0 })
          if (p >= 1) return finish()
          raf = requestAnimationFrame(frame)
          return
        }

        let edge = 0
        let shake = 0
        let sphere = null

        if (t < chargeMs) {
          // Red and Blue spiral into each other, then Purple is born
          const p = t / chargeMs
          const conv = clamp(p / 0.62, 0, 1)
          if (conv < 1) {
            const e = conv * conv
            const dist = orbit * (1 - e)
            const ang = -Math.PI / 2 + e * Math.PI * 1.35
            const rr = r0 * 0.2 * (0.55 + 0.45 * conv)
            const rx = x0 + Math.cos(ang) * dist
            const ry = cy + Math.sin(ang) * dist
            const bx = x0 - Math.cos(ang) * dist
            const by = cy - Math.sin(ang) * dist
            // tether of crackling energy between the two
            ctx.save()
            ctx.globalCompositeOperation = 'lighter'
            const tg = ctx.createLinearGradient(rx, ry, bx, by)
            tg.addColorStop(0, 'rgba(239,68,68,0.5)')
            tg.addColorStop(1, 'rgba(59,130,246,0.5)')
            ctx.strokeStyle = tg
            ctx.lineWidth = 2 + conv * 4
            ctx.beginPath()
            ctx.moveTo(rx, ry)
            ctx.quadraticCurveTo(x0 + (Math.random() - 0.5) * 30, cy + (Math.random() - 0.5) * 30, bx, by)
            ctx.stroke()
            ctx.restore()
            drawOrb(ctx, rx, ry, rr, 'red', t)
            drawOrb(ctx, bx, by, rr, 'blue', t)
          } else {
            const q = clamp((p - 0.62) / 0.38, 0, 1)
            drawHollowPurple(ctx, x0, cy, r0 * Math.max(0, easeOutBack(q)), t, 1 - q)
            drawFlash(ctx, x0, cy, r0 * 3.2, Math.pow(1 - q, 2) * 0.95)
            shake = (1 - q) * 10
          }
        } else {
          if (!fired) {
            fired = true
            sfx.purpleFire({ dur: travelMs / 1000, intensity, dir })
            o.onFire?.()
          }
          const p = clamp((t - chargeMs) / travelMs, 0, 1)
          const sx = x0 + (x1 - x0) * easeTravel(p)
          // it leaves the hand small and swells to full size as it flies
          const g = clamp(p / 0.3, 0, 1)
          const r = r0 + (R - r0) * g * g * (3 - 2 * g)
          // the wipe sweeps out from the screen edge to catch up with the sphere
          const catchUp = clamp(p / 0.2, 0, 1)
          edge = clamp(sx * catchUp * catchUp * (3 - 2 * catchUp), 0, W)
          shake = (1 - p) * 7

          if (wall) {
            // scorched trail of erased space behind the sphere
            const tw = R * 2.6
            const trail = ctx.createLinearGradient(sx - tw, 0, sx, 0)
            trail.addColorStop(0, 'rgba(88, 28, 135, 0)')
            trail.addColorStop(0.75, 'rgba(126, 34, 206, 0.2)')
            trail.addColorStop(1, 'rgba(168, 85, 247, 0.5)')
            ctx.fillStyle = trail
            ctx.fillRect(sx - tw, 0, tw, H)

            // the full-height seam where reality is being deleted
            ctx.save()
            ctx.globalCompositeOperation = 'lighter'
            const seam = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0)
            seam.addColorStop(0, 'rgba(168, 85, 247, 0)')
            seam.addColorStop(0.5, 'rgba(233, 213, 255, 0.85)')
            seam.addColorStop(1, 'rgba(168, 85, 247, 0)')
            ctx.fillStyle = seam
            ctx.fillRect(sx - 60, 0, 120, H)
            ctx.lineWidth = 1.5
            ctx.strokeStyle = 'rgba(255,255,255,0.9)'
            for (let k = 0; k < 2; k++) {
              ctx.beginPath()
              ctx.moveTo(sx, 0)
              for (let yy = 0; yy <= H; yy += 28) ctx.lineTo(sx + (Math.random() - 0.5) * 26, yy)
              ctx.stroke()
            }
            ctx.restore()
          } else {
            // the tunnel it bores glows behind it, its walls crackling, fading once it's gone
            bore.push({ x: sx, r })
            const fx = from?.x ?? x0
            ctx.save()
            ctx.globalAlpha = clamp(1 - (sx - W) / (R * 1.2), 0, 1)
            const glow = ctx.createLinearGradient(fx, 0, sx, 0)
            glow.addColorStop(0, 'rgba(126, 34, 206, 0)')
            glow.addColorStop(1, 'rgba(168, 85, 247, 0.4)')
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.moveTo(fx, cy)
            bore.forEach((b) => ctx.lineTo(b.x, cy - b.r))
            ctx.arc(sx, cy, r, -Math.PI / 2, Math.PI / 2)
            for (let i = bore.length - 1; i >= 0; i--) ctx.lineTo(bore[i].x, cy + bore[i].r)
            ctx.closePath()
            ctx.fill()
            ctx.save()
            ctx.globalCompositeOperation = 'lighter'
            ctx.lineWidth = 1.6
            ctx.strokeStyle = 'rgba(233, 213, 255, 0.75)'
            for (const side of [-1, 1]) {
              ctx.beginPath()
              ctx.moveTo(fx, cy)
              bore.forEach((b) => ctx.lineTo(b.x, cy + side * (b.r + (Math.random() - 0.5) * 10)))
              ctx.stroke()
            }
            ctx.restore()
            ctx.restore()
          }

          // sparks shed by the sphere
          for (let i = 0; i < 6; i++) {
            const a = (Math.random() - 0.5) * Math.PI * 1.2
            sparks.push({
              x: sx + Math.cos(a) * r,
              y: cy + Math.sin(a) * r * 1.05,
              vx: -200 + Math.random() * 700,
              vy: Math.sin(a) * (200 + Math.random() * 400),
              life: 0,
              max: 0.25 + Math.random() * 0.35,
            })
          }
          ctx.save()
          ctx.globalCompositeOperation = 'lighter'
          ctx.lineCap = 'round'
          for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i]
            s.life += dt
            if (s.life > s.max) {
              sparks.splice(i, 1)
              continue
            }
            s.x += s.vx * dt
            s.y += s.vy * dt
            const a = 1 - s.life / s.max
            ctx.strokeStyle = `rgba(233, 213, 255, ${a})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(s.x, s.y)
            ctx.lineTo(s.x - s.vx * 0.03, s.y - s.vy * 0.03)
            ctx.stroke()
          }
          ctx.restore()

          drawHollowPurple(ctx, sx, cy, r, t, Math.max(0, 1 - p * 4))
          // launch flash hides the jump of the wipe edge to the origin
          const lf = 1 - (t - chargeMs) / 180
          if (lf > 0) {
            ctx.fillStyle = `rgba(245, 235, 255, ${lf * launchFlash})`
            ctx.fillRect(0, 0, W, H)
            if (from) drawFlash(ctx, x0, cy, R * 4, lf * (o.handFlash ?? 0.9))
          }
          sphere = { x: dir === 1 ? sx : W - sx, y: cy, r }
          if (p >= 1) {
            o.onFrame?.({ edge: W, opacity: 1, shakeX: 0, shakeY: 0, sphere })
            return finish()
          }
        }

        o.onFrame?.({
          edge,
          sphere,
          opacity: 1,
          shakeX: (Math.random() - 0.5) * shake,
          shakeY: (Math.random() - 0.5) * shake,
        })
        raf = requestAnimationFrame(frame)
      }

      if (!o.reduced && chargeMs > 0) sfx.purpleCharge({ dur: chargeMs / 1000, intensity, dir })
      raf = requestAnimationFrame(frame)
      const cancel = () => {
        cancelAnimationFrame(raf)
        ctx.clearRect(0, 0, W, H)
        runRef.current = null
      }
      runRef.current = { cancel }
      return cancel
    },
  }), [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 9000 }}
    />
  )
})

export default HollowPurpleSweep
