import { useContext } from 'react'
import { FilterContext } from './FilterContext.js'

export function useFilters() {
  const context = useContext(FilterContext)

  if (!context) {
    throw new Error('useFilters must be used within FilterProvider')
  }

  return context
}
