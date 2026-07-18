import { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react';

export const ToastContext = createContext(null);

const VARIANTS = {
  success: { icon: 'fa-circle-check', className: 'text-bg-success' },
  error: { icon: 'fa-circle-exclamation', className: 'text-bg-danger' },
  info: { icon: 'fa-circle-info', className: 'text-bg-primary' },
  warning: { icon: 'fa-triangle-exclamation', className: 'text-bg-warning' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, variant = 'info', duration = 4000) => {
      idRef.current += 1;
      const id = idRef.current;
      setToasts((current) => [...current, { id, message, variant }]);
      timersRef.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
      return id;
    },
    [dismiss],
  );

  // Any toast still pending when the provider unmounts would otherwise leak
  // its timer.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      toast: push,
      success: (m) => push(m, 'success'),
      error: (m) => push(m, 'error', 6000),
      info: (m) => push(m, 'info'),
      warning: (m) => push(m, 'warning'),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="tn-toast-stack" role="status" aria-live="polite">
        {toasts.map(({ id, message, variant }) => {
          const { icon, className } = VARIANTS[variant] || VARIANTS.info;
          return (
            <div key={id} className={`toast show align-items-center border-0 ${className}`}>
              <div className="d-flex">
                <div className="toast-body d-flex align-items-center gap-2">
                  <i className={`fa-solid ${icon}`} aria-hidden="true" />
                  <span>{message}</span>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
