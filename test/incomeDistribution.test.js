import assert from 'node:assert/strict'
import test from 'node:test'
import { prepareIncomeDistribution } from '../src/utils/prepareIncomeDistribution.js'

test('groups countries by World Bank income level and counts each group', () => {
  const countries = [
    { countryId: 'UGA', incomeLevelCode: 'LIC' },
    { countryId: 'DEU', incomeLevelCode: 'HIC' },
    { countryId: 'CAN', incomeLevelCode: 'HIC' },
    { countryId: 'BRA', incomeLevelCode: 'UMC' },
    { countryId: 'IND', incomeLevelCode: 'LMC' },
  ]

  assert.deepEqual(prepareIncomeDistribution(countries), [
    { category: 'High income', count: 2 },
    { category: 'Upper middle income', count: 1 },
    { category: 'Lower middle income', count: 1 },
    { category: 'Low income', count: 1 },
  ])
})

test('returns no chart data for an empty dataset', () => {
  assert.deepEqual(prepareIncomeDistribution([]), [])
})

test('skips missing income levels and preserves labels supplied by the API', () => {
  const countries = [
    { countryId: 'AAA' },
    { countryId: 'BBB', incomeLevelCode: 'XYZ', incomeLevelName: null },
    { countryId: 'CCC', incomeLevelCode: 'NA', incomeLevelName: 'Not classified' },
    { countryId: 'DDD', incomeLevelName: 'High income' },
    { countryId: 'EEE', incomeLevelName: ' ' },
  ]

  assert.deepEqual(prepareIncomeDistribution(countries), [
    { category: 'High income', count: 1 },
    { category: 'Not classified', count: 1 },
  ])
  assert.deepEqual(prepareIncomeDistribution(countries.slice(0, 2)), [])
})

test('counts each stable country code once across duplicate records', () => {
  const countries = [
    { id: 'UKR', countryId: 'UKR', incomeLevelCode: 'UMC' },
    { id: 'duplicate-row', countryId: 'UKR', incomeLevelCode: 'HIC' },
    { id: 'UA', countryId: null, iso2Code: 'UA', incomeLevelCode: 'UMC' },
    { id: 'another-row', countryId: null, iso2Code: 'UA', incomeLevelCode: 'UMC' },
  ]

  assert.deepEqual(prepareIncomeDistribution(countries.slice(0, 2)), [
    { category: 'Upper middle income', count: 1 },
  ])
  assert.deepEqual(prepareIncomeDistribution(countries.slice(2)), [
    { category: 'Upper middle income', count: 1 },
  ])
})

test('counts an ISO3 record and its ISO2-only duplicate once in either order', () => {
  const canada = Object.freeze({ id: 'CAN', countryId: 'CAN', iso2Code: 'CA', incomeLevelCode: 'HIC' })
  const alias = Object.freeze({ id: 'CA', countryId: null, iso2Code: 'CA', incomeLevelCode: 'HIC' })
  const expected = [{ category: 'High income', count: 1 }]

  assert.deepEqual(prepareIncomeDistribution(Object.freeze([canada, alias])), expected)
  assert.deepEqual(prepareIncomeDistribution(Object.freeze([alias, canada])), expected)
})

test('prefers the ISO3 record when duplicate ISO2 records disagree on income', () => {
  const canada = { id: 'CAN', iso2Code: 'CA', incomeLevelCode: 'HIC' }
  const alias = { iso2Code: ' ca ', incomeLevelCode: 'UMC' }
  const expected = [{ category: 'High income', count: 1 }]

  assert.deepEqual(prepareIncomeDistribution([canada, alias]), expected)
  assert.deepEqual(prepareIncomeDistribution([alias, canada]), expected)
})

test('matches an ISO2 alias even when its ISO3 record lacks an income category', () => {
  const rows = [
    { countryId: 'CAN', iso2Code: 'CA' },
    { iso2Code: 'CA', incomeLevelCode: 'HIC' },
    { countryId: 'CAN', incomeLevelCode: 'HIC' },
  ]

  assert.deepEqual(prepareIncomeDistribution(rows), [{ category: 'High income', count: 1 }])
})

test('does not merge countries by similar names or invalid identifiers', () => {
  const rows = [
    { id: 'CONGO', countryId: null, name: 'Congo', incomeLevelCode: 'LMC' },
    { id: 'CONGO', countryId: null, name: 'Congo', incomeLevelCode: 'LMC' },
    { countryId: '??', iso2Code: '000', incomeLevelCode: 'LMC' },
    { countryId: '??', iso2Code: '000', incomeLevelCode: 'LMC' },
    { countryId: 'COD', iso2Code: 'CD', name: 'Congo', incomeLevelCode: 'LIC' },
    { countryId: 'COG', iso2Code: 'CG', name: 'Congo', incomeLevelCode: 'LMC' },
  ]

  assert.deepEqual(prepareIncomeDistribution(rows), [
    { category: 'Lower middle income', count: 5 },
    { category: 'Low income', count: 1 },
  ])
})

test('keeps distinct ISO3 records when an ISO2 alias is ambiguous', () => {
  const rows = [
    { countryId: 'CAN', iso2Code: 'CA', incomeLevelCode: 'HIC' },
    { countryId: 'USA', iso2Code: 'CA', incomeLevelCode: 'HIC' },
    { iso2Code: 'CA', incomeLevelCode: 'UMC' },
  ]

  assert.deepEqual(prepareIncomeDistribution(rows), [
    { category: 'High income', count: 2 },
    { category: 'Upper middle income', count: 1 },
  ])
})

test('excludes aggregate rows with a reported income category', () => {
  const countries = [
    { countryId: 'WLD', regionCode: 'NA', incomeLevelCode: 'HIC' },
    { countryId: 'EAS', regionName: 'Aggregates', incomeLevelCode: 'UMC' },
    { countryId: 'MEX', regionCode: 'LCN', incomeLevelCode: 'UMC' },
  ]

  assert.deepEqual(prepareIncomeDistribution(countries), [
    { category: 'Upper middle income', count: 1 },
  ])
})

test('reads immutable country records without changing the input order or values', () => {
  const countries = Object.freeze([
    Object.freeze({ id: 'KEN', incomeLevelCode: 'LMC' }),
    Object.freeze({ id: 'JPN', incomeLevelCode: 'HIC' }),
  ])

  assert.deepEqual(prepareIncomeDistribution(countries), [
    { category: 'High income', count: 1 },
    { category: 'Lower middle income', count: 1 },
  ])
  assert.deepEqual(countries, [
    { id: 'KEN', incomeLevelCode: 'LMC' },
    { id: 'JPN', incomeLevelCode: 'HIC' },
  ])
})
