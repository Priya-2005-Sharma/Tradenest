import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card, CardBody } from '../../components/ui/Card.jsx';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹0',
    cadence: 'free forever',
    tagline: 'Everything you need to explore the platform end to end.',
    features: [
      'Virtual capital on signup',
      'Watchlist with live simulated quotes',
      'Holdings with average cost basis',
      'Market and limit orders',
      'Positions — open and closed',
      'Funds: deposit, withdraw, history',
      'Full dashboard with growth chart',
    ],
    cta: 'Get started',
    to: '/register',
    variant: 'btn-outline-primary',
    highlighted: false,
  },
  {
    id: 'active',
    name: 'Active',
    price: '₹499',
    cadence: 'per month',
    tagline: 'For heavier use — deeper analytics and faster help.',
    features: [
      'Everything in Starter',
      'Advanced portfolio analytics',
      'Unlimited watchlists',
      'Extended order and P&L history',
      'Priority support queue',
    ],
    cta: 'Choose Active',
    to: '/register',
    variant: 'btn-primary',
    highlighted: true,
  },
  {
    id: 'institutional',
    name: 'Institutional',
    price: 'Custom',
    cadence: 'talk to us',
    tagline: 'For teams that need programmatic access and bespoke reporting.',
    features: [
      'Everything in Active',
      'API access',
      'Dedicated support contact',
      'Custom reporting',
      'Onboarding assistance',
    ],
    cta: 'Contact us',
    to: '/support',
    variant: 'btn-outline-primary',
    highlighted: false,
  },
];

// `null` renders a dash, `true` a tick, a string renders as-is.
const COMPARISON = [
  { feature: 'Virtual capital', starter: true, active: true, institutional: true },
  { feature: 'Dashboard & growth chart', starter: true, active: true, institutional: true },
  { feature: 'Holdings & cost basis', starter: true, active: true, institutional: true },
  { feature: 'Market & limit orders', starter: true, active: true, institutional: true },
  { feature: 'Positions & funds', starter: true, active: true, institutional: true },
  { feature: 'Watchlists', starter: '1', active: 'Unlimited', institutional: 'Unlimited' },
  { feature: 'Advanced analytics', starter: null, active: true, institutional: true },
  { feature: 'Extended history', starter: '90 days', active: 'Full', institutional: 'Full' },
  { feature: 'Support', starter: 'Email', active: 'Priority email', institutional: 'Dedicated contact' },
  { feature: 'API access', starter: null, active: null, institutional: true },
  { feature: 'Custom reporting', starter: null, active: null, institutional: true },
];

const FAQS = [
  {
    id: 'demo',
    question: 'Will I actually be charged anything?',
    answer:
      'No. TradeNest is a portfolio demonstration project and collects no payment of any kind. There is no payment processor connected, no card form, and no billing backend. The prices on this page describe how the product would be packaged if it were a real service — selecting a paid tier simply creates a normal free account.',
  },
  {
    id: 'money',
    question: 'Is any of the money real?',
    answer:
      'No. The capital in your account is virtual and issued by the app itself. Quotes come from a simulated market feed, not an exchange. TradeNest is not a registered broker, executes no real trades, and holds no client funds. Nothing here should be read as investment advice or as a prediction of real market outcomes.',
  },
  {
    id: 'starter-limits',
    question: 'Is the Starter tier limited in a way that makes it useless?',
    answer:
      'No. Starter includes every core feature the platform has: dashboard, watchlist, holdings, orders, positions, and funds. It is the tier the project is actually built around. The paid tiers describe additions on top, not a crippled core.',
  },
  {
    id: 'switch',
    question: 'Can I change tiers later?',
    answer:
      'In a real deployment, yes — up or down, at any time, with the change effective from the next billing cycle. In this demo, since no billing exists, tier selection has no practical effect on your account.',
  },
  {
    id: 'data',
    question: 'What happens to my data?',
    answer:
      'Your account, holdings, orders, and transaction history live in a MongoDB database for this project. Authentication uses a JWT stored in an HTTP-only cookie, and passwords are hashed with bcrypt. Because this is a demonstration environment, treat it as such — do not enter anything you would not be comfortable losing.',
  },
];

const Tick = () => (
  <>
    <i className="fa-solid fa-check" style={{ color: 'var(--tn-profit)' }} aria-hidden="true" />
    <span className="visually-hidden">Included</span>
  </>
);

const Dash = () => (
  <>
    <i className="fa-solid fa-minus" style={{ color: 'var(--tn-faint)' }} aria-hidden="true" />
    <span className="visually-hidden">Not included</span>
  </>
);

const renderCell = (value) => {
  if (value === true) return <Tick />;
  if (value === null) return <Dash />;
  return value;
};

