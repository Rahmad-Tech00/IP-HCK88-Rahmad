import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API } from '../helpers/api'

// Async thunks
export const fetchUserBooks = createAsyncThunk(
  'userBooks/fetchUserBooks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/user-books')
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch books')
    }
  }
)

export const addToShelf = createAsyncThunk(
  'userBooks/addToShelf',
  async (bookData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/user-books', bookData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add book')
    }
  }
)

export const updateUserBook = createAsyncThunk(
  'userBooks/updateUserBook',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/user-books/${id}`, updates)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update book')
    }
  }
)

export const removeFromShelf = createAsyncThunk(
  'userBooks/removeFromShelf',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/user-books/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove book')
    }
  }
)

const userBooksSlice = createSlice({
  name: 'userBooks',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null
  },
  reducers: {
    clearUserBooks: (state) => {
      state.items = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Books
      .addCase(fetchUserBooks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserBooks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchUserBooks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      
      // Add to Shelf
      .addCase(addToShelf.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      
      // Update User Book
      .addCase(updateUserBook.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      
      // Remove from Shelf
      .addCase(removeFromShelf.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  }
})

export const { clearUserBooks } = userBooksSlice.actions
export default userBooksSlice.reducer
