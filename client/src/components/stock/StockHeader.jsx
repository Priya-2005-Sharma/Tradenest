import { Card, CardBody } from '../ui/Card.jsx';
import { ChangePill } from '../trading/PnL.jsx';
import { formatCurrency, formatSignedCurrency, pnlClass } from '../../utils/format.js';

/** The quote headline for a stock, with the actions that act on it. */
export const StockHeader = ({ quote, holding, watched, watching, onBuy, onSell, onToggleWatch }) => (
  <Card className="mb-3">
    <CardBody>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
        <div className="min-w-0">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1 className="h4 mb-0">{quote.symbol}</h1>
            <span className="tn-pill tn-pill-neutral">{quote.exchange}</span>
            <span className="tn-pill tn-pill-primary">{quote.sector}</span>
          </div>
          <p className="text-muted small mb-0">{quote.stockName}</p>
        </div>

        <div className="text-end">
          <div className="h3 mb-1 tn-num">{formatCurrency(quote.lastPrice)}</div>
          <div className="d-flex align-items-center gap-2 justify-content-end">
            <span className={`small tn-num fw-semibold ${pnlClass(quote.change)}`}>
              {formatSignedCurrency(quote.change)}
            </span>
            <ChangePill value={quote.changePercent} />
          </div>
        </div>
      </div>

      <hr className="tn-divider my-3" />

      <div className="d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-buy" onClick={onBuy}>
          <i className="fa-solid fa-arrow-down me-2" aria-hidden="true" />
          Buy
        </button>
        <button
          type="button"
          className="btn btn-sell"
          onClick={onSell}
          disabled={!holding}
          title={holding ? undefined : `You do not hold any ${quote.symbol}`}
        >
          <i className="fa-solid fa-arrow-up me-2" aria-hidden="true" />
          Sell
        </button>
        <button
          type="button"
          className={`btn ${watched ? 'btn-outline-primary' : 'btn-light'}`}
          onClick={onToggleWatch}
          disabled={watching}
        >
          <i className={`${watched ? 'fa-solid' : 'fa-regular'} fa-star me-2`} aria-hidden="true" />
          {watched ? 'On your watchlist' : 'Add to watchlist'}
        </button>
      </div>
    </CardBody>
  </Card>
);
