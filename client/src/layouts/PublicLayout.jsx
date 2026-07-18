import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';

export const PublicLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <PublicNavbar />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
