import { useState } from 'react'
import SplineHero from './SplineHero'
import CursorFollowSection from './CursorFollowSection'
import { useCursorFollow } from '../hooks/useCursorFollow'

export default function Hero() {
  const [imgError, setImgError] = useState(false)
  const { sectionRef: nameImageRef, position } = useCursorFollow({
    smoothing: 0.06,
    maxOffset: 14,
  })

  return (
    <CursorFollowSection as="section" id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <SplineHero />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left animate-fade-in-up">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-jjk-text tracking-tight font-anime">
              <span className="block">Build</span>
              <span className="block bg-gradient-to-r from-jjk-curse via-jjk-curseLight to-jjk-sukuna bg-clip-text text-transparent">
                Impact
              </span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-jjk-text-dim max-w-xl">
              Software Engineer & AI/ML enthusiast — building systems that scale and ideas that connect.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="mailto:ajay192006@gmail.com"
                className="inline-flex items-center px-6 py-3 rounded-full bg-jjk-curse text-jjk-light font-medium hover:bg-jjk-sukuna hover:shadow-[0_0_24px_rgba(147,51,234,0.4)] transition-all duration-300"
              >
                Email me
              </a>
              <a
                href="https://github.com/Ajaysvasan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full border border-jjk-border text-jjk-light font-medium hover:border-jjk-curse hover:text-jjk-silver transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/ajay-s-vasan-584111291"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full border border-jjk-border text-jjk-light font-medium hover:border-jjk-infinity hover:text-jjk-silver transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div
            ref={nameImageRef}
            className="flex-shrink-0 flex flex-row items-center gap-4 sm:gap-6 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <div
              className="flex items-center"
              style={{
                transform: `translate(${position.offsetX}px, ${position.offsetY}px)`,
              }}
            >
              <p
                className="text-2xl sm:text-3xl lg:text-4xl font-bold font-anime bg-gradient-to-b from-jjk-silver via-jjk-light to-jjk-curse bg-clip-text text-transparent whitespace-nowrap animate-name-reveal"
                style={{
                  animationDelay: '350ms',
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                Ajay S Vasan
              </p>
            </div>
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex-shrink-0 group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-jjk-curse via-jjk-sukuna to-jjk-infinity opacity-40 group-hover:opacity-70 blur-sm transition-opacity duration-500" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-jjk-card border border-jjk-border shadow-[0_0_40px_rgba(147,51,234,0.25)] animate-float-slow transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_0_32px_rgba(147,51,234,0.4)]">
                {!imgError ? (
                  <img
                    src="/images/profile.jpg"
                    alt="Ajay S Vasan"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-jjk-muted text-center p-4">
                    <span className="text-sm font-medium">Your photo</span>
                    <small className="text-xs mt-1">images/profile.jpg</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2 text-jjk-muted text-sm animate-fade-in">
          <span>Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-jjk-border flex justify-center pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-jjk-curse animate-bounce" />
          </div>
        </div>
      </div>
    </CursorFollowSection>
  )
}
