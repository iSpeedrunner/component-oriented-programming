import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchWorldBankData } from '../src/services/worldBankApi.js'

const response = data => ({
  ok: true,
  json: async () => [{}, data],
})

const countries = [
  {
    id: 'UKR',
    iso2Code: 'UA',
    name: 'Ukraine',
    region: { id: 'ECS', value: 'Europe & Central Asia' },
    incomeLevel: { id: 'UMC', value: 'Upper middle income' },
  },
  {
    id: 'BRA',
    iso2Code: 'BR',
    name: 'Brazil',
    region: { id: 'LCN', value: 'Latin America & Caribbean' },
    incomeLevel: { id: 'UMC', value: 'Upper middle income' },
  },
]

test('fetchWorldBankData returns only records matching all filter parameters', async () => {
  const fetchImpl = async url => response(url.includes('/country?') ? countries : [])

  const data = await fetchWorldBankData({
    fetchImpl,
    search: 'ukr',
    region: 'ECS',
    incomeLevel: 'UMC',
  })

  assert.deepEqual(data.map(country => country.name), ['Ukraine'])
})
