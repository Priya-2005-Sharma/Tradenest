import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PUBLIC_NAV } from '../../data/navigation.js';
import { Logo } from './Logo.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="tn-public-nav">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between" style={{ height: 'var(--tn-topbar-height)' }}>
          <Logo />

          <div className="d-none d-lg-flex align-items-center gap-4">
            {PUBLIC_NAV.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `small fw-semibold text-decoration-none ${isActive ? 'text-primary' : 'tn-link-muted'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="d-none d-lg-flex align-items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                Go to dashboard
                <i className="fa-solid fa-arrow-right ms-2" aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-light btn-sm">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Open an account</Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="btn btn-light d-lg-none"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
          </button>
        </div>

        {open && (
          <div className="d-lg-none pb-3 tn-fade-in">
            {PUBLIC_NAV.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `tn-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="tn-divider my-2" />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary w-100" onClick={() => setOpen(false)}>
                Go to dashboard
              </Link>
            ) : (
              <div className="d-grid gap-2">
                <Link to="/login" className="btn btn-light" onClick={() => setOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setOpen(false)}>Open an account</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
