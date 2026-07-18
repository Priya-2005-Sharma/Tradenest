import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card, CardBody } from '../../components/ui/Card.jsx';

const STACK = [
  {
    layer: 'Frontend',
    icon: 'fa-react',
    brand: true,
    items: [
      'React 18 with functional components and hooks',
      'Vite for dev server and production builds',
      'React Router for routing, lazy-loaded route bundles',
      'Bootstrap 5 plus a small token-based design system',
      'Chart.js for the portfolio growth and allocation charts',
    ],
  },
  {
    layer: 'Backend',
    icon: 'fa-server',
    items: [
      'Node.js with Express for the REST API',
      'MongoDB with Mongoose schemas and validation',
      'Layered structure: routes, controllers, services, models',
      'Centralised error handling with typed API errors',
    ],
  },
  {
    layer: 'Auth & security',
    icon: 'fa-shield-halved',
    items: [
      'JWT issued on login, stored in an HTTP-only cookie',
      'Passwords hashed with bcrypt, never stored in plain text',
      'Route guards on the client, middleware checks on the server',
      'Server-side validation on every mutating endpoint',
    ],
  },
  {
    layer: 'Market data',
    icon: 'fa-wave-square',
    items: [
      'A simulated feed — quotes are generated, not sourced from an exchange',
      'Prices move on an interval so P&L is visibly live',
      'Orders fill against the simulated last-traded price',
      'Every rupee in the app is virtual capital',
    ],
  },
];

const PRINCIPLES = [
  {
    icon: 'fa-eye',
    title: 'Clarity over decoration',
    body:
      'A number is only useful if you know what it means. Every figure on the dashboard states its basis — day change versus overall change, realised versus unrealised — instead of collapsing everything into one ambiguous total.',
  },
  {
    icon: 'fa-scale-balanced',
    title: 'Honest about risk',
    body:
      'Gains and losses get the same visual weight. Red is not hidden below the fold or shrunk to a footnote. A portfolio view that only feels good when markets rise is not doing its job.',
  },
  {
    icon: 'fa-hand',
    title: 'No dark patterns',
    body:
      'No countdown timers, no fabricated scarcity, no nudges engineered to increase trade frequency. Nothing here is designed to make you act faster than you meant to.',
  },
  {
    icon: 'fa-code',
    title: 'Built to be read',
    body:
      'This is a portfolio project, so the code is part of the product. Predictable structure, small components, and comments that explain the reasoning rather than restate the syntax.',
  },
];

