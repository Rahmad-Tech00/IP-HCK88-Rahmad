import axios from 'axios'

// API Server Backend
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:4000/apis'
})

// Interceptor untuk menambahkan token ke setiap request
API.interceptors.request.use((config) => {
  try {
    const authData = JSON.parse(localStorage.getItem('bt_auth'))
    if (authData && authData.token) {
      config.headers.Authorization = `Bearer ${authData.token}`
    }
  } catch {
    // Ignore error
  }
  return config
})
