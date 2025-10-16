import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const { user, token } = useSelector(s => s.auth)

  useEffect(() => {
    // Redirect ke auth jika belum login
    if (!user || !token) {
      window.location.hash = '#/auth'
    }
  }, [user, token])

  // Jika belum login, tampilkan loading atau null
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

  // Jika sudah login, render children
  return children
}
