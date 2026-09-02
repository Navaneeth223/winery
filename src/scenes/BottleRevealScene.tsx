import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { DustCanvas } from '../components/canvas/DustCanvas'
import { BottleGraphic } from '../components/graphics/BottleGraphic'
import { wines, currency } from '../data/wines'
import { useCart, useUI } from '../store/store'

const HERO_WINE = wines.find((w) => w.id === 'nuit-oree') ?? wines[0]

/**
 * CH. 06 — THE BOTTLE
 * The dark stage. One bottle rises into a single beam of light,
 * its story arriving in passes — never all at once.
 */
export function BottleRevealScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const add = useCart((s) => s.add)
  const showToast = useUI((s) => s.showToast)
  const openCart = useUI((s) => s.openCart)

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

      tl.fromTo('.bottle__wine', { opacity: 0, yPercent: 22, rotate: -7 }, { opacity: 1, yPercent: 0, rotate: 0, ease: 'power1.out', duration: 0.3 }, 0.04)
        .fromTo('.bottle__name .line', { yPercent: 130 }, { yPercent: 0, duration: 0.1, ease: 'power3.out' }, 0.1)
        .fromTo('.bottle__sweep', { xPercent: -160 }, { xPercent: 260, ease: 'power1.inOut', duration: 0.24 }, 0.3)
        .fromTo('.bottle__spec', { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.28)
        .fromTo('.bottle__left', { opacity: 0, x: -44 }, { opacity: 1, x: 0, duration: 0.12, ease: 'power2.out' }, 0.38)
        .fromTo('.bottle__right', { opacity: 0, x: 44 }, { opacity: 1, x: 0, duration: 0.12, ease: 'power2.out' }, 0.46)
        .fromTo('.bottle__buy', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.54)
        .to({}, { duration: 0.2 })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  const buy = () => {
    add(HERO_WINE.id)
    showToast(`${HERO_WINE.name} ${HERO_WINE.vintage} — added to your cellar`)
    openCart()
  }

  return (
    <section className="scene bottle pinned" ref={rootRef} data-chapter="07 · The Bottle" aria-label="The hero bottle revealed">
      <div className="bottle__spotlight" aria-hidden="true" />
      <DustCanvas className="bottle__dust" density={26} />

      <div className="bottle__stage">
        <h2 className="bottle__name serif" aria-label={`${HERO_WINE.name} ${HERO_WINE.vintage}`}>
          <span className="line-mask"><span className="line">
            {HERO_WINE.name} <em>{HERO_WINE.vintage}</em>
          </span></span>
        </h2>

        <div className="bottle__wine-wrap">
          <BottleGraphic tone={HERO_WINE.tone} className="bottle__wine" title={HERO_WINE.name} />
          <span className="bottle__sweep" aria-hidden="true" />
          <span className="bottle__floor" aria-hidden="true" />
        </div>

        <div className="bottle__left" aria-hidden="false">
          <p className="eyebrow eyebrow--gold">Tasting</p>
          <ul className="bottle__notes">
            {HERO_WINE.notes.map((n) => (
              <li key={n} className="serif">{n}</li>
            ))}
          </ul>
          <p className="bottle__profile">{HERO_WINE.profile}</p>
        </div>

        <div className="bottle__right">
          <dl className="bottle__meta">
            <div><dt>Vintage</dt><dd>{HERO_WINE.vintage}</dd></div>
            <div><dt>Region</dt><dd>{HERO_WINE.region}</dd></div>
            <div><dt>Varietal</dt><dd>{HERO_WINE.varietal}</dd></div>
            <div><dt>Alcohol</dt><dd>{HERO_WINE.abv}</dd></div>
            <div><dt>Bottle</dt><dd>{HERO_WINE.size}</dd></div>
          </dl>
        </div>

        <div className="bottle__buy">
          <span className="bottle__price serif">{currency(HERO_WINE.price)}</span>
          <button className="btn btn--solid" onClick={buy}>
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </section>
  )
}
