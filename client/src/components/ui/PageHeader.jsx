export const PageHeader = ({ title, subtitle, action }) => (
  <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
    <div className="min-w-0">
      <h1 className="h4 mb-1">{title}</h1>
      {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
    </div>
    {action && <div className="d-flex gap-2 flex-shrink-0">{action}</div>}
  </div>
);
