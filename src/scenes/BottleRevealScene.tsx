import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { DustCanvas } from '../components/canvas/DustCanvas'
import { ImageSequence } from '../components/canvas/ImageSequence'
import { bottleSequence } from '../data/sequences'
import { wines, currency } from '../data/wines'
import { useCart, useUI } from '../store/store'

const HERO_WINE = wines.find((w) => w.id === 'nuit-oree') ?? wines[0]

/**
 * CH. 06 — THE BOTTLE
 * The estate bottle as a 250-frame film, scrubbed by the scroll.
 * The story arrives in passes around it — never all at once.
 */
export function BottleRevealScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const filmProgress = useRef(0)
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
          end: '+=340%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            filmProgress.current = self.progress
          },
        },
      })

      tl.fromTo('.bottle__film-stage', { opacity: 0, scale: 1.07 }, { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 0.02)
        .fromTo('.bottle__name .line', { yPercent: 130 }, { yPercent: 0, duration: 0.1, ease: 'power3.out' }, 0.12)
        .fromTo('.bottle__left', { opacity: 0, x: -44 }, { opacity: 1, x: 0, duration: 0.12, ease: 'power2.out' }, 0.42)
        .fromTo('.bottle__right', { opacity: 0, x: 44 }, { opacity: 1, x: 0, duration: 0.12, ease: 'power2.out' }, 0.52)
        .fromTo('.bottle__buy', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.64)
        .to({}, { duration: 0.16 })
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
      <ImageSequence
        id="bottle"
        frames={bottleSequence}
        progressRef={filmProgress}
        className="bottle__film-stage film-stage"
        fit="cover"
        background="#0e0a08"
        staticFrame={214}
      />
      <div className="film-vignette" aria-hidden="true" />
      <DustCanvas className="bottle__dust" density={18} />

      <div className="bottle__stage">
        <h2 className="bottle__name serif" aria-label={`${HERO_WINE.name} ${HERO_WINE.vintage}`}>
          <span className="line-mask"><span className="line">
            {HERO_WINE.name} <em>{HERO_WINE.vintage}</em>
          </span></span>
        </h2>

        <div className="bottle__left">
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
