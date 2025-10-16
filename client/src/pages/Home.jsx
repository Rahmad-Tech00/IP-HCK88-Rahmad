import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchBar from '../components/SearchBar'
import BookGrid from '../components/BookGrid'
import BookDetailModal from '../components/BookDetailModal'
import InfiniteScrollAnchor from '../components/InfiniteScrollAnchor'
import { reset, searchBooks, setQuery } from '../features/booksSlice'
import { fetchFavorites } from '../features/favoritesSlice'
import { isAuthenticated } from '../helpers/auth'

export default function Home(){
  const dispatch = useDispatch()
  const { items, total, page, status, q } = useSelector(s=>s.books)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(fetchFavorites())
    }
  }, [dispatch])

  const onSearch = useCallback(({q}) => {
    const currentQ = q || ''
    dispatch(reset())
    dispatch(setQuery({q: currentQ}))
  }, [dispatch])

  useEffect(()=>{
    dispatch(searchBooks({ q }))
  },[q, dispatch])

  const loadMore = useCallback(()=>{
    if (status==='loading') return
    dispatch(searchBooks({ q, page }))
  },[status, q, page, dispatch])

  return (
    <>
      <div className="mb-3">
        <h3 className="fw-bold">Book Library</h3>
        <p className="text-muted small mb-0">
          Search Books • Favorites • AI Synopsis (Gemini AI)
        </p>
      </div>

      <SearchBar onSearch={onSearch} />

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="small text-muted">
          {q ? <>Query: <code>{q}</code></> : 'All Books'}
        </div>
        <div className="small">Total: <strong>{total}</strong></div>
      </div>

      {items.length === 0 && status !== 'loading' ? (
        <div className="text-center text-muted py-5">
          {q ? `No books found for "${q}".` : 'No books available.'}
        </div>
      ) : (
        <BookGrid items={items} onOpenDetail={setDetail} />
      )}

      {status==='loading' && (
        <div className="text-center py-3">
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      )}

      {items.length > 0 && items.length < total && (
        <InfiniteScrollAnchor onIntersect={loadMore} />
      )}

      <BookDetailModal book={detail} onClose={()=>setDetail(null)} />
    </>
  )
}
