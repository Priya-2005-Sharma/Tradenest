import { Link } from 'react-router-dom';
import { ChangePill } from './PnL.jsx';
import { formatCurrency } from '../../utils/format.js';

/**
 * One instrument line: symbol and name on the left, price and change on the
 * right. Used for watchlists, movers and market snapshots.
 *
 * Pass `to` to make the row navigable — the public pages omit it, since those
 * visitors have no session and the stock page is protected.
 */
export const QuoteRow = ({ quote, to }) => {
  const body = (
    <>
      <span className="min-w-0 me-2">
        <span className="d-block small fw-semibold text-truncate" style={{ color: 'var(--tn-ink)' }}>
          {quote.symbol}
        </span>
        <span className="d-block text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
          {quote.stockName}
        </span>
      </span>
      <span className="text-end flex-shrink-0">
        <span className="d-block small tn-num" style={{ color: 'var(--tn-ink)' }}>
          {formatCurrency(quote.lastPrice)}
        </span>
        <ChangePill value={quote.changePercent} />
      </span>
    </>
  );

  const className = 'd-flex justify-content-between align-items-center py-2';

  if (!to) return <div className={className}>{body}</div>;

  return (
    <Link to={to} className={`${className} text-decoration-none`}>
      {body}
    </Link>
  );
};

/** A list of quote rows with a shared skeleton while loading. */
export const QuoteList = ({ quotes = [], loading, linkTo, height = 180 }) => {
  if (loading) return <div className="tn-skeleton" style={{ height }} />;

  return quotes.map((quote) => (
    <QuoteRow key={quote._id || quote.symbol} quote={quote} to={linkTo ? linkTo(quote) : undefined} />
  ));
};
