/**
 * Labelled input wired for Bootstrap validation display. `error` renders the
 * server- or client-side message for this specific field.
 */
export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  prefix,
  required = false,
  disabled = false,
  autoComplete,
  placeholder,
  min,
  step,
  children,
}) => {
  const inputId = `field-${name}`;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  const control = children || (
    <input
      id={inputId}
      name={name}
      type={type}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      value={value ?? ''}
      onChange={onChange}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      placeholder={placeholder}
      min={min}
      step={step}
      aria-describedby={describedBy}
      aria-invalid={Boolean(error)}
    />
  );

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
          {required && <span className="text-danger ms-1" aria-hidden="true">*</span>}
        </label>
      )}
      {prefix ? (
        <div className="input-group has-validation">
          <span className="input-group-text">{prefix}</span>
          {control}
          {error && (
            <div className="invalid-feedback" id={`${inputId}-error`}>
              {error}
            </div>
          )}
        </div>
      ) : (
        <>
          {control}
          {/* A custom control renders its own feedback — Bootstrap only shows
              .invalid-feedback next to an .is-invalid sibling, so an input group
              has to carry it internally. Emitting one here too would duplicate
              the message in the accessibility tree. */}
          {error && !children && (
            <div className="invalid-feedback" id={`${inputId}-error`}>
              {error}
            </div>
          )}
        </>
      )}
      {hint && !error && (
        <div className="form-text" id={`${inputId}-hint`}>
          {hint}
        </div>
      )}
    </div>
  );
};
