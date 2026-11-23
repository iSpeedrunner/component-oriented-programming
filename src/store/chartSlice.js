import { createSlice } from '@reduxjs/toolkit'

const chartSlice = createSlice({
  name: 'chart',
  initialState: { type: 'bar' },
  reducers: {
    setChartType(state, { payload }) {
      if (payload === 'bar' || payload === 'pie') {
        state.type = payload
      }
    },
  },
  selectors: {
    selectChartType: chart => chart.type,
  },
})

export const { setChartType } = chartSlice.actions
export const { selectChartType } = chartSlice.selectors
export default chartSlice.reducer
