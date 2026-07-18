import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { PageLoader } from '../components/ui/Loader.jsx';

/** Keeps signed-in users out of the login and register pages. */
export const PublicOnlyRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
