import { StatGrid } from '../ui/StatGrid.jsx';
import { StatCard } from '../ui/StatCard.jsx';
import { formatCurrency } from '../../utils/format.js';

/** The headline balances for the funds page. */
export const FundsSummary = ({ funds, loading }) => (
  <StatGrid>
    <StatCard
      label="Available"
      value={formatCurrency(funds?.availableBalance ?? 0)}
      icon="fa-wallet"
      tone="primary"
      loading={loading}
      hint="Ready to trade"
    />
    <StatCard
      label="Account equity"
      value={formatCurrency(funds?.equity ?? 0)}
      icon="fa-scale-balanced"
      tone="neutral"
      loading={loading}
      hint="Cash + holdings"
    />
    <StatCard
      label="Total deposits"
      value={formatCurrency(funds?.totalDeposits ?? 0)}
      icon="fa-arrow-down"
      tone="profit"
      loading={loading}
    />
    <StatCard
      label="Total withdrawals"
      value={formatCurrency(funds?.totalWithdrawals ?? 0)}
      icon="fa-arrow-up"
      tone="loss"
      loading={loading}
    />
  </StatGrid>
);
