import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserBooks, updateUserBook, removeFromShelf } from '../features/userBooksSlice'
import Swal from 'sweetalert2'

export default function MyShelf() {
  const dispatch = useDispatch()
  const { items, status } = useSelector(state => state.userBooks)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchUserBooks())
  }, [dispatch])

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      await dispatch(updateUserBook({ id: bookId, updates: { status: newStatus } })).unwrap()
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Book status changed to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update',
        text: error || 'Something went wrong'
      })
    }
  }

  const handleRemove = async (bookId, bookTitle) => {
    const result = await Swal.fire({
      title: 'Remove from shelf?',
      text: `Are you sure you want to remove "${bookTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    })

    if (result.isConfirmed) {
      try {
        await dispatch(removeFromShelf(bookId)).unwrap()
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Book has been removed from your shelf',
          timer: 1500,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to remove',
          text: error || 'Something went wrong'
        })
      }
    }
  }

  const handleToggleFavorite = async (bookId, currentFavorite) => {
    try {
      await dispatch(updateUserBook({ 
        id: bookId, 
        updates: { isFavorite: !currentFavorite } 
      })).unwrap()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update favorite',
        text: error || 'Something went wrong'
      })
    }
  }

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.status === filter)

  if (status === 'loading') {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="mb-4">📚 My Shelf</h1>

      {/* Filter Buttons */}
      <div className="btn-group mb-4" role="group">
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('all')}
        >
          All ({items.length})
        </button>
        <button 
          className={`btn ${filter === 'to-read' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('to-read')}
        >
          To Read ({items.filter(i => i.status === 'to-read').length})
        </button>
        <button 
          className={`btn ${filter === 'reading' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('reading')}
        >
          Reading ({items.filter(i => i.status === 'reading').length})
        </button>
        <button 
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({items.filter(i => i.status === 'completed').length})
        </button>
      </div>

      {/* Books List */}
      {filteredItems.length === 0 ? (
        <div className="alert alert-info">
          <h5>No books in this category</h5>
          <p>Add books from the home page to see them here!</p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredItems.map(userBook => (
            <div key={userBook.id} className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    {/* Book Cover */}
                    <div className="col-md-2">
                      {userBook.Book?.coverUrl ? (
                        <img 
                          src={userBook.Book.coverUrl} 
                          alt={userBook.Book.title}
                          className="img-fluid rounded"
                        />
                      ) : (
                        <div className="bg-secondary text-white d-flex align-items-center justify-content-center rounded" style={{height: '150px'}}>
                          No Cover
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="col-md-6">
                      <h5 className="card-title">
                        {userBook.Book?.title || 'Unknown Title'}
                        {userBook.isFavorite && (
                          <span className="text-warning ms-2">⭐</span>
                        )}
                      </h5>
                      <p className="text-muted mb-2">
                        {userBook.Book?.author || 'Unknown Author'}
                      </p>
                      {userBook.shelfName && (
                        <span className="badge bg-secondary">{userBook.shelfName}</span>
                      )}
                      {userBook.currentPage && (
                        <small className="text-muted ms-2">
                          Page {userBook.currentPage}
                        </small>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-md-4 text-end">
                      {/* Status Selector */}
                      <select 
                        className="form-select form-select-sm mb-2"
                        value={userBook.status}
                        onChange={(e) => handleStatusChange(userBook.id, e.target.value)}
                      >
                        <option value="to-read">To Read</option>
                        <option value="reading">Reading</option>
                        <option value="completed">Completed</option>
                      </select>

                      {/* Action Buttons */}
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-warning"
                          onClick={() => handleToggleFavorite(userBook.id, userBook.isFavorite)}
                          title={userBook.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {userBook.isFavorite ? '⭐' : '☆'}
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleRemove(userBook.id, userBook.Book?.title)}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
