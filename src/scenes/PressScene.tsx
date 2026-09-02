import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { JuiceCanvas } from '../components/canvas/JuiceCanvas'

/**
 * CH. 03 — THE PRESS (the signature moment)
 * A grape fills the frame. The camera passes through its skin into
 * living juice — the canvas takes over as the liquid darkens, calms,
 * and hands the film to the cellar.
 */
export function PressScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const juiceProgress = useRef(0)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=380%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // juice darkening begins as the skin is passed
            juiceProgress.current = Math.max(0, Math.min(1, (self.progress - 0.52) / 0.44))
          },
        },
      })

      // arrival — rack focus onto the grape
      tl.fromTo(
        '.press__img',
        { scale: 1.4, filter: 'blur(10px) brightness(0.85)' },
        { scale: 1.02, filter: 'blur(0px) brightness(1)', ease: 'power1.out', duration: 0.3 },
        0,
      )
        .fromTo('.press__t1 .line', { yPercent: 130 }, { yPercent: 0, duration: 0.07 }, 0.06)
        .to('.press__t1 .line', { yPercent: -130, duration: 0.07 }, 0.26)

      // the skin pass — light ring expands, image blows through
      tl.set('.press__ring', { scale: 0.12, opacity: 0.95 }, 0.36)
        .to('.press__ring', { scale: 26, opacity: 0, ease: 'power2.in', duration: 0.24 }, 0.37)
        .to('.press__img', { scale: 1.85, filter: 'blur(14px) brightness(1.9) saturate(1.2)', ease: 'power2.in', duration: 0.22 }, 0.36)
        .to('.press__img', { opacity: 0, ease: 'none', duration: 0.08 }, 0.56)

      // inside the juice
      tl.fromTo('.press__t2 .line', { yPercent: 130 }, { yPercent: 0, duration: 0.08 }, 0.62)
        .to('.press__t2 .line', { yPercent: -130, duration: 0.07 }, 0.84)
        .to('.press__veil', { opacity: 0.85, ease: 'none', duration: 0.1 }, 0.9)
        .to({}, { duration: 0.03 })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene press pinned" ref={rootRef} data-chapter="04 · The Press" aria-label="The grape becomes juice">
      {/* living juice — revealed beneath the photograph */}
      <JuiceCanvas progressRef={juiceProgress} className="press__juice" />

      <div className="press__photo grade" aria-hidden="false">
        <img
          src="/images/grapes-macro.webp"
          alt="Extreme close-up of dark wine grapes on the bunch"
          className="ph press__img"
          width={2000}
          height={1333}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="press__ring" aria-hidden="true" />
      <div className="press__veil" aria-hidden="true" />

      <div className="press__beats">
        <p className="press__beat press__t1">
          <span className="line-mask"><span className="line serif">Under the skin, the vine keeps its promise.</span></span>
        </p>
        <p className="press__beat press__t2">
          <span className="line-mask"><span className="line serif">Everything the wine will be, the grape already is.</span></span>
        </p>
      </div>
    </section>
  )
}
