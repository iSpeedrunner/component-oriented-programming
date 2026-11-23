import { useId } from 'react'
import './ChartTypeSwitcher.css'

const chartOptions = [
  { type: 'bar', label: 'Bar chart' },
  { type: 'pie', label: 'Pie chart' },
]

function ChartTypeSwitcher({ value, onChange }) {
  const groupName = useId()

  return (
    <fieldset className="chart-type-switcher">
      <legend>Chart type</legend>
      {chartOptions.map(({ type, label }) => (
        <label key={type}>
          <input
            type="radio"
            name={groupName}
            value={type}
            checked={value === type}
            onChange={() => onChange(type)}
          />
          <span>{label}</span>
        </label>
      ))}
    </fieldset>
  )
}

export default ChartTypeSwitcher
