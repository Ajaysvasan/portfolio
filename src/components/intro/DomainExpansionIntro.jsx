import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import GojoFigure from './GojoFigure'
import SixEyes from './SixEyes'
import IntroFx from './IntroFx'
import { createVoidScene } from '../../lib/voidScene'
import * as sfx from '../../lib/sfx'

// Shot list (ms from start). At CHARGE_AT the shared sweep overlay gathers Red
// and Blue at Gojo's fingertips; PURPLE_CHARGE later he fires it.
const SHOTS = [
  ['figure', 0], // backlit Gojo, hand sign
  ['eyes', 2700], // blindfold up — the Six Eyes open
  ['impact', 4100], // impact frames
  ['domain', 4400], // 領域展開
  ['void', 5200], // 無量空処 — the domain swallows everything
  ['purple', 7000], // 虚式「茈」 — Gojo takes aim
]
const CHARGE_AT = 7450
const PURPLE_CHARGE = 1050

// Sound cues, timed to the shots above. `beds` collects the sustained layers so they can be faded out.
const CUES = [
  [0, (beds) => { beds.drone = sfx.drone(); sfx.impact({ intensity: 0.65, pitch: 0.8, hall: 0.6 }) }], // the bars close on him
  [1450, () => sfx.whoosh({ dur: 0.6, gain: 0.45, pan: [0.4, -0.1] })], // the hand sign
  [2600, () => sfx.whoosh({ dur: 0.35, gain: 0.3, bright: 1.4, pan: [-0.3, 0.3] })], // cut in close
  [2950, () => sfx.whoosh({ dur: 0.5, gain: 0.35, bright: 0.8, pan: [0, 0] })], // blindfold pulled up
  [3100, () => sfx.riser({ dur: 0.55, gain: 0.35 })], // a breath before…
  [3650, () => { sfx.glint(); sfx.impact({ intensity: 0.5, pitch: 1.1, hall: 0.7 }) }], // …the Six Eyes open
  [4100, () => sfx.impact({ intensity: 0.9, pitch: 0.9 })], // impact frames
  [4400, () => {
    // "Ryōiki Tenkai" — the hit steps back if there's a voice recording to hear
    sfx.voice('ryoikiTenkai')
    sfx.impact({ intensity: sfx.hasClip('ryoikiTenkai') ? 0.55 : 1, pitch: 0.75, hall: 0.8 })
  }],
  [4450, () => sfx.riser({ dur: 0.75, gain: 0.5 })], // rushing into…
  [5200, (beds) => { beds.drone?.(1); beds.void = sfx.infiniteVoid() }], // …the Infinite Void
  [5800, () => sfx.voice('muryokusho')], // "Muryōkūsho"
  [7000, () => sfx.whoosh({ dur: 0.5, gain: 0.4, pan: [-0.6, 0] })], // Gojo takes aim
]

// What Gojo says, shown in the letterbox as he says it.
const SUBTITLES = {
  domain: { jp: '領域展開', en: 'Ryōiki Tenkai' },
  void: { jp: '無量空処', en: 'Muryōkūsho', delay: 600 },
  purple: { jp: '天上天下唯我独尊', en: 'Throughout heaven and earth, I alone am the honored one.' },
}

const clamp01 = (v) => Math.min(1, Math.max(0, v))

