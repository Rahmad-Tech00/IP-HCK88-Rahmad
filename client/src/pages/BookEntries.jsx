import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEntries, createEntry, updateEntry, deleteEntry } from '../features/entriesSlice'
import { fetchUserBooks } from '../features/userBooksSlice'
import Swal from 'sweetalert2'

export default function BookEntries() {
  const dispatch = useDispatch()
  const { items: entries, status } = useSelector(state => state.entries)
  const { items: userBooks } = useSelector(state => state.userBooks)
  
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [formData, setFormData] = useState({
    UserBookId: '',
    type: 'note',
    content: '',
    page: '',
    rating: ''
  })

  useEffect(() => {
    dispatch(fetchEntries())
    dispatch(fetchUserBooks())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingEntry) {
        await dispatch(updateEntry({ 
          id: editingEntry.id, 
          updates: formData 
        })).unwrap()
        Swal.fire({
          icon: 'success',
          title: 'Entry Updated!',
          timer: 1500,
          showConfirmButton: false
        })
      } else {
        await dispatch(createEntry(formData)).unwrap()
        Swal.fire({
          icon: 'success',
          title: 'Entry Created!',
          timer: 1500,
          showConfirmButton: false
        })
      }
      
      // Reset form
      setFormData({
        UserBookId: '',
        type: 'note',
        content: '',
        page: '',
        rating: ''
      })
      setEditingEntry(null)
      setShowForm(false)
      
    } catch (error) {
      console.error('Entry error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        html: error || 'Something went wrong. Make sure the book is in your shelf!',
        footer: '<a href="#/my-shelf">Go to My Shelf</a>'
      })
    }
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry)
    setFormData({
      UserBookId: entry.UserBookId,
      type: entry.type,
      content: entry.content,
      page: entry.page || '',
      rating: entry.rating || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (entryId) => {
    const result = await Swal.fire({
      title: 'Delete this entry?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await dispatch(deleteEntry(entryId)).unwrap()
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Entry has been deleted',
          timer: 1500,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete',
          text: error || 'Something went wrong'
        })
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEntry(null)
    setFormData({
      UserBookId: '',
      type: 'note',
      content: '',
      page: '',
      rating: ''
    })
  }

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📝 My Notes & Highlights</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            if (userBooks.length === 0) {
              Swal.fire({
                icon: 'info',
                title: 'No Books in Shelf',
                html: 'You need to add books to your shelf first!<br><br>Go to <b>Home</b> → click <b>"➕ Add to My Shelf"</b> on any book.',
                confirmButtonText: 'Go to Home',
                showCancelButton: true
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.hash = '#/'
                }
              })
            } else {
              setShowForm(!showForm)
            }
          }}
        >
          {showForm ? '❌ Cancel' : '➕ New Entry'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card mb-4 shadow">
          <div className="card-body">
            <h5 className="card-title">
              {editingEntry ? '✏️ Edit Entry' : '➕ Create New Entry'}
            </h5>
            <form onSubmit={handleSubmit}>
              {/* Book Selection */}
              <div className="mb-3">
                <label className="form-label">Select Book *</label>
                <select 
                  className="form-select"
                  value={formData.UserBookId}
                  onChange={(e) => setFormData({...formData, UserBookId: e.target.value})}
                  required
                >
                  <option value="">Choose a book...</option>
                  {userBooks.map(ub => (
                    <option key={ub.id} value={ub.id}>
                      {ub.Book?.title || 'Unknown Title'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entry Type */}
              <div className="mb-3">
                <label className="form-label">Type *</label>
                <select 
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="note">📝 Note</option>
                  <option value="highlight">✨ Highlight</option>
                  <option value="summary">📄 Summary</option>
                </select>
              </div>

              {/* Content */}
              <div className="mb-3">
                <label className="form-label">Content *</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your thoughts..."
                  required
                />
              </div>

              {/* Page Number */}
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Page Number</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={formData.page}
                    onChange={(e) => setFormData({...formData, page: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingEntry ? '💾 Update' : '➕ Create'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="alert alert-info">
          <h5>No entries yet</h5>
          <p>Start adding notes, highlights, or summaries from your books!</p>
        </div>
      ) : (
        <div className="row g-3">
          {entries.map(entry => {
            const typeIcons = {
              note: '📝',
              highlight: '✨',
              summary: '📄'
            }
            
            return (
              <div key={entry.id} className="col-12 col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-primary me-2">
                          {typeIcons[entry.type]} {entry.type}
                        </span>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(entry)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(entry.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <h6 className="card-subtitle mb-2 text-muted">
                      {entry.UserBook?.Book?.title || 'Unknown Book'}
                    </h6>
                    
                    <p className="card-text">{entry.content}</p>
                    
                    {entry.page && (
                      <small className="text-muted">📖 Page {entry.page}</small>
                    )}
                  </div>
                  <div className="card-footer text-muted small">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
