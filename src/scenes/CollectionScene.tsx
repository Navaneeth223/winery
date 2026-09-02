import { useMemo, useState } from 'react'
import { wines, currency, type Wine } from '../data/wines'

import { useCart, useUI } from '../store/store'
import { BottleGraphic } from '../components/graphics/BottleGraphic'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Filter = 'All' | 'Red' | 'White' | 'Rosé'

/** One wine, on its stage. */
function ProductCard({ wine }: { wine: Wine }) {
  const add = useCart((s) => s.add)
  const showToast = useUI((s) => s.showToast)
  const openDetail = useUI((s) => s.openDetail)
  const wishlist = useCart((s) => s.wishlist)
  const toggleWish = useCart((s) => s.toggleWish)
  const [qty, setQty] = useState(1)
  const wished = wishlist.includes(wine.id)

  const addNow = () => {
    add(wine.id, qty)
    showToast(`${wine.name} ${wine.vintage} — added to your cellar`)
  }

  return (
    <article className="wine-card">
      <div className="wine-card__stage" style={{ background: wine.tone.bg }}>
        <BottleGraphic tone={wine.tone} className="wine-card__bottle" title={wine.name} />
        <button
          className={['wine-card__wish', wished ? 'is-wished' : ''].join(' ')}
          onClick={() => toggleWish(wine.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${wine.name} from wishlist` : `Save ${wine.name} to wishlist`}
        >
          {wished ? '♥' : '♡'}
        </button>
        <button className="wine-card__view" onClick={() => openDetail(wine.id)}>
          View the wine
        </button>
        <span className="wine-card__num serif" aria-hidden="true">N°{wine.num}</span>
      </div>

      <div className="wine-card__info">
        <p className="wine-card__tags">
          {wine.tag} · {wine.vintage} · {wine.varietal}
        </p>
        <h3 className="wine-card__name serif">
          <button onClick={() => openDetail(wine.id)}>{wine.name}</button>
        </h3>
        <p className="wine-card__profile">{wine.profile}</p>
        <div className="wine-card__buy">
          <span className="wine-card__price serif">{currency(wine.price)}</span>
          <div className="wine-card__actions">
            <div className="stepper" role="group" aria-label={`Quantity of ${wine.name}`}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty(Math.min(12, qty + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn--small" onClick={addNow}>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * CH. 08 — THE COLLECTION
 * Daylight. The film becomes a cellar door: six wines, one estate,
 * commerce with quiet hands.
 */
export function CollectionScene() {
  const reduced = usePrefersReducedMotion()
  const [filter, setFilter] = useState<Filter>('All')

  const list = useMemo(
    () => (filter === 'All' ? wines : wines.filter((w) => (filter === 'White' ? w.tag === 'White' : w.tag === filter))),
    [filter],
  )

  const enter = (node: Element | null) => {
    if (!node || reduced) return
    gsap.fromTo(node, { opacity: 0, y: 44 }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: node, start: 'top 88%' },
    })
  }

  return (
    <section className="scene collection theme-light" id="collection" data-chapter="09 · The Collection" data-navtheme="light" aria-label="The wine collection">
      <div className="container">
        <header className="collection__head" ref={enter}>
          <p className="eyebrow">09 — The Collection</p>
          <h2 className="collection__title serif">
            Six wines.
            <br />
            One estate.
          </h2>
          <p className="copy">
            Everything the journey taught us, bottled by vintage. Shipped from the cellar door in fibre, never foam.
          </p>
          <div className="collection__filters" role="group" aria-label="Filter the collection">
            {(['All', 'Red', 'White', 'Rosé'] as Filter[]).map((f) => (
              <button
                key={f}
                className={['collection__filter', filter === f ? 'is-active' : ''].join(' ')}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="collection__grid">
          {list.map((w) => (
            <ProductCard key={w.id} wine={w} />
          ))}
        </div>

        <p className="collection__note" ref={enter}>
          Complimentary shipping on orders of three bottles or more · Vintages are limited — when they’re gone, they’re gone.
        </p>
      </div>
    </section>
  )
}
