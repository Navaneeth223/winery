import { useState } from 'react'
import type { FormEvent } from 'react'
import { brand, navLinks } from '../data/brand'
import { wines } from '../data/wines'
import { scrollToTarget } from '../lib/smooth'
import { GrapeMark } from './graphics/GrapeMark'

export function Footer() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')

  const subscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error')
      return
    }
    setState('done')
  }

  return (
    <footer className="footer" aria-label="Footer">
      <div className="container">
        <div className="footer__top">
          <GrapeMark className="footer__mark" />
          <p className="footer__statement serif">
            From earth.
            <br />
            To bottle.
            <br />
            <em>To moment.</em>
          </p>
        </div>

        <div className="footer__grid">
          <div className="footer__col">
            <p className="eyebrow">Explore</p>
            {navLinks.map((l) => (
              <button key={l.target} className="footer__link" onClick={() => scrollToTarget(l.target)}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="footer__col">
            <p className="eyebrow">The cellar</p>
            {wines.map((w) => (
              <button key={w.id} className="footer__link" onClick={() => scrollToTarget('#collection')}>
                {w.name} {w.vintage}
              </button>
            ))}
          </div>

          <div className="footer__col">
            <p className="eyebrow">Visit</p>
            <p className="footer__text">{brand.address}</p>
            <p className="footer__text">{brand.phone}</p>
            <p className="footer__text">{brand.email}</p>
            {brand.hours.map((h) => (
              <p key={h} className="footer__text footer__text--dim">
                {h}
              </p>
            ))}
          </div>

          <div className="footer__col footer__col--news">
            <p className="eyebrow">The harvest letter</p>
            <p className="footer__text footer__text--dim">
              Twelve letters a year. Vintage news, cellar notes, first pours.
            </p>
            {state === 'done' ? (
              <p className="footer__done" role="status">
                You're on the list. The first pour is on us.
              </p>
            ) : (
              <form className="footer__form" onSubmit={subscribe} noValidate>
                <label htmlFor="newsletter-email" className="visually-hidden">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@address.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setState('idle')
                  }}
                  aria-invalid={state === 'error'}
                />
                <button type="submit" className="btn btn--small" aria-label="Subscribe">
                  <span>Join</span>
                </button>
              </form>
            )}
            {state === 'error' && <p className="footer__error">A real address, please — like a real appellation.</p>}
          </div>
        </div>

        <div className="footer__legal">
          <div className="footer__brand-row">
            <span className="footer__wordmark serif">ORÉE</span>
            <span className="footer__tagline">{brand.tagline}</span>
          </div>
          <div className="footer__legal-row">
            <span>© {new Date().getFullYear()} ORÉE — {brand.disclaimer}</span>
            <nav className="footer__social" aria-label="Social">
              <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Pinterest</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Vimeo</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
