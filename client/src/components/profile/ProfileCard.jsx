import { Card, CardBody } from '../ui/Card.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { formatDate } from '../../utils/format.js';

/** Read-only identity summary beside the profile form. */
export const ProfileCard = ({ user, imageUrl, onImageError }) => (
  <Card className="h-100">
    <CardBody className="text-center">
      <Avatar
        name={user?.name}
        src={imageUrl}
        size={88}
        className="mx-auto mb-3"
        onError={onImageError}
      />
      <h2 className="h6 mb-1">{user?.name}</h2>
      <p className="text-muted small mb-3">{user?.email}</p>
      <div className="d-flex justify-content-center gap-2 flex-wrap">
        <span className="tn-pill tn-pill-primary">
          <i className="fa-solid fa-circle-check" aria-hidden="true" />
          Active
        </span>
        {user?.createdAt && (
          <span className="tn-pill tn-pill-neutral">Joined {formatDate(user.createdAt)}</span>
        )}
      </div>
    </CardBody>
  </Card>
);
