import { useCallback, useEffect, useRef, useState } from 'react';
import { notificationService } from '../../services/trading.service.js';
import { formatRelativeTime } from '../../utils/format.js';

const ICONS = {
  ORDER: 'fa-receipt',
  FUNDS: 'fa-wallet',
  ALERT: 'fa-bell',
  SYSTEM: 'fa-circle-info',
};

export const NotificationBell = () => {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const { notifications, unreadCount } = await notificationService.list();
      setItems(notifications);
      setUnread(unreadCount);
    } catch {
      // A failing bell must never break the page it sits on.
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) load();
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setItems((current) => current.map((item) => ({ ...item, read: true })));
      setUnread(0);
    } catch {
      // Non-critical.
    }
  };

  return (
    <div className="position-relative" ref={containerRef}>
      <button
        type="button"
        className="btn btn-light position-relative"
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
      >
        <i className="fa-regular fa-bell" aria-hidden="true" />
        {unread > 0 && (
          <span
            className="position-absolute translate-middle badge rounded-pill bg-danger"
            style={{ top: 4, left: '80%', fontSize: '0.625rem' }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="tn-card position-absolute end-0 mt-2 tn-fade-in"
          style={{ width: 'min(340px, calc(100vw - 2rem))', zIndex: 1050, boxShadow: 'var(--tn-shadow-lg)' }}
        >
          <div className="tn-card-header">
            <h3 className="tn-card-title">Notifications</h3>
            {unread > 0 && (
              <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {items.length === 0 ? (
              <p className="text-muted small text-center py-4 mb-0">You have no notifications.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="d-flex gap-2 p-3"
                  style={{
                    borderBottom: '1px solid var(--tn-border)',
                    background: item.read ? 'transparent' : 'var(--tn-primary-subtle)',
                  }}
                >
                  <i
                    className={`fa-solid ${ICONS[item.type] || ICONS.SYSTEM} text-primary mt-1`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="small fw-semibold" style={{ color: 'var(--tn-ink)' }}>
                      {item.title}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {item.message}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.6875rem' }}>
                      {formatRelativeTime(item.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