function ShotVoid({ leaving }) {
  const canvasRef = useRef(null)
  const leavingRef = useRef(leaving)
  leavingRef.current = leaving

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = createVoidScene(canvas, { starCount: 320 })
    const ctx = scene.ctx
    scene.resize()
    const onResize = () => scene.resize()
    window.addEventListener('resize', onResize)
    const t0 = performance.now()
    let last = t0
    let raf = 0
    let dim = 1

    const frame = (now) => {
      const t = now - t0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const W = scene.width
      const H = scene.height
      const diag = Math.hypot(W, H) / 2
      // the black hole steps back once Hollow Purple takes the stage
      dim += ((leavingRef.current ? 0.3 : 1) - dim) * 0.06
      scene.render(dt, {
        cx: W / 2,
        cy: H / 2,
        // a flood of information at first, then the void stills
        speed: 0.3 + 2.6 * Math.exp(-t / 650),
        streak: 2 + 6 * Math.exp(-t / 800),
        ring: clamp01((t - 250) / 900) * dim,
        ringRadius: Math.min(W, H) * (0.09 + 0.035 * clamp01(t / 2200)),
        time: now,
      })

      // the domain boundary: an ink-black sphere with a white-hot rim expanding outward
      const e = clamp01(t / 800)
      const rho = Math.pow(e, 2.2) * diag * 1.08
      if (rho < diag * 1.05) {
        ctx.save()
        ctx.globalCompositeOperation = 'destination-in'
        ctx.fillStyle = '#000' // must be opaque: destination-in multiplies by the fill's alpha
        ctx.beginPath()
        ctx.arc(W / 2, H / 2, Math.max(1, rho), 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = 'lighter'
        for (const [w, a] of [[90, 0.12], [34, 0.3], [10, 0.85], [3, 1]]) {
          ctx.strokeStyle = `rgba(${w > 30 ? '129, 140, 248' : '230, 250, 255'}, ${a})`
          ctx.lineWidth = w
          ctx.beginPath()
          ctx.arc(W / 2, H / 2, Math.max(1, rho), 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="shot shot-void">
      <canvas ref={canvasRef} />
      <div className={`void-title ${leaving ? 'is-leaving' : ''}`}>
        <span className="void-title__jp">無量空処</span>
        <span className="void-title__en">Unlimited Void</span>
        <span className="void-title__by">— the domain of Ajay S Vasan —</span>
      </div>
    </div>
  )
}

/**
 * Cinematic intro: Gojo Satoru's Domain Expansion, ending with him firing Hollow Purple.
 * Everything is drawn live (SVG + canvas) and every sound is synthesized — no assets.
 *
 * Browsers only allow audio after a user gesture, so with sound enabled it opens on
 * an "Enter the domain" gate.
 *
 * @param {object} props
 * @param {(opts: object) => void} props.onPurple hand the charge/launch to the sweep overlay;
 *   `tunnel` means only the sphere's path is erased and Gojo stays until the intro fades
 * @param {boolean} props.fired Hollow Purple has left his hand
 * @param {boolean} [props.autoStart] replayed from a click: skip the "Enter the domain" gate
 */
const DomainExpansionIntro = forwardRef(function DomainExpansionIntro({ onPurple, fired, autoStart = false }, ref) {
  const [started, setStarted] = useState(() => autoStart || !sfx.isEnabled())
  const [shot, setShot] = useState('figure')
  const firedRef = useRef(false)
  const bedsRef = useRef({})
  const tipRef = useRef(null)

  const begin = useCallback(async (withSound) => {
    sfx.setEnabled(withSound)
    if (withSound) await sfx.unlock()
    setStarted(true)
  }, [])

  const firePurple = useCallback(
    (skipped) => {
      if (firedRef.current) return
      firedRef.current = true
      Object.values(bedsRef.current).forEach((stop) => stop?.(skipped ? 0.4 : 2.2))
      const tip = tipRef.current?.getBoundingClientRect()
      if (skipped || !tip) {
        onPurple({ chargeMs: 420 })
        return
      }
      onPurple({
        from: { x: tip.left + tip.width / 2, y: tip.top + tip.height / 2 },
        chargeMs: PURPLE_CHARGE,
        chargeScale: 0.42,
        launchFlash: 0.15,
        intensity: 1,
        tunnel: true,
      })
    },
    [onPurple],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        firePurple(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [firePurple])

  useEffect(() => {
    if (!started) return
    const beds = {}
    bedsRef.current = beds
    const timers = [
      ...SHOTS.slice(1).map(([id, at]) => setTimeout(() => setShot(id), at)),
      ...CUES.map(([at, play]) => setTimeout(() => !firedRef.current && play(beds), at)),
      setTimeout(() => firePurple(false), CHARGE_AT),
    ]
    return () => {
      timers.forEach(clearTimeout)
      Object.values(beds).forEach((stop) => stop?.(0.3))
    }
  }, [started, firePurple])

  const inVoid = started && (shot === 'void' || shot === 'purple')

  return (
    <div ref={ref} className="intro" role="dialog" aria-label="Intro animation">
      {!started && (
        <div className="intro-gate">
          <button type="button" className="intro-gate__enter" onClick={() => begin(true)} autoFocus>
            <span className="intro-gate__ring" aria-hidden />
            <span className="intro-gate__jp">領域展開</span>
            <span className="intro-gate__en">Enter the domain</span>
          </button>
          <p className="intro-gate__hint">Sound on · best with headphones</p>
          <button type="button" className="intro-gate__silent" onClick={() => begin(false)}>
            Enter without sound
          </button>
        </div>
      )}

      {started && shot === 'figure' && (
        <div className="shot shot-figure">
          <IntroFx mode="embers" />
          <div className="shot-figure__cam">
            <GojoFigure hand="sign" handDelay={1500} />
          </div>
          <div className="name-card">
            <span className="name-card__kanji">五条悟</span>
            <div className="name-card__meta">
              <span className="name-card__en">SATORU GOJO</span>
              <span className="name-card__role">特級呪術師 · THE STRONGEST</span>
            </div>
          </div>
        </div>
      )}

      {shot === 'eyes' && (
        <div className="shot shot-eyes">
          <SixEyes />
          <IntroFx mode="focus" density={70} inner={0.44} className="on-open" />
          <div className="lens-flare" />
          <div className="flash-on-open" />
        </div>
      )}

      {shot === 'impact' && (
        <div className="shot shot-impact">
          <div className="shot-figure__cam">
            <GojoFigure hand="sign" handDelay={-5000} wind={3} />
          </div>
        </div>
      )}

      {(shot === 'domain' || shot === 'void') && (
        <div className="shot shot-domain">
          <IntroFx mode="focus" density={120} inner={0.36} />
          <div className="title-card">
            <span className="title-card__jp">領域展開</span>
            <span className="title-card__en">Domain Expansion</span>
          </div>
        </div>
      )}

      {inVoid && <ShotVoid leaving={shot === 'purple'} />}

      {shot === 'purple' && (
        <>
          <div className={`shot shot-fire ${fired ? 'is-fired' : ''}`}>
            <div className="shot-fire__cam">
              <GojoFigure hand="fire" handDelay={-350} eyes blast={fired} wind={1.6} tipRef={tipRef} />
            </div>
          </div>
          <div className="purple-title">
            <span className="purple-title__jp">虚式「茈」</span>
            <span className="purple-title__en">Hollow Purple</span>
          </div>
        </>
      )}

      {started && SUBTITLES[shot] && (
        <p key={shot} className="intro-subtitle" style={{ animationDelay: `${SUBTITLES[shot].delay ?? 200}ms` }}>
          <span>{SUBTITLES[shot].jp}</span>
          <span>{SUBTITLES[shot].en}</span>
        </p>
      )}

      {started && <div className="intro-bars" aria-hidden />}

      <button type="button" className="intro-skip" onClick={() => firePurple(true)}>
        Skip <kbd>Esc</kbd>
      </button>
    </div>
  )
})

export default DomainExpansionIntro
