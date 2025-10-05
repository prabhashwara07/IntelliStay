// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import searchReducer from './features/searchSlice'
import { api } from './api'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    search: searchReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})