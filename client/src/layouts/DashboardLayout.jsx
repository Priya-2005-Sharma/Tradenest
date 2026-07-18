import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { Topbar } from '../components/layout/Topbar.jsx';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="tn-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop only exists while the mobile drawer is open. */}
      {sidebarOpen && (
        <div
          className="tn-backdrop d-lg-none"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="tn-main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="tn-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
