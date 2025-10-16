import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import AuthForm from '../components/AuthForm'

export default function Auth(){
  const { user } = useSelector(s=>s.auth)
  
  // Auto redirect ke home jika sudah login
  useEffect(() => {
    if (user) {
      window.location.hash = '#/'
    }
  }, [user])
  
  if (user) return (
    <div className="alert alert-success">
      Logged in as <strong>{user.email}</strong>. Redirecting...
    </div>
  )
  
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="mb-4 text-center">
          <h3>Welcome to Book Library</h3>
          <p className="text-muted">Please login or register to access all features</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
