import { useEffect, useState, useRef } from 'react'
import { useGlobalCursor } from '../hooks/useGlobalCursor'

const lerp = (a, b, t) => a + (b - a) * t

export default function GojoCursor() {
  const { x, y } = useGlobalCursor({ smoothing: 0.12 })
  const [visible, setVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isText, setIsText] = useState(false)
  const [isHighlightable, setIsHighlightable] = useState(false)

  // Trail positions for the glow effect
  const trailRef = useRef({ x: 0, y: 0 })
  const [trail, setTrail] = useState({ x: 0, y: 0 })

  // Smooth trail animation
  useEffect(() => {
    let raf
    const animate = () => {
      trailRef.current.x = lerp(trailRef.current.x, x, 0.08)
      trailRef.current.y = lerp(trailRef.current.y, y, 0.08)
      setTrail({ ...trailRef.current })
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [x, y])

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (hasTouch) return
    setVisible(true)

    const onOver = (e) => {
      const target = e.target?.closest('a, button, [role="button"], input[type="submit"]')
      const textTarget = e.target?.closest('input, textarea, [contenteditable="true"]')
      const highlightTarget = e.target?.closest('h1, h2, h3, h4, p, span, li')
      setIsPointer(!!target)
      setIsText(!!textTarget)
      setIsHighlightable(!!highlightTarget && !target && !textTarget)
    }

    const onDown = () => setIsPressed(true)
    const onUp = () => setIsPressed(false)

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!visible) return null

  const outerSize = isPointer ? 56 : isHighlightable ? 48 : isText ? 4 : 40
  const innerSize = isPressed ? 8 : isPointer ? 6 : 10

  return (
    <>
      {/* Curse energy trail - creates the dark energy aura */}
      <div
        className="pointer-events-none fixed z-[99998]"
        style={{
          left: trail.x,
          top: trail.y,
          width: 90,
          height: 90,
          transform: 'translate(-50%, -50%)',
          background: isHighlightable
            ? 'radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, rgba(147, 51, 234, 0.12) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(147, 51, 234, 0.18) 0%, rgba(107, 33, 168, 0.1) 40%, transparent 70%)',
          filter: 'blur(10px)',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Main cursor ring with JJK curse gradient */}
      <div
        className="pointer-events-none fixed z-[99999]"
        style={{
          left: x,
          top: y,
          width: outerSize,
          height: outerSize,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.25s cubic-bezier(0.23, 1, 0.32, 1), height 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {/* Animated curse energy ring */}
        <div
          className="absolute inset-0 rounded-full opacity-80"
          style={{
            background: isPointer
              ? 'conic-gradient(from 0deg, #9333ea, #f43f5e, #dc2626, #9333ea)'
              : isHighlightable
                ? 'conic-gradient(from 0deg, rgba(244, 63, 94, 0.7), rgba(147, 51, 234, 0.5), rgba(244, 63, 94, 0.7))'
                : 'conic-gradient(from 0deg, rgba(147, 51, 234, 0.6), rgba(107, 33, 168, 0.4), rgba(220, 38, 38, 0.3), rgba(147, 51, 234, 0.6))',
            padding: isPointer ? 2.5 : 1.5,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: isPointer || isHighlightable ? 'spin 2.5s linear infinite' : 'none',
          }}
        />

        {/* Inner domain glow */}
        {(isPointer || isHighlightable) && (
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: isHighlightable
                ? 'radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Center dot - Sukuna-style */}
      <div
        className="pointer-events-none fixed z-[99999]"
        style={{
          left: x,
          top: y,
          width: innerSize,
          height: innerSize,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s cubic-bezier(0.23, 1, 0.32, 1), height 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: isPointer
              ? 'linear-gradient(135deg, #9333ea 0%, #f43f5e 100%)'
              : isHighlightable
                ? 'linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
            boxShadow: isPointer
              ? '0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(244, 63, 94, 0.3)'
              : isHighlightable
                ? '0 0 18px rgba(244, 63, 94, 0.5), 0 0 35px rgba(220, 38, 38, 0.3)'
                : '0 0 14px rgba(192, 132, 252, 0.5)',
          }}
        />
      </div>

      {/* Text cursor indicator */}
      {isText && (
        <div
          className="pointer-events-none fixed z-[99999]"
          style={{
            left: x,
            top: y,
            width: 2,
            height: 20,
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(180deg, #9333ea 0%, #f43f5e 100%)',
            borderRadius: 1,
            animation: 'blink 1s ease-in-out infinite',
          }}
        />
      )}
    </>
  )
}
