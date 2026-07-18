export const PositionTabs = ({ tab, onChange, openCount, closedCount }) => (
  <div className="btn-group btn-group-sm" role="group" aria-label="Filter positions">
    <button
      type="button"
      className={`btn ${tab === 'open' ? 'btn-primary' : 'btn-outline-primary'}`}
      onClick={() => onChange('open')}
      aria-pressed={tab === 'open'}
    >
      Open ({openCount})
    </button>
    <button
      type="button"
      className={`btn ${tab === 'closed' ? 'btn-primary' : 'btn-outline-primary'}`}
      onClick={() => onChange('closed')}
      aria-pressed={tab === 'closed'}
    >
      Closed ({closedCount})
    </button>
  </div>
);
