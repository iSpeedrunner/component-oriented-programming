import { INCOME_LEVEL_OPTIONS } from './filterCountries.js'

const labelsByCode = new Map(INCOME_LEVEL_OPTIONS.map(({ value, label }) => [value, label]))
const incomeOrder = ['HIC', 'UMC', 'LMC', 'LIC']

function normalizeCode(value, pattern) {
  if (typeof value !== 'string') {
    return null
  }

  const code = value.trim().toUpperCase()
  return pattern.test(code) ? code : null
}

export function prepareIncomeDistribution(countries) {
  const counts = new Map(incomeOrder.map(code => [labelsByCode.get(code), 0]))
  const iso3ByIso2 = new Map()
  const reported = []

  for (const country of countries) {
    if (!country || country.regionCode === 'NA' || country.regionName === 'Aggregates') {
      continue
    }

    // A null API ID means the table key may contain a country name.
    const apiId = country.countryId === undefined ? country.id : country.countryId
    const iso3 = normalizeCode(apiId, /^[A-Z]{3}$/)
    const iso2 = normalizeCode(country.iso2Code, /^[A-Z]{2}$/)

    if (iso3 && iso2) {
      const known = iso3ByIso2.get(iso2)
      iso3ByIso2.set(iso2, known === undefined || known === iso3 ? iso3 : null)
    }

    const reportedLabel = typeof country.incomeLevelName === 'string' ? country.incomeLevelName.trim() : ''
    const category = labelsByCode.get(country.incomeLevelCode) ?? reportedLabel
    if (category) {
      reported.push({ category, iso3, iso2 })
    }
  }

  const countriesByCode = new Map()
  for (const row of reported) {
    const { iso3, iso2 } = row
    // Keep each record with no valid code separate.
    const key = iso3 ?? iso3ByIso2.get(iso2) ?? iso2 ?? row
    const current = countriesByCode.get(key)
    if (!current || (iso3 && !current.iso3)) {
      countriesByCode.set(key, row)
    }
  }

  for (const { category } of countriesByCode.values()) {
    counts.set(category, (counts.get(category) ?? 0) + 1)
  }

  return Array.from(counts, ([category, count]) => ({ category, count }))
    .filter(({ count }) => count > 0)
}
