import { passwordChecks } from '../../utils/password.js';

/**
 * Live password requirements. `showStrength` adds the progress bar used at
 * signup, where the rules are new to the reader.
 */
export const PasswordChecklist = ({ value, showStrength = false }) => {
  if (!value) return null;

  const checks = passwordChecks(value);
  const met = checks.filter((check) => check.ok).length;
  const barClass = met === 3 ? 'bg-success' : met === 2 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="mb-3">
      {showStrength && (
        <div className="progress mb-2" style={{ height: 4 }}>
          <div
            className={`progress-bar ${barClass}`}
            style={{ width: `${(met / checks.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={met}
            aria-valuemin={0}
            aria-valuemax={checks.length}
            aria-label="Password strength"
          />
        </div>
      )}
      <ul className="list-unstyled mb-0">
        {checks.map((check) => (
          <li
            key={check.label}
            className={`small ${check.ok ? 'tn-profit' : 'text-muted'}`}
            style={{ fontSize: '0.75rem' }}
          >
            <i
              className={`fa-solid ${check.ok ? 'fa-circle-check' : 'fa-circle'} me-2`}
              style={{ fontSize: '0.625rem' }}
              aria-hidden="true"
            />
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
