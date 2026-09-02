import { useEffect, useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export interface PourTone {
  liquid: string
  liquidSurface: string
  foil: string
  glassBody: string
}

const DEFAULT_TONE: PourTone = {
  liquid: '#4a1030',
  liquidSurface: '#8a3a5a',
  foil: '#b08d3f',
  glassBody: '#42213a',
}

interface Drop {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  r: number
}

/**
 * THE POUR — scroll-driven liquid.
 * progressRef 0→1: bottle tilts in, wine streams from the neck, the
 * glass fills with a live wave surface, splash droplets rise. Drawn
 * every frame only while visible; static frame under reduced motion.
 */
export function PourCanvas({
  progressRef,
  tone = DEFAULT_TONE,
  className,
}: {
  progressRef: React.MutableRefObject<number>
  tone?: PourTone
  className?: string
}) {
  const { ref: wrapRef, inView } = useInView<HTMLDivElement>('15%')
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
    const drops: Drop[] = []
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

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
    const smooth = (a: number, b: number, v: number) => {
      const x = clamp01((v - a) / (b - a))
      return x * x * (3 - 2 * x)
    }

    // fixed geometry (normalized)
    const mouth = { x: 0.6, y: 0.27 }
    const glassCx = 0.46
    const rimY = 0.56
    const bowlBottomY = 0.8
    const rimHalfW = 0.115
    const bowlHalfWBottom = 0.052

    const surfaceY = () => {
      const p = progressRef.current
      const fill = smooth(0.2, 0.94, p)
      return rimY + (bowlBottomY - rimY) * (1 - fill)
    }

    const drawBottle = (tilt: number) => {
      const mx = mouth.x * w
      const my = mouth.y * h
      const angle = -0.92 * tilt
      ctx.save()
      ctx.translate(mx, my)
      ctx.rotate(angle)

      const bw = w * 0.145
      const nw = w * 0.036
      const neckLen = h * 0.1
      const bodyLen = h * 0.3

      const grad = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0)
      grad.addColorStop(0, '#000000')
      grad.addColorStop(0.25, tone.glassBody)
      grad.addColorStop(0.5, tone.glassBody)
      grad.addColorStop(0.8, '#1a0d16')
      grad.addColorStop(1, '#000000')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(-nw / 2, -neckLen)
      ctx.bezierCurveTo(-nw / 2, -neckLen * 1.5, -bw / 2, -neckLen * 1.9, -bw / 2, -neckLen * 2.2)
      ctx.lineTo(-bw / 2, -neckLen - bodyLen)
      ctx.quadraticCurveTo(-bw / 2, -neckLen - bodyLen - h * 0.02, -bw / 2 + h * 0.015, -neckLen - bodyLen - h * 0.02)
      ctx.lineTo(bw / 2 - h * 0.015, -neckLen - bodyLen - h * 0.02)
      ctx.quadraticCurveTo(bw / 2, -neckLen - bodyLen - h * 0.02, bw / 2, -neckLen - bodyLen)
      ctx.lineTo(bw / 2, -neckLen * 2.2)
      ctx.bezierCurveTo(bw / 2, -neckLen * 1.9, nw / 2, -neckLen * 1.5, nw / 2, -neckLen)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = tone.foil
      ctx.fillRect(-nw / 2 - w * 0.004, -neckLen - h * 0.012, nw + w * 0.008, h * 0.05)

      ctx.fillStyle = 'rgba(255,255,255,0.16)'
      ctx.fillRect(-bw / 2 + bw * 0.14, -neckLen * 2.1, w * 0.007, bodyLen * 0.82)
      ctx.restore()
    }

    const drawGlass = (fill: number, streaming: boolean) => {
      const cx = glassCx * w
      const rim = rimY * h
      const bottom = bowlBottomY * h
      const rTop = rimHalfW * w
      const rBot = bowlHalfWBottom * w

      const bowlPath = new Path2D()
      bowlPath.moveTo(cx - rTop, rim)
      bowlPath.bezierCurveTo(
        cx - rTop * 1.04, rim + (bottom - rim) * 0.55,
        cx - rBot * 1.5, bottom - (bottom - rim) * 0.12,
        cx - rBot, bottom,
      )
      bowlPath.lineTo(cx + rBot, bottom)
      bowlPath.bezierCurveTo(
        cx + rBot * 1.5, bottom - (bottom - rim) * 0.12,
        cx + rTop * 1.04, rim + (bottom - rim) * 0.55,
        cx + rTop, rim,
      )

      if (fill > 0) {
        const sy = rim + (bottom - rim) * (1 - fill)
        ctx.save()
        ctx.clip(bowlPath)
        ctx.fillStyle = tone.liquid
        ctx.fillRect(cx - rTop, sy, rTop * 2, bottom - sy + 4)
        ctx.strokeStyle = tone.liquidSurface
        ctx.lineWidth = 2.4
        ctx.beginPath()
        const amp = streaming ? 2.6 : 1.1
        for (let x = -rTop; x <= rTop; x += 4) {
          const yy = sy + Math.sin(x * 0.055 + t * 7) * amp + Math.sin(x * 0.11 - t * 4) * 0.8
          if (x === -rTop) ctx.moveTo(cx + x, yy)
          else ctx.lineTo(cx + x, yy)
        }
        ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.05)'
        ctx.fillRect(cx - rTop * 0.55, sy, rTop * 0.22, bottom - sy)
        ctx.restore()
      }

      ctx.strokeStyle = 'rgba(240,232,216,0.55)'
      ctx.lineWidth = 2
      ctx.stroke(bowlPath)
      ctx.strokeStyle = 'rgba(240,232,216,0.3)'
      ctx.beginPath()
      ctx.ellipse(cx, rim, rTop, rTop * 0.12, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(240,232,216,0.5)'
      ctx.beginPath()
      ctx.moveTo(cx, bottom)
      ctx.lineTo(cx, bottom + h * 0.085)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(cx, bottom + h * 0.095, w * 0.055, h * 0.008, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(cx - rTop * 0.8, rim + (bottom - rim) * 0.12)
      ctx.bezierCurveTo(
        cx - rTop * 0.9, rim + (bottom - rim) * 0.4,
        cx - rBot * 1.4, bottom - (bottom - rim) * 0.16,
        cx - rBot * 0.85, bottom - 2,
      )
      ctx.stroke()
    }

    const drawStream = (strength: number) => {
      if (strength <= 0.01) return
      const mx = mouth.x * w
      const my = mouth.y * h
      const sy = surfaceY() * h
      const tx = glassCx * w

      const steps = 22
      const midX = (mx + tx) / 2 + Math.sin(t * 2.2) * w * 0.004 * strength
      const midY = (my + sy) / 2

      const width = w * 0.0085 * strength
      const pts: { x: number; y: number; wd: number }[] = []
      for (let i = 0; i <= steps; i++) {
        const u = i / steps
        const x = (1 - u) * (1 - u) * mx + 2 * (1 - u) * u * midX + u * u * tx
        const y = (1 - u) * (1 - u) * my + 2 * (1 - u) * u * midY + u * u * sy
        const wd = width * (0.55 + 0.45 * Math.sin(u * Math.PI * 0.9))
        pts.push({ x, y, wd })
      }

      ctx.save()
      ctx.globalAlpha = 0.35
      ctx.strokeStyle = '#12040e'
      ctx.lineWidth = width * 1.5
      ctx.beginPath()
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x + 3, p.y + 2) : ctx.lineTo(p.x + 3, p.y + 2)))
      ctx.stroke()

      ctx.globalAlpha = 0.96
      ctx.strokeStyle = tone.liquid
      ctx.lineWidth = width
      ctx.beginPath()
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
      ctx.stroke()

      ctx.globalAlpha = 0.5
      ctx.strokeStyle = tone.liquidSurface
      ctx.lineWidth = width * 0.3
      ctx.beginPath()
      pts.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x - width * 0.2, p.y) : ctx.lineTo(p.x - width * 0.2, p.y),
      )
      ctx.stroke()
      ctx.restore()

      if (drops.length < 42) {
        for (let i = 0; i < 2; i++) {
          drops.push({
            x: tx + (Math.random() - 0.5) * width * 2.2,
            y: sy,
            vx: (Math.random() - 0.5) * w * 0.012,
            vy: -Math.random() * h * 0.055 - h * 0.01,
            life: 1,
            r: 1 + Math.random() * 2.2,
          })
        }
      }
    }

    const draw = () => {
      const p = clamp01(progressRef.current)
      const tilt = smooth(0, 0.16, p)
      const stream = smooth(0.14, 0.2, p) * (1 - smooth(0.96, 1, p))
      const fill = smooth(0.2, 0.94, p)

      ctx.clearRect(0, 0, w, h)

      const bg = ctx.createRadialGradient(w * 0.5, h * 0.42, w * 0.1, w * 0.5, h * 0.5, w * 0.75)
      bg.addColorStop(0, 'rgba(58, 26, 22, 0.55)')
      bg.addColorStop(1, 'rgba(12, 7, 8, 0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      drawGlass(fill, stream > 0.1)
      drawStream(stream)
      drawBottle(tilt)

      ctx.fillStyle = tone.liquidSurface
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]
        d.vy += h * 0.0009
        d.x += d.vx
        d.y += d.vy
        d.life -= 0.022
        if (d.life <= 0) {
          drops.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.max(0, d.life) * 0.8
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = () => {
      t += 0.016
      draw()
      raf = requestAnimationFrame(loop)
    }

    if (reduced) {
      progressRef.current = 0.72
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
  }, [inView, reduced, progressRef, tone, wrapRef])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
