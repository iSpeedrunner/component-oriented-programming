import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import KpiCard from '../components/ui/KpiCard/KpiCard.jsx'
import Counter from '../components/widgets/Counter/Counter.jsx'
import CountryTable from '../components/widgets/CountryTable/CountryTable.jsx'
import Toggle from '../components/widgets/Toggle/Toggle.jsx'
import FilteredList from '../components/widgets/FilteredList/FilteredList.jsx'
import FiltersPanel from '../components/widgets/FiltersPanel/FiltersPanel.jsx'
import { fetchWorldBankData } from '../services/worldBankApi.js'
import useFetch from '../hooks/useFetch.js'
import { calculateDashboardMetrics } from '../utils/dashboardMetrics.js'
import { formatGdp, formatLifeExpectancy, formatPopulation } from '../utils/formatters.js'
import useDebounce from '../hooks/useDebounce.js'
import {
  FILTER_DEFAULT_VALUES,
  INCOME_LEVEL_OPTIONS,
  REGION_OPTIONS,
  resetFilters,
} from '../utils/filterCountries.js'

function DashboardPage() {
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
  const debouncedFilters = useDebounce(filters, 400)
  const { data, loading: isLoading, error } = useFetch(fetchWorldBankData, debouncedFilters)
  const countries = data ?? []
  const filteredCountries = countries
  const metrics = calculateDashboardMetrics(filteredCountries)
  const hasActiveFilters = Boolean(debouncedFilters.search?.trim())
    || debouncedFilters.region !== 'all'
    || debouncedFilters.incomeLevel !== 'all'
  const regionOptions = REGION_OPTIONS
  const incomeLevelOptions = INCOME_LEVEL_OPTIONS
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
        onReset={() => resetFilters(reset)}
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
