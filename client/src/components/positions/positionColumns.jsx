import { InstrumentCell } from '../trading/InstrumentCell.jsx';
import { RowActions } from '../ui/RowActions.jsx';
import { PnL } from '../trading/PnL.jsx';
import { StatusBadge } from '../trading/StatusBadge.jsx';
import { formatCurrency, formatDateTime } from '../../utils/format.js';

/**
 * Column definitions for the positions table. `tab` is a dependency, not just
 * the page's filter: the price column shows the live LTP while open and the
 * booked exit price once closed.
 */
export const createPositionColumns = ({ tab, onClose, onDelete }) => [
  {
    key: 'symbol',
    header: 'Instrument',
    render: (row) => <InstrumentCell symbol={row.symbol} subtitle={row.stockName} />,
  },
  {
    key: 'product',
    header: 'Product',
    render: (row) => <span className="tn-pill tn-pill-neutral">{row.product}</span>,
  },
  { key: 'quantity', header: 'Qty', align: 'right', className: 'tn-num', render: (row) => row.quantity },
  {
    key: 'entryPrice',
    header: 'Entry',
    align: 'right',
    className: 'tn-num',
    render: (row) => formatCurrency(row.entryPrice),
  },
  {
    key: 'currentPrice',
    header: tab === 'open' ? 'LTP' : 'Exit',
    align: 'right',
    className: 'tn-num',
    render: (row) => formatCurrency(row.status === 'CLOSED' ? row.exitPrice : row.currentPrice),
  },
  {
    key: 'pnl',
    header: 'P&L',
    align: 'right',
    render: (row) => <PnL value={row.pnl} percent={row.pnlPercent} />,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <>
        <StatusBadge status={row.status} />
        {row.closedAt && (
          <div className="text-muted" style={{ fontSize: '0.6875rem' }}>{formatDateTime(row.closedAt)}</div>
        )}
      </>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <RowActions
        actions={[
          {
            label: 'Close',
            variant: 'btn-sell',
            hidden: row.status !== 'OPEN',
            onClick: () => onClose(row),
          },
          {
            icon: 'fa-trash',
            label: `Delete ${row.symbol} position`,
            danger: true,
            onClick: () => onDelete(row),
          },
        ]}
      />
    ),
  },
];
