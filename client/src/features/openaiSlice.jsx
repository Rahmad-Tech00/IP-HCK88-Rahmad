import axios from 'axios'

// API Server Backend
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:4000'
})

// Interceptor untuk menambahkan token ke setiap request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})