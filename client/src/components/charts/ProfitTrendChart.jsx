import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import './chartSetup.js';
import { CHART_COLORS, inrTick } from './chartSetup.js';
import { formatCurrency } from '../../utils/format.js';
import { EmptyState } from '../ui/EmptyState.jsx';

/**
 * Per-holding P&L. Bars are coloured by sign so gains and losses separate at a
 * glance. `data`: [{ symbol, pnl }]
 */
export const ProfitTrendChart = ({ data = [], height = 240 }) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.symbol),
      datasets: [
        {
          label: 'P&L',
          data: data.map((item) => item.pnl),
          backgroundColor: data.map((item) =>
            item.pnl >= 0 ? 'rgba(5,150,105,0.85)' : 'rgba(220,38,38,0.85)',
          ),
          hoverBackgroundColor: data.map((item) =>
            item.pnl >= 0 ? CHART_COLORS.profit : CHART_COLORS.loss,
          ),
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 40,
        },
      ],
    }),
    [data],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (item) => ` P&L: ${formatCurrency(item.parsed.y)}` },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true } },
        y: {
          grid: { color: '#f1f5f9' },
          border: { display: false },
          ticks: { callback: inrTick, maxTicksLimit: 5 },
        },
      },
    }),
    [],
  );

  if (!data.length) {
    return (
      <EmptyState
        icon="fa-chart-simple"
        title="No P&L to chart"
        message="Profit and loss per holding appears once you own something."
      />
    );
  }

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
