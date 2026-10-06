// Procedural anime hair: spiky clumps radiating from a root point, with
// cel-shade wedges, shine strokes and clump lines. Recomputed every frame so
// the hair can blow in the wind.

const rad = (d) => (d * Math.PI) / 180
const f = (n) => n.toFixed(1)
const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })

/**
 * @param {object} o
 * @param {number} o.cx root x
 * @param {number} o.cy root y
 * @param {{a:number, r:number, v:number}[]} o.spikes angle (deg, 0 = up), tip radius, radius of the valley after it
 * @param {{a:number, r:number}} o.start first valley
 * @param {number} o.t time (s)
 * @param {number} [o.wind] sway strength
 * @param {number} [o.lean] constant lean of every tip (deg)
 * @param {number} [o.phase] phase offset so layers don't sway in sync
 * @param {number} [o.dir] 1 = spikes point away from root (up), -1 = hang down
 * @param {{x:number, y:number}[]} [o.close] points that close the fill (hidden behind the head)
 * @param {number} [o.fan] <1 bends side clumps upward instead of radiating like a sunburst
 * @returns {{outline:string, edge:string, shadow:string, shine:string, clumps:string}}
 *   `outline` is the closed fill, `edge` the open silhouette to stroke
 */
export function buildHair({ cx, cy, spikes, start, t, wind = 1, lean = 6, phase = 0, dir = 1, close, fan = 1 }) {
  const at = (aDeg, r) => {
    const a = rad(aDeg)
    return { x: cx + Math.sin(a) * r, y: cy - dir * Math.cos(a) * r }
  }
  const valleys = [at(start.a, start.r)]
  const tips = []
  spikes.forEach((s, i) => {
    const sway = wind * (2.4 * Math.sin(t * 1.7 + i * 0.9 + phase) + 1.2 * Math.sin(t * 3.4 + i * 1.7 + phase))
    const stretch = 1 + 0.015 * wind * Math.sin(t * 2.2 + i + phase)
    tips.push(at(s.a * fan + lean + sway, s.r * stretch))
    const next = spikes[i + 1]
    valleys.push(at(next ? (s.a + next.a) / 2 : s.a + (s.a - spikes[i - 1].a) / 2, s.v))
  })

  let outline = `M${f(valleys[0].x)} ${f(valleys[0].y)}`
  let shadow = ''
  let shine = ''
  let clumps = ''

  tips.forEach((T, i) => {
    const P = valleys[i]
    const N = valleys[i + 1]
    const base = lerp(P, N, 0.5)
    const len = Math.hypot(T.x - base.x, T.y - base.y)
    // outward normal of an edge for a clockwise outline
    const nrm = (A, B) => {
      const dx = B.x - A.x
      const dy = B.y - A.y
      const l = Math.hypot(dx, dy) || 1
      return { x: (dy / l) * dir, y: (-dx / l) * dir }
    }
    const nl = nrm(P, T)
    const nr = nrm(T, N)
    const l1 = lerp(P, T, 0.35)
    const l2 = lerp(P, T, 0.8)
    const c1 = { x: l1.x + nl.x * len * 0.2, y: l1.y + nl.y * len * 0.2 }
    const c2 = { x: l2.x - nl.x * len * 0.03, y: l2.y - nl.y * len * 0.03 }
    const r1 = lerp(T, N, 0.22)
    const r2 = lerp(T, N, 0.66)
    const d1 = { x: r1.x - nr.x * len * 0.05, y: r1.y - nr.y * len * 0.05 }
    const d2 = { x: r2.x + nr.x * len * 0.08, y: r2.y + nr.y * len * 0.08 }

    outline += ` C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(T.x)} ${f(T.y)}`
    outline += ` C${f(d1.x)} ${f(d1.y)} ${f(d2.x)} ${f(d2.y)} ${f(N.x)} ${f(N.y)}`

    // cel shadow wedge on the left flank of each clump
    const m = lerp(base, T, 0.22)
    const mc = lerp(T, m, 0.5)
    shadow += `M${f(P.x)} ${f(P.y)} C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(T.x)} ${f(T.y)} Q${f(mc.x + nr.x * len * 0.07)} ${f(mc.y + nr.y * len * 0.07)} ${f(m.x)} ${f(m.y)} Z `

    // thin shine stroke on the lit flank
    const s1 = lerp(lerp(base, N, 0.3), T, 0.38)
    const s2 = lerp(lerp(base, N, 0.15), T, 0.8)
    const sm = lerp(s1, s2, 0.5)
    shine += `M${f(s1.x)} ${f(s1.y)} Q${f(sm.x + nr.x * 7)} ${f(sm.y + nr.y * 7)} ${f(s2.x)} ${f(s2.y)} Q${f(sm.x - nr.x * 2)} ${f(sm.y - nr.y * 2)} ${f(s1.x)} ${f(s1.y)} Z `

    if (i > 0) {
      const inner = lerp(P, { x: cx, y: cy }, 0.28)
      clumps += `M${f(P.x)} ${f(P.y)} L${f(inner.x)} ${f(inner.y)} `
    }
  })
  const edge = outline
  const closing = close ?? [{ x: cx, y: cy }]
  outline += closing.map((p) => ` L${f(p.x)} ${f(p.y)}`).join('') + ' Z'

  return { outline, edge, shadow, shine, clumps }
}
