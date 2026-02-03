import { Component } from 'react'
import Spline from '@splinetool/react-spline'

// Dark anime theme – works well with purple/pink overlay. Swap with your own from spline.design:
// Other options: create a dark/nebula/particle scene in Spline → Export → Public URL → paste below
const SPLINE_SCENE = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'

class SplineErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return null
    return (
      <div className="absolute inset-0 opacity-20 md:opacity-25 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-anime-bg/70 via-anime-bg/30 to-anime-bg/90 z-[1]" />
        <Spline scene={SPLINE_SCENE} className="w-full h-full scale-150 origin-center" />
      </div>
    )
  }
}

export default function SplineHero() {
  return <SplineErrorBoundary />
}
