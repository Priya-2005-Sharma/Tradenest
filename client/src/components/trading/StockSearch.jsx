import { useEffect, useMemo, useRef, useState } from 'react';
import { marketService } from '../../services/trading.service.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { formatCurrency } from '../../utils/format.js';
import { ChangePill } from './PnL.jsx';

/** Typeahead over the tradable instrument list. Calls onSelect(quote). */
export const StockSearch = ({ onSelect, placeholder = 'Search stocks by name or symbol…', autoFocus = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 250);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return undefined;
    }

    let active = true;
    setLoading(true);
    marketService
      .instruments({ q: debouncedQuery, limit: 8 })
      .then((instruments) => {
        if (!active) return;
        setResults(instruments);
        setActiveIndex(-1);
      })
      .catch(() => {
        if (active) setResults([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Clicking anywhere outside dismisses the dropdown.
  useEffect(() => {
    const onPointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const choose = useMemo(
    () => (quote) => {
      onSelect?.(quote);
      setQuery('');
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
    },
    [onSelect],
  );

  const onKeyDown = (event) => {
    if (!open || results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      choose(results[activeIndex]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="position-relative" ref={containerRef}>
      <div className="input-group">
        <span className="input-group-text bg-white">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        </span>
        <input
          type="search"
          className="form-control border-start-0"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          aria-label="Search stocks"
          aria-autocomplete="list"
          aria-expanded={open && results.length > 0}
        />
        {loading && (
          <span className="input-group-text bg-white">
            <span className="spinner-border spinner-border-sm text-primary" aria-hidden="true" />
          </span>
        )}
      </div>

      {open && query.trim() && (
        <div
          className="tn-card position-absolute w-100 mt-1 tn-fade-in"
          style={{ zIndex: 1050, maxHeight: 320, overflowY: 'auto', boxShadow: 'var(--tn-shadow-lg)' }}
          role="listbox"
        >
          {results.length === 0 && !loading ? (
            <div className="p-3 text-center small text-muted">
              No instruments match “{query}”.
            </div>
          ) : (
            results.map((quote, index) => (
              <button
                key={quote.symbol}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`btn w-100 text-start border-0 rounded-0 d-flex justify-content-between align-items-center gap-3 py-2 px-3 ${
                  index === activeIndex ? 'bg-light' : ''
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(quote)}
              >
                <span className="min-w-0">
                  <span className="d-block fw-semibold small text-truncate">{quote.symbol}</span>
                  <span className="d-block text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                    {quote.stockName}
                  </span>
                </span>
                <span className="text-end flex-shrink-0">
                  <span className="d-block small tn-num fw-semibold">{formatCurrency(quote.lastPrice)}</span>
                  <ChangePill value={quote.changePercent} />
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
