import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useAuth } from '../hooks/useAuth.js';

export const NotFound = () => {
  useDocumentTitle('Page not found');
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="text-center" style={{ maxWidth: 460 }}>
        <div
          className="mx-auto mb-4 d-grid"
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--tn-primary-subtle)',
            color: 'var(--tn-primary)',
            placeItems: 'center',
            fontSize: '1.75rem',
          }}
        >
          <i className="fa-solid fa-compass" aria-hidden="true" />
        </div>

        <h1 className="display-6 fw-bold mb-2" style={{ letterSpacing: '-0.03em' }}>404</h1>
        <h2 className="h5 mb-2">We could not find that page</h2>
        <p className="text-muted small mb-4">
          The link may be out of date, or the page may have moved.
        </p>

        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="btn btn-primary">
            <i className="fa-solid fa-arrow-left me-2" aria-hidden="true" />
            {isAuthenticated ? 'Back to dashboard' : 'Back home'}
          </Link>
          <Link to="/support" className="btn btn-light">Get help</Link>
        </div>
      </div>
    </div>
  );
};
