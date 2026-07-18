const ORDER_STATUS = {
  EXECUTED: { className: 'tn-pill tn-pill-profit', icon: 'fa-circle-check', label: 'Executed' },
  PENDING: { className: 'tn-pill tn-pill-warning', icon: 'fa-clock', label: 'Pending' },
  CANCELLED: { className: 'tn-pill tn-pill-neutral', icon: 'fa-ban', label: 'Cancelled' },
  REJECTED: { className: 'tn-pill tn-pill-loss', icon: 'fa-circle-xmark', label: 'Rejected' },
  OPEN: { className: 'tn-pill tn-pill-primary', icon: 'fa-circle-dot', label: 'Open' },
  CLOSED: { className: 'tn-pill tn-pill-neutral', icon: 'fa-circle-check', label: 'Closed' },
};

export const StatusBadge = ({ status }) => {
  const config = ORDER_STATUS[status] || {
    className: 'tn-pill tn-pill-neutral',
    icon: 'fa-circle',
    label: status,
  };
  return (
    <span className={config.className}>
      <i className={`fa-solid ${config.icon}`} aria-hidden="true" />
      {config.label}
    </span>
  );
};

export const TypeBadge = ({ type }) => (
  <span className={`tn-pill ${type === 'BUY' ? 'tn-pill-profit' : 'tn-pill-loss'}`}>{type}</span>
);
