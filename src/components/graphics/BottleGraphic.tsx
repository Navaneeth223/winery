import { useId } from 'react'
import type { WineTone } from '../../data/wines'

export const defaultTone: WineTone = {
  bg: '#1c1420',
  glass: '#42213a',
  glassDeep: '#241020',
  foil: '#b08d3f',
  label: '#f0e8d8',
  ink: '#241a10',
}

interface BottleProps {
  tone?: WineTone
  /** 0 = empty, 1 = full — animates the liquid level inside the glass */
  level?: number
  className?: string
  title?: string
}

/**
 * THE bottle of the estate. One silhouette, drawn once, used
 * everywhere: bottle reveal, pour scene, product cards, cart,
 * detail view. Glass tone + foil change per wine; the shape never does.
 */
export function BottleGraphic({ tone = defaultTone, level = 1, className, title }: BottleProps) {
  const uid = useId().replace(/[:]/g, '')
  const gBody = `b-body-${uid}`
  const gShade = `b-shade-${uid}`
  const gFoil = `b-foil-${uid}`
  const gLabel = `b-label-${uid}`
  const clip = `b-clip-${uid}`

  // liquid surface y: from 90 (neck, full) to 440 (base, empty)
  const surface = 440 - level * 350

  return (
    <svg
      viewBox="0 0 140 470"
      className={className}
      role="img"
      aria-label={title ?? 'A bottle of ORÉE wine'}
    >
      <defs>
        <linearGradient id={gBody} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={tone.glassDeep} />
          <stop offset="0.14" stopColor={tone.glass} />
          <stop offset="0.38" stopColor={tone.glass} stopOpacity="0.92" />
          <stop offset="0.55" stopColor={tone.glassDeep} />
          <stop offset="0.82" stopColor={tone.glassDeep} />
          <stop offset="1" stopColor="#000000" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id={gShade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.26" stopColor="#ffffff" stopOpacity="0.30" />
          <stop offset="0.34" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="0.62" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={gFoil} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="0.3" stopColor={tone.foil} />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="0.62" stopColor={tone.foil} />
          <stop offset="1" stopColor="#000000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={gLabel} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone.label} />
          <stop offset="1" stopColor={tone.label} stopOpacity="0.88" />
        </linearGradient>
        <clipPath id={clip}>
          <path d="M62 84 L62 108 C62 128 33 140 30 178 L30 420 C30 437 39 446 52 446 L88 446 C101 446 110 437 110 420 L110 178 C107 140 78 128 78 108 L78 84 Z" />
        </clipPath>
        <filter id={`soft-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* floor shadow */}
      <ellipse cx="70" cy="456" rx="52" ry="7" fill="#000" opacity="0.45" filter={`url(#soft-${uid})`} />

      {/* glass body */}
      <path
        d="M62 84 L62 108 C62 128 33 140 30 178 L30 420 C30 437 39 446 52 446 L88 446 C101 446 110 437 110 420 L110 178 C107 140 78 128 78 108 L78 84 Z"
        fill={`url(#${gBody})`}
      />

      {/* liquid inside the glass, clipped to the silhouette */}
      <g clipPath={`url(#${clip})`}>
        <rect
          x="0"
          y={surface}
          width="140"
          height={470 - surface}
          fill="#3a0f22"
          opacity="0.9"
        />
        {level < 1 && (
          <rect x="0" y={surface} width="140" height="3" fill="#8a3a5a" opacity="0.7" />
        )}
      </g>

      {/* shading + specular */}
      <path
        d="M62 84 L62 108 C62 128 33 140 30 178 L30 420 C30 437 39 446 52 446 L88 446 C101 446 110 437 110 420 L110 178 C107 140 78 128 78 108 L78 84 Z"
        fill={`url(#${gShade})`}
      />
      <rect x="37" y="150" width="6.5" height="282" rx="3.2" fill="#ffffff" opacity="0.22" />
      <rect x="37" y="112" width="4" height="30" rx="2" fill="#ffffff" opacity="0.18" />

      {/* capsule / foil */}
      <rect x="60.5" y="24" width="19" height="66" rx="3" fill={`url(#${gFoil})`} />
      <rect x="60.5" y="74" width="19" height="2.5" fill="#000000" opacity="0.35" />
      <ellipse cx="70" cy="24.5" rx="9.5" ry="2.6" fill={tone.foil} />
      <ellipse cx="70" cy="24" rx="4.5" ry="1.4" fill="#000000" opacity="0.4" />

      {/* label */}
      <g>
        <rect x="38" y="268" width="64" height="92" fill={`url(#${gLabel})`} />
        <rect x="38" y="268" width="64" height="92" fill="#000000" opacity="0.03" />
        <line x1="50" y1="282" x2="90" y2="282" stroke={tone.ink} strokeWidth="0.8" opacity="0.7" />
        <text
          x="70"
          y="300"
          textAnchor="middle"
          fill={tone.ink}
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="12.5"
          letterSpacing="3.5"
        >
          ORÉE
        </text>
        <circle cx="70" cy="313" r="1.6" fill={tone.foil} />
        <text
          x="70"
          y="330"
          textAnchor="middle"
          fill={tone.ink}
          fontFamily="Manrope, sans-serif"
          fontSize="6"
          letterSpacing="2"
          opacity="0.85"
        >
          ESTATE BOTTLED
        </text>
        <line x1="50" y1="342" x2="90" y2="342" stroke={tone.ink} strokeWidth="0.8" opacity="0.7" />
      </g>
    </svg>
  )
}