export const Pricing = () => {
  useDocumentTitle('Pricing');

  // Bootstrap's JS bundle is not loaded in this project (see Modal.jsx), so the
  // accordion uses Bootstrap's classes but is driven from React state.
  const [openFaq, setOpenFaq] = useState(FAQS[0].id);

  return (
    <div className="tn-fade-in">
      <section className="tn-hero">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="tn-eyebrow mb-3">
                <i className="fa-solid fa-tag" aria-hidden="true" />
                Pricing
              </span>
              <h1 className="tn-display mb-3">Straightforward tiers, no surprises</h1>
              <p className="tn-lead mb-0">
                Three plans, stated plainly. Since TradeNest is a demonstration project, no payment is
                ever collected — the pricing below describes how the product would be packaged.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section tn-section-alt">
        <div className="container">
          <div className="row g-4 justify-content-center align-items-stretch">
            {TIERS.map((tier) => (
              <div className="col-12 col-md-6 col-lg-4" key={tier.id}>
                <Card
                  className="h-100 d-flex flex-column"
                  style={
                    tier.highlighted
                      ? { borderColor: 'var(--tn-primary)', borderWidth: '2px' }
                      : undefined
                  }
                >
                  <CardBody className="d-flex flex-column h-100 p-4">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                      <h2 className="h5 mb-0">{tier.name}</h2>
                      {tier.highlighted && (
                        <span className="tn-pill tn-pill-primary">
                          <i className="fa-solid fa-star" aria-hidden="true" />
                          Most popular
                        </span>
                      )}
                    </div>

                    <div className="d-flex align-items-baseline gap-2 mb-2">
                      <span className="tn-num" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--tn-ink)', letterSpacing: '-0.03em' }}>
                        {tier.price}
                      </span>
                      <span className="small" style={{ color: 'var(--tn-muted)' }}>
                        {tier.cadence}
                      </span>
                    </div>

                    <p className="small mb-4" style={{ color: 'var(--tn-muted)' }}>
                      {tier.tagline}
                    </p>

                    <ul className="list-unstyled mb-4 d-flex flex-column gap-2">
                      {tier.features.map((feature) => (
                        <li className="d-flex gap-2 small" key={feature}>
                          <i
                            className="fa-solid fa-check mt-1 flex-shrink-0"
                            style={{ color: 'var(--tn-profit)', fontSize: '0.6875rem' }}
                            aria-hidden="true"
                          />
                          <span style={{ color: 'var(--tn-body)' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={tier.to} className={`btn ${tier.variant} btn-lg w-100 mt-auto`}>
                      {tier.cta}
                    </Link>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>

          <div className="row justify-content-center mt-4">
            <div className="col-lg-8">
              <div
                className="d-flex gap-3 p-3 rounded"
                style={{ background: 'var(--tn-canvas)', border: '1px solid var(--tn-border)' }}
              >
                <i
                  className="fa-solid fa-circle-info mt-1 flex-shrink-0"
                  style={{ color: 'var(--tn-warning)' }}
                  aria-hidden="true"
                />
                <p className="small mb-0" style={{ color: 'var(--tn-muted)' }}>
                  <strong style={{ color: 'var(--tn-ink)' }}>This is a demo.</strong> No payment is
                  collected on any tier. There is no card form, no payment processor, and no billing
                  system behind these buttons — choosing a paid plan creates an ordinary free account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section">
        <div className="container">
          <div className="row justify-content-center text-center mb-4">
            <div className="col-lg-7">
              <h2 className="h3 mb-2">Compare the tiers</h2>
              <p className="tn-lead mb-0">Line by line, what each plan includes.</p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <Card>
                <div className="tn-table-wrap">
                  <table className="tn-table">
                    <caption className="visually-hidden">
                      Feature comparison across the Starter, Active, and Institutional plans
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Feature</th>
                        <th scope="col" className="text-center">Starter</th>
                        <th scope="col" className="text-center">Active</th>
                        <th scope="col" className="text-center">Institutional</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON.map((row) => (
                        <tr key={row.feature}>
                          <th scope="row" className="tn-symbol fw-semibold">{row.feature}</th>
                          <td className="text-center">{renderCell(row.starter)}</td>
                          <td className="text-center">{renderCell(row.active)}</td>
                          <td className="text-center">{renderCell(row.institutional)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section tn-section-alt">
        <div className="container">
          <div className="row justify-content-center text-center mb-4">
            <div className="col-lg-7">
              <h2 className="h3 mb-2">Questions about pricing</h2>
              <p className="tn-lead mb-0">The ones worth answering before you sign up.</p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="pricingFaq">
                {FAQS.map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div className="accordion-item" key={faq.id}>
                      <h3 className="accordion-header" id={`faq-heading-${faq.id}`}>
                        <button
                          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-collapse-${faq.id}`}
                        >
                          {faq.question}
                        </button>
                      </h3>
                      <div
                        id={`faq-collapse-${faq.id}`}
                        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                        aria-labelledby={`faq-heading-${faq.id}`}
                      >
                        <div className="accordion-body small" style={{ color: 'var(--tn-muted)' }}>
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-7">
              <h2 className="h3 mb-3">Start on Starter</h2>
              <p className="tn-lead mb-4">
                It is free, it is complete, and it takes about a minute to set up.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Open a demo account
                </Link>
                <Link to="/products" className="btn btn-outline-primary btn-lg">
                  See the features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
