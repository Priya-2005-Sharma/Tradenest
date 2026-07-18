import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { StatusBadge, TypeBadge } from '../trading/StatusBadge.jsx';
import { formatCurrency, formatRelativeTime } from '../../utils/format.js';

export const RecentOrdersCard = ({ orders = [], loading }) => (
  <Card className="h-100">
    <CardHeader
      title="Recent orders"
      icon="fa-receipt"
      action={<Link to="/orders" className="btn btn-outline-primary btn-sm">All</Link>}
    />
    <CardBody className="pt-2">
      {loading ? (
        <div className="tn-skeleton" style={{ height: 180 }} />
      ) : orders.length ? (
        orders.map((order) => (
          <div key={order._id} className="d-flex justify-content-between align-items-center py-2 gap-2">
            <div className="min-w-0">
              <div className="d-flex align-items-center gap-2">
                <TypeBadge type={order.type} />
                <span className="small fw-semibold text-truncate" style={{ color: 'var(--tn-ink)' }}>
                  {order.symbol}
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {order.quantity} × {formatCurrency(order.price)} · {formatRelativeTime(order.createdAt)}
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>
        ))
      ) : (
        <EmptyState icon="fa-receipt" title="No orders yet" message="Your order history will appear here." />
      )}
    </CardBody>
  </Card>
);
