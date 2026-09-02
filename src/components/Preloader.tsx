import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { lockScroll } from '../lib/smooth'
import { useUI } from '../store/store'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { GrapeMark } from './graphics/GrapeMark'

const CRITICAL = [
  '/images/vineyard-wide.webp',
  '/images/vineyard-rows.webp',
  '/images/grapes-cluster.webp',
  '/images/grapes-macro.webp',
  '/images/cellar-tanks.webp',
  '/images/cellar-barrels.webp',
  // first frame of each scroll-film, so the films open instantly
  '/sequences/bottle/frame-001.jpg',
  '/sequences/pouring/frame-001.jpg',
]

/**
 * The house lights going down. Preloads the critical frames of the
 * film, then lifts like a curtain onto the vineyard.
 */
export function Preloader() {
  const setReady = useUI((s) => s.setReady)
  const reduced = usePrefersReducedMotion()
  const [pct, setPct] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    lockScroll(true)
    let loaded = 0
    let finished = false
    const start = performance.now()

    const finish = () => {
      if (finished) return
      finished = true
      setPct(100)
      const el = rootRef.current
      if (reduced || !el) {
        lockScroll(false)
        setReady(true)
        return
      }
      gsap
        .timeline({ onComplete: () => setReady(true) })
        .to(el.querySelector('.preloader__inner'), { yPercent: -14, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0.15)
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'power4.inOut' }, 0.45)
        .add(() => lockScroll(false))
    }

    const check = () => {
      const elapsed = performance.now() - start
      if (loaded >= CRITICAL.length && elapsed >= 1400) finish()
    }

    CRITICAL.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = () => {
        loaded++
        setPct(Math.round((loaded / CRITICAL.length) * 92))
        check()
      }
      img.src = src
    })
    const minTimer = setTimeout(check, 1450)

    // absolute failsafe — never trap the visitor behind the loader
    const failsafe = setTimeout(finish, 6000)
    return () => {
      clearTimeout(minTimer)
      clearTimeout(failsafe)
      lockScroll(false)
    }
  }, [reduced, setReady])

  if (useUI((s) => s.ready)) return null

  return (
    <div className="preloader" ref={rootRef} role="status" aria-label="Loading the ORÉE experience">
      <div className="preloader__inner">
        <GrapeMark className="preloader__mark" />
        <p className="preloader__wordmark serif">ORÉE</p>
        <div className="preloader__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p className="preloader__label">
          Preparing the harvest <span aria-hidden="true">—</span> {pct}%
        </p>
      </div>
    </div>
  )
}
