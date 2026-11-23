import { createSlice } from '@reduxjs/toolkit'
import {
  FILTER_DEFAULT_VALUES,
  normalizeIncomeLevel,
  normalizeLiveSearch,
  normalizeRegion,
} from '../utils/filterCountries.js'

const filtersSlice = createSlice({
  name: 'filters',
  initialState: FILTER_DEFAULT_VALUES,
  reducers: {
    setSearch(state, { payload }) {
      state.search = normalizeLiveSearch(payload)
    },
    setRegion(state, { payload }) {
      state.region = normalizeRegion(payload)
    },
    setIncomeLevel(state, { payload }) {
      state.incomeLevel = normalizeIncomeLevel(payload)
    },
    resetFilters() {
      return FILTER_DEFAULT_VALUES
    },
  },
  selectors: {
    selectFilters: filters => filters,
  },
})

export const { setSearch, setRegion, setIncomeLevel, resetFilters } = filtersSlice.actions
export const { selectFilters } = filtersSlice.selectors
export default filtersSlice.reducer
