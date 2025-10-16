import { useDispatch, useSelector } from 'react-redux'
import { LinkTo } from '../router/Router'
import { logout } from '../features/authSlice'

export default function NavBar(){
  const { user } = useSelector(s=>s.auth)
  const dispatch = useDispatch()

  return (
    <nav className="navbar navbar-expand bg-light border-bottom">
      <div className="container">
        <LinkTo to="#/" className="navbar-brand fw-bold">📚 BookTracker</LinkTo>
        <div className="d-flex gap-2 align-items-center">
          <LinkTo to="#/" className="btn btn-link">🏠 Home</LinkTo>
          {user && (
            <>
              <LinkTo to="#/my-shelf" className="btn btn-link">📚 My Shelf</LinkTo>
              <LinkTo to="#/favorites" className="btn btn-link">⭐ Favorites</LinkTo>
              <LinkTo to="#/entries" className="btn btn-link">📝 Notes</LinkTo>
            </>
          )}
          {user ? (
            <>
              <span className="navbar-text small ms-2">Hi, {user.email}</span>
              <button className="btn btn-sm btn-outline-dark" onClick={()=>dispatch(logout())}>Logout</button>
            </>
          ) : (
            <LinkTo to="#/auth" className="btn btn-sm btn-primary">Login</LinkTo>
          )}
        </div>
      </div>
    </nav>
  )
}
