import { Card, CardHeader, CardBody } from '../ui/Card.jsx';

/**
 * A chart in a card, with a skeleton sized to the chart so the layout does not
 * jump when data lands.
 */
export const ChartCard = ({ title, subtitle, icon, action, loading, height = 260, children }) => (
  <Card className="h-100">
    <CardHeader title={title} subtitle={subtitle} icon={icon} action={action} />
    <CardBody>
      {loading ? <div className="tn-skeleton" style={{ height }} /> : children}
    </CardBody>
  </Card>
);
