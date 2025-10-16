import { combineReducers } from '@reduxjs/toolkit'
import auth from '../features/authSlice'
import books from '../features/booksSlice'
import favorites from '../features/favoritesSlice'
import openai from '../features/openaiSlice'

export default combineReducers({ auth, books, favorites, openai })
