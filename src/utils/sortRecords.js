const NUMERIC_FIELDS = new Set(['gdp', 'population', 'lifeExpectancy'])

const isMissing = value => value === null || value === undefined || value === ''

export function sortRecords(records, field, direction = 'asc') {
  const directionMultiplier = direction === 'desc' ? -1 : 1

  return [...records].sort((left, right) => {
    const leftValue = left[field]
    const rightValue = right[field]

    if (isMissing(leftValue) && isMissing(rightValue)) {
      return 0
    }

    if (isMissing(leftValue)) {
      return 1
    }

    if (isMissing(rightValue)) {
      return -1
    }

    if (NUMERIC_FIELDS.has(field)) {
      return (leftValue - rightValue) * directionMultiplier
    }

    return String(leftValue).localeCompare(String(rightValue), undefined, { sensitivity: 'base' }) * directionMultiplier
  })
}
