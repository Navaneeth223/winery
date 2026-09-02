import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { scrollToTarget } from '../lib/smooth'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useUI } from '../store/store'

/**
 * CH. 01 — THE LAND
 * Aerial vineyard at golden hour. The camera pushes toward the rows;
 * the title holds, then dissolves as we begin to travel.
 */
export function HeroScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const ready = useUI((s) => s.ready)

  // entrance — plays once the preloader lifts
  useEffect(() => {
    if (!ready || reduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero__eyebrow', { opacity: 0, y: 18, duration: 1 }, 0.15)
        .from('.hero__title .line', { yPercent: 112, duration: 1.5, stagger: 0.16 }, 0.3)
        .from('.hero__sub', { opacity: 0, y: 26, duration: 1.1 }, 1.1)
        .from('.hero__ctas .btn', { opacity: 0, y: 22, duration: 1, stagger: 0.1 }, 1.25)
        .from(['.hero__corner', '.hero__cue'], { opacity: 0, duration: 1.4, stagger: 0.12 }, 1.5)
    }, rootRef)
    return () => ctx.revert()
  }, [ready, reduced])

  // scroll choreography — a slow dolly into the vines
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: '+=240%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        })
        .to('.hero__bg', { scale: 1.3, yPercent: -5, filter: 'blur(4px) brightness(0.72)', ease: 'none', duration: 1 }, 0)
        .to('.hero__content', { yPercent: -36, opacity: 0, ease: 'none', duration: 0.4 }, 0)
        .to('.hero__cue', { opacity: 0, duration: 0.12 }, 0.02)
        .to('.hero__mist--2', { opacity: 0.65, ease: 'none', duration: 0.7 }, 0.2)
        .fromTo('.hero__exit', { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }, 0.66)
        .to({}, { duration: 0.04 })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene hero pinned" ref={rootRef} data-chapter="01 · The Land" aria-label="ORÉE — Born from the vine">
      <div className="hero__bg grade">
        <img
          src="/images/vineyard-wide.webp"
          alt="The ORÉE estate vineyard in golden evening light"
          className="ph"
          width={2000}
          height={1333}
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="hero__mist hero__mist--1" aria-hidden="true" />
      <div className="hero__mist hero__mist--2" aria-hidden="true" />

      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">Anderson Valley · Est. 1962</p>
        <h1 className="hero__title serif">
          <span className="line-mask"><span className="line">BORN FROM</span></span>
          <span className="line-mask"><span className="line">THE <em>VINE.</em></span></span>
        </h1>
        <p className="hero__sub copy">Every bottle begins with a moment in the earth.</p>
        <div className="hero__ctas">
          <button className="btn btn--solid" onClick={() => scrollToTarget('#land')}>
            <span>Discover the journey</span>
          </button>
          <button className="btn" onClick={() => scrollToTarget('#collection')}>
            <span>Shop the collection</span>
          </button>
        </div>
      </div>

      <p className="hero__corner hero__corner--bl" aria-hidden="true">38.8°N — The estate</p>
      <p className="hero__corner hero__corner--br" aria-hidden="true">A film in twelve chapters</p>

      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        <span className="hero__cue-label">Scroll</span>
      </div>

      <p className="hero__exit serif" aria-hidden="true">The season begins.</p>
    </section>
  )
}
