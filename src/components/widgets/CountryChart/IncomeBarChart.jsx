import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const axisTick = { fill: 'var(--text-secondary)', fontSize: 12 }

function IncomeBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={data.length * 44 + 60}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 28, bottom: 18, left: 0 }}
        accessibilityLayer
      >
        <CartesianGrid horizontal={false} stroke="var(--border-strong)" strokeDasharray="3 3" />
        <XAxis
          type="number"
          allowDecimals={false}
          domain={[0, 'dataMax']}
          tickCount={4}
          tick={axisTick}
          tickLine={false}
          axisLine={{ stroke: 'var(--border-strong)' }}
          label={{ ...axisTick, value: 'Number of countries', position: 'insideBottom', offset: -8 }}
        />
        <YAxis
          type="category"
          dataKey="category"
          width={132}
          interval={0}
          tick={axisTick}
          tickMargin={8}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--surface-soft)',
            borderColor: 'var(--border-strong)',
            borderRadius: 8,
            color: 'var(--text-primary)',
          }}
          itemStyle={{ color: 'var(--text-primary)' }}
          cursor={{ fill: 'var(--surface-muted)' }}
        />
        <Bar
          dataKey="count"
          name="Countries"
          fill="var(--accent)"
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
          isAnimationActive={false}
        >
          <LabelList dataKey="count" position="right" fill="var(--text-primary)" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default IncomeBarChart
