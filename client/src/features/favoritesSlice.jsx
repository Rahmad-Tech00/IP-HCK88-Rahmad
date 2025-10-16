import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API } from '../helpers/api'
import { logout } from './authSlice'

// Fetch favorites from backend
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async () => {
    const { data } = await API.get('/favorites')
    return data.bookIds // Array of book IDs
  }
)

// Toggle favorite on backend
export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/favorites/${bookId}`)
      return data // { bookId, isFavorite }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Request failed with status code 401'
      return rejectWithValue(message)
    }
  }
)

const slice = createSlice({
  name:'favorites',
  initialState:{ 
    ids: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  
  reducers:{
    clearFavorites(state){
      state.ids = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch favorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.ids = action.payload
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    
    // Toggle favorite
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { bookId, isFavorite } = action.payload
        if (isFavorite) {
          // Add to favorites
          if (!state.ids.includes(bookId)) {
            state.ids.push(bookId)
          }
        } else {
          // Remove from favorites
          state.ids = state.ids.filter(id => id !== bookId)
        }
      })
    
    // Clear favorites when user logs out
    builder.addCase(logout, (state) => {
      state.ids = []
      state.status = 'idle'
      state.error = null
    })
  }
})

export const { clearFavorites } = slice.actions
export default slice.reducer
