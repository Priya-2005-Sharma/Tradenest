import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { PasswordField } from '../auth/PasswordField.jsx';
import { PasswordChecklist } from '../auth/PasswordChecklist.jsx';
import { profileService } from '../../services/auth.service.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { passwordMeetsRules } from '../../utils/password.js';

const emptyForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

/**
 * Owns the password change end to end. `onChanged` fires only after the server
 * confirms — the caller uses it to sign out, since the server drops the session
 * cookie on success.
 */
export const ChangePasswordForm = ({ onChanged }) => {
  const { errors, setErrors, clearField, handleError } = useFormErrors();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    clearField(name);
  };

  const validate = () => {
    const next = {};
    if (!form.currentPassword) next.currentPassword = 'Enter your current password.';
    if (!passwordMeetsRules(form.newPassword)) {
      next.newPassword = 'Your new password does not meet the requirements.';
    }
    if (form.newPassword !== form.confirmPassword) {
      next.confirmPassword = 'The two passwords do not match.';
    }
    if (form.currentPassword && form.currentPassword === form.newPassword) {
      next.newPassword = 'Your new password must be different from the current one.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await profileService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      await onChanged();
    } catch (error) {
      const message = handleError(error);
      if (message) setErrors({ currentPassword: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Change password" icon="fa-lock" />
      <CardBody>
        <p className="text-muted small">
          Changing your password signs you out everywhere, including this device.
        </p>

        <form onSubmit={submit} noValidate>
          <PasswordField
            label="Current password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={onChange}
            error={errors.currentPassword}
            autoComplete="current-password"
            required
          />

          <PasswordField
            label="New password"
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
            error={errors.newPassword}
            autoComplete="new-password"
            required
          />

          <PasswordChecklist value={form.newPassword} />

          <PasswordField
            label="Confirm new password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Updating…
              </>
            ) : (
              'Change password'
            )}
          </button>
        </form>
      </CardBody>
    </Card>
  );
};
