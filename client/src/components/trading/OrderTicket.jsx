import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { FormField } from '../ui/FormField.jsx';
import { orderService, marketService } from '../../services/trading.service.js';
import { useToast } from '../../hooks/useToast.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { formatCurrency } from '../../utils/format.js';

/**
 * Buy/sell ticket shared by the watchlist, holdings and stock detail pages.
 * `stock` needs at least { symbol, stockName }; the live price is fetched here
 * so every entry point quotes from the same source.
 */
export const OrderTicket = ({ open, onClose, stock, defaultType = 'BUY', onPlaced, availableBalance }) => {
  const toast = useToast();
  const { errors, setErrors, reset, handleError } = useFormErrors();
  const [type, setType] = useState(defaultType);
  const [mode, setMode] = useState('MARKET');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [quote, setQuote] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset to a clean ticket each time it opens, then pull a fresh quote.
  useEffect(() => {
    if (!open || !stock?.symbol) return undefined;

    setType(defaultType);
    setMode('MARKET');
    setQuantity(1);
    reset();
    setQuote(null);

    let active = true;
    marketService
      .quote(stock.symbol)
      .then((fresh) => {
        if (!active) return;
        setQuote(fresh);
        setPrice(fresh.lastPrice);
      })
      .catch(() => {
        if (active) setPrice(stock.lastPrice || stock.currentPrice || 0);
      });

    return () => {
      active = false;
    };
    // `reset` is stable (useCallback with no deps), so listing it cannot
    // re-trigger this effect and re-fetch the quote.
  }, [open, stock, defaultType, reset]);

  const effectivePrice = mode === 'MARKET' ? quote?.lastPrice ?? price : Number(price) || 0;
  const orderValue = useMemo(
    () => (Number(quantity) || 0) * effectivePrice,
    [quantity, effectivePrice],
  );

  const insufficientFunds =
    type === 'BUY' && availableBalance !== undefined && orderValue > availableBalance;

  const validate = () => {
    const next = {};
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      next.quantity = 'Enter a whole number of shares, at least 1.';
    }
    if (mode === 'LIMIT' && (!Number(price) || Number(price) <= 0)) {
      next.price = 'Enter the price you want to trade at.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await orderService.create({
        stockName: stock.stockName || stock.symbol,
        symbol: stock.symbol,
        type,
        mode,
        quantity: Number(quantity),
        price: effectivePrice,
      });

      toast.success(
        order.status === 'EXECUTED'
          ? `${type} order executed — ${order.quantity} × ${order.symbol}`
          : `${type} order placed and waiting at ${formatCurrency(order.price)}`,
      );
      onPlaced?.(order);
      onClose();
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!stock) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${stock.symbol} — ${stock.stockName || ''}`}
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            type="submit"
            form="order-ticket-form"
            className={`btn ${type === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
            disabled={submitting || insufficientFunds}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Placing…
              </>
            ) : (
              `${type} ${quantity || 0} share${Number(quantity) === 1 ? '' : 's'}`
            )}
          </button>
        </>
      }
    >
      <form id="order-ticket-form" onSubmit={submit} noValidate>
        <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded" style={{ background: 'var(--tn-canvas)' }}>
          <div>
            <div className="small text-muted">Last traded price</div>
            <div className="h5 mb-0 tn-num">
              {quote ? formatCurrency(quote.lastPrice) : <span className="tn-skeleton d-inline-block" style={{ width: 90, height: 20 }} />}
            </div>
          </div>
          {quote && (
            <div className="text-end small text-muted">
              <div>H {formatCurrency(quote.dayHigh)}</div>
              <div>L {formatCurrency(quote.dayLow)}</div>
            </div>
          )}
        </div>

        <div className="btn-group w-100 mb-3" role="group" aria-label="Order side">
          {['BUY', 'SELL'].map((side) => (
            <button
              key={side}
              type="button"
              className={`btn ${
                type === side
                  ? side === 'BUY'
                    ? 'btn-buy'
                    : 'btn-sell'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setType(side)}
              aria-pressed={type === side}
            >
              {side}
            </button>
          ))}
        </div>

        <div className="row g-3">
          <div className="col-6">
            <FormField
              label="Quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              error={errors.quantity}
              required
            />
          </div>
          <div className="col-6">
            <FormField label="Order type" name="mode">
              <select
                id="field-mode"
                className="form-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="MARKET">Market</option>
                <option value="LIMIT">Limit</option>
              </select>
            </FormField>
          </div>
        </div>

        {mode === 'LIMIT' && (
          <FormField
            label="Limit price"
            name="price"
            type="number"
            min="0"
            step="0.05"
            prefix="₹"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
            hint={
              type === 'BUY'
                ? 'Fills when the market trades at or below this price.'
                : 'Fills when the market trades at or above this price.'
            }
            required
          />
        )}

        <hr className="tn-divider my-3" />

        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted small">Order value</span>
          <span className="h6 mb-0 tn-num">{formatCurrency(orderValue)}</span>
        </div>

        {availableBalance !== undefined && (
          <div className="d-flex justify-content-between align-items-center mt-1">
            <span className="text-muted small">Available funds</span>
            <span className="small tn-num">{formatCurrency(availableBalance)}</span>
          </div>
        )}

        {insufficientFunds && (
          <div className="alert alert-danger py-2 px-3 small mt-3 mb-0" role="alert">
            <i className="fa-solid fa-circle-exclamation me-2" aria-hidden="true" />
            This order costs more than your available funds. Add funds or reduce the quantity.
          </div>
        )}
      </form>
    </Modal>
  );
};
