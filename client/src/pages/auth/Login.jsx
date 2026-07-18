import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { FormField } from '../../components/ui/FormField.jsx';
import { PasswordField } from '../../components/auth/PasswordField.jsx';
import { AuthFormShell, SubmitButton } from '../../components/auth/AuthFormShell.jsx';

export const Login = () => {
  useDocumentTitle('Sign in');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { errors, setErrors, clearField, handleError } = useFormErrors();

  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    clearField(name);
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Enter your email address.';
    if (!form.password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
      // Return them to wherever the guard intercepted them.
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      const message = handleError(error);
      if (message) setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormShell
      title="Sign in"
      subtitle="Welcome back. Pick up where you left off."
      error={formError}
      footer={
        <>
          New to TradeNest? <Link to="/register" className="fw-semibold">Open an account</Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate>
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

        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={onChange}
          error={errors.password}
          autoComplete="current-password"
          placeholder="Your password"
          required
        />

        <SubmitButton busy={submitting} busyLabel="Signing in…">Sign in</SubmitButton>
      </form>
    </AuthFormShell>
  );
};
