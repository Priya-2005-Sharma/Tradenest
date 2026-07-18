import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const SIZES = { sm: 'modal-sm', md: '', lg: 'modal-lg' };

/**
 * Accessible modal rendered through a portal. Handles Escape, focus capture,
 * and background scroll locking; Bootstrap's JS is not used.
 */
export const Modal = ({ open, onClose, title, size = 'md', footer, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog so keyboard and screen-reader users land in
    // the right place, and restore it to the trigger on close.
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => {
          // Only a press that both starts and ends on the backdrop closes.
          if (event.target === event.currentTarget) onClose?.();
        }}
      >
        <div className={`modal-dialog modal-dialog-centered ${SIZES[size] || ''}`}>
          <div
            className="modal-content border-0"
            style={{ borderRadius: 'var(--tn-radius-lg)', boxShadow: 'var(--tn-shadow-lg)' }}
            ref={dialogRef}
            tabIndex={-1}
          >
            <div className="modal-header border-bottom" style={{ borderColor: 'var(--tn-border)' }}>
              <h2 className="modal-title h6 mb-0">{title}</h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">{children}</div>
            {footer && (
              <div className="modal-footer border-top" style={{ borderColor: 'var(--tn-border)' }}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  busy = false,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <button type="button" className="btn btn-light" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button type="button" className={`btn btn-${variant}`} onClick={onConfirm} disabled={busy}>
          {busy ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
              Working…
            </>
          ) : (
            confirmLabel
          )}
        </button>
      </>
    }
  >
    <p className="mb-0 text-muted small">{message}</p>
  </Modal>
);
