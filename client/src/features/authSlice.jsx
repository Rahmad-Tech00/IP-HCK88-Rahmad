import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loadJSON, saveJSON } from '../helpers/storage'
import { API } from '../helpers/api'

const initial = loadJSON('bt_auth', { user:null, token:null })

// Register thunk
export const register = createAsyncThunk(
  'auth/register',
  async (payload) => {
    const { data } = await API.post('/auth/register', payload)
    return data
  }
)

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (payload) => {
    const { data } = await API.post('/auth/login', payload)
    // Decode token untuk mendapatkan user info
    const tokenParts = data.access_token.split('.')[1]
    const tokenData = JSON.parse(atob(tokenParts.replace(/-/g,'+').replace(/_/g,'/')))
    return { 
      token: data.access_token, 
      user: { id: tokenData.id, email: tokenData.email }
    }
  }
)

const authSlice = createSlice({
  name:'auth',
  initialState: { ...initial, status: 'idle', error: null },
  reducers:{
    loginGoogle(state, {payload}) {
      // payload = google id_token (JWT)
      // Demo: decode yang sederhana (tanpa verify)
      const parts = payload.split('.')[1]
      const info = JSON.parse(atob(parts.replace(/-/g,'+').replace(/_/g,'/')))
      state.user = { name: info.name || info.email, email: info.email, picture: info.picture }
      state.token = payload
      saveJSON('bt_auth', state)
    },
    logout(state){
      state.user = null; state.token = null
      saveJSON('bt_auth', state)
    }
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded'
        // Setelah register sukses, bisa langsung login otomatis atau tidak
        // Di sini kita tidak auto-login, user harus login manual
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, {payload}) => {
        state.status = 'succeeded'
        state.user = payload.user
        state.token = payload.token
        saveJSON('bt_auth', state)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { loginGoogle, logout } = authSlice.actions
export default authSlice.reducer
