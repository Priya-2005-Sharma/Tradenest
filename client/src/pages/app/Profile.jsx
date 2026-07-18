import { useCallback, useEffect, useMemo, useState } from 'react';
import { profileService } from '../../services/auth.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { useFormErrors } from '../../hooks/useFormErrors.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { ProfileCard } from '../../components/profile/ProfileCard.jsx';
import { ProfileDetailsForm } from '../../components/profile/ProfileDetailsForm.jsx';

const toForm = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  profileImage: user?.profileImage || '',
});

export const Profile = () => {
  useDocumentTitle('Profile');

  const { user, setUser } = useAuth();
  const toast = useToast();
  const { errors, setErrors, clearField, handleError } = useFormErrors();

  const [form, setForm] = useState(toForm(null));
  const [saving, setSaving] = useState(false);

  // Seed the form once the session user is available.
  useEffect(() => {
    if (user) setForm(toForm(user));
  }, [user]);

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
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const updated = await profileService.update({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        profileImage: form.profileImage.trim(),
      });
      setUser(updated);
      toast.success('Profile updated.');
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const dirty = useMemo(() => {
    if (!user) return false;
    const original = toForm(user);
    return Object.keys(original).some((key) => form[key] !== original[key]);
  }, [form, user]);

  // A broken image URL should degrade to initials, not a broken icon.
  const onImageError = useCallback(() => {
    setForm((current) => ({ ...current, profileImage: '' }));
  }, []);

  return (
    <div className="tn-fade-in">
      <PageHeader title="Profile" subtitle="Your account details." />

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <ProfileCard user={user} imageUrl={form.profileImage} onImageError={onImageError} />
        </div>

        <div className="col-12 col-lg-8">
          <ProfileDetailsForm
            form={form}
            errors={errors}
            onChange={onChange}
            onSubmit={submit}
            onDiscard={() => {
              setForm(toForm(user));
              setErrors({});
            }}
            saving={saving}
            dirty={dirty}
          />
        </div>
      </div>
    </div>
  );
};
