export function filterCountriesByRegion(countries, region) {
  return region === 'All'
    ? countries
    : countries.filter(country => country.regionName === region)
}

export function filterCountries(countries, filters = {}) {
  const search = (filters.search ?? '').trim().toLowerCase()
  const region = filters.region ?? 'all'
  const incomeLevel = filters.incomeLevel ?? 'all'

  return countries.filter(country => {
    const matchesSearch = !search || country.name.toLowerCase().includes(search)
    const matchesRegion = region === 'all' || country.regionCode === region
    const matchesIncomeLevel = incomeLevel === 'all' || country.incomeLevelCode === incomeLevel

    return matchesSearch && matchesRegion && matchesIncomeLevel
  })
}
