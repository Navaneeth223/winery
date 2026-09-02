import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const STEPS = [
  {
    n: 'I',
    title: 'Hand-thinned',
    text: 'Each vine carries twenty clusters. Never twenty-one. Concentration is subtraction.',
  },
  {
    n: 'II',
    title: 'Wild yeast',
    text: 'Nothing inoculated, nothing rushed. Fermentation begins when the cellar decides.',
  },
  {
    n: 'III',
    title: 'Basket press',
    text: 'The gentlest pressure we know. The must leaves the skin without fear.',
  },
  {
    n: 'IV',
    title: 'Twenty-two months',
    text: 'Old French oak, cold stone, and the patience of the previous century.',
  },
]

/**
 * CH. 05 — THE CRAFT
 * Editorial spread: a sticky creed on the left, drifting photographs
 * and the four disciplines on the right.
 */
export function CraftScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // parallax drift for the photographs
      gsap.utils.toArray<HTMLElement>('.craft__img-wrap').forEach((wrap) => {
        const speed = Number(wrap.dataset.speed || 1)
        gsap.fromTo(
          wrap.querySelector('img'),
          { yPercent: -6 * speed },
          {
            yPercent: 6 * speed,
            ease: 'none',
            scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1 },
          },
        )
      })

      // the creed holds; the list arrives
      gsap.from('.craft__step', {
        opacity: 0,
        y: 48,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.craft__steps', start: 'top 78%' },
      })
      gsap.from('.craft__right img', {
        opacity: 0,
        scale: 1.06,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.craft__right', start: 'top 82%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene craft" ref={rootRef} data-chapter="06 · The Craft" aria-label="The craft of the estate">
      <div className="craft__grid container">
        <div className="craft__left">
          <p className="eyebrow eyebrow--gold">06 — The Craft</p>
          <h2 className="craft__title serif">
            Attention is the only ingredient
            <br />
            <em>you cannot buy.</em>
          </h2>
          <p className="copy">
            Everything here is decided by hand, in the weather, at hours nobody photographs. What remains — in the glass
            — is a record of those decisions.
          </p>
          <ol className="craft__steps">
            {STEPS.map((s) => (
              <li key={s.n} className="craft__step">
                <span className="craft__step-n serif" aria-hidden="true">
                  {s.n}
                </span>
                <div>
                  <h3 className="craft__step-title serif">{s.title}</h3>
                  <p className="craft__step-text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="craft__right">
          <figure className="craft__img-wrap" data-speed="1.2">
            <img
              src="/images/winemaker.webp"
              alt="The winemaker looking up among stacked barrels"
              className="ph"
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="craft__caption">Barrel hall, first week of October</figcaption>
          </figure>
          <figure className="craft__img-wrap craft__img-wrap--offset" data-speed="0.8">
            <img
              src="/images/sommelier.webp"
              alt="A tasting in progress in the cellar"
              className="ph"
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="craft__caption">Blending trials, by lamplight</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
