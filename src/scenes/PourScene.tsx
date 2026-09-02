import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ImageSequence } from '../components/canvas/ImageSequence'
import { pourSequence } from '../data/sequences'

/**
 * CH. 07 — THE POUR
 * A 300-frame cinematic pour, scrubbed frame-by-frame with the
 * scroll — then the glass pushes us into daylight and commerce.
 */
export function PourScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const filmProgress = useRef(0)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            filmProgress.current = self.progress
          },
        },
      })

      tl.fromTo('.pour__t .line', { yPercent: 130 }, { yPercent: 0, duration: 0.08 }, 0.04)
        .to('.pour__t .line', { yPercent: -130, duration: 0.06 }, 0.7)
        .fromTo('.pour__caption', { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.32)
        .to('.pour__caption', { opacity: 0, duration: 0.06 }, 0.76)
        // settle the film toward the daylight of the collection
        .to('.pour__film-stage', { scale: 1.06, filter: 'brightness(1.05)', duration: 0.18, ease: 'power1.inOut' }, 0.8)
        .to({}, { duration: 0.02 })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene pour pinned" ref={rootRef} data-chapter="08 · The Pour" aria-label="Wine pouring into the glass">
      <ImageSequence
        id="pouring"
        frames={pourSequence}
        progressRef={filmProgress}
        className="pour__film-stage film-stage"
        fit="cover"
        background="#120a0c"
        staticFrame={168}
      />
      <div className="film-vignette" aria-hidden="true" />

      <p className="pour__t">
        <span className="line-mask"><span className="line serif">Nineteen seconds. Every one of them earned.</span></span>
      </p>
      <p className="pour__caption eyebrow">The first glass is poured in the tasting room — and, from here on, at yours.</p>
    </section>
  )
}
