const finiteValues = (records, field) => records
  .map(record => record[field])
  .filter(value => Number.isFinite(value))

const sumMetric = (records, field) => {
  const values = finiteValues(records, field)

  return {
    value: values.length > 0 ? values.reduce((sum, value) => sum + value, 0) : null,
    count: values.length,
  }
}

const averageMetric = (records, field) => {
  const values = finiteValues(records, field)

  return {
    value: values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
    count: values.length,
  }
}

export function calculateDashboardMetrics(records = []) {
  return {
    totalCountries: records.length,
    totalGdp: sumMetric(records, 'gdp'),
    totalPopulation: sumMetric(records, 'population'),
    averageLifeExpectancy: averageMetric(records, 'lifeExpectancy'),
  }
}
