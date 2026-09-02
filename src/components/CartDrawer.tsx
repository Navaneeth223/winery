import { useEffect, useRef, useState } from 'react'
import { useCart, useUI } from '../store/store'
import { currency, wineById } from '../data/wines'
import { lockScroll, scrollToTarget } from '../lib/smooth'
import { BottleGraphic } from './graphics/BottleGraphic'

const FREE_SHIPPING_BOTTLES = 3

/** Slide-over cellar. Never a page reload, never a broken mood. */
export function CartDrawer() {
  const cartOpen = useUI((s) => s.cartOpen)
  const closeCart = useUI((s) => s.closeCart)
  const openDetail = useUI((s) => s.openDetail)
  const items = useCart((s) => s.items)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const clear = useCart((s) => s.clear)
  const [stage, setStage] = useState<'cart' | 'confirm'>('cart')
  const closeRef = useRef<HTMLButtonElement>(null)

  const count = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((n, i) => {
    const wine = wineById(i.id)
    return n + (wine ? wine.price * i.qty : 0)
  }, 0)

  useEffect(() => {
    if (cartOpen) {
      setStage('cart')
      lockScroll(true)
      setTimeout(() => closeRef.current?.focus(), 80)
    } else {
      lockScroll(false)
    }
  }, [cartOpen])

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, closeCart])

  const browse = () => {
    closeCart()
    setTimeout(() => scrollToTarget('#collection'), 100)
  }

  return (
    <div className={['cart', cartOpen ? 'is-open' : ''].join(' ')} aria-hidden={!cartOpen}>
      <div className="cart__backdrop" onClick={closeCart} aria-hidden="true" />
      <aside className="cart__panel" role="dialog" aria-modal="true" aria-label="Shopping cart" data-lenis-prevent>
        <header className="cart__head">
          <p className="eyebrow">Your cellar</p>
          <h2 className="cart__title serif">
            {stage === 'cart' ? `${count} bottle${count === 1 ? '' : 's'}` : 'Order received'}
          </h2>
          <button className="cart__close" onClick={closeCart} ref={closeRef} aria-label="Close cart">
            ×
          </button>
        </header>

        {stage === 'confirm' ? (
          <div className="cart__confirm">
            <span className="cart__confirm-mark" aria-hidden="true">✓</span>
            <p className="serif cart__confirm-title">The cellar has your order.</p>
            <p className="cart__confirm-copy">
              This is a demonstration checkout — nothing was charged, and no wine was disturbed.
            </p>
            <button
              className="btn btn--small"
              onClick={() => {
                clear()
                setStage('cart')
                closeCart()
              }}
            >
              <span>Continue</span>
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="cart__empty">
            <p className="serif cart__empty-title">Your cellar is empty.</p>
            <p className="cart__empty-copy">The journey ends at a bottle. Choose yours.</p>
            <button className="btn btn--small" onClick={browse}>
              <span>Explore the collection</span>
            </button>
          </div>
        ) : (
          <>
            <ul className="cart__list">
              {items.map((item) => {
                const wine = wineById(item.id)
                if (!wine) return null
                return (
                  <li key={item.id} className="cart__item">
                    <button
                      className="cart__thumb"
                      style={{ background: wine.tone.bg }}
                      onClick={() => { closeCart(); openDetail(wine.id) }}
                      aria-label={`View ${wine.name}`}
                    >
                      <BottleGraphic tone={wine.tone} className="cart__bottle" title={wine.name} />
                    </button>
                    <div className="cart__meta">
                      <p className="cart__name serif">
                        {wine.name} <span className="cart__vintage">{wine.vintage}</span>
                      </p>
                      <p className="cart__sub">
                        {wine.varietal} · {wine.region}
                      </p>
                      <div className="cart__controls">
                        <div className="stepper" role="group" aria-label={`Quantity of ${wine.name}`}>
                          <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
                          <span aria-live="polite">{item.qty}</span>
                          <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
                        </div>
                        <span className="cart__price">{currency(wine.price * item.qty)}</span>
                        <button className="cart__remove" onClick={() => remove(item.id)} aria-label={`Remove ${wine.name}`}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
            <footer className="cart__foot">
              <div className="cart__shipping">
                <div className="cart__shipping-bar" aria-hidden="true">
                  <span style={{ transform: `scaleX(${Math.min(1, count / FREE_SHIPPING_BOTTLES)})` }} />
                </div>
                <p>
                  {count >= FREE_SHIPPING_BOTTLES
                    ? 'Complimentary shipping unlocked.'
                    : `${FREE_SHIPPING_BOTTLES - count} more bottle${FREE_SHIPPING_BOTTLES - count === 1 ? '' : 's'} for complimentary shipping.`}
                </p>
              </div>
              <div className="cart__subtotal">
                <span>Subtotal</span>
                <span className="serif">{currency(subtotal)}</span>
              </div>
              <button className="btn btn--solid cart__checkout" onClick={() => setStage('confirm')}>
                <span>Checkout — {currency(subtotal)}</span>
              </button>
              <button className="cart__continue" onClick={browse}>
                Continue browsing
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
