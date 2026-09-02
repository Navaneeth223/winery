import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

export function initSmooth(reduced: boolean): Lenis | null {
  if (reduced) return null
  if (lenis) return lenis
  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function getLenis(): Lenis | null {
  return lenis
}

export function scrollToTarget(selector: string) {
  const el = document.querySelector(selector) as HTMLElement | null
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.8 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? 'hidden' : ''
  if (!lenis) return
  if (lock) lenis.stop()
  else lenis.start()
}
