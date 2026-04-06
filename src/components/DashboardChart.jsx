import React from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const monthFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  year: '2-digit',
});

const buildChartData = (transactions) => {
  const monthlyMap = new Map();
  const today = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    monthlyMap.set(key, {
      label: monthFormatter.format(date),
      income: 0,
      expense: 0,
      net: 0,
    });
  }

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const monthEntry = monthlyMap.get(key);

    if (!monthEntry) {
      return;
    }

    if (transaction.amount > 0) {
      monthEntry.income += transaction.amount;
    } else {
      monthEntry.expense += Math.abs(transaction.amount);
    }
  });

  return Array.from(monthlyMap.values()).map((entry) => ({
    ...entry,
    net: entry.income - entry.expense,
  }));
};

const DashboardChart = ({ transactions = [] }) => {
  const chartData = buildChartData(transactions);
  const latestMonth = chartData[chartData.length - 1] || { income: 0, expense: 0, net: 0 };

  return (
    <div className="chart-container glass-panel">
      <div className="chart-header">
        <div>
          <p className="section-eyebrow">Performance</p>
          <h2>Cash Flow Overview</h2>
          <span className="chart-subtitle">Live monthly trend built from your recorded transactions.</span>
        </div>
        <div className="chart-kpis">
          <div className="chart-kpi">
            <span>This month income</span>
            <strong>{currencyFormatter.format(latestMonth.income)}</strong>
          </div>
          <div className="chart-kpi">
            <span>Net flow</span>
            <strong className={latestMonth.net >= 0 ? 'positive' : 'negative'}>
              {currencyFormatter.format(latestMonth.net)}
            </strong>
          </div>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-success)" stopOpacity={0.32} />
                <stop offset="95%" stopColor="var(--accent-success)" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-danger)" stopOpacity={0.24} />
                <stop offset="95%" stopColor="var(--accent-danger)" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              tickFormatter={(value) => `INR ${Math.round(value / 1000)}k`}
            />
            <Tooltip
              cursor={{ stroke: 'var(--border-highlight)', strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: 'rgba(20, 20, 22, 0.96)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-lg)',
              }}
              formatter={(value, name) => [currencyFormatter.format(value), name]}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
            />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="var(--accent-success)"
              strokeWidth={3}
              fill="url(#incomeFill)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="var(--accent-danger)"
              strokeWidth={3}
              fill="url(#expenseFill)"
            />
            <Line
              type="monotone"
              dataKey="net"
              name="Net Flow"
              stroke="var(--accent-primary)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--accent-primary)', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
