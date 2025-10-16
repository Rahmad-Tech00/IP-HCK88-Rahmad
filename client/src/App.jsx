import Router, { Route, LinkTo } from './router/Router.jsx'
import Home from './pages/Home.jsx'
import Favorites from './pages/Favorites.jsx'
import MyShelf from './pages/MyShelf.jsx'
import BookEntries from './pages/BookEntries.jsx'
import Auth from './pages/Auth.jsx'
import NavBar from './components/NavBar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App(){
  return (
    <>
      <NavBar />
      <div className="container py-3">
        <Router>
          <Route path="#" element={<Home />} />
          <Route path="#/" element={<Home />} />
          <Route path="#/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="#/my-shelf" element={<ProtectedRoute><MyShelf /></ProtectedRoute>} />
          <Route path="#/entries" element={<ProtectedRoute><BookEntries /></ProtectedRoute>} />
          <Route path="#/auth" element={<Auth />} />
        </Router>
      </div>
      <footer className="text-center text-muted small py-4">
        <div>Book Library with Gemini AI • <LinkTo to="#/auth">Login</LinkTo></div>
      </footer>
    </>
  )
}