import { useEffect, useRef } from 'react'

/**
 * Marks `.reveal` and `.mask-line` elements inside the returned ref with `is-in`
 * the first time they scroll into view, so text animates as you reach it rather
 * than all at once when the page opens.
 */
export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal, .mask-line')
    if (!els?.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return ref
}
