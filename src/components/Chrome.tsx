import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useUI } from '../store/store'

/** Fixed top line — the film timeline. */
export function ProgressRail() {
  const fillRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          scrub: 0.4,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])
  return (
    <div className="progress-rail" aria-hidden="true">
      <div className="progress-rail__fill" ref={fillRef} />
    </div>
  )
}

/** Fixed bottom-left chapter slate. */
export function ChapterRail() {
  const chapter = useUI((s) => s.chapter)
  return (
    <div className="chapter-rail" aria-hidden="true">
      <span className="chapter-rail__line" />
      <span className="chapter-rail__label">{chapter}</span>
    </div>
  )
}

export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />
}
