// Sukuna's slashes on canvas — Dismantle (解) and Cleave (捌).
// A slash rips across in a few frames, flares white-hot, then leaves a dark
// red gash in the air that fades.

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/**
 * @param {number} W
 * @param {number} H
 * @param {number} now
 * @param {{ scale?: number, kind?: 'single' | 'grid' | 'cross' }} [o]
 */
export function spawnSlashes(W, H, now, { scale = 1, kind } = {}) {
  const pick = kind ?? (Math.random() < 0.2 ? 'grid' : Math.random() < 0.25 ? 'cross' : 'single')
  const cx = W * (0.1 + Math.random() * 0.8)
  const cy = H * (0.1 + Math.random() * 0.8)
  const diag = Math.hypot(W, H)
  const len = diag * (0.3 + Math.random() * 0.5) * scale
  const angle = (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.7)
  const make = (a, ox, oy, delay) => ({
    x1: cx + ox - (Math.cos(a) * len) / 2,
    y1: cy + oy - (Math.sin(a) * len) / 2,
    x2: cx + ox + (Math.cos(a) * len) / 2,
    y2: cy + oy + (Math.sin(a) * len) / 2,
    born: now + delay,
    grow: 70 + Math.random() * 50,
    life: 420 + Math.random() * 300,
    width: (1.2 + Math.random() * 1.6) * Math.max(0.7, scale),
  })
  if (pick === 'grid') {
    // Dismantle: a volley of parallel cuts
    const n = 3 + Math.floor(Math.random() * 4)
    const gap = 18 + Math.random() * 16
    return Array.from({ length: n }, (_, i) => {
      const off = (i - (n - 1) / 2) * gap
      return make(angle, -Math.sin(angle) * off, Math.cos(angle) * off, i * 28)
    })
  }
  if (pick === 'cross') {
    // Cleave: two cuts crossing
    return [make(angle, 0, 0, 0), make(-angle, 0, 0, 60)]
  }
  return [make(angle, 0, 0, 0)]
}

/** Draws and ages the slashes in place; returns the ones still alive. */
export function drawSlashes(ctx, slashes, now, alpha = 1) {
  const alive = []
  for (const s of slashes) {
    const age = now - s.born
    if (age < 0) {
      alive.push(s)
      continue
    }
    if (age > s.grow + s.life) continue
    alive.push(s)
    const g = 1 - Math.pow(1 - clamp01(age / s.grow), 3)
    const fade = age < s.grow ? 1 : 1 - (age - s.grow) / s.life
    const x2 = s.x1 + (s.x2 - s.x1) * g
    const y2 = s.y1 + (s.y2 - s.y1) * g

    // the gash it leaves behind
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = `rgba(60, 4, 6, ${0.55 * fade * alpha})`
    ctx.lineWidth = s.width * 2.4
    ctx.beginPath()
    ctx.moveTo(s.x1, s.y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    // the blade's flash
    const hot = age < s.grow + 90 ? 1 : fade * fade
    ctx.globalCompositeOperation = 'lighter'
    for (const [w, c, a] of [[8, '220, 38, 38', 0.28], [3, '248, 113, 113', 0.6], [1, '255, 241, 241', 0.95]]) {
      ctx.strokeStyle = `rgba(${c}, ${a * hot * alpha})`
      ctx.lineWidth = s.width * w
      ctx.beginPath()
      ctx.moveTo(s.x1, s.y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }
  ctx.globalCompositeOperation = 'source-over'
  return alive
}
