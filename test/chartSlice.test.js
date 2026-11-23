import assert from 'node:assert/strict'
import test from 'node:test'
import chartReducer, { selectChartType, setChartType } from '../src/store/chartSlice.js'
import { addFavorite } from '../src/store/favoritesSlice.js'
import { resetFilters, setRegion, setSearch } from '../src/store/filtersSlice.js'
import { store } from '../src/store/store.js'
import { toggleTheme } from '../src/store/themeSlice.js'

test('the chart type defaults to bar in the dashboard store', () => {
  assert.equal(selectChartType(store.getState()), 'bar')
})

test('setChartType selects pie and switches back to bar', () => {
  const pie = chartReducer(undefined, setChartType('pie'))
  assert.equal(selectChartType({ chart: pie }), 'pie')

  const bar = chartReducer(pie, setChartType('bar'))
  assert.equal(selectChartType({ chart: bar }), 'bar')
})

test('setChartType ignores unsupported values and keeps the selected chart', () => {
  const pie = chartReducer(undefined, setChartType('pie'))

  for (const type of ['line', 'BAR', null, {}]) {
    assert.equal(selectChartType({ chart: chartReducer(pie, setChartType(type)) }), 'pie')
  }
})

test('filtering, reset, theme and favorites actions preserve the selected chart type', () => {
  store.dispatch(setChartType('pie'))
  for (const action of [setSearch('Ukraine'), setRegion('ECS'), resetFilters(), toggleTheme(), addFavorite('UKR')]) {
    store.dispatch(action)
    assert.equal(selectChartType(store.getState()), 'pie')
  }
})
