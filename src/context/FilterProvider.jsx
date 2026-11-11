import { useCallback, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FilterContext } from './FilterContext.js'
import { FILTER_DEFAULT_VALUES, resetFilters as resetFilterValues } from '../utils/filterCountries.js'

export function FilterProvider({ children }) {
  const { control, reset } = useForm({
    defaultValues: FILTER_DEFAULT_VALUES,
  })
  const search = useWatch({ control, name: 'search' })
  const region = useWatch({ control, name: 'region' })
  const incomeLevel = useWatch({ control, name: 'incomeLevel' })
  const filters = useMemo(() => ({
    search,
    region,
    incomeLevel,
  }), [search, region, incomeLevel])
  const resetFilters = useCallback(() => resetFilterValues(reset), [reset])
  const value = useMemo(() => ({
    control,
    filters,
    resetFilters,
  }), [control, filters, resetFilters])

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}
