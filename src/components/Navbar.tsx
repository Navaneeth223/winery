import { useEffect } from 'react'
import { navLinks } from '../data/brand'
import { useUI, useCart, type CartItem } from '../store/store'
import { getLenis, lockScroll, scrollToTarget } from '../lib/smooth'
import { Wordmark } from './graphics/GrapeMark'

export function useCartCount(): number {
  return useCart((s) => s.items.reduce((n: number, i: CartItem) => n + i.qty, 0))
}

export function Navbar() {
  const navTheme = useUI((s) => s.navTheme)
  const navSolid = useUI((s) => s.navSolid)
  const menuOpen = useUI((s) => s.menuOpen)
  const setMenuOpen = useUI((s) => s.setMenuOpen)
  const openCart = useUI((s) => s.openCart)
  const count = useCartCount()

  useEffect(() => {
    const onScroll = () => useUI.getState().setNavSolid(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lockScroll(menuOpen)
    return () => lockScroll(false)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, setMenuOpen])

  const go = (target: string) => {
    setMenuOpen(false)
    // let the menu close before travelling
    setTimeout(() => scrollToTarget(target), menuOpen ? 60 : 0)
  }

  return (
    <>
      <header
        className={[
          'nav',
          navSolid ? 'nav--solid' : '',
          navTheme === 'light' ? 'nav--light' : '',
          menuOpen ? 'nav--menu-open' : '',
        ].join(' ')}
      >
        <button className="nav__brand" onClick={() => getLenis()?.scrollTo(0, { duration: 1.6 })} aria-label="ORÉE — back to top">
          <Wordmark className="nav__wordmark serif" />
        </button>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((l) => (
            <button key={l.target} className="nav__link" onClick={() => go(l.target)}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="nav__cart" onClick={openCart} aria-label={`Open cart, ${count} items`}>
            <span className="nav__cart-label">Cart</span>
            <span className="nav__cart-count" aria-hidden="true">
              {count}
            </span>
          </button>
          <button
            className="nav__burger"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={['mobile-menu', menuOpen ? 'is-open' : ''].join(' ')} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">
          {navLinks.map((l, i) => (
            <button
              key={l.target}
              className="mobile-menu__link serif"
              style={{ transitionDelay: `${0.08 + i * 0.06}s` }}
              onClick={() => go(l.target)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {l.label}
            </button>
          ))}
          <button
            className="mobile-menu__link mobile-menu__link--gold serif"
            style={{ transitionDelay: `${0.08 + navLinks.length * 0.06}s` }}
            onClick={() => {
              setMenuOpen(false)
              setTimeout(openCart, 80)
            }}
            tabIndex={menuOpen ? 0 : -1}
          >
            Cart ({count})
          </button>
        </nav>
      </div>
    </>
  )
}
