import { useEffect } from 'react'
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

function App() {
  useEffect(() => {
    const year = document.getElementById('year')
    if (year) year.textContent = new Date().getFullYear()
  }, [])

  return (
    <>
      <ParallaxBg />
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
