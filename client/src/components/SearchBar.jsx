import { useEffect, useState, useRef } from 'react'
import { debounce } from '../helpers/debounce'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')
  const isFirstRender = useRef(true)

  // Auto-search dengan debounce, tapi skip saat pertama kali mount
  useEffect(() => {
    // Skip saat pertama kali render untuk menghindari conflict
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Debounce search agar tidak terlalu sering hit API
    const debouncedSearch = debounce(() => {
      onSearch({ q })  // Kirim q termasuk jika kosong ('')
    }, 500)

    debouncedSearch()
    
    // Cleanup function untuk cancel debounce jika component unmount
    return () => clearTimeout(debouncedSearch.timerId)
  }, [q, onSearch])

  const handleSearch = () => {
    onSearch({ q })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="row g-2">
          <div className="col-md-9">
            <label className="form-label">Search</label>
            <input 
              className="form-control" 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
              onKeyPress={handleKeyPress}
              placeholder="e.g. javascript, react, node" 
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}
