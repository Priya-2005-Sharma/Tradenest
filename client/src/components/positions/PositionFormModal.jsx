import { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { FormField } from '../ui/FormField.jsx';
import { StockSearch } from '../trading/StockSearch.jsx';
import { positionService } from '../../services/trading.service.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { useToast } from '../../hooks/useToast.js';

const emptyForm = { stockName: '', symbol: '', quantity: '', entryPrice: '', product: 'MIS' };

/**
 * Opens a new position. Owns its own form state and persistence so the page
 * only decides when it is open and what to do after it saves.
 *
 * The form is cleared on a successful save rather than on open, so a cancelled
 * entry can be resumed.
 */
export const PositionFormModal = ({ open, onClose, onSaved }) => {
  const toast = useToast();
  const { errors, setErrors, clearField, handleError } = useFormErrors();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    clearField(name);
  };

  const validate = () => {
    const next = {};
    if (!form.stockName.trim()) next.stockName = 'Pick a stock.';
    if (!form.symbol.trim()) next.symbol = 'Symbol is required.';
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) {
      next.quantity = 'Enter a whole number of shares, at least 1.';
    }
    if (!Number(form.entryPrice) || Number(form.entryPrice) <= 0) {
      next.entryPrice = 'Enter your entry price.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await positionService.create({
        stockName: form.stockName.trim(),
        symbol: form.symbol.trim().toUpperCase(),
        quantity: Number(form.quantity),
        entryPrice: Number(form.entryPrice),
        product: form.product,
      });
      toast.success(`Position opened in ${form.symbol.toUpperCase()}.`);
      onClose();
      setForm(emptyForm);
      onSaved();
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Open a position"
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="position-form" className="btn btn-primary" disabled={saving}>
            {saving ? 'Opening…' : 'Open position'}
          </button>
        </>
      }
    >
      <form id="position-form" onSubmit={submit} noValidate>
        <div className="mb-3">
          <label className="form-label">Find a stock</label>
          <StockSearch
            onSelect={(quote) =>
              setForm((current) => ({
                ...current,
                stockName: quote.stockName,
                symbol: quote.symbol,
                entryPrice: current.entryPrice || String(quote.lastPrice),
              }))
            }
          />
        </div>

        <div className="row g-3">
          <div className="col-12 col-sm-8">
            <FormField label="Stock name" name="stockName" value={form.stockName} onChange={onChange} error={errors.stockName} required />
          </div>
          <div className="col-12 col-sm-4">
            <FormField label="Symbol" name="symbol" value={form.symbol} onChange={onChange} error={errors.symbol} required />
          </div>
          <div className="col-4">
            <FormField label="Quantity" name="quantity" type="number" min="1" step="1" value={form.quantity} onChange={onChange} error={errors.quantity} required />
          </div>
          <div className="col-4">
            <FormField label="Entry price" name="entryPrice" type="number" min="0" step="0.05" prefix="₹" value={form.entryPrice} onChange={onChange} error={errors.entryPrice} required />
          </div>
          <div className="col-4">
            <FormField label="Product" name="product">
              <select id="field-product" name="product" className="form-select" value={form.product} onChange={onChange}>
                <option value="MIS">MIS — Intraday</option>
                <option value="CNC">CNC — Delivery</option>
                <option value="NRML">NRML — Normal</option>
              </select>
            </FormField>
          </div>
        </div>
      </form>
    </Modal>
  );
};
