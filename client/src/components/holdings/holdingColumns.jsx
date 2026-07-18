import { InstrumentCell } from '../trading/InstrumentCell.jsx';
import { RowActions } from '../ui/RowActions.jsx';
import { PnL, ChangePill } from '../trading/PnL.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

/**
 * Column definitions for the holdings table. A factory rather than a constant
 * because the action column closes over the page's handlers.
 */
export const createHoldingColumns = ({ onEdit, onDelete }) => [
  {
    key: 'symbol',
    header: 'Instrument',
    render: (row) => <InstrumentCell symbol={row.symbol} subtitle={row.stockName} />,
  },
  { key: 'quantity', header: 'Qty', align: 'right', className: 'tn-num', render: (row) => row.quantity },
  {
    key: 'buyPrice',
    header: 'Avg cost',
    align: 'right',
    className: 'tn-num',
    render: (row) => formatCurrency(row.buyPrice),
  },
  {
    key: 'currentPrice',
    header: 'LTP',
    align: 'right',
    render: (row) => (
      <>
        <div className="tn-num">{formatCurrency(row.currentPrice)}</div>
        <ChangePill value={row.dayChangePercent} />
      </>
    ),
  },
  {
    key: 'currentValue',
    header: 'Value',
    align: 'right',
    className: 'tn-num',
    render: (row) => formatCurrency(row.currentValue),
  },
  {
    key: 'pnl',
    header: 'P&L',
    align: 'right',
    render: (row) => <PnL value={row.pnl} percent={row.pnlPercent} />,
  },
  {
    key: 'datePurchased',
    header: 'Bought',
    align: 'right',
    render: (row) => <span className="small text-muted">{formatDate(row.datePurchased)}</span>,
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <RowActions
        actions={[
          { icon: 'fa-pen', label: `Edit ${row.symbol}`, onClick: () => onEdit(row) },
          { icon: 'fa-trash', label: `Delete ${row.symbol}`, danger: true, onClick: () => onDelete(row) },
        ]}
      />
    ),
  },
];
