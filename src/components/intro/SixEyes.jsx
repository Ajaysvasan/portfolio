import { useEffect, useId, useRef, useState } from 'react'
import { buildHair } from './hair'

// Extreme close-up: the blindfold is pulled up and the Six Eyes (六眼) open.
// viewBox 0 0 1600 700. Geometry is written for the left eye and mirrored.

const OPEN_AT = 950 // ms after mount
const OPEN_MS = 140

const mirror = (side, x) => (side === 'L' ? x : 1600 - x)
const lerp = (a, b, t) => a + (b - a) * t
const f = (n) => n.toFixed(1)

const LID = {
  O: [360, 352], // outer corner
  I: [680, 372], // inner corner
  open: [[410, 284], [590, 254]],
  closed: [[430, 398], [600, 408]],
  lower: [[620, 426], [450, 432], [372, 362]],
  crease: 'M384 300 C440 228 600 206 676 318',
}

function eyePaths(side, o) {
  const m = ([x, y]) => `${f(mirror(side, x))} ${f(y)}`
  const c1 = [lerp(LID.closed[0][0], LID.open[0][0], o), lerp(LID.closed[0][1], LID.open[0][1], o)]
  const c2 = [lerp(LID.closed[1][0], LID.open[1][0], o), lerp(LID.closed[1][1], LID.open[1][1], o)]
  const upper = `M${m(LID.O)} C${m(c1)} ${m(c2)} ${m(LID.I)}`
  const lower = `C${m(LID.lower[0])} ${m(LID.lower[1])} ${m(LID.lower[2])}`
  // white lashes flicking out past the outer corner, following the lid as it opens
  const y = (v) => lerp(LID.O[1] + 10, v, o)
  const wing = `M${m([366, y(348)])} Q${m([344, y(346)])} ${m([322, y(330)])} M${m([378, y(332)])} Q${m([356, y(322)])} ${m([342, y(302)])} M${m([394, y(316)])} Q${m([380, y(300)])} ${m([374, y(282)])}`
  return { clip: `${upper} ${lower} Z`, upper, wing }
}

const IRIS = { L: [515, 340], R: [1085, 340] }
const FIBERS = Array.from({ length: 44 }, (_, i) => (i / 44) * Math.PI * 2)

const BANGS = {
  start: { a: -48, r: 520 },
  spikes: [
    { a: -38, r: 600, v: 520 },
    { a: -27, r: 660, v: 530 },
    { a: -16, r: 700, v: 540 },
    { a: -6, r: 730, v: 540 },
    { a: 5, r: 712, v: 540 },
    { a: 16, r: 690, v: 530 },
    { a: 27, r: 640, v: 520 },
    { a: 38, r: 590, v: 500 },
  ],
}

