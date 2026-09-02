import { useEffect, useRef } from 'react'
import { useUI } from '../store/store'

/** Single quiet confirmation pill. */
export function Toast() {
  const toast = useUI((s) => s.toast)
  const ref = useRef<HTMLDivElement>(null)
  const visible = !!toast

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => useUI.getState().clearToast(toast.id), 2600)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className="toast-region" aria-live="polite">
      <div className={['toast', visible ? 'is-visible' : ''].join(' ')} ref={ref}>
        {toast?.msg}
      </div>
    </div>
  )
}
