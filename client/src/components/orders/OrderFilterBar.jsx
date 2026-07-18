const FILTERS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'EXECUTED', label: 'Executed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const OrderFilterBar = ({ value, onChange }) => (
  <div className="btn-group btn-group-sm flex-wrap" role="group" aria-label="Filter orders by status">
    {FILTERS.map((option) => (
      <button
        key={option.value || 'all'}
        type="button"
        className={`btn ${value === option.value ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
      >
        {option.label}
      </button>
    ))}
  </div>
);
