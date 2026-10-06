import { useEffect, useId, useRef } from 'react'
import { buildHair } from './hair'

// Hair clumps around the root just above the blindfold (viewBox units).
const ROOT = { x: 500, y: 392 }
const MAIN = {
  start: { a: -122, r: 122 },
  spikes: [
    { a: -104, r: 200, v: 160 },
    { a: -84, r: 262, v: 182 },
    { a: -62, r: 312, v: 202 },
    { a: -41, r: 344, v: 214 },
    { a: -21, r: 362, v: 220 },
    { a: -2, r: 366, v: 220 },
    { a: 17, r: 356, v: 216 },
    { a: 36, r: 334, v: 206 },
    { a: 56, r: 298, v: 190 },
    { a: 77, r: 252, v: 170 },
    { a: 100, r: 196, v: 116 },
  ],
}
const BACK = {
  start: { a: -116, r: 124 },
  spikes: MAIN.spikes.slice(0, -1).map((s, i) => ({ a: s.a + 10, r: s.r * (i % 2 ? 0.92 : 1.02), v: s.v * 0.92 })),
}
// tucked behind the blindfold so the fill never shows below it
const CLOSE = [{ x: 594, y: 420 }, { x: 500, y: 404 }, { x: 406, y: 420 }]
// …and behind it again once it's pushed up onto his forehead
const CLOSE_RAISED = [{ x: 594, y: 370 }, { x: 500, y: 352 }, { x: 406, y: 370 }]
const RAISE = 52

/**
 * @param {object} props
 * @param {'sign' | 'fire' | null} [props.hand] crossed-finger domain sign, or two fingers aimed to the right
 * @param {number} [props.handDelay] ms before the hand rises into frame
 * @param {boolean} [props.eyes] blindfold pushed up, Six Eyes showing
 * @param {boolean} [props.blast] hair thrown back by a blast from the right
 * @param {import('react').Ref<SVGCircleElement>} [props.tipRef] marker at the aimed fingertips
 */
