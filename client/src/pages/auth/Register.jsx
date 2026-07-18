import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { FormField } from '../../components/ui/FormField.jsx';
import { PasswordField } from '../../components/auth/PasswordField.jsx';
import { PasswordChecklist } from '../../components/auth/PasswordChecklist.jsx';
import { AuthFormShell, SubmitButton } from '../../components/auth/AuthFormShell.jsx';
import { passwordMeetsRules } from '../../utils/password.js';

export const Register = () => {
  useDocumentTitle('Open an account');

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { errors, setErrors, clearField, handleError } = useFormErrors();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    clearField(name);
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.phone && !/^[0-9+\-\s()]{7,20}$/.test(form.phone)) {
      next.phone = 'Enter a valid phone number, or leave it blank.';
    }
    if (!passwordMeetsRules(form.password)) {
      next.password = 'Your password does not meet the requirements below.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await register({
        ...form,
        // Send undefined rather than '' so the optional field validates cleanly.
        phone: form.phone.trim() || undefined,
      });
      toast.success(
        `Welcome to TradeNest, ${user.name.split(' ')[0]}. Your account is funded with ₹1,00,000 in virtual capital.`,
      );
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = handleError(error);
      if (message) setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormShell
      title="Open an account"
      subtitle="Free to start. You get ₹1,00,000 in virtual capital to trade with."
      error={formError}
      footer={
        <>
          Already have an account? <Link to="/login" className="fw-semibold">Sign in</Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate>
        <FormField
          label="Full name"
          name="name"
          value={form.name}
          onChange={onChange}
          error={errors.name}
          autoComplete="name"
          placeholder="Priya Sharma"
          required
        />

        <FormField
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.com"
          required
        />

        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          error={errors.phone}
          autoComplete="tel"
          placeholder="9876543210"
          hint="Optional."
        />

        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={onChange}
          error={errors.password}
          autoComplete="new-password"
          placeholder="Create a password"
          required
        />

        <PasswordChecklist value={form.password} showStrength />

        <SubmitButton busy={submitting} busyLabel="Creating your account…">Create account</SubmitButton>
      </form>
    </AuthFormShell>
  );
};
