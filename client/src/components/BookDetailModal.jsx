import { useSelector } from 'react-redux'

export default function BookDetailModal({ book, onClose }){
  const key = book ? `${book.title}|${(book.authors||[]).join(',')}` : null
  const synopsis = useSelector(s=> key ? (s.openai.byKey?.[key] || '') : '')
  const status = useSelector(s=> s.openai?.status || 'idle')
  const error = useSelector(s=> s.openai?.error || null)

  // Placeholder untuk buku tanpa cover
  const placeholderStyle = {
    width: '100%',
    height: '400px',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c757d',
    borderRadius: '0.25rem'
  }

  if(!book) return null
  return (
    <div className="modal fade show" style={{display:'block', background:'rgba(0,0,0,.5)'}} onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{book.title}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-4">
                {book.coverUrl ? (
                  <img className="img-fluid rounded" src={book.coverUrl} alt={book.title} />
                ) : (
                  <div style={placeholderStyle}>
                    <div className="text-center">
                      <i className="bi bi-book" style={{fontSize: '64px', display: 'block', marginBottom: '10px'}}></i>
                      <div>No Cover Available</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-8">
                <div className="text-muted small mb-2">{(book.authors||[]).join(', ')} {book.publishedYear?`• ${book.publishedYear}`:''}</div>
                <h6>AI Synopsis (Gemini)</h6>
                {status === 'loading' && (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted small">Generating synopsis with Gemini AI...</p>
                  </div>
                )}
                {status === 'failed' && (
                  <div className="alert alert-danger" role="alert">
                    <small>Error: {error || 'Failed to generate synopsis'}</small>
                  </div>
                )}
                {status === 'succeeded' && synopsis && (
                  <p className="mb-0">{synopsis}</p>
                )}
                {!synopsis && status !== 'loading' && status !== 'failed' && (
                  <p className="mb-0"><em className="text-muted">Klik "AI Synopsis" pada kartu untuk menghasilkan ringkasan dengan Gemini AI.</em></p>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a className="btn btn-outline-secondary" href={`https://openlibrary.org/works/${book.openLibId}`} target="_blank">Open Library</a>
            <button className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
