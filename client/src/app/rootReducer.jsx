import { combineReducers } from '@reduxjs/toolkit'
import auth from '../features/authSlice'
import books from '../features/booksSlice'
import favorites from '../features/favoritesSlice'
import openai from '../features/openaiSlice'
import userBooks from '../features/userBooksSlice'
import entries from '../features/entriesSlice'

const rootReducer = combineReducers({ 
  auth, 
  books, 
  favorites, 
  openai, 
  userBooks, 
  entries 
})

export default rootReducer
