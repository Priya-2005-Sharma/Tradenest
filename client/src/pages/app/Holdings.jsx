import { useCallback, useMemo, useState } from 'react';
import { holdingService } from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useConfirmAction } from '../../hooks/useConfirmAction.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card } from '../../components/ui/Card.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { StatGrid } from '../../components/ui/StatGrid.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import { QueryBoundary } from '../../components/ui/QueryBoundary.jsx';
import {
  InvestedStat,
  CurrentValueStat,
  DayPnlStat,
  OverallPnlStat,
} from '../../components/portfolio/PortfolioStats.jsx';
import { HoldingFormModal } from '../../components/holdings/HoldingFormModal.jsx';
import { createHoldingColumns } from '../../components/holdings/holdingColumns.jsx';

export const Holdings = () => {
  useDocumentTitle('Holdings');

  const fetcher = useCallback(() => holdingService.list(), []);
  const { data, loading, error, reload } = useApi(fetcher);

  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [query, setQuery] = useState('');

  const remove = useConfirmAction({
    action: (holding) => holdingService.remove(holding._id),
    successMessage: (holding) => `${holding.symbol} removed from your holdings.`,
    onDone: reload,
  });

  const holdings = useMemo(() => data?.holdings || [], [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return holdings;
    return holdings.filter(
      (h) => h.symbol.toLowerCase().includes(q) || h.stockName.toLowerCase().includes(q),
    );
  }, [holdings, query]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = useCallback((holding) => {
    setEditing(holding);
    setFormOpen(true);
  }, []);

  const columns = useMemo(
    () => createHoldingColumns({ onEdit: openEdit, onDelete: remove.request }),
    [openEdit, remove.request],
  );

  return (
    <QueryBoundary error={error} onRetry={reload} errorTitle="Could not load your holdings">
      <div className="tn-fade-in">
        <PageHeader
          title="Holdings"
          subtitle="Everything you own, valued at the latest price."
          action={
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <i className="fa-solid fa-plus me-2" aria-hidden="true" />
              Add holding
            </button>
          }
        />

        <StatGrid>
          <InvestedStat summary={data?.summary} loading={loading} />
          <CurrentValueStat summary={data?.summary} loading={loading} />
          <DayPnlStat summary={data?.summary} loading={loading} />
          <OverallPnlStat summary={data?.summary} loading={loading} />
        </StatGrid>

        <Card>
          <div className="tn-card-header">
            <h2 className="tn-card-title">
              {holdings.length} holding{holdings.length === 1 ? '' : 's'}
            </h2>
            <div style={{ maxWidth: 240, width: '100%' }}>
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Filter holdings…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Filter holdings"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            rows={filtered}
            loading={loading}
            empty={
              query ? (
                <EmptyState
                  icon="fa-magnifying-glass"
                  title="No matches"
                  message={`Nothing in your holdings matches “${query}”.`}
                />
              ) : (
                <EmptyState
                  icon="fa-briefcase"
                  title="No holdings yet"
                  message="Add a holding manually, or buy a stock and it will appear here automatically."
                  action={
                    <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
                      Add your first holding
                    </button>
                  }
                />
              )
            }
          />
        </Card>

        <HoldingFormModal
          open={formOpen}
          holding={editing}
          onClose={() => setFormOpen(false)}
          onSaved={reload}
        />

        <ConfirmModal
          open={Boolean(remove.target)}
          onClose={remove.cancel}
          onConfirm={remove.confirm}
          busy={remove.busy}
          title={`Remove ${remove.target?.symbol}?`}
          message={`This deletes the holding record for ${remove.target?.quantity} × ${remove.target?.symbol}. Your order history is not affected.`}
          confirmLabel="Remove holding"
        />
      </div>
    </QueryBoundary>
  );
};
