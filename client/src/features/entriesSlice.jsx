import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API } from '../helpers/api'

// Async thunks
export const fetchEntries = createAsyncThunk(
  'entries/fetchEntries',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/entries')
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch entries')
    }
  }
)

export const createEntry = createAsyncThunk(
  'entries/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/entries', entryData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create entry')
    }
  }
)

export const updateEntry = createAsyncThunk(
  'entries/updateEntry',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/entries/${id}`, updates)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update entry')
    }
  }
)

export const deleteEntry = createAsyncThunk(
  'entries/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/entries/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete entry')
    }
  }
)

const entriesSlice = createSlice({
  name: 'entries',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null
  },
  reducers: {
    clearEntries: (state) => {
      state.items = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Entries
      .addCase(fetchEntries.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      
      // Create Entry
      .addCase(createEntry.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      
      // Update Entry
      .addCase(updateEntry.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      
      // Delete Entry
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  }
})

export const { clearEntries } = entriesSlice.actions
export default entriesSlice.reducer
