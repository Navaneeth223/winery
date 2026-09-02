import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { PourCanvas } from '../components/canvas/PourCanvas'

/**
 * CH. 07 — THE POUR
 * The bottle tilts, the stream falls, the glass fills with your
 * scrolling — then the glass pushes us into daylight and commerce.
 */
export function PourScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const pourProgress = useRef(0)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=280%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            pourProgress.current = self.progress
          },
        },
      })

      tl.fromTo('.pour__t .line', { yPercent: 130 }, { yPercent: 0, duration: 0.08 }, 0.04)
        .to('.pour__t .line', { yPercent: -130, duration: 0.06 }, 0.72)
        .fromTo('.pour__caption', { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.3)
        .to('.pour__caption', { opacity: 0, duration: 0.06 }, 0.78)
        // the glass grows toward us and hands off to the collection
        .to('.pour__canvas', { scale: 1.5, yPercent: 6, filter: 'blur(3px) brightness(1.3)', ease: 'power1.in', duration: 0.18 }, 0.8)
        .to({}, { duration: 0.02 })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene pour pinned" ref={rootRef} data-chapter="08 · The Pour" aria-label="Wine pouring into the glass">
      <div className="pour__canvas-wrap">
        <PourCanvas progressRef={pourProgress} className="pour__canvas" />
      </div>

      <p className="pour__t">
        <span className="line-mask"><span className="line serif">Nineteen seconds. Every one of them earned.</span></span>
      </p>
      <p className="pour__caption eyebrow">The first glass is poured in the tasting room — and, from here on, at yours.</p>
    </section>
  )
}
