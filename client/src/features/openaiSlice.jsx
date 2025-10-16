import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchSynopsis } from '../helpers/openai'

export const getSynopsis = createAsyncThunk(
  'openai/synopsis',
  async ({ title, authors }) => {
    const content = await fetchSynopsis({ title, authors })
    return { key: `${title}|${(authors||[]).join(',')}`, content }
  }
)

const slice = createSlice({
  name:'openai',
  initialState:{ byKey:{}, status:'idle', error:null },
  reducers:{},
  extraReducers: b => {
    b.addCase(getSynopsis.pending, s=>{ s.status='loading' })
     .addCase(getSynopsis.fulfilled, (s,{payload})=>{
       s.status='succeeded'; s.byKey[payload.key] = payload.content
     })
     .addCase(getSynopsis.rejected, (s,a)=>{ s.status='failed'; s.error=a.error.message })
  }
})
export default slice.reducer
