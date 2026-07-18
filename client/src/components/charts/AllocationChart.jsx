import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './chartSetup.js';
import { CHART_COLORS } from './chartSetup.js';
import { formatCurrency } from '../../utils/format.js';
import { EmptyState } from '../ui/EmptyState.jsx';

/** Sector allocation. `data`: [{ sector, value, percent }] */
export const AllocationChart = ({ data = [], height = 240 }) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((slice) => slice.sector),
      datasets: [
        {
          data: data.map((slice) => slice.value),
          backgroundColor: data.map((_, i) => CHART_COLORS.palette[i % CHART_COLORS.palette.length]),
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [data],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle', padding: 10 },
        },
        tooltip: {
          displayColors: true,
          callbacks: {
            label: (item) => {
              const slice = data[item.dataIndex];
              return ` ${slice.sector}: ${formatCurrency(slice.value)} (${slice.percent}%)`;
            },
          },
        },
      },
    }),
    [data],
  );

  if (!data.length) {
    return (
      <EmptyState
        icon="fa-chart-pie"
        title="No allocation to show"
        message="Your sector split appears once you hold at least one stock."
      />
    );
  }

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
