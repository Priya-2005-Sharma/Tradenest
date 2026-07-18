import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { QuoteList } from '../trading/QuoteRow.jsx';

export const WatchlistPreviewCard = ({ items = [], loading }) => (
  <Card className="h-100">
    <CardHeader
      title="Watchlist"
      icon="fa-star"
      action={<Link to="/watchlist" className="btn btn-outline-primary btn-sm">Open</Link>}
    />
    <CardBody className="pt-2">
      {!loading && items.length === 0 ? (
        <EmptyState
          icon="fa-star"
          title="Your watchlist is empty"
          message="Track stocks you are interested in."
          action={<Link to="/watchlist" className="btn btn-primary btn-sm">Add stocks</Link>}
        />
      ) : (
        <QuoteList quotes={items} loading={loading} linkTo={(q) => `/stocks/${q.symbol}`} />
      )}
    </CardBody>
  </Card>
);
