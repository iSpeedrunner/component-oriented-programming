const isNumber = value => Number.isFinite(value)

export function formatGdp(value) {
  if (!isNumber(value)) {
    return '—'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPopulation(value) {
  if (!isNumber(value)) {
    return '—'
  }

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatLifeExpectancy(value) {
  return isNumber(value) ? `${value.toFixed(1)} years` : '—'
}

export function formatMetricWithYear(formatter, value, year) {
  if (!isNumber(value)) {
    return '—'
  }

  return `${formatter(value)}${year ? ` (${year})` : ''}`
}
