import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loadJSON, saveJSON } from '../helpers/storage'
import { API } from '../helpers/api'

const initial = loadJSON('bt_auth', { user:null, token:null })

export const register = createAsyncThunk(
  'auth/register',
  async (payload) => {
    const { data } = await API.post('/auth/register', payload)
    return data
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (payload) => {
    const { data } = await API.post('/auth/login', payload)
    const tokenParts = data.access_token.split('.')[1]
    const tokenData = JSON.parse(atob(tokenParts.replace(/-/g,'+').replace(/_/g,'/')))
    return { 
      token: data.access_token, 
      user: { id: tokenData.id, email: tokenData.email }
    }
  }
)

export const loginGoogle = createAsyncThunk(
  'auth/loginGoogle',
  async (credential, { rejectWithValue }) => {
    try {
      console.log('[AUTH SLICE] Sending Google credential:', credential?.substring(0, 50) + '...')
      const { data } = await API.post('/auth/google-login', { credential })
      console.log('[AUTH SLICE] Google login success:', data)
      return { 
        token: data.access_token, 
        user: data.user
      }
    } catch (error) {
      console.error('[AUTH SLICE] Google login error:', error.response?.data || error.message)
      console.error('[AUTH SLICE] Full error:', error)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const authSlice = createSlice({
  name:'auth',
  initialState: { ...initial, status: 'idle', error: null },
  reducers:{
    logout(state){
      state.user = null; state.token = null
      saveJSON('bt_auth', state)
      localStorage.removeItem('bt_favs')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    
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
    
    builder
      .addCase(loginGoogle.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginGoogle.fulfilled, (state, {payload}) => {
        state.status = 'succeeded'
        state.user = payload.user
        state.token = payload.token
        saveJSON('bt_auth', state)
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
