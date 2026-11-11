import assert from 'node:assert/strict'
import test from 'node:test'
import { createFormControl } from 'react-hook-form'
import { FILTER_DEFAULT_VALUES, resetFilters } from '../src/utils/filterCountries.js'

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
