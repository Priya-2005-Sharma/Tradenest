import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { Avatar } from '../ui/Avatar.jsx';
import { NotificationBell } from './NotificationBell.jsx';
import { StockSearch } from '../trading/StockSearch.jsx';

export const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    toast.success('Signed out. See you soon.');
    navigate('/login');
  };

  return (
    <header className="tn-topbar">
      <button
        type="button"
        className="btn btn-light d-lg-none"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <i className="fa-solid fa-bars" aria-hidden="true" />
      </button>

      {/* The global search is the primary way into any stock, so it gets the
          most horizontal room the breakpoint allows. */}
      <div className="flex-grow-1" style={{ maxWidth: 420 }}>
        <StockSearch onSelect={(quote) => navigate(`/stocks/${quote.symbol}`)} />
      </div>

      <div className="ms-auto d-flex align-items-center gap-2">
        <NotificationBell />

        <div className="position-relative">
          <button
            type="button"
            className="btn btn-light d-flex align-items-center gap-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Account menu"
          >
            <Avatar name={user?.name} src={user?.profileImage} size={24} />
            <span className="d-none d-md-inline small fw-semibold">{user?.name?.split(' ')[0]}</span>
            <i className="fa-solid fa-chevron-down d-none d-md-inline" style={{ fontSize: '0.625rem' }} aria-hidden="true" />
          </button>

          {menuOpen && (
            <>
              {/* Click-away layer keeps the menu logic here instead of a
                  document listener. */}
              <div className="position-fixed inset-0" style={{ inset: 0, zIndex: 1040 }} onClick={() => setMenuOpen(false)} />
              <div
                className="tn-card position-absolute end-0 mt-2 tn-fade-in"
                style={{ width: 200, zIndex: 1050, boxShadow: 'var(--tn-shadow-lg)' }}
              >
                <div className="p-3" style={{ borderBottom: '1px solid var(--tn-border)' }}>
                  <div className="small fw-semibold text-truncate" style={{ color: 'var(--tn-ink)' }}>{user?.name}</div>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                </div>
                <div className="p-2">
                  {[
                    { to: '/profile', icon: 'fa-user', label: 'Profile' },
                    { to: '/settings', icon: 'fa-gear', label: 'Settings' },
                    { to: '/funds', icon: 'fa-wallet', label: 'Funds' },
                  ].map((item) => (
                    <button
                      key={item.to}
                      type="button"
                      className="tn-nav-link w-100 border-0 bg-transparent text-start"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(item.to);
                      }}
                    >
                      <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <hr className="tn-divider my-1" />
                  <button
                    type="button"
                    className="tn-nav-link w-100 border-0 bg-transparent text-start text-danger"
                    onClick={onLogout}
                  >
                    <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
