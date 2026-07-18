import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import './chartSetup.js';
import { CHART_COLORS, inrTick } from './chartSetup.js';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { EmptyState } from '../ui/EmptyState.jsx';

/**
 * Portfolio value vs invested capital over time.
 * `series`: [{ date, value, invested }]
 */
export const PortfolioChart = ({ series = [], height = 260 }) => {
  const isUp = useMemo(() => {
    if (series.length === 0) return true;
    const last = series[series.length - 1];
    return last.value >= last.invested;
  }, [series]);

  const data = useMemo(() => {
    const lineColor = isUp ? CHART_COLORS.profit : CHART_COLORS.loss;

    return {
      labels: series.map((point) => point.date),
      datasets: [
        {
          label: 'Portfolio value',
          data: series.map((point) => point.value),
          borderColor: lineColor,
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            // chartArea is undefined on the first paint, before layout.
            if (!chartArea) return 'transparent';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, isUp ? 'rgba(5,150,105,0.22)' : 'rgba(220,38,38,0.22)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            return gradient;
          },
          fill: true,
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        },
        {
          label: 'Invested',
          data: series.map((point) => point.invested),
          borderColor: '#94a3b8',
          borderDash: [5, 4],
          borderWidth: 1.5,
          fill: false,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 3,
        },
      ],
    };
  }, [series, isUp]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle', padding: 12 },
        },
        tooltip: {
          displayColors: true,
          callbacks: {
            title: (items) => formatDate(items[0].label),
            label: (item) => ` ${item.dataset.label}: ${formatCurrency(item.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxTicksLimit: 6,
            callback(value) {
              const label = this.getLabelForValue(value);
              return new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            },
          },
        },
        y: {
          grid: { color: '#f1f5f9' },
          border: { display: false },
          ticks: { callback: inrTick, maxTicksLimit: 5 },
        },
      },
    }),
    [],
  );

  if (!series.length) {
    return (
      <EmptyState
        icon="fa-chart-line"
        title="No portfolio history yet"
        message="Add a holding or place your first order and your growth curve will start building here."
      />
    );
  }

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
};
