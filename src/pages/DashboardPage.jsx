import { useForm, useWatch } from 'react-hook-form'
import KpiCard from '../components/ui/KpiCard'
import Counter from '../components/widgets/Counter'
import CountryTable from '../components/widgets/CountryTable'
import Toggle from '../components/widgets/Toggle'
import FilteredList from '../components/widgets/FilteredList'
import FiltersPanel from '../components/widgets/FiltersPanel'
import { fetchWorldBankData } from '../services/worldBankApi.js'
import useFetch from '../hooks/useFetch.js'
import { calculateDashboardMetrics } from '../utils/dashboardMetrics.js'
import { filterCountries } from '../utils/filterCountries.js'
import { formatGdp, formatLifeExpectancy, formatPopulation } from '../utils/formatters.js'
import useDebounce from '../hooks/useDebounce.js'

function createFilterOptions(countries, valueField, labelField) {
  const options = []
  const usedValues = new Set()

  for (const country of countries) {
    const value = country[valueField]
    const label = country[labelField]

    if (value && label && !usedValues.has(value)) {
      usedValues.add(value)
      options.push({ value, label })
    }
  }

  return options.sort((left, right) => left.label.localeCompare(right.label))
}

function DashboardPage() {
  const { data, loading: isLoading, error } = useFetch(fetchWorldBankData)
  const countries = data ?? []
  const { control, reset } = useForm({
    defaultValues: {
      search: '',
      region: 'all',
      incomeLevel: 'all',
    },
  })
  const search = useWatch({ control, name: 'search' })
  const region = useWatch({ control, name: 'region' })
  const incomeLevel = useWatch({ control, name: 'incomeLevel' })
  const debouncedSearch = useDebounce(search, 400)
  const filteredCountries = filterCountries(countries, {
    search: debouncedSearch,
    region,
    incomeLevel,
  })
  const metrics = calculateDashboardMetrics(filteredCountries)
  const hasActiveFilters = Boolean(debouncedSearch?.trim())
    || region !== 'all'
    || incomeLevel !== 'all'
  const regionOptions = createFilterOptions(countries, 'regionCode', 'regionName')
  const incomeLevelOptions = createFilterOptions(countries, 'incomeLevelCode', 'incomeLevelName')
  const regions = ['All', ...regionOptions.map(option => option.label)]

  const metricDescription = metric => {
    if (isLoading) {
      return 'Loading real data…'
    }

    if (error) {
      return 'Data unavailable'
    }

    return metric.count > 0
      ? `Latest available values for ${metric.count} countries`
      : 'No values available'
  }

  const kpiCards = [
    {
      title: 'Total GDP (latest available)',
      value: formatGdp(metrics.totalGdp.value),
      change: metricDescription(metrics.totalGdp),
    },
    {
      title: 'Population (latest available)',
      value: formatPopulation(metrics.totalPopulation.value),
      change: metricDescription(metrics.totalPopulation),
    },
    {
      title: 'Life Expectancy (latest available)',
      value: formatLifeExpectancy(metrics.averageLifeExpectancy.value),
      change: metricDescription(metrics.averageLifeExpectancy),
    },
  ]

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>World Economy Dashboard</h1>
        <p className="dashboard-intro">
          Live country indicators loaded from the World Bank API.
        </p>
      </header>

      <FiltersPanel
        control={control}
        regionOptions={regionOptions}
        incomeLevelOptions={incomeLevelOptions}
        onReset={reset}
      />

      <div className="kpi-container">
        {kpiCards.map(kpi => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="legacy-widgets">
        <Counter
          title="Number of countries"
          initialValue={10}
          min={1}
          max={15}
          step={1}
          itemLabel="countries"
        />
        <Toggle
          title="Indicator (latest available)"
          firstLabel="GDP"
          secondLabel="Population"
          firstValue={formatGdp(metrics.totalGdp.value)}
          secondValue={formatPopulation(metrics.totalPopulation.value)}
          initialMode="first"
        />
      </div>

      <CountryTable
        records={filteredCountries}
        isLoading={isLoading}
        error={error}
        emptyMessage={hasActiveFilters
          ? 'No countries match the selected filters.'
          : 'No country data is available.'}
      />

      <FilteredList
        title="Countries by region"
        countries={filteredCountries}
        regions={regions}
        initialRegion="All"
        isLoading={isLoading}
        error={error}
        emptyMessage={hasActiveFilters
          ? 'No countries match the selected filters.'
          : 'No country data is available.'}
      />
    </main>
  )
}

export default DashboardPage
