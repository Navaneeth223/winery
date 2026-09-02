import { useEffect, useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Mote {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  phase: number
}

/**
 * Cellar dust — slow drifting motes for the dark scenes.
 * Renders only while visible; one static frame under reduced motion.
 */
export function DustCanvas({
  className,
  density = 34,
}: {
  className?: string
  density?: number
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

    const motes: Mote[] = Array.from({ length: density }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: -(0.00004 + Math.random() * 0.0001),
      phase: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const m of motes) {
        const flicker = 0.35 + 0.3 * Math.sin(t * 1.4 + m.phase)
        ctx.fillStyle = `rgba(216, 201, 168, ${flicker})`
        ctx.beginPath()
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      t += 0.016
      for (const m of motes) {
        m.x += m.vx
        m.y += m.vy
        if (m.y < -0.02) m.y = 1.02
        if (m.x < -0.02) m.x = 1.02
        if (m.x > 1.02) m.x = -0.02
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    if (reduced) draw()
    else if (inView) step()

    const onResize = () => {
      resize()
      if (reduced) draw()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [inView, reduced, density, wrapRef])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
