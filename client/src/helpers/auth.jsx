// Helper untuk check apakah user sudah login
export const isAuthenticated = () => {
  try {
    const authData = JSON.parse(localStorage.getItem('bt_auth'))
    return !!(authData && authData.token)
  } catch {
    return false
  }
}

// Helper untuk redirect ke login jika belum auth
export const requireAuth = (navigate, returnPath = null) => {
  if (!isAuthenticated()) {
    const path = returnPath || window.location.pathname
    navigate('/auth', { state: { from: path } })
    return false
  }
  return true
}
