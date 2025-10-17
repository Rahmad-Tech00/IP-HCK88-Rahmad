import { useEffect, useRef } from 'react'

export default function InfiniteScrollAnchor({ onIntersect, disabled }) {
  const ref = useRef(null)
  useEffect(() => {
    if (disabled) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) onIntersect()
    }, { rootMargin: '200px' })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [onIntersect, disabled])
  return <div ref={ref} />
}
