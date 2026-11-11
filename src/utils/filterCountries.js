export const FILTER_DEFAULT_VALUES = Object.freeze({
  search: '',
  region: 'all',
  incomeLevel: 'all',
})

export const REGION_OPTIONS = Object.freeze([
  { value: 'EAS', label: 'East Asia & Pacific' },
  { value: 'ECS', label: 'Europe & Central Asia' },
  { value: 'LCN', label: 'Latin America & Caribbean' },
  { value: 'MEA', label: 'Middle East, North Africa, Afghanistan & Pakistan' },
  { value: 'NAC', label: 'North America' },
  { value: 'SAS', label: 'South Asia' },
  { value: 'SSF', label: 'Sub-Saharan Africa' },
])

export const INCOME_LEVEL_OPTIONS = Object.freeze([
  { value: 'HIC', label: 'High income' },
  { value: 'LIC', label: 'Low income' },
  { value: 'LMC', label: 'Lower middle income' },
  { value: 'UMC', label: 'Upper middle income' },
])

const regionCodes = new Set(REGION_OPTIONS.map(option => option.value))
const incomeLevelCodes = new Set(INCOME_LEVEL_OPTIONS.map(option => option.value))

export function normalizeRegion(value) {
  return regionCodes.has(value) ? value : 'all'
}

export function normalizeIncomeLevel(value) {
  return incomeLevelCodes.has(value) ? value : 'all'
}

function stripSearchControls(value) {
  return typeof value === 'string' ? value.replace(/\p{Cc}/gu, '') : ''
}

export function normalizeLiveSearch(value) {
  return stripSearchControls(value).slice(0, 100)
}

export function normalizeSearch(value) {
  return stripSearchControls(value).trim().slice(0, 100)
}

export function filterCountriesByRegion(countries, region) {
  return region === 'All'
    ? countries
    : countries.filter(country => country.regionName === region)
}

export function filterCountries(countries, filters = {}) {
  const search = normalizeSearch(filters.search).toLowerCase()
  const region = normalizeRegion(filters.region)
  const incomeLevel = normalizeIncomeLevel(filters.incomeLevel)

  return countries.filter(country => {
    const matchesSearch = !search || country.name.toLowerCase().includes(search)
    const matchesRegion = region === 'all' || country.regionCode === region
    const matchesIncomeLevel = incomeLevel === 'all' || country.incomeLevelCode === incomeLevel

    return matchesSearch && matchesRegion && matchesIncomeLevel
  })
}

export function resetFilters(reset) {
  reset(FILTER_DEFAULT_VALUES)
}
