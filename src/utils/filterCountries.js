export function filterCountriesByRegion(countries, region) {
  return region === 'All'
    ? countries
    : countries.filter(country => country.regionName === region)
}
