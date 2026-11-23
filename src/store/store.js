import { configureStore } from '@reduxjs/toolkit'
import chartReducer from './chartSlice.js'
import favoritesReducer from './favoritesSlice.js'
import filtersReducer from './filtersSlice.js'
import themeReducer from './themeSlice.js'

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    theme: themeReducer,
    favorites: favoritesReducer,
    chart: chartReducer,
  },
})
