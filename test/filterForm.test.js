import assert from 'node:assert/strict'
import test from 'node:test'
import { createFormControl } from 'react-hook-form'
import {
  FILTER_DEFAULT_VALUES,
  filterCountries,
  resetFilters,
} from '../src/utils/filterCountries.js'

const countries = [
  { name: 'Ukraine', regionCode: 'ECS', incomeLevelCode: 'UMC' },
  { name: 'Andorra', regionCode: 'ECS', incomeLevelCode: 'HIC' },
  { name: 'Brazil', regionCode: 'LCN', incomeLevelCode: 'UMC' },
]

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

test('resetFilters restores every filter default without using a click event as values', () => {
  const form = createFormControl({ defaultValues: FILTER_DEFAULT_VALUES })

  form.register('search')
  form.register('region')
  form.register('incomeLevel')
  form.setValue('search', 'Ukraine')
  form.setValue('region', 'ECS')
  form.setValue('incomeLevel', 'UMC')

  resetFilters(form.reset)

  assert.deepEqual(form.getValues(), FILTER_DEFAULT_VALUES)
})
