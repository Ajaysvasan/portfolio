import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], input[type="submit"], summary'

/**
 * Six Eyes cursor: a bright core that tracks the pointer exactly and an
 * "Infinity" ring that trails it. Over links the ring charges into Hollow Purple.
 *
 * Mount at the app root — never inside a transformed/opacity-animated wrapper,
 * or `position: fixed` resolves against that wrapper and the cursor drifts away.
 */
export default function GojoCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(any-hover: hover) and (any-pointer: fine)')
    if (!fine.matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf = 0
    let last = performance.now()
    let shown = false

    const show = (v) => {
      if (shown === v) return
      shown = v
      dot.classList.toggle('is-visible', v)
      ring.classList.toggle('is-visible', v)
    }

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!shown) {
        // first move: jump the ring to the pointer and only now hide the native cursor
        ringPos.x = pos.x
        ringPos.y = pos.y
        document.documentElement.classList.add('has-gojo-cursor')
      }
      show(true)
    }
    const onOver = (e) => {
      ring.classList.toggle('is-hover', !!e.target.closest?.(INTERACTIVE))
    }
    const onLeave = (e) => {
      if (!e.relatedTarget) show(false)
    }
    const onDown = () => ring.classList.add('is-pressed')
    const onUp = () => ring.classList.remove('is-pressed')

    const tick = (now) => {
      // frame-rate independent easing (0.2 per frame at 60fps)
      const k = 1 - Math.pow(0.8, Math.min(0.1, (now - last) / 1000) * 60)
      last = now
      ringPos.x += (pos.x - ringPos.x) * k
      ringPos.y += (pos.y - ringPos.y) * k
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onLeave, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.classList.remove('has-gojo-cursor')
    }
  }, [])

  return (
    <div aria-hidden className="gojo-cursor">
      <div ref={ringRef} className="gojo-cursor__ring">
        <span />
      </div>
      <div ref={dotRef} className="gojo-cursor__dot" />
    </div>
  )
}
