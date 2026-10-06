import './App.css'
import Counter from './components/Counter'
import Toggle from './components/Toggle'
import FilteredList from './components/FilteredList'
import WorldBankDashboard from './components/WorldBankDashboard'

function App() {
  return (
    <div>
      <h1>World Economy Dashboard</h1>

      <Counter />
      <Toggle />
      <FilteredList />

      <WorldBankDashboard />
    </div>
  )
}

export default App