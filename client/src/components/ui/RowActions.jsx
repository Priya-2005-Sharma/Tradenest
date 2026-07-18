/**
 * Icon buttons for a table row. Every action needs an accessible label, since
 * an icon-only button is unreadable to a screen reader.
 *
 * actions: [{ icon, label, onClick, variant?, danger?, hidden? }]
 */
export const RowActions = ({ actions = [] }) => (
  <div className="d-flex gap-1 justify-content-end">
    {actions
      .filter((action) => !action.hidden)
      .map((action) =>
        action.variant ? (
          <button
            key={action.label}
            type="button"
            className={`btn btn-sm ${action.variant}`}
            onClick={action.onClick}
            title={action.title}
            disabled={action.disabled}
          >
            {action.text || action.label}
          </button>
        ) : (
          <button
            key={action.label}
            type="button"
            className={`btn btn-sm btn-light ${action.danger ? 'text-danger' : ''}`}
            onClick={action.onClick}
            aria-label={action.label}
            title={action.title || action.label}
            disabled={action.disabled}
          >
            <i className={`fa-solid ${action.icon}`} aria-hidden="true" />
          </button>
        ),
      )}
  </div>
);
