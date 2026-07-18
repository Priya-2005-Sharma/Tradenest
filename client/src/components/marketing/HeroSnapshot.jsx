import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { ChangePill } from '../trading/PnL.jsx';
import { QuoteList } from '../trading/QuoteRow.jsx';

/** Live market card in the hero — doubles as a product screenshot. */
export const HeroSnapshot = ({ indices = [], gainers = [], loading }) => (
  <Card style={{ boxShadow: 'var(--tn-shadow-lg)' }}>
    <CardHeader title="Market snapshot" subtitle="Simulated, updating live" icon="fa-chart-line" />
    <CardBody>
      <div className="row g-2 mb-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key -- fixed-length placeholder
              <div className="col-6" key={i}>
                <div className="tn-skeleton" style={{ height: 58 }} />
              </div>
            ))
          : indices.map((index) => (
              <div className="col-6" key={index.name}>
                <div className="p-2 rounded h-100" style={{ background: 'var(--tn-canvas)' }}>
                  <div
                    className="text-truncate"
                    style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--tn-muted)' }}
                  >
                    {index.name}
                  </div>
                  <div className="d-flex justify-content-between align-items-center gap-1">
                    <span className="small tn-num fw-semibold" style={{ color: 'var(--tn-ink)' }}>
                      {index.value.toLocaleString('en-IN')}
                    </span>
                    <ChangePill value={index.changePercent} />
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="tn-stat-label mb-2">Top gainers</div>
      {/* No links: these visitors have no session, and the stock page is protected. */}
      <QuoteList quotes={gainers.slice(0, 4)} loading={loading} height={120} />
    </CardBody>
  </Card>
);
