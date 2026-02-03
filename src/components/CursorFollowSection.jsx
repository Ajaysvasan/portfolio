import { useCursorFollow } from '../hooks/useCursorFollow'

export default function CursorFollowSection({ children, className = '', as: Tag = 'section', ...rest }) {
  const { sectionRef, position } = useCursorFollow({ smoothing: 0.06, maxOffset: 28 })

  return (
    <Tag ref={sectionRef} className={`relative overflow-hidden ${className}`} {...rest}>
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div
          className="absolute w-64 h-64 rounded-full bg-gojo-indigo/25 blur-[80px] transition-opacity duration-300"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${position.offsetX}px), calc(-50% + ${position.offsetY}px))`,
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full bg-gojo-purple/20 blur-[60px] transition-opacity duration-300"
          style={{
            left: '60%',
            top: '40%',
            transform: `translate(calc(-50% + ${position.offsetX * 0.6}px), calc(-50% + ${position.offsetY * 0.6}px))`,
          }}
        />
        <div
          className="absolute w-40 h-40 rounded-full bg-gojo-cyan/15 blur-[50px] transition-opacity duration-300"
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
