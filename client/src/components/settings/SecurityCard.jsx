import { Card, CardHeader, CardBody } from '../ui/Card.jsx';

const FACTS = [
  { icon: 'fa-key', text: 'Passwords are hashed with bcrypt and never stored in plain text.' },
  { icon: 'fa-cookie-bite', text: 'Your session lives in an HTTP-only cookie that page scripts cannot read.' },
  { icon: 'fa-clock', text: 'Sessions expire after 7 days of inactivity.' },
];

export const SecurityCard = () => (
  <Card className="mb-3">
    <CardHeader title="Security" icon="fa-shield-halved" />
    <CardBody>
      <ul className="list-unstyled mb-0 small">
        {FACTS.map((fact) => (
          <li key={fact.icon} className="d-flex gap-2 mb-2">
            <i className={`fa-solid ${fact.icon} text-primary mt-1`} aria-hidden="true" />
            <span className="text-muted">{fact.text}</span>
          </li>
        ))}
      </ul>
    </CardBody>
  </Card>
);
