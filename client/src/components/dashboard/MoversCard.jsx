import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { QuoteList } from '../trading/QuoteRow.jsx';

/**
 * Top gainers or losers. `linkTo` is passed through so the same card serves the
 * public landing page (no links) and the dashboard (links to stock details).
 */
export const MoversCard = ({ title, icon, quotes, loading, linkTo }) => (
  <Card className="h-100">
    <CardHeader title={title} icon={icon} />
    <CardBody className="pt-2">
      <QuoteList quotes={quotes} loading={loading} linkTo={linkTo} />
    </CardBody>
  </Card>
);
