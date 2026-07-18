import { formatSignedCurrency, formatPercent, pnlClass, pnlPillClass } from '../../utils/format.js';

/** A signed P&L amount with an optional percentage, coloured by sign. */
export const PnL = ({ value, percent, className = '', showPercent = true }) => (
  <span className={`tn-num ${className}`}>
    <span className={`fw-semibold ${pnlClass(value)}`}>{formatSignedCurrency(value)}</span>
    {showPercent && percent !== undefined && percent !== null && (
      <span className={`d-block small ${pnlClass(value)}`}>{formatPercent(percent)}</span>
    )}
  </span>
);

/** Compact percentage pill, for change columns and quote cards. */
export const ChangePill = ({ value }) => (
  <span className={pnlPillClass(value)}>
    <i
      className={`fa-solid ${Number(value) >= 0 ? 'fa-caret-up' : 'fa-caret-down'}`}
      aria-hidden="true"
    />
    {formatPercent(value)}
  </span>
);
