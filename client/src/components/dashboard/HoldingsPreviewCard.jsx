import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { formatCurrency, formatSignedCurrency, pnlClass } from '../../utils/format.js';

/** Compact top-holdings table for the dashboard. */
export const HoldingsPreviewCard = ({ holdings = [], loading }) => (
  <Card className="h-100">
    <CardHeader
      title="Holdings"
      subtitle="Your largest positions"
      icon="fa-briefcase"
      action={<Link to="/holdings" className="btn btn-outline-primary btn-sm">View all</Link>}
    />

    {loading ? (
      <CardBody>
        <div className="tn-skeleton" style={{ height: 160 }} />
      </CardBody>
    ) : holdings.length ? (
      <div className="tn-table-wrap">
        <table className="tn-table">
          <thead>
            <tr>
              <th scope="col">Instrument</th>
              <th scope="col" className="text-end">Qty</th>
              <th scope="col" className="text-end">Avg</th>
              <th scope="col" className="text-end">LTP</th>
              <th scope="col" className="text-end">P&L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding._id}>
                <td>
                  <Link to={`/stocks/${holding.symbol}`} className="tn-symbol text-decoration-none">
                    {holding.symbol}
                  </Link>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{holding.sector}</div>
                </td>
                <td className="text-end tn-num">{holding.quantity}</td>
                <td className="text-end tn-num">{formatCurrency(holding.buyPrice)}</td>
                <td className="text-end tn-num">{formatCurrency(holding.currentPrice)}</td>
                <td className={`text-end tn-num fw-semibold ${pnlClass(holding.pnl)}`}>
                  {formatSignedCurrency(holding.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <EmptyState
        icon="fa-briefcase"
        title="No holdings yet"
        message="Buy your first stock and it will show up here."
        action={<Link to="/watchlist" className="btn btn-primary btn-sm">Find stocks to buy</Link>}
      />
    )}
  </Card>
);
