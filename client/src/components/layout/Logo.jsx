import { Link } from 'react-router-dom';

export const Logo = ({ to = '/', dark = false, size = 'md' }) => {
  const fontSize = size === 'sm' ? '1rem' : '1.125rem';
  const box = size === 'sm' ? 28 : 32;

  return (
    <Link to={to} className="d-inline-flex align-items-center gap-2 text-decoration-none">
      <span
        className="d-grid place-items-center flex-shrink-0"
        style={{
          width: box,
          height: box,
          borderRadius: 8,
          background: 'var(--tn-primary)',
          display: 'grid',
          placeItems: 'center',
        }}
        aria-hidden="true"
      >
        <i className="fa-solid fa-chart-line text-white" style={{ fontSize: '0.8125rem' }} />
      </span>
      <span
        className="fw-bold"
        style={{
          fontSize,
          letterSpacing: '-0.03em',
          color: dark ? '#fff' : 'var(--tn-ink)',
        }}
      >
        Trade<span style={{ color: 'var(--tn-primary)' }}>Nest</span>
      </span>
    </Link>
  );
};
