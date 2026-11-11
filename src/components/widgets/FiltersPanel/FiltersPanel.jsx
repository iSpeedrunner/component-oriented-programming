import { Controller } from 'react-hook-form'
import { useFilters } from '../../../context/useFilters.js'
import {
  INCOME_LEVEL_OPTIONS,
  REGION_OPTIONS,
  normalizeIncomeLevel,
  normalizeLiveSearch,
  normalizeRegion,
} from '../../../utils/filterCountries.js'
import './FiltersPanel.css'

function FiltersPanel() {
  const { control, resetFilters } = useFilters()

  return (
    <div className="filters-panel">
      <div className="filters-heading">
        <p className="eyebrow">Explore the data</p>
        <h2>Filters</h2>
        <button
          className="filters-reset-button"
          type="button"
          onClick={resetFilters}
        >
          Скинути фільтри
        </button>
      </div>

      <div className="filter-field">
        <label htmlFor="country-search">Country search</label>

        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <input
              id="country-search"
              name={field.name}
              type="text"
              value={field.value}
              onChange={event => field.onChange(normalizeLiveSearch(event.target.value))}
              onBlur={field.onBlur}
              ref={field.ref}
              placeholder="Введіть назву країни"
            />
          )}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="region-filter">Region</label>

        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <select
              id="region-filter"
              name={field.name}
              value={field.value}
              onChange={event => field.onChange(normalizeRegion(event.target.value))}
              onBlur={field.onBlur}
              ref={field.ref}
            >
              <option value="all">Усі регіони</option>
              {REGION_OPTIONS.map(option => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="income-level-filter">Income level</label>

        <Controller
          name="incomeLevel"
          control={control}
          render={({ field }) => (
            <select
              id="income-level-filter"
              name={field.name}
              value={field.value}
              onChange={event => field.onChange(normalizeIncomeLevel(event.target.value))}
              onBlur={field.onBlur}
              ref={field.ref}
            >
              <option value="all">Усі рівні доходу</option>
              {INCOME_LEVEL_OPTIONS.map(option => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>
    </div>
  )
}

export default FiltersPanel
