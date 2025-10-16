import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API } from '../helpers/api'
import { mapServerBooks } from '../helpers/mapOpenLibrary'

export const searchBooks = createAsyncThunk(
  'books/search',
  async ({ q }) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    const { data } = await API.get(`/books?${params.toString()}`)
    // Response dari server: { data: [...books] }
    const books = mapServerBooks(data.data || [])
    return { docs: books, total: books.length, page: 1 }
  }
)

const slice = createSlice({
  name:'books',
  initialState:{ items:[], total:0, page:1, status:'idle', error:null, q:'' },
  reducers:{
    setQuery(state, {payload}){ state.q = payload.q ?? state.q; },
    reset(state){ state.items=[]; state.total=0; state.page=1; state.status='idle'; state.error=null; }
  },
  extraReducers: b => {
    b.addCase(searchBooks.pending, (s)=>{ s.status = 'loading' })
     .addCase(searchBooks.fulfilled, (s, {payload})=>{
        s.status='succeeded'
        s.total = payload.total
        s.page = payload.page + 1
        s.items = payload.page===1 ? payload.docs : [...s.items, ...payload.docs]
     })
     .addCase(searchBooks.rejected, (s, a)=>{ s.status='failed'; s.error = a.error.message })
  }
})
export const { setQuery, reset } = slice.actions
export default slice.reducer