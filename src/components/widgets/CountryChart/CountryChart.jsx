import { lazy, Suspense, useId } from 'react'
import ChartErrorBoundary from './ChartErrorBoundary.jsx'
import './CountryChart.css'

const IncomeBarChart = lazy(() => import('./IncomeBarChart.jsx'))
const IncomePieChart = lazy(() => import('./IncomePieChart.jsx'))
const loadingContent = <p className="country-chart-state" role="status">Loading income distribution…</p>

function CountryChart({ data, type = 'bar', isLoading = false, error = null, controls }) {
  const titleId = useId()
  let content

  if (isLoading) {
    content = loadingContent
  } else if (error) {
    content = (
      <p className="country-chart-state country-chart-error" role="alert">
        Could not load income distribution. {error.message}
      </p>
    )
  } else if (data.length === 0) {
    content = <p className="country-chart-state">No income data for the selected countries.</p>
  } else if (type === 'bar' || type === 'pie') {
    content = (
      <ChartErrorBoundary key={type}>
        <Suspense fallback={loadingContent}>
          {type === 'bar' ? <IncomeBarChart data={data} /> : <IncomePieChart data={data} />}
        </Suspense>
      </ChartErrorBoundary>
    )
  } else {
    content = <p className="country-chart-state">This chart type is unavailable.</p>
  }

  return (
    <section className="country-chart" aria-labelledby={titleId} aria-busy={isLoading}>
      <div className="country-chart-header">
        <h2 id={titleId}>Countries by income level</h2>
        {controls}
      </div>
      <p className="country-chart-scope">
        Counts include loaded countries that match your filters and have a reported income category.
      </p>
      {content}
    </section>
  )
}

export default CountryChart
