import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { FormField } from '../ui/FormField.jsx';
import { positionService } from '../../services/trading.service.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { useToast } from '../../hooks/useToast.js';
import { formatCurrency, formatSignedCurrency, pnlClass } from '../../utils/format.js';

/**
 * Closes an open position at a user-supplied exit price, previewing the P&L
 * that price would book. Owns its own state so the page only decides which
 * position is being closed and what to do afterwards.
 */
export const ClosePositionModal = ({ open, position, onClose, onClosed }) => {
  const toast = useToast();
  const { errors, setErrors, reset } = useFormErrors();
  const [exitPrice, setExitPrice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !position) return;
    setExitPrice(String(position.currentPrice));
    reset();
  }, [open, position, reset]);

  const submit = async (event) => {
    event.preventDefault();
    if (!Number(exitPrice) || Number(exitPrice) <= 0) {
      setErrors({ exitPrice: 'Enter the price you exited at.' });
      return;
    }

    setBusy(true);
    try {
      await positionService.update(position._id, { status: 'CLOSED', exitPrice: Number(exitPrice) });
      toast.success(`${position.symbol} position closed.`);
      onClose();
      onClosed();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const preview = position ? (Number(exitPrice) - position.entryPrice) * position.quantity : 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Close ${position?.symbol} position`}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" form="close-position-form" className="btn btn-sell" disabled={busy}>
            {busy ? 'Closing…' : 'Close position'}
          </button>
        </>
      }
    >
      <form id="close-position-form" onSubmit={submit} noValidate>
        <p className="text-muted small">
          Closing {position?.quantity} × {position?.symbol}, entered at {formatCurrency(position?.entryPrice)}.
        </p>
        <FormField
          label="Exit price"
          name="exitPrice"
          type="number"
          min="0"
          step="0.05"
          prefix="₹"
          value={exitPrice}
          onChange={(e) => setExitPrice(e.target.value)}
          error={errors.exitPrice}
          required
        />
        {Number(exitPrice) > 0 && position && (
          <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{ background: 'var(--tn-canvas)' }}>
            <span className="small text-muted">P&L on close</span>
            <span className={`fw-semibold tn-num ${pnlClass(preview)}`}>
              {formatSignedCurrency(preview)}
            </span>
          </div>
        )}
      </form>
    </Modal>
  );
};
