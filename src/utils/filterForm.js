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

export function resetFilters(reset) {
  reset(FILTER_DEFAULT_VALUES)
}
