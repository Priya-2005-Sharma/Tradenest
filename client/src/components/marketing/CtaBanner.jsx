import { Link } from 'react-router-dom';

export const CtaBanner = ({ title, text, to, label }) => (
  <section className="tn-section">
    <div className="container">
      <div
        className="p-4 p-lg-5 text-center"
        style={{
          borderRadius: 'var(--tn-radius-xl)',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        }}
      >
        <h2 className="text-white mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
          {title}
        </h2>
        <p className="mb-4 mx-auto" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 520 }}>
          {text}
        </p>
        <Link to={to} className="btn btn-light btn-lg">
          {label}
          <i className="fa-solid fa-arrow-right ms-2" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);
