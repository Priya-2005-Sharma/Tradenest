import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card, CardBody } from '../../components/ui/Card.jsx';

const FEATURES = [
  {
    icon: 'fa-gauge-high',
    title: 'Dashboard',
    summary: 'Everything that matters about your portfolio on one screen, in one glance.',
    points: [
      'Total portfolio value with day change and overall change shown side by side',
      'Growth chart tracking performance over time — deposits never inflate the line',
      'Sector allocation breakdown so concentration is visible before it bites',
      'Top gainers and losers from your own holdings, not a generic market list',
      'Market news feed alongside your numbers',
    ],
  },
  {
    icon: 'fa-star',
    title: 'Watchlist',
    summary: 'Track the stocks you are thinking about before you commit capital.',
    points: [
      'Add or remove any instrument in the simulated universe',
      'Live simulated quotes that tick while you watch',
      'Last price, change, and percentage change per row',
      'Jump straight from a watchlist row into an order ticket',
    ],
  },
  {
    icon: 'fa-layer-group',
    title: 'Holdings',
    summary: 'Your long-term book, with a cost basis that actually holds up.',
    points: [
      'Full create, read, update, and delete control over your holdings',
      'Average cost basis blended across every buy in the same symbol',
      'Current value, invested value, and unrealised P&L per holding',
      'Quantity and price recalculated automatically as you trade',
    ],
  },
  {
    icon: 'fa-receipt',
    title: 'Orders',
    summary: 'Place, track, and cancel orders with a real order lifecycle behind them.',
    points: [
      'Market orders that fill against the simulated last-traded price',
      'Limit orders that rest until the price is met',
      'Full status model: pending, executed, cancelled, and rejected',
      'Cancel a pending order before it fills',
      'Complete order history with timestamps and fill prices',
    ],
  },
  {
    icon: 'fa-arrow-right-arrow-left',
    title: 'Positions',
    summary: 'Open and closed positions, each carrying its own P&L story.',
    points: [
      'Open positions marked to the live simulated price',
      'Closed positions retain their realised P&L instead of vanishing',
      'Entry price, exit price, and quantity on every row',
      'Realised and unrealised kept clearly separate',
    ],
  },
  {
    icon: 'fa-wallet',
    title: 'Funds',
    summary: 'Virtual capital in, virtual capital out, with a full paper trail.',
    points: [
      'Deposit virtual funds to increase your buying power',
      'Withdraw against your available balance',
      'Transaction history for every deposit, withdrawal, and trade settlement',
      'Available margin updates as orders are placed and filled',
    ],
  },
  {
    icon: 'fa-chart-line',
    title: 'Stock details',
    summary: 'A focused page for a single instrument when you want to look closer.',
    points: [
      'Price, day range, and change for the selected symbol',
      'Price history chart from the simulated feed',
      'Add to watchlist or open an order ticket from the same page',
      'Your existing exposure to the symbol, if you hold any',
    ],
  },
];

export const Products = () => {
  useDocumentTitle('Products');

  return (
    <div className="tn-fade-in">
      <section className="tn-hero">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="tn-eyebrow mb-3">
                <i className="fa-solid fa-cubes" aria-hidden="true" />
                What is built
              </span>
              <h1 className="tn-display mb-3">Seven pieces, one coherent platform</h1>
              <p className="tn-lead mb-4">
                This is a complete description of what TradeNest actually does today — not a roadmap.
                Everything listed here is implemented and running against a simulated market feed.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Open a demo account
                </Link>
                <Link to="/pricing" className="btn btn-outline-primary btn-lg">
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tn-section tn-section-alt">
        <div className="container">
          <div className="row g-4">
            {FEATURES.map((feature) => (
              <div className="col-12 col-md-6 col-lg-4" key={feature.title}>
                <Card className="h-100" hover>
                  <CardBody>
                    <div className="tn-feature-icon">
                      <i className={`fa-solid ${feature.icon}`} aria-hidden="true" />
                    </div>
                    <h2 className="h6 mb-2">{feature.title}</h2>
                    <p className="small mb-3" style={{ color: 'var(--tn-muted)' }}>
                      {feature.summary}
                    </p>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                      {feature.points.map((point) => (
                        <li className="d-flex gap-2 small" key={point}>
                          <i
                            className="fa-solid fa-check mt-1 flex-shrink-0"
                            style={{ color: 'var(--tn-primary)', fontSize: '0.6875rem' }}
                            aria-hidden="true"
                          />
                          <span style={{ color: 'var(--tn-muted)' }}>{point}</span>
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

      <section className="tn-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <Card>
                <CardBody className="p-4 p-lg-5">
                  <div className="row g-4 align-items-center">
                    <div className="col-md-8">
                      <span className="tn-pill tn-pill-warning mb-3">
                        <i className="fa-solid fa-circle-info" aria-hidden="true" />
                        Simulated throughout
                      </span>
                      <h2 className="h5 mb-2">Real mechanics, simulated market</h2>
                      <p className="small mb-0" style={{ color: 'var(--tn-muted)' }}>
                        Order routing, fills, cost basis, and P&amp;L all behave the way you would
                        expect them to. The prices they act on are generated, not sourced from an
                        exchange. TradeNest is not a registered broker, executes no real trades, and
                        holds no real money — the capital in your account is issued by the app.
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <Link to="/register" className="btn btn-primary btn-lg w-100">
                        Try it free
                      </Link>
                      <p className="small mt-2 mb-0" style={{ color: 'var(--tn-muted)' }}>
                        No payment details needed.
                      </p>
                    </div>
                  </div>
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
              <h2 className="h3 mb-3">Ready to place your first order?</h2>
              <p className="tn-lead mb-4">
                Sign up, receive virtual capital, and every feature on this page is yours to explore.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create your account
                </Link>
                <Link to="/support" className="btn btn-outline-primary btn-lg">
                  Questions first
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
