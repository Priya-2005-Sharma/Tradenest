import { NavLink } from 'react-router-dom';
import { DASHBOARD_NAV } from '../../data/navigation.js';
import { Logo } from './Logo.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  return (
    <aside className={`tn-sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
      <div className="d-flex align-items-center justify-content-between px-3" style={{ height: 'var(--tn-topbar-height)', borderBottom: '1px solid var(--tn-border)' }}>
        <Logo to="/dashboard" />
        <button
          type="button"
          className="btn btn-sm btn-light d-lg-none"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </div>

      <nav className="tn-sidebar-nav">
        {DASHBOARD_NAV.map((group) => (
          <div key={group.section}>
            <div className="tn-nav-section">{group.section}</div>
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `tn-nav-link ${isActive ? 'active' : ''}`}
                // Navigating on mobile should dismiss the drawer.
                onClick={onClose}
              >
                <i className={`fa-solid ${link.icon}`} aria-hidden="true" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3" style={{ borderTop: '1px solid var(--tn-border)' }}>
        <NavLink to="/profile" className="d-flex align-items-center gap-2 text-decoration-none" onClick={onClose}>
          <Avatar name={user?.name} src={user?.profileImage} size={36} />
          <span className="min-w-0">
            <span className="d-block small fw-semibold text-truncate" style={{ color: 'var(--tn-ink)' }}>
              {user?.name}
            </span>
            <span className="d-block text-truncate text-muted" style={{ fontSize: '0.75rem' }}>
              {user?.email}
            </span>
          </span>
        </NavLink>
      </div>
    </aside>
  );
};
