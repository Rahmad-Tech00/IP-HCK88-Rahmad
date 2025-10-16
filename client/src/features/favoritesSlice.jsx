import { createSlice } from '@reduxjs/toolkit'
import { loadJSON, saveJSON } from '../helpers/storage'

const initial = loadJSON('bt_favs', [])

const slice = createSlice({
  name:'favorites',
  initialState:{ ids: initial },
  
  reducers:{
    toggleFav(state, {payload}){
      const set = new Set(state.ids)
      if (set.has(payload)) set.delete(payload); else set.add(payload)
      state.ids = [...set]; saveJSON('bt_favs', state.ids)
    }
  }
})
export const { toggleFav } = slice.actions
export default slice.reducer
