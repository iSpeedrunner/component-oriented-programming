import { useEffect, useState } from 'react'
import KpiCard from '../components/ui/KpiCard'
import Counter from '../components/widgets/Counter'
import CountryTable from '../components/widgets/CountryTable'
import Toggle from '../components/widgets/Toggle'
import FilteredList from '../components/widgets/FilteredList'
import { fetchWorldBankData } from '../services/worldBankApi.js'
import { calculateDashboardMetrics } from '../utils/dashboardMetrics.js'
import { formatGdp, formatLifeExpectancy, formatPopulation } from '../utils/formatters.js'
import { isAbortError } from '../utils/requestErrors.js'

function DashboardPage() {
  const [countries, setCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = typeof AbortController === 'function' ? new AbortController() : null

    fetchWorldBankData({ signal: controller?.signal })
      .then(records => {
        if (controller?.signal.aborted) {
          return
        }

        setCountries(records)
        setError(null)
        setIsLoading(false)
      })
      .catch(requestError => {
        if (controller?.signal.aborted || isAbortError(requestError)) {
          return
        }

        setError(requestError)
        setIsLoading(false)
      })

    return () => controller?.abort()
  }, [])

  const metrics = calculateDashboardMetrics(countries)
  const regions = [
    'All',
    ...new Set(countries.map(country => country.regionName).filter(Boolean)),
  ]

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

      <CountryTable records={countries} isLoading={isLoading} error={error} />

      <FilteredList
        title="Countries by region"
        countries={countries}
        regions={regions}
        initialRegion="All"
      />
    </main>
  )
}

export default DashboardPage