export default function SixEyes() {
  const id = useId().replace(/:/g, '')
  // on portrait screens frame a single eye instead of the bridge of the nose
  const [viewBox] = useState(() => (window.innerWidth < window.innerHeight ? '820 40 560 620' : '0 0 1600 700'))
  const eye = {
    L: { clip: useRef(null), upper: useRef(null), lash: useRef(null), wing: useRef(null), wingLight: useRef(null), crease: useRef(null) },
    R: { clip: useRef(null), upper: useRef(null), lash: useRef(null), wing: useRef(null), wingLight: useRef(null), crease: useRef(null) },
  }
  const root = useRef(null)
  const glow = useRef(null)
  const bangs = { fill: useRef(null), shadow: useRef(null), shine: useRef(null), edge: useRef(null) }

  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const frame = (now) => {
      const t = now - t0
      const p = Math.min(1, Math.max(0, (t - OPEN_AT) / OPEN_MS))
      const o = 1 - Math.pow(1 - p, 3)
      for (const side of ['L', 'R']) {
        const d = eyePaths(side, o)
        eye[side].clip.current?.setAttribute('d', d.clip)
        eye[side].upper.current?.setAttribute('d', d.upper)
        eye[side].lash.current?.setAttribute('d', d.upper)
        eye[side].wing.current?.setAttribute('d', d.wing)
        eye[side].wingLight.current?.setAttribute('d', d.wing)
        eye[side].crease.current?.setAttribute('opacity', (o * 0.8).toFixed(2))
      }
      // pupils contract as light floods in
      const pc = Math.min(1, Math.max(0, (t - OPEN_AT) / 380))
      const ps = 1.35 - 0.35 * (1 - Math.pow(1 - pc, 2))
      root.current?.style.setProperty('--pupil', ps.toFixed(3))
      glow.current?.setAttribute('opacity', (o * (0.75 + 0.25 * Math.sin(t * 0.012))).toFixed(2))

      const b = buildHair({ cx: 800, cy: -420, ...BANGS, t: t / 1000, wind: 0.5, lean: 0, dir: -1 })
      bangs.fill.current?.setAttribute('d', b.outline)
      bangs.shadow.current?.setAttribute('d', b.shadow)
      bangs.shine.current?.setAttribute('d', b.shine)
      bangs.edge.current?.setAttribute('d', b.edge)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
    // refs are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderEye = (side) => {
    const [ix, iy] = IRIS[side]
    const m = (x) => mirror(side, x)
    return (
      <g key={side}>
        <clipPath id={`${id}-clip-${side}`}>
          <path ref={eye[side].clip} />
        </clipPath>
        <g clipPath={`url(#${id}-clip-${side})`}>
          <rect x={m(side === 'L' ? 340 : 700)} y="200" width="360" height="260" fill="#eef2ff" />
          <rect x={m(side === 'L' ? 340 : 700)} y="200" width="360" height="260" fill={`url(#${id}-lidshade)`} />
          <g filter={`url(#${id}-glow)`}>
            <circle cx={ix} cy={iy} r="88" fill={`url(#${id}-iris)`} />
            <g stroke="#d6f9ff" strokeWidth="1.6" opacity="0.4">
              {FIBERS.map((a, i) => (
                <line
                  key={i}
                  x1={ix + Math.cos(a) * 26}
                  y1={iy + Math.sin(a) * 26}
                  x2={ix + Math.cos(a) * (i % 3 ? 70 : 80)}
                  y2={iy + Math.sin(a) * (i % 3 ? 70 : 80)}
                />
              ))}
            </g>
            <circle cx={ix} cy={iy} r="86" fill="none" stroke="#06205c" strokeWidth="6" />
          </g>
          {/* outside the glow filter so the pupil stays ink-dark */}
          <circle cx={ix} cy={iy} r="22" fill="#030b26" className="six-eyes-pupil" style={{ transformOrigin: `${ix}px ${iy}px` }} />
          <rect x={m(side === 'L' ? 340 : 700)} y="200" width="360" height="260" fill={`url(#${id}-irisShade)`} />
          <ellipse cx={ix - 30} cy={iy - 34} rx="21" ry="14" fill="#fff" transform={`rotate(-25 ${ix - 30} ${iy - 34})`} />
          <circle cx={ix + 32} cy={iy + 30} r="7" fill="#fff" />
          <path d={`M${ix + 40} ${iy - 52} l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 l12 -4 Z`} fill="#fff" opacity="0.9" />
        </g>
        {/* lids */}
        <path d={`M${m(372)} 362 C${m(450)} 440 ${m(620)} 432 ${m(680)} 372`} fill="none" stroke="#7a6271" strokeWidth="3" />
        <path d={`M${m(392)} 372 l${side === 'L' ? -14 : 14} 14 M${m(414)} 386 l${side === 'L' ? -10 : 10} 16`} stroke="#eef3ff" strokeWidth="3" strokeLinecap="round" />
        <path ref={eye[side].crease} d={side === 'L' ? LID.crease : mirrorPath(LID.crease)} fill="none" stroke="#7d6672" strokeWidth="3" />
        <path ref={eye[side].upper} fill="none" stroke="#1d2235" strokeWidth="8" strokeLinecap="round" />
        <path ref={eye[side].lash} fill="none" stroke="#eef3ff" strokeWidth="5" strokeLinecap="round" transform="translate(0 -6)" />
        <path ref={eye[side].wing} fill="none" stroke="#1d2235" strokeWidth="9" strokeLinecap="round" />
        <path ref={eye[side].wingLight} fill="none" stroke="#f4f7ff" strokeWidth="4.5" strokeLinecap="round" />
      </g>
    )
  }

  return (
    <svg ref={root} viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className="six-eyes" aria-hidden>
      <defs>
        <radialGradient id={`${id}-skin`} cx="800" cy="380" r="920" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#dcc4c7" />
          <stop offset="0.4" stopColor="#b99eab" />
          <stop offset="0.72" stopColor="#6c5470" />
          <stop offset="1" stopColor="#1b1424" />
        </radialGradient>
        <linearGradient id={`${id}-topshade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1428" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="#1c1428" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-iris`}>
          <stop offset="0" stopColor="#f0feff" />
          <stop offset="0.25" stopColor="#8ef0ff" />
          <stop offset="0.52" stopColor="#2fb3ff" />
          <stop offset="0.82" stopColor="#0d58dc" />
          <stop offset="1" stopColor="#06276e" />
        </radialGradient>
        <linearGradient id={`${id}-lidshade`} x1="0" y1="200" x2="0" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0.1" stopColor="#7d8cbc" />
          <stop offset="0.38" stopColor="#7d8cbc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-irisShade`} x1="0" y1="200" x2="0" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0.12" stopColor="#020a24" stopOpacity="0.75" />
          <stop offset="0.42" stopColor="#020a24" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-socket`}>
          <stop offset="0" stopColor="#4a3555" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4a3555" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-spill`}>
          <stop offset="0" stopColor="#67e8f9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-bangs`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3cce4" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1600" height="700" fill={`url(#${id}-skin)`} />
      <rect width="1600" height="700" fill={`url(#${id}-topshade)`} />
      {/* eye sockets + nose bridge */}
      <ellipse cx="515" cy="290" rx="230" ry="95" fill={`url(#${id}-socket)`} />
      <ellipse cx="1085" cy="290" rx="230" ry="95" fill={`url(#${id}-socket)`} />
      <path d="M786 470 C794 560 792 630 780 700" fill="none" stroke="#6e5670" strokeWidth="5" strokeLinecap="round" opacity="0.45" />

      {/* white brows */}
      <path d="M702 228 C612 188 474 174 356 198 C470 194 600 214 694 254 Z" fill="#f1f4fc" stroke="#7c87ab" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M898 228 C988 188 1126 174 1244 198 C1130 194 1000 214 906 254 Z" fill="#f1f4fc" stroke="#7c87ab" strokeWidth="2.5" strokeLinejoin="round" />

      {renderEye('L')}
      {renderEye('R')}

      <g ref={glow} opacity="0" style={{ mixBlendMode: 'screen' }}>
        <circle cx={IRIS.L[0]} cy={IRIS.L[1]} r="280" fill={`url(#${id}-spill)`} />
        <circle cx={IRIS.R[0]} cy={IRIS.R[1]} r="280" fill={`url(#${id}-spill)`} />
      </g>

      {/* blindfold being pulled up */}
      <g className="six-eyes-blindfold">
        <path d="M-60 150 Q800 110 1660 150 L1660 540 Q800 500 -60 540 Z" fill="#06070d" />
        <path d="M-60 162 Q800 122 1660 162" stroke="#2b3150" strokeWidth="6" fill="none" />
        <path d="M120 300 Q520 270 900 296 M700 420 Q1100 400 1500 430 M200 470 Q500 455 760 468" stroke="#151829" strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>

      {/* bangs falling between the eyes */}
      <path ref={bangs.fill} fill={`url(#${id}-bangs)`} />
      <path ref={bangs.shadow} fill="#a3aecf" opacity="0.9" />
      <path ref={bangs.shine} fill="#fff" />
      <path ref={bangs.edge} fill="none" stroke="#3a4466" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

function mirrorPath(d) {
  return d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${1600 - parseFloat(x)} ${y}`)
}
