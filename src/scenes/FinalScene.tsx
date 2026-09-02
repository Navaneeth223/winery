import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { scrollToTarget } from '../lib/smooth'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * CH. 12 — THE FINAL MOMENT
 * Three sentences, one breath. The film ends where every bottle
 * begins: at a table, with someone.
 */
export function FinalScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=220%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo('.final__l1', { opacity: 0, y: 70, letterSpacing: '0.12em' }, { opacity: 1, y: 0, letterSpacing: '0em', duration: 0.14, ease: 'power2.out' }, 0.04)
        .fromTo('.final__l2', { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.24)
        .fromTo('.final__l3', { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.44)
        .fromTo('.final__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: 'power2.out' }, 0.56)
        .fromTo(['.final__cta', '.final__mark'], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.14, stagger: 0.04 }, 0.62)
        .to({}, { duration: 0.2 })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene final pinned" ref={rootRef} data-chapter="12 · The Final Moment" aria-label="From earth to bottle to moment">
      <div className="final__glow" aria-hidden="true" />
      <p className="final__line final__l1 serif">FROM EARTH.</p>
      <p className="final__line final__l2 serif">TO BOTTLE.</p>
      <p className="final__line final__l3 serif">
        TO <em>MOMENT.</em>
      </p>
      <span className="final__rule" aria-hidden="true" />
      <button className="btn final__cta" onClick={() => scrollToTarget('#collection')}>
        <span>Explore the collection</span>
      </button>
      <p className="final__mark eyebrow">ORÉE — Anderson Valley</p>
    </section>
  )
}
