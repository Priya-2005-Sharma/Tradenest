import { Card } from '../ui/Card.jsx';
import { ChangePill } from '../trading/PnL.jsx';

/** Row of market index tiles (NIFTY, SENSEX, …). */
export const IndexStrip = ({ indices = [], loading }) => (
  <div className="row g-3 mb-3">
    {loading
      ? Array.from({ length: 4 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key -- fixed-length placeholder
          <div className="col-6 col-lg-3" key={i}>
            <div className="tn-skeleton" style={{ height: 66 }} />
          </div>
        ))
      : indices.map((index) => (
          <div className="col-6 col-lg-3" key={index.name}>
            <Card className="h-100">
              <div className="tn-card-body py-3 d-flex justify-content-between align-items-center gap-2">
                <div className="min-w-0">
                  <div className="small fw-semibold text-truncate" style={{ color: 'var(--tn-ink)' }}>
                    {index.name}
                  </div>
                  <div className="tn-num text-muted" style={{ fontSize: '0.8125rem' }}>
                    {index.value.toLocaleString('en-IN')}
                  </div>
                </div>
                <ChangePill value={index.changePercent} />
              </div>
            </Card>
          </div>
        ))}
  </div>
);
