import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: { current: 'light' },
  reducers: {
    toggleTheme(state) {
      state.current = state.current === 'light' ? 'dark' : 'light'
    },
  },
  selectors: {
    selectTheme: theme => theme.current,
  },
})

export const { toggleTheme } = themeSlice.actions
export const { selectTheme } = themeSlice.selectors
export default themeSlice.reducer
