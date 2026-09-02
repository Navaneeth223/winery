import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * CH. 02 — THE LAND → THE FRUIT → THE HARVEST
 * One travelling shot: forward through the rows, into the cluster,
 * then the hands that pick it. Three beats, one continuous move.
 */
export function VineDollyScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=320%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // beat 1 — walking the rows
      tl.fromTo('.dolly__rows', { scale: 1.06, yPercent: 0 }, { scale: 1.42, yPercent: -4, ease: 'none', duration: 1 }, 0)
        .fromTo('.dolly__beat--1 .line', { yPercent: 0 }, { yPercent: -130, ease: 'none', duration: 0.16 }, 0.14)
        .to('.dolly__rows', { filter: 'brightness(0.5) saturate(0.75)', ease: 'none', duration: 0.5 }, 0.22)

      // beat 2 — the cluster grows from the frame
      tl.fromTo(
        '.dolly__cluster',
        { clipPath: 'circle(11% at 50% 46%)', opacity: 1 },
        { clipPath: 'circle(120% at 50% 46%)', ease: 'power1.in', duration: 0.42 },
        0.2,
      )
        .fromTo('.dolly__cluster-img', { scale: 1.35 }, { scale: 1.02, ease: 'none', duration: 0.6 }, 0.2)
        .fromTo('.dolly__beat--2 .line', { yPercent: 130 }, { yPercent: 0, duration: 0.1 }, 0.26)
        .to('.dolly__beat--2 .line', { yPercent: -130, duration: 0.1 }, 0.48)

      // beat 3 — the harvest
      tl.fromTo('.dolly__hands', { yPercent: 100 }, { yPercent: 0, ease: 'power2.out', duration: 0.2 }, 0.56)
        .fromTo('.dolly__hands-img', { scale: 1.22 }, { scale: 1.05, ease: 'none', duration: 0.3 }, 0.56)
        .fromTo('.dolly__beat--3 .line', { yPercent: 130 }, { yPercent: 0, duration: 0.08 }, 0.62)
        .to('.dolly__veil', { opacity: 0.92, ease: 'none', duration: 0.16 }, 0.84)
        .to({}, { duration: 0.03 })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene dolly pinned" ref={rootRef} data-chapter="02 · The Fruit" aria-label="Through the vineyard, toward the fruit">
      <div className="dolly__rows grade">
        <img
          src="/images/vineyard-rows.webp"
          alt="Sunlight filtering through the estate vine rows"
          className="ph"
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="dolly__cluster" aria-hidden="true">
        <img
          src="/images/grapes-cluster.webp"
          alt=""
          className="ph dolly__cluster-img"
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="dolly__hands" aria-hidden="false">
        <img
          src="/images/harvest-hands.webp"
          alt="Hands holding freshly picked dark grapes"
          className="ph dolly__hands-img"
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="dolly__veil" aria-hidden="true" />

      <div className="dolly__beats" aria-live="off">
        <p className="dolly__beat dolly__beat--1">
          <span className="line-mask"><span className="line serif">Two thousand rows. One promise.</span></span>
        </p>
        <p className="dolly__beat dolly__beat--2">
          <span className="line-mask"><span className="line serif">Closer, now. Closer still.</span></span>
        </p>
        <p className="dolly__beat dolly__beat--3">
          <span className="line-mask"><span className="line serif">Taken at dawn. Chosen by hand.</span></span>
        </p>
      </div>
    </section>
  )
}
