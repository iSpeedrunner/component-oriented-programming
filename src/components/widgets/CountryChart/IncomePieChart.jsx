import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import './IncomePieChart.css'

const categoryColors = new Map([
  ['High income', 'var(--accent)'],
  ['Upper middle income', 'var(--income-pie-upper-middle)'],
  ['Lower middle income', 'var(--income-pie-lower-middle)'],
  ['Low income', 'var(--income-pie-low)'],
])
const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 })

function IncomePieChart({ data }) {
  const total = data.reduce((sum, { count }) => sum + count, 0)
  if (total === 0) {
    return null
  }

  const segments = data.map(({ category, count }) => ({
    category,
    count,
    fill: categoryColors.get(category) ?? 'var(--text-muted)',
    share: percent.format(count / total),
  }))

  return (
    <div className="income-pie-chart">
      <ResponsiveContainer width="100%" height={224}>
        <PieChart accessibilityLayer>
          <Pie
            data={segments}
            dataKey="count"
            nameKey="category"
            startAngle={90}
            endAngle={-270}
            outerRadius="92%"
            stroke="var(--surface-soft)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Tooltip
            formatter={(count, category, { payload }) => [`${count} (${payload.share})`, category]}
            contentStyle={{
              background: 'var(--surface-soft)',
              borderColor: 'var(--border-strong)',
              borderRadius: 8,
              color: 'var(--text-primary)',
            }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="income-pie-legend" aria-label="Income levels">
        {segments.map(({ category, count, fill, share }) => (
          <li key={category}>
            <span className="income-pie-swatch" style={{ backgroundColor: fill }} aria-hidden="true" />
            <span className="income-pie-category">{category}</span>
            <span className="income-pie-values"><strong>{count}</strong> ({share})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IncomePieChart
