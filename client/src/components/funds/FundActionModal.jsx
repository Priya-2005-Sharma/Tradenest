import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { FormField } from '../ui/FormField.jsx';
import { fundService } from '../../services/trading.service.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { useToast } from '../../hooks/useToast.js';
import { formatCurrency } from '../../utils/format.js';

const QUICK_AMOUNTS = [5000, 10_000, 25_000, 50_000];

/**
 * Deposits to or withdraws from the trading balance. Owns its own form state
 * and persistence so the page only decides which action is open.
 */
export const FundActionModal = ({ open, action, funds, onClose, onDone }) => {
  const toast = useToast();
  const { errors, setErrors, reset, handleError } = useFormErrors();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const balance = funds?.availableBalance ?? 0;

  useEffect(() => {
    if (!open) return;
    setAmount('');
    setNote('');
    reset();
  }, [open, action, reset]);

  const submit = async (event) => {
    event.preventDefault();

    const value = Number(amount);
    const next = {};
    if (!value || value <= 0) {
      next.amount = 'Enter an amount greater than zero.';
    } else if (action === 'withdraw' && value > balance) {
      next.amount = `You only have ${formatCurrency(balance)} available.`;
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const payload = { amount: value, note: note.trim() || undefined };
      if (action === 'deposit') {
        await fundService.deposit(payload);
        toast.success(`${formatCurrency(value)} added to your account.`);
      } else {
        await fundService.withdraw(payload);
        toast.success(`${formatCurrency(value)} withdrawn.`);
      }
      onClose();
      onDone();
    } catch (error) {
      // Whatever the API could not pin to a field still belongs on the amount
      // input — this form has nowhere else to show it.
      const message = handleError(error);
      if (message) setErrors({ amount: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={action === 'deposit' ? 'Add funds' : 'Withdraw funds'}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            type="submit"
            form="funds-form"
            className={`btn ${action === 'deposit' ? 'btn-buy' : 'btn-sell'}`}
            disabled={saving}
          >
            {saving ? 'Working…' : action === 'deposit' ? 'Add funds' : 'Withdraw'}
          </button>
        </>
      }
    >
      <form id="funds-form" onSubmit={submit} noValidate>
        <FormField
          label="Amount"
          name="amount"
          type="number"
          min="1"
          step="1"
          prefix="₹"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            reset();
          }}
          error={errors.amount}
          hint={action === 'withdraw' ? `Available: ${formatCurrency(balance)}` : undefined}
          required
        />

        <div className="d-flex flex-wrap gap-2 mb-3">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                setAmount(String(value));
                reset();
              }}
            >
              {formatCurrency(value, { compact: true })}
            </button>
          ))}
        </div>

        <FormField
          label="Note"
          name="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={action === 'deposit' ? 'Monthly top-up' : 'Profit booking'}
          hint="Optional."
        />
      </form>
    </Modal>
  );
};
