import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { toggleFavorite } from '../features/favoritesSlice'
import { addToShelf } from '../features/userBooksSlice'
import { getSynopsis } from '../features/openaiSlice'
import { isAuthenticated } from '../helpers/auth'

export default function BookCard({ book, onOpenDetail }){
  const dispatch = useDispatch()
  const favIds = useSelector(s=>s.favorites.ids)
  const openaiStatus = useSelector(s=>s.openai.status)
  const bookId = book.id  // Use database ID for favorites
  const isFav = favIds.includes(bookId)

  const handleToggleFavorite = async () => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to add favorites',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.hash = '#/auth'
        }
      })
      return
    }
    try {
      await dispatch(toggleFavorite(bookId)).unwrap()
    } catch (error) {
      console.error('Toggle favorite error:', error)
      
      // Check if error is 401 Unauthorized
      if (error.message && error.message.includes('401')) {
        localStorage.removeItem('bt_auth')
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Your session has expired. Please login again.',
          confirmButtonText: 'Go to Login'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.hash = '#/auth'
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to update favorite',
          text: error.message || 'Please try again',
        })
      }
    }
  }

  const onSynopsis = async () => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to use AI Synopsis',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.hash = '#/auth'
        }
      })
      return
    }
    // Generate synopsis dengan Gemini AI
    await dispatch(getSynopsis({ title: book.title, authors: book.authors }))
    // Buka modal detail setelah synopsis selesai
    onOpenDetail(book)
  }

  const handleOpenDetail = () => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to view book details',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.hash = '#/auth'
        }
      })
      return
    }
    onOpenDetail(book)
  }

  const handleAddToShelf = async () => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to add books to your shelf',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.hash = '#/auth'
        }
      })
      return
    }

    const { value: status } = await Swal.fire({
      title: 'Add to My Shelf',
      input: 'select',
      inputOptions: {
        'to-read': 'To Read',
        'reading': 'Currently Reading',
        'completed': 'Completed'
      },
      inputPlaceholder: 'Select status',
      showCancelButton: true,
      confirmButtonText: 'Add',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to select a status!'
        }
      }
    })

    if (status) {
      try {
        await dispatch(addToShelf({ 
          BookId: bookId, 
          status 
        })).unwrap()
        
        Swal.fire({
          icon: 'success',
          title: 'Added to Shelf!',
          text: `Book added to "${status}" category`,
          timer: 1500,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add',
          text: error || 'Book might already be in your shelf'
        })
      }
    }
  }

  // Placeholder untuk buku tanpa cover
  const placeholderStyle = {
    height: '300px',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c757d',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px'
  }

  return (
    <div className="card h-100 shadow-sm">
      {book.coverUrl ? (
        <img src={book.coverUrl} className="card-img-top" alt={book.title} style={{height: '300px', objectFit: 'cover'}} />
      ) : (
        <div style={placeholderStyle}>
          <div>
            <i className="bi bi-book" style={{fontSize: '48px', display: 'block', marginBottom: '10px'}}></i>
            <div>No Cover Available</div>
          </div>
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{book.title}</h6>
        <div className="text-muted small mb-2">{(book.authors||[]).join(', ')} {book.publishedYear?`• ${book.publishedYear}`:''}</div>
        <div className="mt-auto">
          <div className="d-flex justify-content-between mb-2">
            <button className={`btn btn-sm ${isFav?'btn-warning':'btn-outline-warning'}`} onClick={handleToggleFavorite}>★</button>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={onSynopsis}
              disabled={openaiStatus === 'loading'}
            >
              {openaiStatus === 'loading' ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Loading...
                </>
              ) : (
                'AI Synopsis'
              )}
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleOpenDetail}>Detail</button>
          </div>
          <button className="btn btn-sm btn-success w-100" onClick={handleAddToShelf}>
            ➕ Add to My Shelf
          </button>
        </div>
      </div>
    </div>
  )
}
