import './App.css'
import KpiCard from './components/KpiCard'
import Counter from './components/Counter'
import Toggle from './components/Toggle'
import FilteredList from './components/FilteredList'

function App() {
  return (
    <div>
      <h1>World Economy Dashboard</h1>

      <div className="kpi-container">
        <KpiCard
          title="Total GDP"
          value="8.58 T"
          change="+3.2% from previous year"
        />

        <KpiCard
          title="Population"
          value="226.4 M"
          change="+0.8% from previous year"
        />

        <KpiCard
          title="Life Expectancy"
          value="78.7 years"с
          change="-0.2% from previous year"
        />
      </div>

      <Counter />
      <Toggle />
      <FilteredList />
    </div>
  )
}

export default App