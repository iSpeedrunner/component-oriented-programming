import { createSlice } from '@reduxjs/toolkit'

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: [],
  reducers: {
    addFavorite(state, { payload: countryId }) {
      if (typeof countryId === 'string' && countryId.trim() && !state.includes(countryId)) {
        state.push(countryId)
      }
    },
    removeFavorite(state, { payload: countryId }) {
      return state.filter(id => id !== countryId)
    },
  },
  selectors: {
    selectFavoriteIds: favorites => favorites,
    selectIsFavorite: (favorites, countryId) => favorites.includes(countryId),
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions
export const { selectFavoriteIds, selectIsFavorite } = favoritesSlice.selectors
export default favoritesSlice.reducer
