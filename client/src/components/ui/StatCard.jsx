import { Card } from './Card.jsx';
import { pnlPillClass, formatPercent } from '../../utils/format.js';

const TONES = {
  primary: { bg: 'var(--tn-primary-subtle)', color: 'var(--tn-primary)' },
  profit: { bg: 'var(--tn-profit-light)', color: 'var(--tn-profit)' },
  loss: { bg: 'var(--tn-loss-light)', color: 'var(--tn-loss)' },
  warning: { bg: 'var(--tn-warning-light)', color: 'var(--tn-warning)' },
  neutral: { bg: '#f1f5f9', color: 'var(--tn-muted)' },
};

/**
 * A single headline metric. `valueClass` lets the caller apply P&L colouring
 * to the number while the label and chrome stay neutral.
 */
export const StatCard = ({
  label,
  value,
  valueClass = '',
  icon,
  tone = 'primary',
  change,
  hint,
  loading = false,
}) => {
  const palette = TONES[tone] || TONES.primary;

  if (loading) {
    return (
      <Card className="h-100">
        <div className="tn-card-body">
          <div className="tn-skeleton mb-2" style={{ height: 12, width: '55%' }} />
          <div className="tn-skeleton" style={{ height: 26, width: '75%' }} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-100" hover>
      <div className="tn-card-body d-flex justify-content-between align-items-start gap-3">
        <div className="min-w-0">
          <div className="tn-stat-label">{label}</div>
          <div className={`tn-stat-value tn-num text-truncate ${valueClass}`}>{value}</div>
          {change !== undefined && change !== null && (
            <span className={`${pnlPillClass(change)} mt-2`}>
              <i
                className={`fa-solid ${Number(change) >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}
                aria-hidden="true"
              />
              {formatPercent(change)}
            </span>
          )}
          {hint && <div className="small text-muted mt-2">{hint}</div>}
        </div>
        {icon && (
          <div className="tn-stat-icon" style={{ background: palette.bg, color: palette.color }}>
            <i className={`fa-solid ${icon}`} aria-hidden="true" />
          </div>
        )}
      </div>
    </Card>
  );
};
