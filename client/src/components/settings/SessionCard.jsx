import { Card, CardHeader, CardBody } from '../ui/Card.jsx';

export const SessionCard = ({ onSignOut }) => (
  <Card>
    <CardHeader title="Session" icon="fa-right-from-bracket" />
    <CardBody>
      <p className="text-muted small">Sign out of TradeNest on this device.</p>
      <button type="button" className="btn btn-outline-danger w-100" onClick={onSignOut}>
        <i className="fa-solid fa-right-from-bracket me-2" aria-hidden="true" />
        Sign out
      </button>
    </CardBody>
  </Card>
);
