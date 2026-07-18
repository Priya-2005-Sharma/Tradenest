import { Card, CardBody } from '../ui/Card.jsx';

export const FeatureCard = ({ icon, title, text }) => (
  <Card className="h-100" hover>
    <CardBody>
      <div className="tn-feature-icon">
        <i className={`fa-solid ${icon}`} aria-hidden="true" />
      </div>
      <h3 className="h6 mb-2">{title}</h3>
      <p className="small text-muted mb-0">{text}</p>
    </CardBody>
  </Card>
);
