import axios from 'axios'

export const OL = axios.create({
  baseURL: import.meta.env.VITE_OL_BASE || 'https://openlibrary.org'
})

export const COVER = axios.create({
  baseURL: import.meta.env.VITE_COVER_BASE || 'https://covers.openlibrary.org'
})