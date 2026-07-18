import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { FormField } from '../ui/FormField.jsx';
import { orderService } from '../../services/trading.service.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { useToast } from '../../hooks/useToast.js';

/**
 * Modifies a pending order. Owns its own form state and persistence so the page
 * only decides when it is open and what to do after it saves.
 */
export const OrderEditModal = ({ open, order, onClose, onSaved }) => {
  const toast = useToast();
  const { errors, setErrors, reset, handleError } = useFormErrors();
  const [form, setForm] = useState({ quantity: '', price: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !order) return;
    setForm({ quantity: String(order.quantity), price: String(order.price) });
    reset();
  }, [open, order, reset]);

  const validate = () => {
    const next = {};
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) {
      next.quantity = 'Enter a whole number of shares, at least 1.';
    }
    if (!Number(form.price) || Number(form.price) <= 0) next.price = 'Enter a price.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await orderService.update(order._id, {
        quantity: Number(form.quantity),
        price: Number(form.price),
      });
      toast.success('Order updated.');
      onClose();
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
      title={`Modify ${order?.symbol} order`}
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="edit-order-form" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </>
      }
    >
      <form id="edit-order-form" onSubmit={submit} noValidate>
        <p className="text-muted small">
          Only pending orders can be modified.
        </p>
        <div className="row g-3">
          <div className="col-6">
            <FormField
              label="Quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={(e) => setForm((c) => ({ ...c, quantity: e.target.value }))}
              error={errors.quantity}
              required
            />
          </div>
          <div className="col-6">
            <FormField
              label="Price"
              name="price"
              type="number"
              min="0"
              step="0.05"
              prefix="₹"
              value={form.price}
              onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))}
              error={errors.price}
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
