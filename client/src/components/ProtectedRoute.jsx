import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const { user, token } = useSelector(s => s.auth)

  useEffect(() => {
    if (!user || !token) {
      window.location.hash = '#/auth'
    }
  }, [user, token])

  if (!user || !token) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Checking authentication...</p>
      </div>
    )
  }

  return children
}
