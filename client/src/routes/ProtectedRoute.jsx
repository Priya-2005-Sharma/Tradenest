import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { PageLoader } from '../components/ui/Loader.jsx';

/**
 * Gate for authenticated areas. Rendering must wait for the session probe —
 * deciding while `loading` is true would bounce a signed-in user to /login on
 * every refresh.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader label="Restoring your session…" />;

  // Remember where they were headed so login can return them there.
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
};
