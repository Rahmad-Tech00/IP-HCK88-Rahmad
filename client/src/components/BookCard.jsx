import { useDispatch, useSelector } from 'react-redux'
import { toggleFav } from '../features/favoritesSlice'
import { getSynopsis } from '../features/openaiSlice'

export default function BookCard({ book, onOpenDetail }){
  const dispatch = useDispatch()
  const favIds = useSelector(s=>s.favorites.ids)
  const openaiStatus = useSelector(s=>s.openai.status)
  const bookId = book.id || book.openLibId
  const isFav = favIds.includes(bookId)

  const onSynopsis = async () => {
    // Generate synopsis dengan Gemini AI
    await dispatch(getSynopsis({ title: book.title, authors: book.authors }))
    // Buka modal detail setelah synopsis selesai
    onOpenDetail(book)
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
        <div className="mt-auto d-flex justify-content-between">
          <button className={`btn btn-sm ${isFav?'btn-warning':'btn-outline-warning'}`} onClick={()=>dispatch(toggleFav(bookId))}>★</button>
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
          <button className="btn btn-sm btn-primary" onClick={()=>onOpenDetail(book)}>Detail</button>
        </div>
      </div>
    </div>
  )
}
