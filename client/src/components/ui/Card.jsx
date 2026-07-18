export const Card = ({ className = '', hover = false, children, ...rest }) => (
  <div className={`tn-card ${hover ? 'tn-card-hover' : ''} ${className}`} {...rest}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action, icon }) => (
  <div className="tn-card-header">
    <div className="d-flex align-items-center gap-2 min-w-0">
      {icon && <i className={`fa-solid ${icon} text-primary`} aria-hidden="true" />}
      <div className="min-w-0">
        <h2 className="tn-card-title text-truncate">{title}</h2>
        {subtitle && <div className="small text-muted text-truncate">{subtitle}</div>}
      </div>
    </div>
    {action}
  </div>
);

export const CardBody = ({ className = '', children }) => (
  <div className={`tn-card-body ${className}`}>{children}</div>
);
