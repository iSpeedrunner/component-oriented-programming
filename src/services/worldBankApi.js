import { filterCountries } from '../utils/filterCountries.js'

const WORLD_BANK_API_URL = 'https://api.worldbank.org/v2'

const INDICATORS = {
  gdp: 'NY.GDP.MKTP.CD',
  population: 'SP.POP.TOTL',
  lifeExpectancy: 'SP.DYN.LE00.IN',
}

const getCountryKey = item => item?.countryiso3code || item?.country?.id || item?.id

const normalizeNumber = value => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const normalizeYear = value => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const year = Number(value)
  return Number.isInteger(year) ? year : null
}

const normalizeCoordinate = value => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const coordinate = Number(value)
  return Number.isFinite(coordinate) ? coordinate : null
}

const createIndicatorMap = (rows = []) => {
  const indicatorMap = new Map()

  for (const row of rows) {
    const key = getCountryKey(row)

    if (key) {
      const oldValue = indicatorMap.get(key)
      const value = normalizeNumber(row.value)

      if (!oldValue || oldValue.value === null || value !== null) {
        indicatorMap.set(key, { value, year: normalizeYear(row.date) })
      }
    }
  }

  return indicatorMap
}

const emptyIndicator = { value: null, year: null }

export class CountryNotFoundError extends Error {
  constructor(code) {
    super(`Country "${code}" was not found`)
    this.name = 'CountryNotFoundError'
  }
}

export function normalizeWorldBankData(countries, indicators) {
  const maps = {
    gdp: createIndicatorMap(indicators?.gdp),
    population: createIndicatorMap(indicators?.population),
    lifeExpectancy: createIndicatorMap(indicators?.lifeExpectancy),
  }

  return (countries ?? [])
    .filter(country => country?.region?.id !== 'NA' && country?.region?.value !== 'Aggregates')
    .map(country => {
      const countryKey = country.id ?? country.iso2Code ?? country.name
      const gdp = maps.gdp.get(countryKey) ?? emptyIndicator
      const population = maps.population.get(countryKey) ?? emptyIndicator
      const lifeExpectancy = maps.lifeExpectancy.get(countryKey) ?? emptyIndicator

      return {
        id: countryKey,
        iso2Code: country.iso2Code ?? null,
        name: country.name ?? 'Unknown country',
        regionCode: country.region?.id ?? null,
        regionName: country.region?.value ?? null,
        incomeLevelCode: country.incomeLevel?.id ?? null,
        incomeLevelName: country.incomeLevel?.value ?? null,
        gdp: gdp.value,
        gdpYear: gdp.year,
        population: population.value,
        populationYear: population.year,
        lifeExpectancy: lifeExpectancy.value,
        lifeExpectancyYear: lifeExpectancy.year,
      }
    })
}

export function normalizeCountryDetails(country) {
  if (!country || typeof country !== 'object') {
    return null
  }

  return {
    id: country.id ?? null,
    iso2Code: country.iso2Code ?? null,
    name: country.name ?? null,
    regionName: country.region?.value ?? null,
    adminRegionName: country.adminregion?.value ?? null,
    incomeLevelName: country.incomeLevel?.value ?? null,
    capitalCity: country.capitalCity ?? null,
    lendingTypeName: country.lendingType?.value ?? null,
    latitude: normalizeCoordinate(country.latitude),
    longitude: normalizeCoordinate(country.longitude),
  }
}

async function requestData(url, fetchImpl, signal) {
  const response = await fetchImpl(url, { signal })

  if (!response.ok) {
    throw new Error(`World Bank API request failed (${response.status})`)
  }

  const payload = await response.json()
  const data = Array.isArray(payload) ? payload[1] : null

  if (!Array.isArray(data)) {
    throw new Error('World Bank API returned an invalid response')
  }

  return data
}

const isInvalidCountryResponse = payload => {
  const messages = Array.isArray(payload) ? payload[0]?.message : null

  return Array.isArray(messages) && messages.some(message => (
    String(message?.id) === '120'
    && /invalid value/i.test(message?.key ?? '')
  ))
}

async function requestCountryDetailsData(url, fetchImpl, signal, code) {
  const response = await fetchImpl(url, { signal })

  if (response.status === 404) {
    throw new CountryNotFoundError(code)
  }

  if (!response.ok) {
    throw new Error(`World Bank API request failed (${response.status})`)
  }

  const payload = await response.json()

  if (isInvalidCountryResponse(payload)) {
    throw new CountryNotFoundError(code)
  }

  if (!Array.isArray(payload) || !Array.isArray(payload[1])) {
    throw new Error('World Bank API returned an invalid country response')
  }

  return payload[1]
}

export async function fetchCountryDetails({
  code,
  fetchImpl = globalThis.fetch,
  signal,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('Fetch API is unavailable')
  }

  if (typeof code !== 'string' || !code.trim()) {
    throw new Error('Country code is required')
  }

  const normalizedCode = code.trim()
  const data = await requestCountryDetailsData(
    `${WORLD_BANK_API_URL}/country/${encodeURIComponent(normalizedCode)}?format=json`,
    fetchImpl,
    signal,
    normalizedCode,
  )

  if (data.length === 0) {
    throw new CountryNotFoundError(normalizedCode)
  }

  const country = data[0]

  if (!country || typeof country !== 'object'
    || typeof country.id !== 'string' || typeof country.name !== 'string') {
    throw new Error('World Bank API returned an invalid country record')
  }

  return normalizeCountryDetails(country)
}

export async function fetchWorldBankData({
  fetchImpl = globalThis.fetch,
  signal,
  ...filters
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('Fetch API is unavailable')
  }

  const commonQuery = 'format=json&per_page=400'
  const indicatorQuery = `${commonQuery}&MRV=1`

  const [countriesResult, gdpResult, populationResult, lifeExpectancyResult] = await Promise.allSettled([
    requestData(`${WORLD_BANK_API_URL}/country?${commonQuery}`, fetchImpl, signal),
    requestData(`${WORLD_BANK_API_URL}/country/all/indicator/${INDICATORS.gdp}?${indicatorQuery}`, fetchImpl, signal),
    requestData(`${WORLD_BANK_API_URL}/country/all/indicator/${INDICATORS.population}?${indicatorQuery}`, fetchImpl, signal),
    requestData(`${WORLD_BANK_API_URL}/country/all/indicator/${INDICATORS.lifeExpectancy}?${indicatorQuery}`, fetchImpl, signal),
  ])

  if (countriesResult.status === 'rejected') {
    throw countriesResult.reason
  }

  const getSettledValue = result => result.status === 'fulfilled' ? result.value : []
  const countries = countriesResult.value
  const gdp = getSettledValue(gdpResult)
  const population = getSettledValue(populationResult)
  const lifeExpectancy = getSettledValue(lifeExpectancyResult)

  return filterCountries(
    normalizeWorldBankData(countries, { gdp, population, lifeExpectancy }),
    filters,
  )
}
