interface GrapeMarkProps {
  className?: string
  /** stroke color of the stem */
  stroke?: string
  fill?: string
}

/** The estate mark: a small hanging cluster. Used in loader, nav, footer. */
export function GrapeMark({ className, stroke = '#c8a15a', fill = '#5a1e2e' }: GrapeMarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M24 14V6"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 8.5c-3.6-.7-5.8-2.9-6.4-5.5"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g fill={fill}>
        <circle cx="19" cy="20" r="5.6" />
        <circle cx="29" cy="20" r="5.6" />
        <circle cx="24" cy="28" r="5.6" />
        <circle cx="19" cy="35.5" r="5" />
        <circle cx="29" cy="35.5" r="5" />
        <circle cx="24" cy="42.5" r="4.4" />
      </g>
      <circle cx="17.4" cy="18.4" r="1.5" fill="#ffffff" opacity="0.25" />
    </svg>
  )
}

/** Wordmark: ORÉE set in the display serif with generous tracking. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} aria-label="ORÉE — home">
      ORÉE
    </span>
  )
}
