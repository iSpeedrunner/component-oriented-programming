import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  resetFilters,
  selectFilters,
  setIncomeLevel,
  setRegion,
  setSearch,
} from '../../../store/filtersSlice.js'
import {
  FILTER_DEFAULT_VALUES,
  INCOME_LEVEL_OPTIONS,
  REGION_OPTIONS,
} from '../../../utils/filterCountries.js'
import './FiltersPanel.css'

function FiltersPanel() {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const { control } = useForm({
    defaultValues: FILTER_DEFAULT_VALUES,
    values: filters,
    resetOptions: { keepDefaultValues: true },
  })

  return (
    <div className="filters-panel">
      <div className="filters-heading">
        <p className="eyebrow">Explore the data</p>
        <h2>Filters</h2>
        <button
          className="filters-reset-button"
          type="button"
          onClick={() => dispatch(resetFilters())}
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
              value={filters.search}
              onChange={event => dispatch(setSearch(event.target.value))}
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
              value={filters.region}
              onChange={event => dispatch(setRegion(event.target.value))}
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
              value={filters.incomeLevel}
              onChange={event => dispatch(setIncomeLevel(event.target.value))}
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
