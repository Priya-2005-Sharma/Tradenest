import { useCallback, useMemo, useState } from 'react';
import { watchlistService, fundService } from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useConfirmAction } from '../../hooks/useConfirmAction.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card } from '../../components/ui/Card.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import { QueryBoundary } from '../../components/ui/QueryBoundary.jsx';
import { OrderTicket } from '../../components/trading/OrderTicket.jsx';
import { AddToWatchlistModal } from '../../components/watchlist/AddToWatchlistModal.jsx';
import { WatchlistNoteModal } from '../../components/watchlist/WatchlistNoteModal.jsx';
import { createWatchlistColumns } from '../../components/watchlist/watchlistColumns.jsx';

const CLOSED_TICKET = { open: false, stock: null, type: 'BUY' };

export const Watchlist = () => {
  useDocumentTitle('Watchlist');

  const listFetcher = useCallback(() => watchlistService.list(), []);
  const { data: items, loading, error, reload } = useApi(listFetcher);

  const fundsFetcher = useCallback(() => fundService.get(), []);
  const { data: funds, reload: reloadFunds } = useApi(fundsFetcher);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [ticket, setTicket] = useState(CLOSED_TICKET);

  const remove = useConfirmAction({
    action: (item) => watchlistService.remove(item._id),
    successMessage: (item) => `${item.symbol} removed from your watchlist.`,
    onDone: reload,
  });

  const columns = useMemo(
    () =>
      createWatchlistColumns({
        onBuy: (row) => setTicket({ open: true, stock: row, type: 'BUY' }),
        onSell: (row) => setTicket({ open: true, stock: row, type: 'SELL' }),
        onEditNote: setEditing,
        onRemove: remove.request,
      }),
    [remove.request],
  );

  return (
    <QueryBoundary error={error} onRetry={reload} errorTitle="Could not load your watchlist">
      <div className="tn-fade-in">
        <PageHeader
          title="Watchlist"
          subtitle="Track the stocks you care about and trade them in one click."
          action={
            <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
              <i className="fa-solid fa-plus me-2" aria-hidden="true" />
              Add stock
            </button>
          }
        />

        <Card>
          <div className="tn-card-header">
            <h2 className="tn-card-title">
              {items?.length || 0} stock{items?.length === 1 ? '' : 's'} tracked
            </h2>
            <span className="small text-muted">Prices are simulated</span>
          </div>
          <DataTable
            columns={columns}
            rows={items || []}
            loading={loading}
            empty={
              <EmptyState
                icon="fa-star"
                title="Your watchlist is empty"
                message="Add the stocks you want to follow and their prices will update here."
                action={
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
                    Add your first stock
                  </button>
                }
              />
            }
          />
        </Card>

        <AddToWatchlistModal open={adding} onClose={() => setAdding(false)} onAdded={reload} />

        <WatchlistNoteModal
          open={Boolean(editing)}
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={reload}
        />

        <ConfirmModal
          open={Boolean(remove.target)}
          onClose={remove.cancel}
          onConfirm={remove.confirm}
          busy={remove.busy}
          title={`Remove ${remove.target?.symbol}?`}
          message="This only removes it from your watchlist. Any holdings or orders are unaffected."
          confirmLabel="Remove"
        />

        <OrderTicket
          open={ticket.open}
          stock={ticket.stock}
          defaultType={ticket.type}
          availableBalance={funds?.availableBalance}
          onClose={() => setTicket(CLOSED_TICKET)}
          onPlaced={() => {
            reload();
            reloadFunds();
          }}
        />
      </div>
    </QueryBoundary>
  );
};
