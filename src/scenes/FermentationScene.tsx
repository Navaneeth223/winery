import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { DustCanvas } from '../components/canvas/DustCanvas'
import { brand } from '../data/brand'

/**
 * CH. 04 — THE CELLAR
 * Rack focus out of darkness. Fermentation numbers count themselves
 * up; the barrels cross through; the winemaker's creed.
 */
export function FermentationScene() {
  const rootRef = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=280%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        '.ferm__tanks-img',
        { scale: 1.18, filter: 'blur(12px) brightness(0.7)' },
        { scale: 1, filter: 'blur(0px) brightness(0.95)', ease: 'power1.out', duration: 0.3 },
        0,
      )
        .fromTo('.ferm__t1 .line', { yPercent: 130 }, { yPercent: 0, duration: 0.08 }, 0.06)
        .to('.ferm__t1 .line', { yPercent: -130, duration: 0.07 }, 0.26)

      // the numbers keep themselves
      tl.fromTo(
        '.ferm__stats',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out', onStart: countUp },
        0.3,
      )
        .to('.ferm__stats', { opacity: 0, y: -26, duration: 0.08 }, 0.5)

      // barrels drift through — aging
      tl.fromTo('.ferm__barrels', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.18 }, 0.52)
        .fromTo('.ferm__barrels-img', { scale: 1.22, yPercent: 6 }, { scale: 1.02, yPercent: 0, ease: 'none', duration: 0.4 }, 0.52)
        .fromTo('.ferm__quote', { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.66)
        .to({}, { duration: 0.16 })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  const countUp = () => {
    const root = rootRef.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count || 0)
      const obj = { v: 0 }
      gsap.to(obj, {
        v: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v))
        },
      })
    })
  }

  return (
    <section className="scene ferm pinned" ref={rootRef} data-chapter="05 · The Cellar" aria-label="Fermentation and aging in the cellar">
      <div className="ferm__tanks grade">
        <img
          src="/images/cellar-tanks.webp"
          alt="Fermentation tanks in the dark of the cellar"
          className="ph ferm__tanks-img"
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="ferm__barrels grade">
        <img
          src="/images/cellar-barrels.webp"
          alt="Oak barrels resting in the aging cellar"
          className="ph ferm__barrels-img"
          width={2000}
          height={1333}
          loading="lazy"
          decoding="async"
        />
      </div>
      <DustCanvas className="ferm__dust" />

      <div className="ferm__beats">
        <p className="ferm__beat ferm__t1">
          <span className="line-mask"><span className="line serif">In the dark, sugar becomes wine.</span></span>
        </p>

        <div className="ferm__stats" role="list">
          <div className="ferm__stat" role="listitem">
            <span className="serif ferm__stat-num">
              <span data-count={21}>21</span>
            </span>
            <span className="ferm__stat-label">days on skins</span>
          </div>
          <div className="ferm__stat" role="listitem">
            <span className="serif ferm__stat-num">
              <span data-count={14}>14</span>°
            </span>
            <span className="ferm__stat-label">fermented slowly</span>
          </div>
          <div className="ferm__stat" role="listitem">
            <span className="serif ferm__stat-num">
              <span data-count={0}>0</span>
            </span>
            <span className="ferm__stat-label">shortcuts taken</span>
          </div>
        </div>

        <figure className="ferm__quote">
          <blockquote className="serif">
            “We don’t make wine. We introduce the grape to time.”
          </blockquote>
          <figcaption className="eyebrow">{brand.winemaker} — winemaker, ORÉE</figcaption>
        </figure>
      </div>
    </section>
  )
}
