// Canvas renderer for the Infinite Void (無量空処): a nebula backdrop, a warp
// star field streaming out of the centre, and a black-hole ring.
// Shared by the intro's domain expansion and the site-wide background.

const TAU = Math.PI * 2

function paintBackdrop(W, H, dpr) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(W * dpr))
  c.height = Math.max(1, Math.round(H * dpr))
  const g = c.getContext('2d')
  g.scale(dpr, dpr)
  g.fillStyle = '#020207'
  g.fillRect(0, 0, W, H)

  const M = Math.max(W, H)
  const blob = (x, y, r, color) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r)
    gr.addColorStop(0, color)
    gr.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = gr
    g.fillRect(x - r, y - r, r * 2, r * 2)
  }
  g.globalCompositeOperation = 'lighter'
  blob(W * 0.15, H * 0.2, M * 0.6, 'rgba(91, 33, 182, 0.22)')
  blob(W * 0.88, H * 0.82, M * 0.55, 'rgba(30, 64, 175, 0.22)')
  blob(W * 0.6, H * 0.4, M * 0.4, 'rgba(147, 51, 234, 0.08)')
  blob(W * 0.92, H * 0.08, M * 0.3, 'rgba(14, 165, 233, 0.07)')
  blob(W * 0.3, H * 0.95, M * 0.3, 'rgba(126, 34, 206, 0.08)')

  // static dust stars
  const count = Math.round((W * H) / 2200)
  for (let i = 0; i < count; i++) {
    const s = Math.random() < 0.92 ? 0.8 : 1.6
    g.fillStyle = `rgba(220, 225, 255, ${Math.random() * 0.55})`
    g.fillRect(Math.random() * W, Math.random() * H, s, s)
  }

  g.globalCompositeOperation = 'source-over'
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, M * 0.78)
  v.addColorStop(0, 'rgba(0,0,0,0)')
  v.addColorStop(1, 'rgba(0,0,0,0.7)')
  g.fillStyle = v
  g.fillRect(0, 0, W, H)
  return c
}

function drawDisk(ctx, x, y, r, a, time, frontOnly) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(-0.1)
  if (frontOnly) {
    ctx.beginPath()
    ctx.rect(-r * 6, 0, r * 12, r * 6)
    ctx.clip()
  }
  ctx.scale(1, 0.15)
  const d = ctx.createRadialGradient(0, 0, r * 1.02, 0, 0, r * 3.6)
  d.addColorStop(0, `rgba(255,255,255,${0.95 * a})`)
  d.addColorStop(0.07, `rgba(186,230,253,${0.8 * a})`)
  d.addColorStop(0.28, `rgba(129,140,248,${0.45 * a})`)
  d.addColorStop(0.62, `rgba(147,51,234,${0.2 * a})`)
  d.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = d
  ctx.beginPath()
  ctx.arc(0, 0, r * 3.6, 0, TAU)
  ctx.fill()
  // a hot spot orbiting the disk (doppler beaming)
  const ang = time * 0.0005
  const hx = Math.cos(ang) * r * 1.7
  const hy = Math.sin(ang) * r * 1.7
  const h = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 1.1)
  h.addColorStop(0, `rgba(255,255,255,${0.35 * a})`)
  h.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = h
  ctx.beginPath()
  ctx.arc(hx, hy, r * 1.1, 0, TAU)
  ctx.fill()
  ctx.restore()
}

export function drawBlackHole(ctx, x, y, r, a, time = 0) {
  if (a <= 0 || r <= 0) return
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  const glow = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 3.4)
  glow.addColorStop(0, `rgba(124,58,237,${0.3 * a})`)
  glow.addColorStop(0.45, `rgba(59,130,246,${0.1 * a})`)
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(x, y, r * 3.4, 0, TAU)
  ctx.fill()

  drawDisk(ctx, x, y, r, a, time, false)

  // lensed photon ring
  const pulse = 1 + Math.sin(time * 0.002) * 0.015
  const h = ctx.createRadialGradient(x, y, r * 0.98, x, y, r * 1.55 * pulse)
  h.addColorStop(0, `rgba(255,255,255,${a})`)
  h.addColorStop(0.05, `rgba(207,250,254,${0.85 * a})`)
  h.addColorStop(0.22, `rgba(125,211,252,${0.4 * a})`)
  h.addColorStop(0.55, `rgba(168,85,247,${0.14 * a})`)
  h.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = h
  ctx.beginPath()
  ctx.arc(x, y, r * 1.55 * pulse, 0, TAU)
  ctx.fill()
  ctx.restore()

  // event horizon (callers may leave the context in additive mode)
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = `rgba(0,0,0,${Math.min(1, a * 1.5)})`
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()

  // the near side of the disk passes in front of the horizon
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  drawDisk(ctx, x, y, r, a * 0.9, time, true)
  ctx.restore()
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ starCount?: number, dprCap?: number }} opts
 */
export function createVoidScene(canvas, { starCount = 240, dprCap = 1.5 } = {}) {
  const ctx = canvas.getContext('2d')
  let W = 1
  let H = 1
  let backdrop = null

  const spawn = (s, initial) => {
    s.x = Math.random() * 2 - 1
    s.y = Math.random() * 2 - 1
    s.z = initial ? 0.05 + Math.random() * 0.95 : 1
    s.tint = Math.random()
    return s
  }
  const stars = Array.from({ length: starCount }, () => spawn({}, true))

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap)
    W = canvas.clientWidth || window.innerWidth
    H = canvas.clientHeight || window.innerHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    backdrop = paintBackdrop(W, H, dpr)
  }

  /**
   * @param {number} dt seconds since last frame
   * @param {{ cx:number, cy:number, speed:number, streak?:number, starAlpha?:number,
   *           ring?:number, ringRadius?:number, time:number }} s
   */
  function render(dt, s) {
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(backdrop, 0, 0, W, H)

    const f = Math.max(W, H) * 0.45
    const streak = s.streak ?? 1
    const starAlpha = s.starAlpha ?? 1
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineCap = 'round'
    for (const st of stars) {
      st.z -= s.speed * dt
      if (st.z <= 0.02) {
        spawn(st, false)
        continue
      }
      const sx = s.cx + (st.x / st.z) * f
      const sy = s.cy + (st.y / st.z) * f
      if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) {
        spawn(st, false)
        continue
      }
      const tz = st.z + s.speed * 0.016 * streak
      const tx = s.cx + (st.x / tz) * f
      const ty = s.cy + (st.y / tz) * f
      const a = Math.min(1, (1 - st.z) * 1.5) * starAlpha
      ctx.strokeStyle =
        st.tint > 0.82
          ? `rgba(196,181,253,${a})`
          : st.tint > 0.62
            ? `rgba(147,197,253,${a})`
            : `rgba(230,236,255,${a})`
      ctx.lineWidth = Math.max(0.6, (1 - st.z) * 2.4)
      ctx.beginPath()
      ctx.moveTo(tx, ty)
      ctx.lineTo(sx + 0.01, sy)
      ctx.stroke()
    }

    if (s.ring > 0) drawBlackHole(ctx, s.cx, s.cy, s.ringRadius, s.ring, s.time)
  }

  return {
    ctx,
    resize,
    render,
    get width() { return W },
    get height() { return H },
  }
}