export const About = () => {
  useDocumentTitle('About');

  return (
    <div className="tn-fade-in">
      <section className="tn-hero">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="tn-eyebrow mb-3">
                <i className="fa-solid fa-flask" aria-hidden="true" />
                Portfolio project
              </span>
              <h1 className="tn-display mb-3">
                A demonstration of what a modern investing platform can look like
              </h1>
              <p className="tn-lead mb-0">
                TradeNest is a full-stack MERN application built to explore one question: why is it
                so hard to tell, at a glance, whether your portfolio is actually doing well? It runs
                on a simulated market feed. No real money moves through it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section tn-section-alt">
        <div className="container">
          <div className="row g-4 g-lg-5 align-items-start">
            <div className="col-lg-6">
              <h2 className="h3 mb-3">The problem it explores</h2>
              <p style={{ color: 'var(--tn-muted)' }}>
                Most retail brokerage screens are good at telling you what you own and bad at telling
                you how you are doing. Your position list shows a current value. Somewhere else, a
                day change. Somewhere else again, a total that quietly folds in the money you
                deposited last week, so a portfolio that lost value can still show a bigger number
                than yesterday.
              </p>
              <p style={{ color: 'var(--tn-muted)' }}>
                Making P&amp;L legible turns out to be mostly a modelling problem, not a design one.
                You need a real cost basis, a clean separation between deposits and returns, and a
                consistent answer to &ldquo;compared to what?&rdquo; TradeNest takes a position on
                each of those and then makes the interface follow from the model.
              </p>
              <p className="mb-0" style={{ color: 'var(--tn-muted)' }}>
                It is inspired by Zerodha Kite in spirit — dense, quiet, numbers-first — without
                copying its interface.
              </p>
            </div>

            <div className="col-lg-6">
              <Card>
                <CardBody>
                  <h3 className="h6 mb-3">What TradeNest decided</h3>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li className="d-flex gap-3">
                      <i
                        className="fa-solid fa-circle-check mt-1"
                        style={{ color: 'var(--tn-primary)' }}
                        aria-hidden="true"
                      />
                      <span>
                        <strong>Average cost basis per holding.</strong> Buying the same stock three
                        times produces one blended entry price, so unrealised P&amp;L means something.
                      </span>
                    </li>
                    <li className="d-flex gap-3">
                      <i
                        className="fa-solid fa-circle-check mt-1"
                        style={{ color: 'var(--tn-primary)' }}
                        aria-hidden="true"
                      />
                      <span>
                        <strong>Deposits are not returns.</strong> Adding funds moves your balance
                        but never your P&amp;L. The growth chart tracks performance, not cash flow.
                      </span>
                    </li>
                    <li className="d-flex gap-3">
                      <i
                        className="fa-solid fa-circle-check mt-1"
                        style={{ color: 'var(--tn-primary)' }}
                        aria-hidden="true"
                      />
                      <span>
                        <strong>Day and overall are always both shown.</strong> Never one without the
                        other, because either alone can flatter or frighten.
                      </span>
                    </li>
                    <li className="d-flex gap-3">
                      <i
                        className="fa-solid fa-circle-check mt-1"
                        style={{ color: 'var(--tn-primary)' }}
                        aria-hidden="true"
                      />
                      <span>
                        <strong>Closed positions keep their history.</strong> Realised P&amp;L stays
                        on the record instead of disappearing when you exit.
                      </span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-7">
              <span className="tn-eyebrow mb-3">
                <i className="fa-solid fa-screwdriver-wrench" aria-hidden="true" />
                Under the hood
              </span>
              <h2 className="h3 mb-2">How it is built</h2>
              <p className="tn-lead mb-0">
                A MERN stack, kept deliberately unexotic. The interesting parts are in the domain
                model, not the dependency list.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {STACK.map((group) => (
              <div className="col-12 col-md-6" key={group.layer}>
                <Card className="h-100" hover>
                  <CardBody>
                    <div className="tn-feature-icon">
                      <i
                        className={`${group.brand ? 'fa-brands' : 'fa-solid'} ${group.icon}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="h6 mb-3">{group.layer}</h3>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                      {group.items.map((item) => (
                        <li className="d-flex gap-2 small" key={item}>
                          <i
                            className="fa-solid fa-minus mt-1"
                            style={{ color: 'var(--tn-faint)', fontSize: '0.625rem' }}
                            aria-hidden="true"
                          />
                          <span style={{ color: 'var(--tn-muted)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tn-section tn-section-alt">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-7">
              <h2 className="h3 mb-2">Principles</h2>
              <p className="tn-lead mb-0">
                Four rules the interface is held to. They are easier to state than to keep.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {PRINCIPLES.map((principle) => (
              <div className="col-12 col-md-6" key={principle.title}>
                <div className="d-flex gap-3">
                  <div className="tn-feature-icon flex-shrink-0 mb-0">
                    <i className={`fa-solid ${principle.icon}`} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="h6 mb-2">{principle.title}</h3>
                    <p className="small mb-0" style={{ color: 'var(--tn-muted)' }}>
                      {principle.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tn-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <Card>
                <CardBody className="p-4 p-lg-5">
                  <div className="d-flex gap-3 mb-3">
                    <i
                      className="fa-solid fa-triangle-exclamation mt-1"
                      style={{ color: 'var(--tn-warning)', fontSize: '1.25rem' }}
                      aria-hidden="true"
                    />
                    <h2 className="h5 mb-0">What TradeNest is not</h2>
                  </div>
                  <p style={{ color: 'var(--tn-muted)' }}>
                    TradeNest is <strong>not a registered broker</strong> and is not registered with
                    SEBI or any other regulator. It is not a member of any exchange. It executes{' '}
                    <strong>no real trades</strong>, holds no client funds, and provides no
                    investment advice.
                  </p>
                  <p className="mb-0" style={{ color: 'var(--tn-muted)' }}>
                    Every quote you see is generated by a simulated feed. Every balance is virtual
                    capital issued by the app itself. Nothing on this platform reflects real market
                    prices, and no outcome here predicts or represents a real investment result. It
                    exists to demonstrate software engineering, not to manage money.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section tn-section-alt">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-7">
              <h2 className="h3 mb-3">Have a look around</h2>
              <p className="tn-lead mb-4">
                Create an account, get virtual capital, and put the dashboard through its paces.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Open a demo account
                </Link>
                <Link to="/products" className="btn btn-outline-primary btn-lg">
                  See what it does
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
