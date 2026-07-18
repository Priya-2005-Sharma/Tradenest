import { Link } from 'react-router-dom';
import { FOOTER_NAV } from '../../data/navigation.js';
import { Logo } from './Logo.jsx';

export const Footer = () => (
  <footer className="tn-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4">
          <Logo dark />
          <p className="small mt-3 mb-3" style={{ color: '#94a3b8', maxWidth: 320 }}>
            A modern platform for tracking equity portfolios, managing watchlists and
            understanding your returns — built for clarity.
          </p>
          <div className="d-flex gap-2">
            {['fa-x-twitter', 'fa-linkedin-in', 'fa-github', 'fa-youtube'].map((icon) => (
              <a
                key={icon}
                href="#"
                aria-label={icon.replace('fa-', '').replace('-in', '')}
                className="d-grid"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  placeItems: 'center',
                }}
              >
                <i className={`fa-brands ${icon}`} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_NAV.map((group) => (
          <div className="col-6 col-lg-2" key={group.title}>
            <h6>{group.title}</h6>
            <ul className="list-unstyled mb-0">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-6 col-lg-2">
          <h6>Contact</h6>
          <ul className="list-unstyled mb-0 small" style={{ color: '#94a3b8' }}>
            <li className="mb-1">
              <i className="fa-solid fa-envelope me-2" aria-hidden="true" />
              help@tradenest.app
            </li>
            <li className="mb-1">
              <i className="fa-solid fa-phone me-2" aria-hidden="true" />
              1800 200 4000
            </li>
            <li>
              <i className="fa-solid fa-location-dot me-2" aria-hidden="true" />
              Bengaluru, India
            </li>
          </ul>
        </div>
      </div>

      <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0 1.25rem' }} />

      {/* This is a portfolio project, not a broker — say so plainly rather than
          imitating regulatory boilerplate. */}
      <p className="mb-2" style={{ fontSize: '0.75rem', color: '#64748b' }}>
        TradeNest is a demonstration project built for a portfolio. It is not a registered broker,
        holds no client funds, and executes no real trades. All market data shown is simulated and
        must not be used for investment decisions.
      </p>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          © {new Date().getFullYear()} TradeNest. Built with the MERN stack.
        </span>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Simulated data · No real money · Educational use only
        </span>
      </div>
    </div>
  </footer>
);
