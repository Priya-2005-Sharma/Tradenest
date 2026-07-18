import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../components/layout/Logo.jsx';

const HIGHLIGHTS = [
  { icon: 'fa-chart-line', title: 'Live portfolio tracking', text: 'Day and overall P&L recalculated on every quote.' },
  { icon: 'fa-star', title: 'Watchlists that keep up', text: 'Follow the names you care about with live prices.' },
  { icon: 'fa-shield-halved', title: 'Secure by default', text: 'Hashed passwords and HTTP-only session cookies.' },
];

/** Split layout: brand story on the left, the form on the right. */
export const AuthLayout = () => (
  <div className="min-vh-100 d-flex">
    <div
      className="d-none d-lg-flex flex-column justify-content-between p-5 text-white"
      style={{
        width: '44%',
        background: 'linear-gradient(150deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)',
      }}
    >
      <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none text-white">
        <i className="fa-solid fa-chart-line" aria-hidden="true" />
        <span className="fw-bold" style={{ fontSize: '1.125rem', letterSpacing: '-0.03em' }}>TradeNest</span>
      </Link>

      <div>
        <h2 className="text-white fw-bold mb-3" style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>
          Invest with clarity.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 380 }}>
          Track every holding, understand every rupee of P&L, and trade a simulated market
          without risking a paisa.
        </p>

        <div className="mt-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="d-flex gap-3 mb-3">
              <div
                className="d-grid flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.15)',
                  placeItems: 'center',
                }}
              >
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              </div>
              <div>
                <div className="fw-semibold small text-white">{item.title}</div>
                <div className="small" style={{ color: 'rgba(255,255,255,0.75)' }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Simulated market data. A portfolio project, not a real broker.
      </p>
    </div>

    <div className="flex-grow-1 d-flex flex-column">
      <div className="d-lg-none p-3 border-bottom">
        <Logo />
      </div>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3 p-sm-4">
        <div className="w-100" style={{ maxWidth: 420 }}>
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);
