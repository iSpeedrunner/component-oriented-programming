import { Controller } from 'react-hook-form'
import './FiltersPanel.css'

function FiltersPanel({
  control,
  regionOptions = [],
  incomeLevelOptions = [],
  onReset,
}) {
  return (
    <div className="filters-panel">
      <div className="filters-heading">
        <p className="eyebrow">Explore the data</p>
        <h2>Filters</h2>
        <button
          className="filters-reset-button"
          type="button"
          onClick={onReset}
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
              onChange={field.onChange}
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
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            >
              <option value="all">Усі регіони</option>
              {regionOptions.map(option => (
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
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            >
              <option value="all">Усі рівні доходу</option>
              {incomeLevelOptions.map(option => (
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
