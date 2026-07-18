export const EmptyState = ({ icon = 'fa-inbox', title, message, action }) => (
  <div className="tn-empty">
    <div className="tn-empty-icon">
      <i className={`fa-solid ${icon}`} aria-hidden="true" />
    </div>
    <h3 className="h6 mb-1">{title}</h3>
    {message && <p className="small text-muted mb-3 mx-auto" style={{ maxWidth: 380 }}>{message}</p>}
    {action}
  </div>
);
