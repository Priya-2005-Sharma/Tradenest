import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { FormField } from '../ui/FormField.jsx';
import { StockSearch } from '../trading/StockSearch.jsx';
import { holdingService } from '../../services/trading.service.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { useToast } from '../../hooks/useToast.js';

const emptyForm = {
  stockName: '',
  symbol: '',
  quantity: '',
  buyPrice: '',
  sector: '',
  datePurchased: new Date().toISOString().slice(0, 10),
};

const toForm = (holding) => ({
  stockName: holding.stockName,
  symbol: holding.symbol,
  quantity: String(holding.quantity),
  buyPrice: String(holding.buyPrice),
  sector: holding.sector || '',
  datePurchased: new Date(holding.datePurchased).toISOString().slice(0, 10),
});

/**
 * Creates or edits a holding. Owns its own form state and persistence so the
 * page only decides when it is open and what to do after it saves.
 *
 * `holding` null means create.
 */
export const HoldingFormModal = ({ open, holding, onClose, onSaved }) => {
  const toast = useToast();
  const { errors, clearField, reset, handleError, setErrors } = useFormErrors();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(holding ? toForm(holding) : emptyForm);
    reset();
  }, [open, holding, reset]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    clearField(name);
  };

  const validate = () => {
    const next = {};
    if (!form.stockName.trim()) next.stockName = 'Pick a stock or enter a name.';
    if (!form.symbol.trim()) next.symbol = 'Symbol is required.';
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) {
      next.quantity = 'Enter a whole number of shares, at least 1.';
    }
    if (!Number(form.buyPrice) || Number(form.buyPrice) <= 0) {
      next.buyPrice = 'Enter the price you paid per share.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const payload = {
      stockName: form.stockName.trim(),
      symbol: form.symbol.trim().toUpperCase(),
      quantity: Number(form.quantity),
      buyPrice: Number(form.buyPrice),
      sector: form.sector.trim() || undefined,
      datePurchased: form.datePurchased,
    };

    try {
      if (holding) {
        await holdingService.update(holding._id, payload);
        toast.success(`${payload.symbol} updated.`);
      } else {
        await holdingService.create(payload);
        toast.success(`${payload.symbol} added to your holdings.`);
      }
      onSaved();
      onClose();
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
      title={holding ? `Edit ${holding.symbol}` : 'Add holding'}
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="holding-form" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Saving…
              </>
            ) : holding ? (
              'Save changes'
            ) : (
              'Add holding'
            )}
          </button>
        </>
      }
    >
      <form id="holding-form" onSubmit={submit} noValidate>
        {!holding && (
          <div className="mb-3">
            <label className="form-label" htmlFor="holding-search">Find a stock</label>
            <StockSearch
              onSelect={(quote) =>
                setForm((current) => ({
                  ...current,
                  stockName: quote.stockName,
                  symbol: quote.symbol,
                  sector: quote.sector,
                  buyPrice: current.buyPrice || String(quote.lastPrice),
                }))
              }
              placeholder="Search by name or symbol…"
            />
            <div className="form-text">Or type the details in manually below.</div>
          </div>
        )}

        <div className="row g-3">
          <div className="col-12 col-sm-8">
            <FormField label="Stock name" name="stockName" value={form.stockName} onChange={onChange} error={errors.stockName} required />
          </div>
          <div className="col-12 col-sm-4">
            <FormField label="Symbol" name="symbol" value={form.symbol} onChange={onChange} error={errors.symbol} required />
          </div>
          <div className="col-6">
            <FormField label="Quantity" name="quantity" type="number" min="1" step="1" value={form.quantity} onChange={onChange} error={errors.quantity} required />
          </div>
          <div className="col-6">
            <FormField label="Buy price" name="buyPrice" type="number" min="0" step="0.05" prefix="₹" value={form.buyPrice} onChange={onChange} error={errors.buyPrice} required />
          </div>
          <div className="col-6">
            <FormField label="Sector" name="sector" value={form.sector} onChange={onChange} error={errors.sector} />
          </div>
          <div className="col-6">
            <FormField label="Date purchased" name="datePurchased" type="date" value={form.datePurchased} onChange={onChange} error={errors.datePurchased} />
          </div>
        </div>
      </form>
    </Modal>
  );
};
