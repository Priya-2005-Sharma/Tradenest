import { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { StockSearch } from '../trading/StockSearch.jsx';
import { watchlistService } from '../../services/trading.service.js';
import { useToast } from '../../hooks/useToast.js';

/**
 * Picks a stock and follows it. Owns its own persistence so the page only
 * decides when it is open and what to do after a stock is added.
 */
export const AddToWatchlistModal = ({ open, onClose, onAdded }) => {
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const addStock = async (quote) => {
    setSaving(true);
    try {
      await watchlistService.add({
        stockName: quote.stockName,
        symbol: quote.symbol,
        exchange: quote.exchange,
        lastPrice: quote.lastPrice,
        changePercent: quote.changePercent,
      });
      toast.success(`${quote.symbol} added to your watchlist.`);
      onClose();
      onAdded();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add to watchlist">
      <p className="text-muted small">Search the instrument list and pick a stock to follow.</p>
      <StockSearch onSelect={addStock} autoFocus />
      {saving && (
        <div className="d-flex align-items-center gap-2 mt-3 small text-muted">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          Adding…
        </div>
      )}
    </Modal>
  );
};
