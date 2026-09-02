import { useEffect, useRef, useState } from 'react'
import { useCart, useUI } from '../store/store'
import { wines, currency, wineById } from '../data/wines'
import { lockScroll } from '../lib/smooth'
import { BottleGraphic } from './graphics/BottleGraphic'

/**
 * The bottle, held up to the light. A full-screen dialogue between
 * the visitor and one wine — story, method, pairing, price.
 */
export function ProductDetail() {
  const detailId = useUI((s) => s.detailId)
  const closeDetail = useUI((s) => s.closeDetail)
  const openDetail = useUI((s) => s.openDetail)
  const add = useCart((s) => s.add)
  const showToast = useUI((s) => s.showToast)
  const wishlist = useCart((s) => s.wishlist)
  const toggleWish = useCart((s) => s.toggleWish)

  const wine = wineById(detailId)
  const [qty, setQtyLocal] = useState(1)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setQtyLocal(1)
    if (detailId) {
      lockScroll(true)
      setTimeout(() => closeRef.current?.focus(), 80)
    } else {
      lockScroll(false)
    }
  }, [detailId])

  useEffect(() => {
    if (!detailId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDetail()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detailId, closeDetail])

  if (!wine) return null

  const wished = wishlist.includes(wine.id)
  const related = wines.filter((w) => w.id !== wine.id).slice(0, 3)

  const addToCart = () => {
    add(wine.id, qty)
    showToast(`${wine.name} ${wine.vintage} — added to your cellar`)
  }

  return (
    <div className="detail" role="dialog" aria-modal="true" aria-label={`${wine.name} ${wine.vintage}`}>
      <div className="detail__backdrop" onClick={closeDetail} aria-hidden="true" />
      <div className="detail__shell" data-lenis-prevent>
        <button className="detail__close" onClick={closeDetail} ref={closeRef} aria-label="Close product view">
          ×
        </button>

        <div className="detail__stage" style={{ background: wine.tone.bg }}>
          <img
            src="/images/pour-2.webp"
            alt=""
            className="detail__stage-photo"
            loading="lazy"
            decoding="async"
            width={1600}
            height={1067}
          />
          <BottleGraphic tone={wine.tone} className="detail__bottle" title={wine.name} />
          <p className="detail__stage-num serif" aria-hidden="true">
            N°{wine.num}
          </p>
        </div>

        <div className="detail__body">
          <p className="eyebrow eyebrow--gold">
            The Collection · {wine.tag}
          </p>
          <h2 className="detail__name serif">
            {wine.name} <span className="detail__vintage">{wine.vintage}</span>
          </h2>
          <p className="detail__meta">
            {wine.varietal} · {wine.region} · {wine.abv} · {wine.size}
          </p>
          <p className="detail__price serif">{currency(wine.price)}</p>
          <p className="detail__profile">{wine.profile}</p>

          <ul className="detail__notes" aria-label="Tasting notes">
            {wine.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>

          <div className="detail__rows">
            <div className="detail__row">
              <span className="detail__row-label">The story</span>
              <p>{wine.story}</p>
            </div>
            <div className="detail__row">
              <span className="detail__row-label">In the cellar</span>
              <p>{wine.method}</p>
            </div>
            <div className="detail__row">
              <span className="detail__row-label">At the table</span>
              <p>{wine.pairing}</p>
            </div>
            <div className="detail__row">
              <span className="detail__row-label">Serving</span>
              <p>{wine.serving}</p>
            </div>
          </div>

          <div className="detail__buy">
            <div className="stepper stepper--lg" role="group" aria-label="Quantity">
              <button onClick={() => setQtyLocal(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQtyLocal(Math.min(12, qty + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn--solid detail__add" onClick={addToCart}>
              <span>Add to cart — {currency(wine.price * qty)}</span>
            </button>
            <button
              className={['detail__wish', wished ? 'is-wished' : ''].join(' ')}
              onClick={() => toggleWish(wine.id)}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              {wished ? '♥' : '♡'}
            </button>
          </div>

          <div className="detail__related">
            <p className="eyebrow">Also from the cellar</p>
            <div className="detail__related-grid">
              {related.map((r) => (
                <button
                  key={r.id}
                  className="detail__related-card"
                  onClick={() => openDetail(r.id)}
                  style={{ background: r.tone.bg }}
                >
                  <BottleGraphic tone={r.tone} className="detail__related-bottle" title={r.name} />
                  <span className="detail__related-name serif">{r.name}</span>
                  <span className="detail__related-price">{currency(r.price)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
