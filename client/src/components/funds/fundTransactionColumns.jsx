import { formatCurrency, formatDateTime } from '../../utils/format.js';

/** Column definitions for the fund transaction history table. */
export const createTransactionColumns = () => [
  {
    key: 'createdAt',
    header: 'Date',
    render: (row) => <span className="small text-muted">{formatDateTime(row.createdAt)}</span>,
  },
  {
    key: 'type',
    header: 'Type',
    render: (row) => (
      <span className={`tn-pill ${row.type === 'DEPOSIT' ? 'tn-pill-profit' : 'tn-pill-loss'}`}>
        <i
          className={`fa-solid ${row.type === 'DEPOSIT' ? 'fa-arrow-down' : 'fa-arrow-up'}`}
          aria-hidden="true"
        />
        {row.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
      </span>
    ),
  },
  {
    key: 'note',
    header: 'Note',
    render: (row) => <span className="small text-muted">{row.note || '—'}</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (row) => (
      <span className={`tn-num fw-semibold ${row.type === 'DEPOSIT' ? 'tn-profit' : 'tn-loss'}`}>
        {row.type === 'DEPOSIT' ? '+' : '−'}
        {formatCurrency(row.amount)}
      </span>
    ),
  },
];
