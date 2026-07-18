import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { formatCurrency, formatSignedCurrency, pnlClass } from '../../utils/format.js';

/** What the user owns of this stock, or an invitation to buy it. */
export const YourPositionCard = ({ holding, quote, onBuy }) => {
  const rows = holding
    ? [
        { label: 'Quantity', value: holding.quantity },
        { label: 'Average cost', value: formatCurrency(holding.buyPrice) },
        { label: 'Invested', value: formatCurrency(holding.investedValue) },
        { label: 'Current value', value: formatCurrency(holding.currentValue) },
      ]
    : [];

  return (
    <Card className="h-100">
      <CardHeader title="Your position" icon="fa-briefcase" />
      <CardBody>
        {holding ? (
          <>
            {rows.map((row) => (
              <div className="d-flex justify-content-between py-2" key={row.label}>
                <span className="small text-muted">{row.label}</span>
                <span className="small tn-num fw-semibold" style={{ color: 'var(--tn-ink)' }}>
                  {row.value}
                </span>
              </div>
            ))}
            <hr className="tn-divider my-2" />
            <div className="d-flex justify-content-between py-2">
              <span className="small text-muted">P&L</span>
              <span className={`fw-semibold tn-num ${pnlClass(holding.pnl)}`}>
                {formatSignedCurrency(holding.pnl)}
              </span>
            </div>
          </>
        ) : (
          <EmptyState
            icon="fa-briefcase"
            title="You do not own this"
            message={`Buy ${quote.symbol} and your position will show up here.`}
            action={
              <button type="button" className="btn btn-buy btn-sm" onClick={onBuy}>
                Buy {quote.symbol}
              </button>
            }
          />
        )}
      </CardBody>
    </Card>
  );
};
