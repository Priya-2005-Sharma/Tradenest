import { useCallback, useState } from 'react';
import { fieldErrorsFrom } from '../utils/formErrors.js';

/**
 * Form error state plus the one rule every form here shares: field-level
 * problems from the API belong on their inputs, and anything else is a single
 * message the caller decides how to surface (toast, or inline alert).
 *
 * `handleError` returns that leftover message, or null when the error was
 * fully mapped onto fields.
 */
export const useFormErrors = (initial = {}) => {
  const [errors, setErrors] = useState(initial);

  const clearField = useCallback((name) => {
    setErrors((current) => ({ ...current, [name]: undefined }));
  }, []);

  const reset = useCallback(() => setErrors({}), []);

  const handleError = useCallback((error) => {
    const fields = fieldErrorsFrom(error);
    if (fields) {
      setErrors(fields);
      return null;
    }
    return error?.message || 'Something went wrong. Please try again.';
  }, []);

  return { errors, setErrors, clearField, reset, handleError };
};
