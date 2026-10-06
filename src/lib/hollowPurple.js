// Canvas drawing for Gojo's techniques: Reversal Red (赫), Lapse Blue (蒼)
// and the Hollow Purple (茈) sphere they collapse into.

const TAU = Math.PI * 2

const ORB_COLORS = {
  red: { glow: '239, 68, 68', light: '#fecaca', mid: '#f87171', deep: '#b91c1c' },
  blue: { glow: '59, 130, 246', light: '#dbeafe', mid: '#60a5fa', deep: '#1d4ed8' },
}

function bolt(ctx, x, y, angle, length, jitter) {
  const steps = 5
  ctx.beginPath()
  ctx.moveTo(x, y)
  for (let i = 1; i <= steps; i++) {
    const d = (length * i) / steps
    const off = (Math.random() - 0.5) * jitter
    ctx.lineTo(
      x + Math.cos(angle) * d + Math.cos(angle + Math.PI / 2) * off,
      y + Math.sin(angle) * d + Math.sin(angle + Math.PI / 2) * off,
    )
  }
  ctx.stroke()
}

export function drawOrb(ctx, x, y, r, kind, time) {
  const c = ORB_COLORS[kind]
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2)
  glow.addColorStop(0, `rgba(${c.glow}, 0.65)`)
  glow.addColorStop(0.35, `rgba(${c.glow}, 0.22)`)
  glow.addColorStop(1, `rgba(${c.glow}, 0)`)
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(x, y, r * 3.2, 0, TAU)
  ctx.fill()

  const core = ctx.createRadialGradient(x, y, 0, x, y, r)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(0.3, c.light)
  core.addColorStop(0.65, c.mid)
  core.addColorStop(1, `rgba(${c.glow}, 0)`)
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()

  // swirling rings
  ctx.lineWidth = Math.max(1, r * 0.06)
  ctx.strokeStyle = `rgba(${c.glow}, 0.8)`
  for (let k = 0; k < 2; k++) {
    ctx.beginPath()
    ctx.ellipse(x, y, r * 1.25, r * 0.45, time * 0.006 * (k ? -1 : 1) + k, 0, TAU * 0.7)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 1.2
  for (let i = 0; i < 2; i++) {
    const a = Math.random() * TAU
    bolt(ctx, x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, a, r * (0.6 + Math.random() * 0.8), r * 0.35)
  }
  ctx.restore()
}

/** The Hollow Purple sphere. `heat` (0-1) boosts the bloom, e.g. at launch. */
export function drawHollowPurple(ctx, x, y, r, time, heat = 0) {
  if (r <= 0.5) return
  const pulse = 1 + Math.sin(time * 0.03) * 0.025
  const R = r * pulse
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  const bloom = ctx.createRadialGradient(x, y, R * 0.3, x, y, R * (2.4 + heat))
  bloom.addColorStop(0, `rgba(192, 132, 252, ${0.55 + heat * 0.3})`)
  bloom.addColorStop(0.4, 'rgba(126, 34, 206, 0.25)')
  bloom.addColorStop(1, 'rgba(76, 29, 149, 0)')
  ctx.fillStyle = bloom
  ctx.beginPath()
  ctx.arc(x, y, R * (2.4 + heat), 0, TAU)
  ctx.fill()

  // red and blue fringes — the two techniques still visible inside the purple
  const fringe = (dx, dy, rgb) => {
    const g = ctx.createRadialGradient(x + dx, y + dy, R * 0.5, x + dx, y + dy, R * 1.12)
    g.addColorStop(0, `rgba(${rgb}, 0)`)
    g.addColorStop(0.85, `rgba(${rgb}, 0.35)`)
    g.addColorStop(1, `rgba(${rgb}, 0)`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x + dx, y + dy, R * 1.12, 0, TAU)
    ctx.fill()
  }
  fringe(-R * 0.07, -R * 0.05, '239, 68, 68')
  fringe(R * 0.07, R * 0.05, '59, 130, 246')
  ctx.restore()

  // body
  const body = ctx.createRadialGradient(x - R * 0.15, y - R * 0.15, 0, x, y, R)
  body.addColorStop(0, '#ffffff')
  body.addColorStop(0.22, '#f5ecff')
  body.addColorStop(0.48, '#d8b4fe')
  body.addColorStop(0.74, '#9333ea')
  body.addColorStop(0.9, '#c084fc')
  body.addColorStop(1, 'rgba(192, 132, 252, 0)')
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(x, y, R, 0, TAU)
  ctx.fill()

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  // energy currents swirling across the surface
  ctx.lineCap = 'round'
  for (let k = 0; k < 5; k++) {
    const rr = R * (0.55 + k * 0.1)
    ctx.strokeStyle = `rgba(243, 232, 255, ${0.28 - k * 0.03})`
    ctx.lineWidth = Math.max(1, R * 0.03)
    ctx.beginPath()
    const rot = time * 0.004 * (k % 2 ? -1 : 1) + k * 1.3
    ctx.ellipse(x, y, rr, rr * 0.32, rot, 0, TAU * 0.55)
    ctx.stroke()
  }
  // crackling discharge
  for (let i = 0; i < 4; i++) {
    const a = Math.random() * TAU
    const sx = x + Math.cos(a) * R * 0.95
    const sy = y + Math.sin(a) * R * 0.95
    const len = R * (0.25 + Math.random() * 0.45)
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
    ctx.lineWidth = 5
    bolt(ctx, sx, sy, a, len, R * 0.12)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.lineWidth = 1.4
    bolt(ctx, sx, sy, a, len, R * 0.12)
  }
  ctx.restore()
}

export function drawFlash(ctx, x, y, radius, alpha, rgb = '255, 255, 255') {
  if (alpha <= 0) return
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
  g.addColorStop(0, `rgba(${rgb}, ${alpha})`)
  g.addColorStop(0.4, `rgba(216, 180, 254, ${alpha * 0.5})`)
  g.addColorStop(1, 'rgba(126, 34, 206, 0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, TAU)
  ctx.fill()
  ctx.restore()
}
