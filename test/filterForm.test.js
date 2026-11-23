import assert from 'node:assert/strict'
import test from 'node:test'
import {
  resetFilters,
  selectFilters,
  setIncomeLevel,
  setRegion,
  setSearch,
} from '../src/store/filtersSlice.js'
import { store } from '../src/store/store.js'
import {
  filterCountries,
  normalizeLiveSearch,
} from '../src/utils/filterCountries.js'

const countries = [
  { name: 'Ukraine', regionCode: 'ECS', incomeLevelCode: 'UMC' },
  { name: 'Andorra', regionCode: 'ECS', incomeLevelCode: 'HIC' },
  { name: 'Brazil', regionCode: 'LCN', incomeLevelCode: 'UMC' },
]

test('live search keeps typed spaces while removing controls and limiting length', () => {
  assert.equal(normalizeLiveSearch('New '), 'New ')
  assert.equal(normalizeLiveSearch('New Zealand'), 'New Zealand')
  assert.equal(normalizeLiveSearch('New\n Zealand\u0000'), 'New Zealand')
  assert.equal(normalizeLiveSearch('N'.repeat(101)), 'N'.repeat(100))
  assert.equal(normalizeLiveSearch({ toString: () => 'New Zealand' }), '')

  const newZealand = { name: 'New Zealand', regionCode: 'EAS', incomeLevelCode: 'HIC' }
  assert.deepEqual(filterCountries([newZealand], { search: ' New Zealand ' }), [newZealand])
})

test('valid region and income codes restrict direct filtering', () => {
  assert.deepEqual(filterCountries(countries, { region: 'ECS', incomeLevel: 'UMC' }), [countries[0]])
})

test('invalid and injection-like select values normalize to all', () => {
  assert.deepEqual(filterCountries(countries, {
    region: "ECS' OR 1=1 --",
    incomeLevel: '<script>alert(1)</script>',
  }), countries)
  assert.deepEqual(filterCountries(countries, { region: null, incomeLevel: { value: 'UMC' } }), countries)
})

test('search accepts only text and strips control characters before matching', () => {
  assert.deepEqual(filterCountries(countries, { search: '  Uk\r\na\tine\u0000  ' }), [])
  assert.deepEqual(filterCountries(countries, { search: '  Ukr\naine  ' }), [countries[0]])
  assert.deepEqual(filterCountries(countries, { search: 123 }), countries)
})

test('search is capped at 100 characters after trimming', () => {
  const longName = 'A'.repeat(100)
  assert.deepEqual(filterCountries([{ name: longName, regionCode: 'ECS', incomeLevelCode: 'UMC' }], {
    search: `  ${longName}suffix  `,
  }).map(country => country.name), [longName])
})

test('Redux filter actions normalize input and reset all active filters together', () => {
  store.dispatch(setSearch('New\n Zealand '))
  store.dispatch(setRegion('EAS'))
  store.dispatch(setIncomeLevel('HIC'))

  assert.deepEqual(selectFilters(store.getState()), {
    search: 'New Zealand ',
    region: 'EAS',
    incomeLevel: 'HIC',
  })

  store.dispatch(resetFilters())

  assert.deepEqual(selectFilters(store.getState()), {
    search: '',
    region: 'all',
    incomeLevel: 'all',
  })
})
