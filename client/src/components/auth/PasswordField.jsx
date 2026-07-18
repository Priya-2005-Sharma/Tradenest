import { useState } from 'react';
import { FormField } from '../ui/FormField.jsx';

/** Password input with a show/hide toggle. */
export const PasswordField = ({
  label,
  name,
  value,
  onChange,
  error,
  autoComplete = 'current-password',
  placeholder,
  required = false,
}) => {
  const [visible, setVisible] = useState(false);
  const inputId = `field-${name}`;

  return (
    <FormField label={label} name={name} error={error} required={required}>
      <div className="input-group has-validation">
        <input
          id={inputId}
          name={name}
          type={visible ? 'text' : 'password'}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          // Skipped in the tab order so it never sits between the field and submit.
          tabIndex={-1}
        >
          <i className={`fa-regular ${visible ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
        </button>
        {error && (
          <div className="invalid-feedback" id={`${inputId}-error`}>
            {error}
          </div>
        )}
      </div>
    </FormField>
  );
};
