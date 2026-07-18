import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { StatusBadge, TypeBadge } from '../trading/StatusBadge.jsx';
import { formatCurrency, formatDateTime } from '../../utils/format.js';

/** Recent orders placed for one symbol. */
export const SymbolOrdersCard = ({ symbol, orders }) => (
  <Card>
    <CardHeader
      title={`Your ${symbol} orders`}
      icon="fa-receipt"
      action={<Link to="/orders" className="btn btn-outline-primary btn-sm">All orders</Link>}
    />
    {orders?.length ? (
      <div className="tn-table-wrap">
        <table className="tn-table">
          <thead>
            <tr>
              <th scope="col">Placed</th>
              <th scope="col">Side</th>
              <th scope="col">Type</th>
              <th scope="col" className="text-end">Qty</th>
              <th scope="col" className="text-end">Price</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="small text-muted">{formatDateTime(order.createdAt)}</td>
                <td><TypeBadge type={order.type} /></td>
                <td className="small text-muted">{order.mode}</td>
                <td className="text-end tn-num">{order.quantity}</td>
                <td className="text-end tn-num">{formatCurrency(order.price)}</td>
                <td><StatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <EmptyState
        icon="fa-receipt"
        title={`No ${symbol} orders yet`}
        message="Orders you place for this stock will be listed here."
      />
    )}
  </Card>
);
