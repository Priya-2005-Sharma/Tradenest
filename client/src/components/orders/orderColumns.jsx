import { InstrumentCell } from '../trading/InstrumentCell.jsx';
import { RowActions } from '../ui/RowActions.jsx';
import { StatusBadge, TypeBadge } from '../trading/StatusBadge.jsx';
import { formatCurrency, formatDateTime } from '../../utils/format.js';

/**
 * Column definitions for the orders table. A factory rather than a constant
 * because the action column closes over the page's handlers.
 */
export const createOrderColumns = ({ onEdit, onExecute, onCancel }) => [
  {
    key: 'createdAt',
    header: 'Placed',
    render: (row) => <span className="small text-muted">{formatDateTime(row.createdAt)}</span>,
  },
  {
    key: 'symbol',
    header: 'Instrument',
    render: (row) => <InstrumentCell symbol={row.symbol} subtitle={row.stockName} />,
  },
  { key: 'type', header: 'Side', render: (row) => <TypeBadge type={row.type} /> },
  {
    key: 'mode',
    header: 'Type',
    render: (row) => <span className="small text-muted">{row.mode}</span>,
  },
  { key: 'quantity', header: 'Qty', align: 'right', className: 'tn-num', render: (row) => row.quantity },
  {
    key: 'price',
    header: 'Price',
    align: 'right',
    className: 'tn-num',
    render: (row) => formatCurrency(row.price),
  },
  {
    key: 'value',
    header: 'Value',
    align: 'right',
    className: 'tn-num',
    render: (row) => formatCurrency(row.quantity * row.price),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <>
        <StatusBadge status={row.status} />
        {row.statusReason && (
          <div className="text-muted mt-1" style={{ fontSize: '0.6875rem', maxWidth: 220, whiteSpace: 'normal' }}>
            {row.statusReason}
          </div>
        )}
      </>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => {
      // Executed orders are immutable — they have already moved cash and stock.
      if (row.status === 'EXECUTED') {
        return <span className="small text-muted">—</span>;
      }

      const pending = row.status === 'PENDING';

      return (
        <RowActions
          actions={[
            {
              label: 'Execute',
              variant: 'btn-buy',
              title: 'Execute this order at its limit price now',
              hidden: !pending,
              onClick: () => onExecute(row),
            },
            {
              icon: 'fa-pen',
              label: `Edit ${row.symbol} order`,
              hidden: !pending,
              onClick: () => onEdit(row),
            },
            {
              icon: pending ? 'fa-ban' : 'fa-trash',
              label: pending ? `Cancel ${row.symbol} order` : `Remove ${row.symbol} order`,
              danger: true,
              onClick: () => onCancel(row),
            },
          ]}
        />
      );
    },
  },
];
