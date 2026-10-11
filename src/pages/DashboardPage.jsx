import KpiCard from '../components/ui/KpiCard'
import Counter from '../components/widgets/Counter'
import Toggle from '../components/widgets/Toggle'
import FilteredList from '../components/widgets/FilteredList'
import countries from '../data/countries.js'
import dashboardMetrics from '../data/dashboardMetrics.js'

const kpiCards = [
  {
    title: 'Total GDP',
    value: dashboardMetrics.totalGdp.value,
    change: dashboardMetrics.totalGdp.change,
  },
  {
    title: 'Population',
    value: dashboardMetrics.population.value,
    change: dashboardMetrics.population.change,
  },
  {
    title: 'Life Expectancy',
    value: dashboardMetrics.lifeExpectancy.value,
    change: dashboardMetrics.lifeExpectancy.change,
  },
]

const counterConfig = {
  title: 'Number of countries',
  initialValue: 10,
  min: 1,
  max: 15,
  step: 1,
  itemLabel: 'countries',
}

const toggleConfig = {
  title: 'Indicator',
  firstLabel: 'GDP',
  secondLabel: 'Population',
  firstValue: `$${dashboardMetrics.totalGdp.value}`,
  secondValue: dashboardMetrics.population.value,
  initialMode: 'first',
}

const filterConfig = {
  title: 'Countries',
  countries,
  regions: ['All', 'Europe', 'Asia', 'Latin America'],
  initialRegion: 'All',
}

function DashboardPage() {
  return (
    <div>
      <h1>World Economy Dashboard</h1>

      <div className="kpi-container">
        {kpiCards.map(kpi => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <Counter {...counterConfig} />
      <Toggle {...toggleConfig} />
      <FilteredList {...filterConfig} />
    </div>
  )
}

export default DashboardPage
