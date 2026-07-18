import { Link } from 'react-router-dom';

/**
 * The symbol-over-subtitle cell shared by every instrument table.
 * Keeps the symbol a link to the stock page in exactly one place.
 */
export const InstrumentCell = ({ symbol, subtitle }) => (
  <>
    <Link to={`/stocks/${symbol}`} className="tn-symbol text-decoration-none">
      {symbol}
    </Link>
    {subtitle && (
      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
        {subtitle}
      </div>
    )}
  </>
);
