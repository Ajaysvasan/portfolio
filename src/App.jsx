import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ParallaxBg from './components/ParallaxBg'
import GojoCursor from './components/GojoCursor'
import FloatingOrbs from './components/FloatingOrbs'
import JJKCharacters from './components/JJKCharacters'

function App() {
  const [useCustomCursor, setUseCustomCursor] = useState(false)

  useEffect(() => {
    const year = document.getElementById('year')
    if (year) year.textContent = new Date().getFullYear()
  }, [])

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setUseCustomCursor(!hasTouch)
    if (!hasTouch) document.body.classList.add('cursor-jjk')
    return () => document.body.classList.remove('cursor-jjk')
  }, [])

  return (
    <>
      <ParallaxBg />
      <JJKCharacters />
      <FloatingOrbs />
      {useCustomCursor && <GojoCursor />}
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
