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

export async function fetchWorldBankData({ fetchImpl = globalThis.fetch, signal } = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('Fetch API is unavailable')
  }

  const commonQuery = 'format=json&per_page=400'
  const indicatorQuery = `${commonQuery}&mrnev=1`

  const [countries, gdp, population, lifeExpectancy] = await Promise.all([
    requestData(`${WORLD_BANK_API_URL}/country?${commonQuery}`, fetchImpl, signal),
    requestData(`${WORLD_BANK_API_URL}/country/all/indicator/${INDICATORS.gdp}?${indicatorQuery}`, fetchImpl, signal),
    requestData(`${WORLD_BANK_API_URL}/country/all/indicator/${INDICATORS.population}?${indicatorQuery}`, fetchImpl, signal),
    requestData(`${WORLD_BANK_API_URL}/country/all/indicator/${INDICATORS.lifeExpectancy}?${indicatorQuery}`, fetchImpl, signal),
  ])

  return normalizeWorldBankData(countries, { gdp, population, lifeExpectancy })
}
