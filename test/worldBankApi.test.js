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
  {
    id: 'AND',
    iso2Code: 'AD',
    name: 'Andorra',
    region: { id: 'ECS', value: 'Europe & Central Asia' },
    incomeLevel: { id: 'HIC', value: 'High income' },
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

test('fetchWorldBankData normalizes untrusted filters before matching', async () => {
  const fetchImpl = async url => response(url.includes('/country?') ? countries : [])

  const data = await fetchWorldBankData({
    fetchImpl,
    search: '  Ukr\naine  ',
    region: "ECS' OR 1=1 --",
    incomeLevel: '<script>alert(1)</script>',
  })

  assert.deepEqual(data.map(country => country.name), ['Ukraine'])
})

test('fetchWorldBankData loads the latest population observation for Andorra', async () => {
  const fetchImpl = async url => {
    if (url.includes('/country?')) {
      return response(countries)
    }

    if (url.includes('/SP.POP.TOTL') && url.includes('MRV=1')) {
      return response([
        {
          countryiso3code: 'AND',
          country: { id: 'AD', value: 'Andorra' },
          date: '2024',
          value: 85700,
        },
      ])
    }

    return response([])
  }

  const data = await fetchWorldBankData({
    fetchImpl,
    search: 'andorra',
  })

  assert.deepEqual(data, [{
    id: 'AND',
    iso2Code: 'AD',
    name: 'Andorra',
    regionCode: 'ECS',
    regionName: 'Europe & Central Asia',
    incomeLevelCode: 'HIC',
    incomeLevelName: 'High income',
    gdp: null,
    gdpYear: null,
    population: 85700,
    populationYear: 2024,
    lifeExpectancy: null,
    lifeExpectancyYear: null,
  }])
})
