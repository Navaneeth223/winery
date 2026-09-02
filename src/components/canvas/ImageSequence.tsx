import { useEffect, useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { preloadSequence, type SequenceState } from '../../lib/sequences'

interface ImageSequenceProps {
  /** cache id for the preloader */
  id: string
  frames: string[]
  /** 0→1 scroll progress driving the frame index */
  progressRef: React.MutableRefObject<number>
  fit?: 'cover' | 'contain'
  className?: string
  /** canvas clear colour behind/around frames */
  background?: string
  /** frame shown as a still when the user prefers reduced motion */
  staticFrame?: number
}

/**
 * A scroll-scrubbed film.
 *
 * Frames preload in order; the player draws the requested frame, or
 * the newest contiguous frame already loaded — so early scrolling
 * degrades gracefully instead of stuttering. Only repaints when the
 * frame index changes; renders only while visible.
 */
export function ImageSequence({
  id,
  frames,
  progressRef,
  fit = 'cover',
  className,
  background = '#0b0709',
  staticFrame,
}: ImageSequenceProps) {
  const { ref: wrapRef, inView } = useInView<HTMLDivElement>('12%')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const state: SequenceState = preloadSequence(id, frames)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let lastDrawn = -1
    const DPR = Math.min(window.devicePixelRatio || 1, 1.75)

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * DPR))
      canvas.height = Math.max(1, Math.round(h * DPR))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()

    const paint = (img: HTMLImageElement) => {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, w, h)
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      if (!iw || !ih) return
      const scale = fit === 'cover' ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih)
      const dw = iw * scale
      const dh = ih * scale
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    }

    const pickLoaded = (target: number): HTMLImageElement | null => {
      const idx = Math.min(target, Math.max(0, state.loadedUpTo))
      return state.images[idx]
    }

    const loop = () => {
      const n = frames.length
      if (reduced) {
        // a single, deliberate still
        const i = Math.min(n - 1, Math.max(0, staticFrame ?? Math.floor(n * 0.6)))
        const img = state.images[i] ?? pickLoaded(i)
        if (img) {
          paint(img)
          return // painted once — stop the loop
        }
      } else {
        const p = Math.max(0, Math.min(1, progressRef.current))
        const target = Math.min(n - 1, Math.floor(p * (n - 1) + 1e-4))
        if (target !== lastDrawn) {
          const img = pickLoaded(target)
          if (img) {
            paint(img)
            lastDrawn = target
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }

    if (inView) loop()

    const onResize = () => {
      resize()
      lastDrawn = -1
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, fit, background, staticFrame, progressRef, wrapRef])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
