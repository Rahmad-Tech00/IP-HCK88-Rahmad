import { useEffect, useState } from 'react'

export function LinkTo({ to, children, className }) {
  return <a href={to} className={className} onClick={()=>{ }}>{children}</a>
}

export function Route({ path, element }) {
  return { path, element }
}

export default function Router({ children }) {
  const routes = children.filter(Boolean).map(r => r.props)
  const [hash, setHash] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.location.hash = '#/'
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const match = routes.find(r => r.path === hash) || routes.find(r => r.path === '#/')
  return match?.element ?? null
}