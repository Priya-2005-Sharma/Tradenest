import { useEffect, useState } from 'react';
import { marketService } from '../../services/trading.service.js';
import { formatCurrency, formatPercent } from '../../utils/format.js';

/** Scrolling strip of live simulated quotes for the marketing pages. */
export const MarketTicker = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    let active = true;

    marketService
      .instruments({ limit: 14 })
      .then((instruments) => {
        if (active) setQuotes(instruments.slice(0, 14));
      })
      .catch(() => {
        // The ticker is decorative — a failure just leaves the strip empty.
      });

    return () => {
      active = false;
    };
  }, []);

  if (quotes.length === 0) return null;

  return (
    <div className="tn-ticker" aria-hidden="true">
      {/* The list is rendered twice so the -50% keyframe loops seamlessly. */}
      <div className="tn-ticker-track">
        {[...quotes, ...quotes].map((quote, index) => (
          // Every symbol appears twice by design, so the index is what makes
          // the key unique. The list never reorders, so it is stable.
          // eslint-disable-next-line react/no-array-index-key
          <span key={`${quote.symbol}-${index}`} className="d-flex align-items-center gap-2 flex-shrink-0">
            <span className="fw-semibold">{quote.symbol}</span>
            <span className="tn-num" style={{ color: '#94a3b8' }}>{formatCurrency(quote.lastPrice)}</span>
            <span
              className="tn-num"
              style={{ color: quote.changePercent >= 0 ? '#34d399' : '#f87171' }}
            >
              {formatPercent(quote.changePercent)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};
