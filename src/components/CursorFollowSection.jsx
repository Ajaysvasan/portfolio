import { useCursorFollow } from '../hooks/useCursorFollow'

/**
 * Wraps content and provides cursor-follow data to children.
 * Renders floating decorative elements that move with the cursor in an anime/antigravity style.
 */
export default function CursorFollowSection({ children, className = '', as: Tag = 'section', ...rest }) {
  const { sectionRef, position } = useCursorFollow({ smoothing: 0.06, maxOffset: 28 })

  return (
    <Tag ref={sectionRef} className={`relative overflow-hidden ${className}`} {...rest}>
      {/* Cursor-following glow orbs - only visible when pointer is in section */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div
          className="absolute w-64 h-64 rounded-full bg-anime-purple/30 blur-[80px] transition-opacity duration-300"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${position.offsetX}px), calc(-50% + ${position.offsetY}px))`,
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full bg-anime-pink/25 blur-[60px] transition-opacity duration-300"
          style={{
            left: '60%',
            top: '40%',
            transform: `translate(calc(-50% + ${position.offsetX * 0.6}px), calc(-50% + ${position.offsetY * 0.6}px))`,
          }}
        />
        <div
          className="absolute w-40 h-40 rounded-full bg-anime-cyan/20 blur-[50px] transition-opacity duration-300"
          style={{
            left: '35%',
            top: '55%',
            transform: `translate(calc(-50% + ${-position.offsetX * 0.5}px), calc(-50% + ${-position.offsetY * 0.5}px))`,
          }}
        />
      </div>
      {children}
    </Tag>
  )
}
