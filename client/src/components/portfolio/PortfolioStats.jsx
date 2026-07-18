import { StatCard } from '../ui/StatCard.jsx';
import { formatCurrency, formatSignedCurrency, pnlClass } from '../../utils/format.js';

/**
 * Headline portfolio metrics, each reading from the same `summary` shape the
 * API returns. Pages compose whichever ones they need inside a <StatGrid>,
 * rather than restating the label, icon, tone and P&L colour rules.
 *
 * Tone follows the sign of the value, so a loss never renders in profit green.
 */

export const InvestedStat = ({ summary, loading, hint }) => (
  <StatCard
    label="Invested"
    value={formatCurrency(summary?.invested ?? 0)}
    icon="fa-wallet"
    tone="neutral"
    loading={loading}
    hint={hint}
  />
);

export const CurrentValueStat = ({ summary, loading, hint }) => (
  <StatCard
    label="Current value"
    value={formatCurrency(summary?.currentValue ?? 0)}
    icon="fa-chart-pie"
    tone="primary"
    loading={loading}
    hint={hint}
  />
);

export const PortfolioValueStat = ({ summary, loading, hint }) => (
  <StatCard
    label="Portfolio value"
    value={formatCurrency(summary?.currentValue ?? 0)}
    icon="fa-chart-pie"
    tone="primary"
    loading={loading}
    hint={hint}
  />
);

export const DayPnlStat = ({ summary, loading }) => (
  <StatCard
    label="Today's P&L"
    value={formatSignedCurrency(summary?.dayPnl ?? 0)}
    valueClass={pnlClass(summary?.dayPnl)}
    icon="fa-bolt"
    tone={Number(summary?.dayPnl) >= 0 ? 'profit' : 'loss'}
    change={summary?.dayPnlPercent}
    loading={loading}
  />
);

export const OverallPnlStat = ({ summary, loading }) => (
  <StatCard
    label="Overall P&L"
    value={formatSignedCurrency(summary?.overallPnl ?? 0)}
    valueClass={pnlClass(summary?.overallPnl)}
    icon="fa-arrow-trend-up"
    tone={Number(summary?.overallPnl) >= 0 ? 'profit' : 'loss'}
    change={summary?.overallPnlPercent}
    loading={loading}
  />
);
