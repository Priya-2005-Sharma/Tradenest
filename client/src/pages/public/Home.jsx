import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { marketService } from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { MarketTicker } from '../../components/layout/MarketTicker.jsx';
import { Section } from '../../components/marketing/Section.jsx';
import { FeatureCard } from '../../components/marketing/FeatureCard.jsx';
import { CtaBanner } from '../../components/marketing/CtaBanner.jsx';
import { HeroSnapshot } from '../../components/marketing/HeroSnapshot.jsx';
import { MoversCard } from '../../components/dashboard/MoversCard.jsx';
import { HOME_FEATURES, HOME_STEPS, HOME_TRUST_POINTS } from '../../data/marketing.js';

export const Home = () => {
  useDocumentTitle();

  const { isAuthenticated } = useAuth();
  const fetcher = useCallback(() => marketService.overview(), []);
  const { data, loading } = useApi(fetcher);

  return (
    <div className="tn-fade-in">
      <MarketTicker />

      <section className="tn-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="tn-eyebrow mb-3">
                <i className="fa-solid fa-bolt" aria-hidden="true" />
                Simulated markets · Real mechanics
              </span>

              <h1 className="tn-display mb-3">
                Invest with <span style={{ color: 'var(--tn-primary)' }}>clarity</span>, not guesswork.
              </h1>

              <p className="tn-lead mb-4">
                TradeNest is a modern equity platform that makes your portfolio legible: every
                holding, every rupee of P&L, and exactly where your returns come from. Practise on a
                simulated market with ₹1,00,000 in virtual capital — no risk, no payment details.
              </p>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    Go to your dashboard
                    <i className="fa-solid fa-arrow-right ms-2" aria-hidden="true" />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Open a free account
                      <i className="fa-solid fa-arrow-right ms-2" aria-hidden="true" />
                    </Link>
                    <Link to="/products" className="btn btn-light btn-lg">
                      See what it does
                    </Link>
                  </>
                )}
              </div>

              <div className="d-flex flex-wrap gap-4">
                {HOME_TRUST_POINTS.map((point) => (
                  <span key={point.text} className="d-flex align-items-center gap-2 small text-muted">
                    <i className={`fa-solid ${point.icon}`} style={{ color: 'var(--tn-profit)' }} aria-hidden="true" />
                    {point.text}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              <HeroSnapshot indices={data?.indices} gainers={data?.gainers} loading={loading} />
            </div>
          </div>
        </div>
      </section>

      <Section
        alt
        eyebrow="Everything you need"
        title="Built for people who want to understand their money"
        lead="Not a wall of numbers — the specific answers you actually came for."
      >
        <div className="row g-4">
          {HOME_FEATURES.map((feature) => (
            <div className="col-md-6 col-lg-4" key={feature.title}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="How it works" title="From signup to first trade in minutes">
        <div className="row g-4">
          {HOME_STEPS.map((step) => (
            <div className="col-6 col-lg-3" key={step.number}>
              <div
                className="fw-bold mb-2"
                style={{ fontSize: '2rem', color: 'var(--tn-primary-light)', lineHeight: 1 }}
              >
                {step.number}
              </div>
              <h3 className="h6 mb-1">{step.title}</h3>
              <p className="small text-muted mb-0">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section alt title="Today's movers" lead="Simulated data, refreshed continuously.">
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <MoversCard title="Top gainers" icon="fa-arrow-trend-up" quotes={data?.gainers} loading={loading} />
          </div>
          <div className="col-12 col-lg-6">
            <MoversCard title="Top losers" icon="fa-arrow-trend-down" quotes={data?.losers} loading={loading} />
          </div>
        </div>
      </Section>

      <CtaBanner
        title="Start building your portfolio today"
        text="Free forever, no card, no risk. Just a clear view of how investing actually works."
        to={isAuthenticated ? '/dashboard' : '/register'}
        label={isAuthenticated ? 'Go to your dashboard' : 'Open your free account'}
      />
    </div>
  );
};
