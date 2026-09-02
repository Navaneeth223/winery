import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { brand } from '../data/brand'

const EXPERIENCES = [
  { name: 'The Tasting', detail: 'Ninety minutes, five wines, one view', price: '$35' },
  { name: 'The Walk', detail: 'Two hours among the rows, boots provided', price: '$60' },
  { name: 'The Harvest Table', detail: 'Lunch among the barrels, weekends', price: '$110' },
]

/**
 * CH. 10 — THE ESTATE
 * Evening falls on the property. The aerial drifts; the visit
 * becomes concrete — experiences, a form, a promise to write back.
 */
export function EstateScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const [selected, setSelected] = useState<string | null>(null)
  const [guests, setGuests] = useState(2)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.estate__bg-img',
        { xPercent: -4, scale: 1.15 },
        {
          xPercent: 4,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      )
      gsap.from('.estate__content > *', {
        opacity: 0,
        y: 44,
        stagger: 0.1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 65%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="scene estate" id="estate" ref={rootRef} data-chapter="11 · The Estate" aria-label="Visit the estate">
      <div className="estate__bg grade">
        <img
          src="/images/estate.webp"
          alt="Aerial view of the ORÉE estate and vineyards"
          className="ph estate__bg-img"
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="estate__content container" id="visit">
        <p className="eyebrow eyebrow--gold">11 — The Estate</p>
        <h2 className="estate__title serif">
          Come and see
          <br />
          where it happens.
        </h2>

        <div className="estate__grid">
          <div className="estate__experiences">
            {EXPERIENCES.map((x) => (
              <button
                key={x.name}
                className={['estate__exp', selected === x.name ? 'is-selected' : ''].join(' ')}
                onClick={() => {
                  setSelected(x.name)
                  setSent(false)
                }}
                aria-pressed={selected === x.name}
              >
                <span className="estate__exp-name serif">{x.name}</span>
                <span className="estate__exp-detail">{x.detail}</span>
                <span className="estate__exp-price serif">{x.price}</span>
              </button>
            ))}
          </div>

          <div className="estate__visit">
            {sent ? (
              <p className="estate__sent serif" role="status">
                Consider it pencilled in the ledger.
                <br />
                <span>We’ll write within a day to confirm.</span>
              </p>
            ) : (
              <form className="estate__form" onSubmit={submit}>
                <p className="estate__form-title serif">
                  {selected ? `Plan your visit — ${selected}` : 'Plan your visit'}
                </p>
                <div className="estate__form-row">
                  <label>
                    <span className="eyebrow">Date</span>
                    <input type="date" required />
                  </label>
                  <label>
                    <span className="eyebrow">Guests</span>
                    <div className="stepper" role="group" aria-label="Number of guests">
                      <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="Fewer guests">−</button>
                      <span aria-live="polite">{guests}</span>
                      <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))} aria-label="More guests">+</button>
                    </div>
                  </label>
                </div>
                <label>
                  <span className="eyebrow">Email</span>
                  <input type="email" required placeholder="you@somewhere.com" />
                </label>
                <button type="submit" className="btn btn--solid">
                  <span>Request visit</span>
                </button>
              </form>
            )}

            <div className="estate__facts">
              <p>{brand.address}</p>
              <p>{brand.hours[0]}</p>
              <p>{brand.hours[1]}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
