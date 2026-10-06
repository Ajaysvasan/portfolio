import { useId } from 'react'

// Malevolent Shrine (伏魔御厨子): a horned, tiered shrine whose doorway is a
// fanged maw, raised on stone and heaped with skulls. viewBox 0 0 800 640,
// ground line at y = 600.

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// skull pile, generated once and identical for the shrine and its reflection
const SKULLS = (() => {
  const rnd = seeded(7)
  const out = []
  for (let row = 0; row < 3; row++) {
    const y = 604 - row * 16
    const count = 22 - row * 6
    for (let i = 0; i < count; i++) {
      const x = row === 0 ? (i / (count - 1)) * 800 : rnd() < 0.5 ? rnd() * 140 + 10 : 650 + rnd() * 140
      out.push({ x, y: y + rnd() * 6, r: 11 + rnd() * 9 - row * 2, tilt: (rnd() - 0.5) * 30 })
    }
  }
  return out
})()

const TEETH_UP = [[300, 22], [326, 16], [350, 14], [374, 13], [400, 13], [426, 13], [450, 14], [474, 16], [500, 22]]
const TEETH_DOWN = [[312, 18], [338, 12], [362, 11], [388, 11], [412, 11], [438, 11], [462, 12], [488, 18]]

function Skull({ x, y, r, tilt }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <path
        d={`M${-r} 0 C${-r} ${-r * 1.4} ${r} ${-r * 1.4} ${r} 0 C${r} ${r * 0.5} ${r * 0.55} ${r * 0.6} ${r * 0.5} ${r * 0.9} L${-r * 0.5} ${r * 0.9} C${-r * 0.55} ${r * 0.6} ${-r} ${r * 0.5} ${-r} 0 Z`}
        fill="#2a1916"
        stroke="#5c2a24"
        strokeWidth="1.2"
      />
      <ellipse cx={-r * 0.42} cy={-r * 0.05} rx={r * 0.28} ry={r * 0.32} fill="#050101" />
      <ellipse cx={r * 0.42} cy={-r * 0.05} rx={r * 0.28} ry={r * 0.32} fill="#050101" />
      <path d={`M0 ${r * 0.28} l${-r * 0.12} ${r * 0.28} h${r * 0.24} Z`} fill="#050101" />
    </g>
  )
}

export default function MalevolentShrine({ className = '' }) {
  const id = useId().replace(/:/g, '')
  const DARK = '#0b0204'
  const RIM = '#f87171'

  return (
    <svg viewBox="0 0 800 640" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-maw`} cx="400" cy="450" r="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd3b0" />
          <stop offset="0.25" stopColor="#ff6a3d" />
          <stop offset="0.6" stopColor="#b91c1c" />
          <stop offset="1" stopColor="#2a0306" />
        </radialGradient>
        <linearGradient id={`${id}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0406" />
          <stop offset="1" stopColor="#070102" />
        </linearGradient>
      </defs>

      {/* horns */}
      <path d="M338 178 C300 150 248 118 228 52 C262 98 302 128 356 164 Z" fill={DARK} stroke={RIM} strokeWidth="2" />
      <path d="M462 178 C500 150 552 118 572 52 C538 98 498 128 444 164 Z" fill={DARK} stroke={RIM} strokeWidth="2" />

      {/* upper roof */}
      <path d="M240 210 L330 172 L470 172 L560 210 Z" fill={`url(#${id}-roof)`} />
      <path
        d="M196 206 Q260 220 320 212 L480 212 Q540 220 604 206 L598 224 Q540 238 480 230 L320 230 Q260 238 202 224 Z"
        fill={DARK}
        stroke={RIM}
        strokeWidth="1.6"
      />
      <circle cx="400" cy="166" r="14" fill={DARK} stroke={RIM} strokeWidth="1.6" />
      <path d="M392 166 l3 -4 l3 4 M402 166 l3 -4 l3 4" stroke={RIM} strokeWidth="1.4" fill="none" />

      {/* middle tier: lattice wall */}
      <rect x="270" y="228" width="260" height="26" fill="#120305" />
      <path d="M290 230 v22 M320 230 v22 M350 230 v22 M380 230 v22 M410 230 v22 M440 230 v22 M470 230 v22 M500 230 v22" stroke="#3d0a0d" strokeWidth="3" />

      {/* lower roof with upturned eaves */}
      <path d="M120 306 L242 252 L558 252 L680 306 Z" fill={`url(#${id}-roof)`} />
      <path d="M150 300 L250 258 M200 300 L290 258 M600 300 L510 258 M650 300 L550 258" stroke="#2a0507" strokeWidth="2" />
      <path
        d="M52 298 Q140 318 240 306 L560 306 Q660 318 748 298 L740 318 Q660 340 550 332 L250 332 Q140 340 60 318 Z"
        fill={DARK}
        stroke={RIM}
        strokeWidth="1.8"
      />

      {/* pillars */}
      {[205, 285, 515, 595].map((x) => (
        <g key={x}>
          <rect x={x - 11} y="330" width="22" height="192" fill={DARK} />
          <path d={`M${x + 11} 332 V522`} stroke={RIM} strokeWidth="1.4" opacity="0.7" />
        </g>
      ))}

      {/* the maw */}
      <rect x="296" y="346" width="208" height="176" fill={`url(#${id}-maw)`} />
      <path d="M290 340 H510 V384 C470 372 330 372 290 384 Z" fill={DARK} stroke={RIM} strokeWidth="1.6" />
      <path d="M290 528 H510 V494 C470 506 330 506 290 494 Z" fill={DARK} stroke={RIM} strokeWidth="1.6" />
      {TEETH_UP.map(([x, w]) => (
        <path key={`u${x}`} d={`M${x - w / 2} 378 L${x} ${378 + w * 2.1} L${x + w / 2} 378 Z`} fill="#e7dcc6" stroke="#4a1410" strokeWidth="1.2" />
      ))}
      {TEETH_DOWN.map(([x, w]) => (
        <path key={`d${x}`} d={`M${x - w / 2} 500 L${x} ${500 - w * 2} L${x + w / 2} 500 Z`} fill="#d9ccb4" stroke="#4a1410" strokeWidth="1.2" />
      ))}

      {/* stone base */}
      <path d="M150 548 L170 520 L630 520 L650 548 Z" fill="#100304" stroke={RIM} strokeWidth="1.4" />
      <path d="M90 600 L130 548 L670 548 L710 600 Z" fill="#0d0304" stroke={RIM} strokeWidth="1.4" />

      {/* the dead, heaped around it */}
      {SKULLS.map((s, i) => (
        <Skull key={i} {...s} />
      ))}
    </svg>
  )
}
