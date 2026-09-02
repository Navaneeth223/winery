import { useEffect, useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Blob {
  x: number
  y: number
  r: number
  dx: number
  dy: number
  phase: number
  speed: number
  spec: boolean
}

/**
 * THE PRESS — living juice.
 * A drifting field of deep-purple volumes with warm specular light.
 * `progressRef` (0→1, driven by scroll) darkens and calms the liquid,
 * physically connecting the press to the dark of the cellar.
 */
export function JuiceCanvas({
  progressRef,
  className,
}: {
  progressRef: React.MutableRefObject<number>
  className?: string
}) {
  const { ref: wrapRef, inView } = useInView<HTMLDivElement>('10%')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let t = 0

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5)

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

    const blobs: Blob[] = []
    for (let i = 0; i < 9; i++) {
      blobs.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.22 + Math.random() * 0.3,
        dx: (Math.random() - 0.5) * 0.0006,
        dy: (Math.random() - 0.5) * 0.0004,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.35,
        spec: i > 5,
      })
    }

    const draw = () => {
      const p = Math.max(0, Math.min(1, progressRef.current))
      const calm = 1 - p * 0.65 // the surface settles as we approach the cellar
      const dark = p * 0.55

      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#2b0a20')
      bg.addColorStop(0.55, '#1e0616')
      bg.addColorStop(1, '#120410')
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // liquid volumes
      ctx.globalCompositeOperation = 'lighter'
      for (const b of blobs) {
        const bx = (b.x + Math.cos(t * b.speed + b.phase) * 0.06 * calm) * w
        const by = (b.y + Math.sin(t * b.speed * 0.8 + b.phase) * 0.05 * calm) * h
        const br = b.r * Math.min(w, h) * (0.9 + Math.sin(t * b.speed + b.phase) * 0.12 * calm)

        const g = ctx.createRadialGradient(bx, by, br * 0.1, bx, by, br)
        if (b.spec) {
          g.addColorStop(0, `rgba(255, 158, 108, ${0.10 * (1 - dark)})`)
          g.addColorStop(0.5, `rgba(180, 60, 90, ${0.05 * (1 - dark)})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
        } else {
          g.addColorStop(0, `rgba(122, 28, 84, ${0.42 * (1 - dark * 0.6)})`)
          g.addColorStop(0.6, `rgba(74, 16, 48, ${0.22 * (1 - dark * 0.6)})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
        }
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(bx, by, br, 0, Math.PI * 2)
        ctx.fill()
      }

      // settle into the dark
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = `rgba(8, 3, 8, ${dark})`
      ctx.fillRect(0, 0, w, h)

      // vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(6,2,6,0.6)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)
    }

    const loop = () => {
      t += 0.016
      draw()
      raf = requestAnimationFrame(loop)
    }

    if (reduced) {
      progressRef.current = 0.35
      draw()
    } else if (inView) {
      loop()
    }

    const onResize = () => {
      resize()
      if (reduced) draw()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [inView, reduced, progressRef, wrapRef])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
