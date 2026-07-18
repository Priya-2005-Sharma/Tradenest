export const ErrorState = ({ error, onRetry, title = 'Something went wrong' }) => (
  <div className="tn-empty">
    <div className="tn-empty-icon" style={{ background: 'var(--tn-loss-light)', color: 'var(--tn-loss)' }}>
      <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
    </div>
    <h3 className="h6 mb-1">{title}</h3>
    <p className="small text-muted mb-3 mx-auto" style={{ maxWidth: 400 }}>
      {error?.message || 'An unexpected error occurred.'}
    </p>
    {onRetry && (
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={onRetry}>
        <i className="fa-solid fa-rotate-right me-2" aria-hidden="true" />
        Try again
      </button>
    )}
  </div>
);
