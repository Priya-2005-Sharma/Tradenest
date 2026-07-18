import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { formatSignedCurrency, formatPercent, pnlClass } from '../../utils/format.js';

/** Best or weakest holding, by return. */
export const PerformerCard = ({ title, icon, holding }) => {
  if (!holding) return null;

  return (
    <Card className="h-100">
      <CardHeader title={title} icon={icon} />
      <CardBody>
        <div className="d-flex justify-content-between align-items-center">
          <div className="min-w-0">
            <Link to={`/stocks/${holding.symbol}`} className="h6 mb-1 d-block text-decoration-none">
              {holding.symbol}
            </Link>
            <div className="small text-muted text-truncate">{holding.stockName}</div>
          </div>
          <div className="text-end flex-shrink-0">
            <div className={`h5 mb-0 tn-num ${pnlClass(holding.pnl)}`}>
              {formatSignedCurrency(holding.pnl)}
            </div>
            <div className={`small ${pnlClass(holding.pnlPercent)}`}>
              {formatPercent(holding.pnlPercent)}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
