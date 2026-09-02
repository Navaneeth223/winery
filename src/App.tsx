import { useEffect } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { initSmooth } from './lib/smooth'
import { useUI } from './store/store'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { ProgressRail, ChapterRail, GrainOverlay } from './components/Chrome'
import { CartDrawer } from './components/CartDrawer'
import { ProductDetail } from './components/ProductDetail'
import { Toast } from './components/Toast'
import { Footer } from './components/Footer'

import { HeroScene } from './scenes/HeroScene'
import { VineDollyScene } from './scenes/VineDollyScene'
import { PressScene } from './scenes/PressScene'
import { FermentationScene } from './scenes/FermentationScene'
import { CraftScene } from './scenes/CraftScene'
import { BottleRevealScene } from './scenes/BottleRevealScene'
import { PourScene } from './scenes/PourScene'
import { CollectionScene } from './scenes/CollectionScene'
import { TableScene } from './scenes/TableScene'
import { EstateScene } from './scenes/EstateScene'
import { FinalScene } from './scenes/FinalScene'

export default function App() {
  const reduced = usePrefersReducedMotion()
  const ready = useUI((s) => s.ready)
  const setChapter = useUI((s) => s.setChapter)

  // the film projector
  useEffect(() => {
    initSmooth(reduced)
  }, [reduced])

  // chapter slate — one ScrollTrigger per scene, created after pinning
  useEffect(() => {
    if (!ready) return
    let triggers: ScrollTrigger[] = []
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]')).map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) setChapter(el.getAttribute('data-chapter') || '')
          },
        }),
      )
    })
    return () => {
      cancelAnimationFrame(id)
      triggers.forEach((t) => t.kill())
    }
  }, [ready, setChapter])

  // nav legibility — light sections flip the chrome
  useEffect(() => {
    const els = document.querySelectorAll('[data-navtheme]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            useUI.getState().setNavTheme(e.target.getAttribute('data-navtheme') === 'light' ? 'light' : 'dark')
          }
        })
      },
      { rootMargin: '0px 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#collection">
        Skip to the collection
      </a>

      <Preloader />
      <ProgressRail />
      <Navbar />
      <ChapterRail />

      <main id="top">
        <HeroScene />
        <VineDollyScene />
        <PressScene />
        <FermentationScene />
        <CraftScene />
        <BottleRevealScene />
        <PourScene />
        <CollectionScene />
        <TableScene />
        <EstateScene />
        <FinalScene />
      </main>

      <Footer />

      <CartDrawer />
      <ProductDetail />
      <Toast />
      <GrainOverlay />
    </>
  )
}
