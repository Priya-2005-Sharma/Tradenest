import { InstrumentCell } from '../trading/InstrumentCell.jsx';
import { RowActions } from '../ui/RowActions.jsx';
import { ChangePill } from '../trading/PnL.jsx';
import { formatCurrency } from '../../utils/format.js';

const NOTE_LIMIT = 40;

/**
 * Column definitions for the watchlist table. A factory rather than a constant
 * because the action column closes over the page's handlers.
 */
export const createWatchlistColumns = ({ onBuy, onSell, onEditNote, onRemove }) => [
  {
    key: 'symbol',
    header: 'Instrument',
    render: (row) => (
      <InstrumentCell symbol={row.symbol} subtitle={`${row.stockName} · ${row.exchange}`} />
    ),
  },
  {
    key: 'lastPrice',
    header: 'LTP',
    align: 'right',
    className: 'tn-num',
    render: (row) => formatCurrency(row.lastPrice),
  },
  {
    key: 'changePercent',
    header: 'Change',
    align: 'right',
    render: (row) => <ChangePill value={row.changePercent} />,
  },
  {
    key: 'notes',
    header: 'Note',
    render: (row) =>
      row.notes ? (
        <span className="small text-muted" title={row.notes}>
          {row.notes.length > NOTE_LIMIT ? `${row.notes.slice(0, NOTE_LIMIT)}…` : row.notes}
        </span>
      ) : (
        <span className="small text-muted fst-italic">—</span>
      ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <RowActions
        actions={[
          { label: 'Buy', variant: 'btn-buy', onClick: () => onBuy(row) },
          { label: 'Sell', variant: 'btn-sell', onClick: () => onSell(row) },
          { icon: 'fa-pen', label: `Add a note to ${row.symbol}`, onClick: () => onEditNote(row) },
          { icon: 'fa-trash', label: `Remove ${row.symbol}`, danger: true, onClick: () => onRemove(row) },
        ]}
      />
    ),
  },
];
