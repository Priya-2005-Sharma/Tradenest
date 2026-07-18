import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Registered once at module load — Chart.js is tree-shaken and needs each
// controller/element opted in explicitly.
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#64748b';
Chart.defaults.plugins.tooltip.backgroundColor = '#0f172a';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 12 };
Chart.defaults.plugins.tooltip.displayColors = false;

export const CHART_COLORS = {
  primary: '#2563eb',
  profit: '#059669',
  loss: '#dc2626',
  // Categorical ramp for allocation/sector charts.
  palette: [
    '#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626',
    '#0891b2', '#db2777', '#65a30d', '#ea580c', '#4f46e5',
  ],
};

export const inrTick = (value) => {
  const n = Number(value);
  if (Math.abs(n) >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (Math.abs(n) >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};
