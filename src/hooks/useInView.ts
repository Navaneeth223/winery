import { useEffect, useRef, useState } from 'react'

/**
 * IntersectionObserver visibility — used to gate expensive canvas
 * rendering so nothing animates off-screen.
 */
export function useInView<T extends HTMLElement>(rootMargin = '20%') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => setInView(entries[0].isIntersecting), {
      rootMargin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return { ref, inView }
}
