import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { ChangePasswordForm } from '../../components/settings/ChangePasswordForm.jsx';
import { SecurityCard } from '../../components/settings/SecurityCard.jsx';
import { SessionCard } from '../../components/settings/SessionCard.jsx';

export const Settings = () => {
  useDocumentTitle('Settings');

  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const signOut = async (message) => {
    await logout();
    toast.success(message);
    navigate('/login', { replace: true });
  };

  return (
    <div className="tn-fade-in">
      <PageHeader title="Settings" subtitle="Security and preferences for your account." />

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          {/* The server clears the session cookie on a password change, so the
              only correct next step is a fresh sign-in. */}
          <ChangePasswordForm
            onChanged={() => signOut('Password changed. Please sign in again.')}
          />
        </div>

        <div className="col-12 col-lg-5">
          <SecurityCard />
          <SessionCard onSignOut={() => signOut('Signed out.')} />
        </div>
      </div>
    </div>
  );
};
