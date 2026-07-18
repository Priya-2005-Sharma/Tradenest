import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { FormField } from '../ui/FormField.jsx';
import { watchlistService } from '../../services/trading.service.js';
import { useToast } from '../../hooks/useToast.js';

/**
 * Edits the note on a watchlist entry. Owns its own form state and persistence
 * so the page only decides which item is being annotated.
 */
export const WatchlistNoteModal = ({ open, item, onClose, onSaved }) => {
  const toast = useToast();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNotes(item?.notes || '');
  }, [open, item]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await watchlistService.update(item._id, { notes });
      toast.success('Note saved.');
      onClose();
      onSaved();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Note on ${item?.symbol}`}
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="note-form" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save note'}
          </button>
        </>
      }
    >
      <form id="note-form" onSubmit={submit}>
        <FormField label="Your note" name="notes" hint="Up to 240 characters.">
          <textarea
            id="field-notes"
            className="form-control"
            rows={3}
            maxLength={240}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Why are you watching this stock?"
          />
        </FormField>
      </form>
    </Modal>
  );
};