export default function GojoFigure({ hand = null, handDelay = 0, eyes = false, blast = false, wind = 1, tipRef, className = '' }) {
  const id = useId().replace(/:/g, '')
  const refs = {
    back: useRef(null),
    main: useRef(null),
    shadow: useRef(null),
    shine: useRef(null),
    clumps: useRef(null),
    rim: useRef(null),
  }
  // eased toward every frame so a blast whips the hair back instead of snapping it
  const target = useRef(null)
  target.current = { wind: blast ? 4.2 : wind, lean: blast ? -16 : 0 }

  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const motion = { ...target.current }
    const close = eyes ? CLOSE_RAISED : CLOSE
    const set = (r, d) => r.current && r.current.setAttribute('d', d)
    const frame = (now) => {
      const t = (now - t0) / 1000
      motion.wind += (target.current.wind - motion.wind) * 0.06
      motion.lean += (target.current.lean - motion.lean) * 0.08
      const w = motion.wind
      const back = buildHair({ cx: ROOT.x, cy: ROOT.y, ...BACK, t, wind: w, lean: 4 + motion.lean, phase: 1.3, close, fan: 0.72 })
      const main = buildHair({ cx: ROOT.x, cy: ROOT.y, ...MAIN, t, wind: w, lean: 6 + motion.lean, close, fan: 0.72 })
      set(refs.back, back.outline)
      set(refs.main, main.outline)
      set(refs.rim, main.edge)
      set(refs.shadow, main.shadow)
      set(refs.shine, main.shine)
      set(refs.clumps, main.clumps)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
    // refs are stable; wind/blast are read through `target`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eyes])

  const LINE = '#16121f'
  const RIM = '#c4f5ff'
  const PURPLE_RIM = '#ead5ff'

  const eye = (side) => {
    const m = (x) => (side === 'L' ? x : 1000 - x)
    const lid = `M${m(420)} 427 C${m(430)} 409 ${m(466)} 405 ${m(483)} 432`
    const shape = `${lid} C${m(470)} 444 ${m(436)} 445 ${m(424)} 433 Z`
    const cx = m(454)
    return (
      <g key={side}>
        <clipPath id={`${id}-eye-${side}`}>
          <path d={shape} />
        </clipPath>
        <path d={shape} fill="#eef2ff" />
        <g clipPath={`url(#${id}-eye-${side})`}>
          <circle cx={cx} cy="428" r="14" fill={`url(#${id}-iris)`} />
          <circle cx={cx} cy="428" r="4.5" fill="#030b26" />
          <rect x={m(side === 'L' ? 415 : 490)} y="400" width="75" height="14" fill="#06123a" opacity="0.55" />
          <circle cx={cx - 4} cy="423" r="3.5" fill="#fff" />
        </g>
        <path d={lid} fill="none" stroke="#1d2235" strokeWidth="4" strokeLinecap="round" />
        <path d={lid} fill="none" stroke="#f4f7ff" strokeWidth="2" strokeLinecap="round" transform="translate(0 -2.5)" />
        <path d={`M${m(422)} 426 Q${m(412)} 420 ${m(404)} 410`} fill="none" stroke="#1d2235" strokeWidth="4.5" strokeLinecap="round" />
        <path d={`M${m(422)} 426 Q${m(412)} 420 ${m(404)} 410`} fill="none" stroke="#f4f7ff" strokeWidth="2" strokeLinecap="round" />
      </g>
    )
  }

  return (
    <svg viewBox="0 0 1000 1000" className={`gojo-figure ${className}`} aria-hidden>
      <defs>
        <linearGradient id={`${id}-skin`} x1="1" y1="0" x2="0" y2="0.35">
          <stop offset="0" stopColor="#d6bec3" />
          <stop offset="1" stopColor="#8d7590" />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#e6ecf8" />
          <stop offset="1" stopColor="#aeb9d8" />
        </linearGradient>
        <linearGradient id={`${id}-jacket`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#161c3c" />
          <stop offset="1" stopColor="#04050c" />
        </linearGradient>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#222842" />
          <stop offset="0.22" stopColor="#0a0b14" />
          <stop offset="1" stopColor="#030308" />
        </linearGradient>
        <linearGradient id={`${id}-hand`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b79ead" />
          <stop offset="1" stopColor="#5f4b66" />
        </linearGradient>
        <radialGradient id={`${id}-iris`}>
          <stop offset="0" stopColor="#f0feff" />
          <stop offset="0.35" stopColor="#7ee8ff" />
          <stop offset="0.75" stopColor="#1f8bff" />
          <stop offset="1" stopColor="#0a3a9e" />
        </radialGradient>
        <radialGradient id={`${id}-eyeGlow`}>
          <stop offset="0" stopColor="#67e8f9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* hair, back layer */}
      <path ref={refs.back} fill="#7884ad" />

      {/* neck */}
      <path d="M452 540 L548 540 L560 700 L440 700 Z" fill="#6a556d" />
      <path d="M456 586 C476 620 524 620 544 586 L550 640 C526 652 474 652 450 640 Z" fill="#3d3047" />

      {/* torso — Jujutsu High uniform */}
      <path
        d="M380 766 C320 790 230 806 168 836 C118 862 92 914 84 1000 L916 1000 C908 914 882 862 832 836 C770 806 680 790 620 766 Z"
        fill={`url(#${id}-jacket)`}
        stroke={LINE}
        strokeWidth="3"
      />
      <path d="M300 860 C318 900 328 950 324 1000 M700 860 C682 900 672 950 676 1000" stroke="#03040a" strokeWidth="4" fill="none" opacity="0.8" />
      <path d="M500 788 L500 1000" stroke="#03040a" strokeWidth="5" />
      <g transform="translate(500 856)">
        <circle r="15" fill="#1b2346" stroke="#4a5788" strokeWidth="2" />
        <path d="M0 0 m-7 0 a7 7 0 1 1 7 7 a4.5 4.5 0 1 1 -4.5 -4.5" fill="none" stroke="#8b98c9" strokeWidth="2" />
      </g>
      <path
        d="M380 766 C320 790 230 806 168 836 C118 862 92 914 84 1000 M620 766 C680 790 770 806 832 836 C882 862 908 914 916 1000"
        stroke="#9be7ff"
        strokeWidth="3"
        fill="none"
        opacity="0.75"
      />

      {/* high collar */}
      <path d="M408 622 C440 600 560 600 592 622 C560 612 440 612 408 622 Z" fill="#05060c" />
      <path
        d="M408 622 C440 640 476 664 497 690 L497 790 C455 788 413 780 380 766 C392 724 402 668 408 622 Z"
        fill="#10152d"
        stroke={LINE}
        strokeWidth="3"
      />
      <path
        d="M592 622 C560 640 524 664 503 690 L503 790 C545 788 587 780 620 766 C608 724 598 668 592 622 Z"
        fill="#0c1024"
        stroke={LINE}
        strokeWidth="3"
      />
      <path d="M592 622 C598 668 608 724 620 766" stroke="#9be7ff" strokeWidth="2.5" fill="none" opacity="0.7" />

      {/* ears */}
      <path d="M401 410 C380 400 371 436 380 460 C386 478 398 486 410 482 Z" fill="#76607a" stroke={LINE} strokeWidth="2.5" />
      <path d="M599 410 C620 400 629 436 620 460 C614 478 602 486 590 482 Z" fill="#ab92a3" stroke={LINE} strokeWidth="2.5" />
      <path d="M622 420 C628 440 624 462 614 474" fill="none" stroke={RIM} strokeWidth="2" opacity="0.8" />

      {/* face */}
      <path
        d="M398 330 C394 404 400 462 416 516 C432 570 466 606 500 618 C534 606 568 570 584 516 C600 462 606 404 602 330 Z"
        fill={`url(#${id}-skin)`}
      />
      {/* cel shading: shadow side, blindfold cast shadow */}
      <path
        d="M398 330 C394 404 400 462 416 516 C432 570 466 606 500 618 L500 608 C476 592 454 560 444 514 C432 466 428 404 434 330 Z"
        fill="#6e5a78"
        opacity="0.85"
      />
      <path
        d="M398 424 L602 424 L600 456 C560 478 440 478 400 456 Z"
        transform={eyes ? `translate(0 ${-RAISE})` : undefined}
        fill="#6a5576"
        opacity={eyes ? 0.45 : 0.6}
      />
      <path
        d="M398 330 C394 404 400 462 416 516 C432 570 466 606 500 618 C534 606 568 570 584 516 C600 462 606 404 602 330"
        fill="none"
        stroke={LINE}
        strokeWidth="3.2"
      />
      <path d="M602 350 C606 404 600 462 584 516 C568 570 534 606 500 618" fill="none" stroke={RIM} strokeWidth="2.6" opacity="0.9" />
      {/* nose + mouth */}
      <path d="M502 462 L509 496 L497 500 Z" fill="#6e5a78" opacity="0.8" />
      <path d="M506 464 C510 479 512 490 506 498 L497 500" fill="none" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M478 548 Q498 555 522 545 Q529 542 533 536" fill="none" stroke={LINE} strokeWidth="3" strokeLinecap="round" />
      <path d="M491 566 L506 566" stroke="#4f3d57" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* hair, main layer */}
      <path ref={refs.main} fill={`url(#${id}-hair)`} />
      <path ref={refs.shadow} fill="#a7b2d4" opacity="0.92" />
      <path ref={refs.clumps} stroke="#7480a6" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path ref={refs.shine} fill="#ffffff" opacity="0.95" />
      <path ref={refs.rim} fill="none" stroke="#2c3554" strokeWidth="2.6" strokeLinejoin="round" />

      {eyes && (
        <g>
          <circle cx="454" cy="428" r="46" fill={`url(#${id}-eyeGlow)`} />
          <circle cx="546" cy="428" r="46" fill={`url(#${id}-eyeGlow)`} />
          {eye('L')}
          {eye('R')}
          {/* white brows, drawn in toward the nose */}
          <path d="M486 400 C466 388 436 388 410 396 C436 393 466 396 484 410 Z" fill="#f1f4fc" stroke="#7c87ab" strokeWidth="1.5" />
          <path d="M514 400 C534 388 564 388 590 396 C564 393 534 396 516 410 Z" fill="#f1f4fc" stroke="#7c87ab" strokeWidth="1.5" />
        </g>
      )}

      {/* blindfold — wraps round the head, ends tucked under the hair */}
      <g transform={eyes ? `translate(0 ${-RAISE})` : undefined}>
        <path
          d="M378 372 Q500 340 622 372 C628 392 628 414 622 438 Q500 408 378 438 C372 414 372 392 378 372 Z"
          fill={`url(#${id}-band)`}
          stroke={LINE}
          strokeWidth="3"
        />
        <path d="M390 376 Q500 348 610 376" fill="none" stroke="#3d466c" strokeWidth="3" />
        <path d="M420 404 Q468 394 522 398 M540 414 Q574 410 604 418 M392 420 Q404 418 416 420" fill="none" stroke="#1d2134" strokeWidth="3" strokeLinecap="round" />
        <path d="M622 372 C628 392 628 414 622 438" fill="none" stroke={RIM} strokeWidth="2.4" opacity="0.8" />
      </g>

      {hand === 'sign' && (
        <g className="gojo-hand-rise" style={{ animationDelay: `${handDelay}ms` }}>
          <g transform="translate(742 712) rotate(-6)">
            {/* sleeve */}
            <path d="M-64 30 L-58 -4 L60 -8 L68 30 L92 420 L-86 420 Z" fill={`url(#${id}-jacket)`} stroke={LINE} strokeWidth="3" />
            <path d="M-60 6 L62 2" stroke="#2a335c" strokeWidth="3" />
            <path d="M68 30 L92 420" stroke="#9be7ff" strokeWidth="2.5" opacity="0.7" />
            {/* palm */}
            <path
              d="M-50 4 C-58 -30 -60 -70 -54 -104 C-50 -122 52 -126 56 -108 C60 -72 58 -30 50 2 Z"
              fill={`url(#${id}-hand)`}
              stroke={LINE}
              strokeWidth="3"
            />
            {/* ring + little finger folded */}
            <path d="M6 -116 C6 -138 34 -142 36 -120 C38 -102 34 -88 22 -84 C10 -86 6 -100 6 -116 Z" fill="#8f7891" stroke={LINE} strokeWidth="2.6" />
            <path d="M34 -108 C36 -126 58 -126 58 -108 C58 -94 54 -84 44 -82 C36 -84 34 -94 34 -108 Z" fill="#a08aa1" stroke={LINE} strokeWidth="2.6" />
            {/* thumb pinning them down */}
            <path
              d="M-54 -40 C-66 -70 -48 -98 -14 -100 C6 -101 22 -96 30 -88 C34 -80 26 -72 14 -74 C-4 -76 -22 -70 -30 -52 Z"
              fill="#8a7390"
              stroke={LINE}
              strokeWidth="2.6"
            />
            {/* index finger, leaning right */}
            <path
              d="M-44 -104 C-38 -160 -18 -220 -6 -256 C-2 -270 16 -270 16 -256 C10 -218 -2 -160 -10 -104 Z"
              fill="#7e6884"
              stroke={LINE}
              strokeWidth="2.6"
            />
            <path d="M-30 -178 L-16 -176 M-18 -222 L-6 -220" stroke={LINE} strokeWidth="1.8" opacity="0.7" />
            {/* middle finger crossed in front of it, leaning left */}
            <path
              d="M0 -112 C-6 -172 -16 -230 -26 -266 C-30 -282 -10 -288 -8 -272 C0 -232 14 -176 30 -116 Z"
              fill={`url(#${id}-hand)`}
              stroke={LINE}
              strokeWidth="2.6"
            />
            <path d="M-2 -176 L12 -180 M-10 -228 L2 -232" stroke={LINE} strokeWidth="1.8" opacity="0.7" />
            <path d="M30 -116 C14 -176 0 -232 -8 -272" fill="none" stroke={RIM} strokeWidth="2.2" opacity="0.9" />
            <path d="M16 -256 C12 -236 8 -224 4 -214" fill="none" stroke={RIM} strokeWidth="2" opacity="0.7" />
            <path d="M50 2 C58 -30 60 -72 56 -108" fill="none" stroke={RIM} strokeWidth="2.2" opacity="0.9" />
          </g>
        </g>
      )}

      {hand === 'fire' && (
        <g className="gojo-hand-rise" style={{ animationDelay: `${handDelay}ms` }}>
          <g className="gojo-hand-recoil">
            <g transform="translate(650 548) rotate(-4)">
              {/* forearm raised from below */}
              <path d="M-42 -28 L30 -36 L56 40 L78 560 L-104 560 L-70 30 Z" fill={`url(#${id}-jacket)`} stroke={LINE} strokeWidth="3" />
              <path d="M-44 -6 L40 -14" stroke="#2a335c" strokeWidth="3" />
              <path d="M56 40 L78 560" stroke={PURPLE_RIM} strokeWidth="2.5" opacity="0.8" />
              {/* back of the hand */}
              <path
                d="M-4 -34 C26 -44 60 -42 78 -30 L82 26 C66 40 30 42 2 34 C-10 14 -10 -16 -4 -34 Z"
                fill={`url(#${id}-hand)`}
                stroke={LINE}
                strokeWidth="3"
              />
              {/* ring + little finger curled */}
              <path d="M76 16 C96 16 104 30 96 40 C86 48 66 46 62 36 Z" fill="#8f7891" stroke={LINE} strokeWidth="2.6" />
              <path d="M60 34 C78 36 84 50 74 56 C64 62 46 58 44 48 Z" fill="#7e6884" stroke={LINE} strokeWidth="2.6" />
              {/* thumb raised */}
              <path d="M18 -36 C18 -62 30 -84 48 -92 C60 -96 66 -84 58 -76 C48 -64 46 -50 48 -38 Z" fill="#8a7390" stroke={LINE} strokeWidth="2.6" />
              {/* index + middle fingers aimed at the target */}
              <path
                d="M74 -34 C110 -38 150 -36 178 -30 C190 -27 190 -12 178 -10 C150 -8 110 -8 76 -10 Z"
                fill={`url(#${id}-hand)`}
                stroke={LINE}
                strokeWidth="2.6"
              />
              <path
                d="M76 -10 C114 -10 158 -8 188 -3 C200 0 200 15 188 17 C158 19 114 18 80 16 Z"
                fill="#9f879f"
                stroke={LINE}
                strokeWidth="2.6"
              />
              <path d="M120 -34 L122 -12 M150 -34 L152 -10 M126 -8 L128 16 M158 -6 L160 17" stroke={LINE} strokeWidth="1.6" opacity="0.6" />
              {/* lit by the purple forming at his fingertips */}
              <path d="M74 -34 C110 -38 150 -36 178 -30 C190 -27 190 -12 178 -10" fill="none" stroke={PURPLE_RIM} strokeWidth="2.4" />
              <path d="M188 -3 C200 0 200 15 188 17" fill="none" stroke={PURPLE_RIM} strokeWidth="2.4" />
              <path d="M78 -30 L82 26" fill="none" stroke={PURPLE_RIM} strokeWidth="2" opacity="0.8" />
              <circle ref={tipRef} cx="202" cy="4" r="1" fill="none" />
            </g>
          </g>
        </g>
      )}
    </svg>
  )
}
