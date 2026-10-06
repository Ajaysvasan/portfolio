import { useCallback, useEffect, useRef, useState } from 'react'
import { ROUTES, routeFromHash } from './routes'
import Nav from './components/Nav'
import Home from './components/Home'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import InfiniteVoidBg from './components/InfiniteVoidBg'
import GojoCursor from './components/GojoCursor'
import HollowPurpleSweep from './components/HollowPurpleSweep'
import GojoStrike from './components/GojoStrike'
import ShrineStamp from './components/sukuna/ShrineStamp'
import DomainExpansionIntro from './components/intro/DomainExpansionIntro'
import { unlock as unlockAudio } from './lib/sfx'

const PAGES = {
  home: Home,
  experience: Experience,
  projects: Projects,
  skills: Skills,
  education: Education,
  achievements: Achievements,
  contact: Contact,
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// the opening plays once per browser session; Home has a button to replay it
const INTRO_SEEN = 'gojo-intro-seen'
const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_SEEN) === '1'
  } catch {
    return false
  }
}
const pageIndex = (id) => ROUTES.findIndex((r) => r.id === id)
// Gojo steps in, then Red and Blue gather at his fingertips before he fires
const STRIKE_ENTER_MS = 200

function App() {
  // 'playing' → 'firing' (Hollow Purple is wiping the intro away) → 'done'
  const [intro, setIntro] = useState(() => (prefersReducedMotion() || introSeen() ? 'done' : 'playing'))
  // bumped to replay the intro on demand
  const [introRun, setIntroRun] = useState(0)
  const [view, setView] = useState(() => ({ current: routeFromHash(window.location.hash), outgoing: null, dir: 1 }))
  // Gojo firing the transition: { id, dir, fired, leaving }
  const [strike, setStrike] = useState(null)
  const strikeTipRef = useRef(null)
  // Sukuna's domain answering when you land on Projects
  const [shrineStamp, setShrineStamp] = useState(null)
  const viewRef = useRef(view)
  viewRef.current = view
  const introStateRef = useRef(intro)
  introStateRef.current = intro
  const pendingRef = useRef(null)
  const sweepRef = useRef(null)
  const introRef = useRef(null)
  const pageRefs = useRef({})

  const navigate = useCallback((target) => {
    const { current, outgoing } = viewRef.current
    if (introStateRef.current !== 'done') {
      // the intro owns the sweep; just swap the page hidden underneath it
      setView({ current: target, outgoing: null })
      return
    }
    if (outgoing) {
      // mid-transition: remember only the latest request
      pendingRef.current = target
      return
    }
    // forward through the pages fires left → right, backward fires right → left
    if (target !== current) setView({ current: target, outgoing: current, dir: pageIndex(target) > pageIndex(current) ? 1 : -1 })
  }, [])

  useEffect(() => {
    if (intro !== 'firing') return
    try {
      sessionStorage.setItem(INTRO_SEEN, '1')
    } catch {
      /* storage blocked — it'll just play again next load */
    }
  }, [intro])

  useEffect(() => {
    const replay = () => {
      if (introStateRef.current !== 'done' || viewRef.current.outgoing) return
      setIntroRun((n) => n + 1)
      setIntro('playing')
    }
    window.addEventListener('replay-intro', replay)
    return () => window.removeEventListener('replay-intro', replay)
  }, [])

  // audio may only start after a user gesture
  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio)
    window.addEventListener('keydown', unlockAudio)
    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  useEffect(() => {
    const onHash = () => navigate(routeFromHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [navigate])

  // Gojo fires Hollow Purple across the outgoing page — whatever it erases reveals the new one.
  useEffect(() => {
    const { current, outgoing, dir } = view
    if (!outgoing) {
      const pending = pendingRef.current
      pendingRef.current = null
      if (pending) navigate(pending)
      return
    }
    const outEl = pageRefs.current[outgoing]
    const inEl = pageRefs.current[current]
    const reduced = prefersReducedMotion()
    let cancel = () => {}
    const fire = () => {
      const tip = strikeTipRef.current?.getBoundingClientRect()
      cancel = sweepRef.current.fire({
        reduced,
        dir,
        from: tip && { x: tip.left + tip.width / 2, y: tip.top + tip.height / 2 },
        chargeMs: 420,
        travelMs: 820,
        chargeScale: 0.42,
        launchFlash: 0.1,
        handFlash: 0.45,
        intensity: 0.65,
        onFire: () => setStrike((s) => s && { ...s, fired: true }),
        onFrame: ({ edge, opacity, shakeX, shakeY }) => {
          // pages are transparent over the void, so each is clipped to its own side of the edge
          const rest = window.innerWidth - edge
          outEl.style.clipPath = dir > 0 ? `inset(0 0 0 ${edge}px)` : `inset(0 ${edge}px 0 0)`
          inEl.style.clipPath = reduced ? '' : dir > 0 ? `inset(0 ${rest}px 0 0)` : `inset(0 0 0 ${rest}px)`
          outEl.style.opacity = opacity
          inEl.style.opacity = reduced ? 1 - opacity : ''
          outEl.style.transform = inEl.style.transform = `translate(${shakeX}px, ${shakeY}px)`
        },
        onDone: () => {
          inEl.style.clipPath = inEl.style.opacity = inEl.style.transform = ''
          inEl.focus({ preventScroll: true })
          setStrike((s) => s && { ...s, leaving: true })
          setView((v) => ({ ...v, outgoing: null }))
        },
      })
    }
    if (reduced) {
      fire()
      return () => cancel()
    }
    setStrike({ id: Date.now(), dir, fired: false, leaving: false })
    const timer = setTimeout(fire, STRIKE_ENTER_MS)
    return () => {
      clearTimeout(timer)
      cancel()
    }
  }, [view, navigate])

  // Projects is Sukuna's domain: red cursor, and Malevolent Shrine is declared each time you arrive
  const inShrine = view.current === 'projects'
  useEffect(() => {
    document.documentElement.dataset.domain = inShrine ? 'sukuna' : ''
  }, [inShrine])
  useEffect(() => {
    if (view.outgoing || intro !== 'done' || !inShrine) {
      setShrineStamp(null)
      return
    }
    if (!prefersReducedMotion()) setShrineStamp(Date.now())
  }, [view.outgoing, inShrine, intro])

  // Gojo steps back out once the new page is revealed
  useEffect(() => {
    if (!strike?.leaving) return
    const timer = setTimeout(() => setStrike((s) => (s?.leaving ? null : s)), 320)
    return () => clearTimeout(timer)
  }, [strike])

  const startIntroSweep = useCallback(({ tunnel, ...opts }) => {
    if (!tunnel) {
      sweepRef.current.fire({
        ...opts,
        onFire: () => setIntro('firing'),
        onFrame: ({ edge }) => {
          if (introRef.current) introRef.current.style.clipPath = `inset(0 0 0 ${edge}px)`
        },
        onDone: () => setIntro('done'),
      })
      return
    }
    // Fired from Gojo's hand: erase only the tunnel the sphere bores through the domain
    // (narrow at his fingertips, widening as it grows), then the rest of the domain dissolves.
    const path = []
    let fadeAt = 0
    const fade = () => {
      if (fadeAt) return
      fadeAt = performance.now()
      introRef.current?.classList.add('intro--fading')
    }
    sweepRef.current.fire({
      ...opts,
      wall: false,
      onFire: () => setIntro('firing'),
      onFrame: ({ sphere }) => {
        const el = introRef.current
        if (!el || !sphere) return
        path.push(sphere)
        const { x: fx, y: fy } = opts.from
        const top = path.map((p) => `${p.x}px ${p.y - p.r}px`)
        const bottom = path.map((p) => `${p.x}px ${p.y + p.r}px`).reverse()
        // rounded front: the tunnel is exactly what the sphere has swept through
        const cap = Array.from({ length: 7 }, (_, k) => {
          const a = -Math.PI / 2 + ((k + 1) * Math.PI) / 8
          return `${sphere.x + Math.cos(a) * sphere.r}px ${sphere.y + Math.sin(a) * sphere.r}px`
        })
        // even-odd: the outer frame minus the tunnel
        el.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${fx}px ${fy}px, ${[...top, ...cap, ...bottom].join(', ')}, ${fx}px ${fy}px)`
        if (sphere.x > window.innerWidth) fade()
      },
      onDone: () => {
        fade()
        setTimeout(() => setIntro('done'), Math.max(0, 700 - (performance.now() - fadeAt)))
      },
    })
  }, [])

  const pages = view.outgoing ? [view.outgoing, view.current] : [view.current]

  return (
    <>
      <InfiniteVoidBg paused={inShrine && !view.outgoing && intro === 'done'} />
      <div className="grain" aria-hidden />

      {pages.map((id) => {
        const Page = PAGES[id]
        const leaving = id === view.outgoing
        return (
          <main
            key={id}
            ref={(el) => {
              if (el) pageRefs.current[id] = el
              else delete pageRefs.current[id]
            }}
            className={`page ${leaving ? 'page--outgoing' : ''}`}
            data-entered={intro !== 'playing' ? '' : undefined}
            // the incoming page starts fully hidden; the sweep's clip reveals it
            style={view.outgoing && !leaving ? { clipPath: view.dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' } : undefined}
            tabIndex={-1}
            aria-hidden={leaving || undefined}
            inert={leaving ? '' : undefined}
          >
            <Page />
          </main>
        )
      })}

      <Nav current={view.current} />

      {shrineStamp && <ShrineStamp key={shrineStamp} onDone={() => setShrineStamp(null)} />}
      {strike && <GojoStrike key={strike.id} {...strike} tipRef={strikeTipRef} />}

      {intro !== 'done' && (
        <DomainExpansionIntro
          key={introRun}
          ref={introRef}
          onPurple={startIntroSweep}
          fired={intro === 'firing'}
          autoStart={introRun > 0}
        />
      )}
      <HollowPurpleSweep ref={sweepRef} />
      {/* root level, outside every transformed layer, so position: fixed stays relative to the viewport */}
      <GojoCursor />
    </>
  )
}

export default App
