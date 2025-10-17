import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchSynopsis } from '../helpers/openai'

export const getSynopsis = createAsyncThunk(
  'openai/getSynopsis',
  async ({ title, authors }) => {
    const text = await fetchSynopsis({ title, authors })
    return { key: `${title}|${(authors||[]).join(',')}`, text }
  }
)

const openaiSlice = createSlice({
  name: 'openai',
  initialState: {
    byKey: {},
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSynopsis.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getSynopsis.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.byKey[action.payload.key] = action.payload.text
      })
      .addCase(getSynopsis.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default openaiSlice.reducer