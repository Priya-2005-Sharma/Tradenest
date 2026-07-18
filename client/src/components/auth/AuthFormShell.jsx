/** Heading, optional error banner and form body shared by sign-in and signup. */
export const AuthFormShell = ({ title, subtitle, error, children, footer }) => (
  <div className="tn-fade-in">
    <h1 className="h3 mb-1">{title}</h1>
    <p className="text-muted small mb-4">{subtitle}</p>

    {error && (
      <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2" role="alert">
        <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
        {error}
      </div>
    )}

    {children}

    {footer && <p className="text-center text-muted small mt-4 mb-0">{footer}</p>}
  </div>
);

/** Submit button with the busy state every auth form uses. */
export const SubmitButton = ({ busy, busyLabel, children }) => (
  <button type="submit" className="btn btn-primary w-100 btn-lg mt-2" disabled={busy}>
    {busy ? (
      <>
        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
        {busyLabel}
      </>
    ) : (
      children
    )}
  </button>
);
