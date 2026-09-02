import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * CH. 09 — THE TABLE
 * Where the bottle becomes an evening. Asymmetric editorial gallery,
 * each photograph drifting at its own speed.
 */
export function TableScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.table__img').forEach((wrap) => {
        const speed = Number(wrap.dataset.speed || 1)
        gsap.fromTo(
          wrap.querySelector('img'),
          { yPercent: -7 * speed },
          {
            yPercent: 7 * speed,
            ease: 'none',
            scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1 },
          },
        )
      })
      gsap.from('.table__head > *', {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene table theme-light" ref={rootRef} data-chapter="10 · The Table" data-navtheme="light" aria-label="Wine at the table">
      <div className="container">
        <header className="table__head">
          <p className="eyebrow">10 — The Table</p>
          <h2 className="table__title serif">
            Where the bottle
            <br />
            becomes <em>an evening.</em>
          </h2>
        </header>

        <div className="table__gallery">
          <figure className="table__img table__img--main" data-speed="1.15">
            <img
              src="/images/glass-table.webp"
              alt="Wine glasses catching low light on a dark table"
              className="ph"
              width={2000}
              height={1333}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="table__caption">The estate table, an hour before service</figcaption>
          </figure>

          <figure className="table__img table__img--side" data-speed="0.75">
            <img
              src="/images/toast.webp"
              alt="Two hands clinking glasses of red wine"
              className="ph"
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="table__caption">Two glasses, one vintage</figcaption>
          </figure>

          <figure className="table__img table__img--wide" data-speed="1">
            <img
              src="/images/table-food.webp"
              alt="A table of cheese, grapes and wine"
              className="ph"
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="table__caption">What we eat while we wait</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
