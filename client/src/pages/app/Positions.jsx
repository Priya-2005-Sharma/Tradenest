import { useCallback, useMemo, useState } from 'react';
import { positionService } from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useConfirmAction } from '../../hooks/useConfirmAction.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card } from '../../components/ui/Card.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { StatGrid } from '../../components/ui/StatGrid.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import { QueryBoundary } from '../../components/ui/QueryBoundary.jsx';
import { PositionFormModal } from '../../components/positions/PositionFormModal.jsx';
import { ClosePositionModal } from '../../components/positions/ClosePositionModal.jsx';
import { PositionTabs } from '../../components/positions/PositionTabs.jsx';
import { createPositionColumns } from '../../components/positions/positionColumns.jsx';
import { formatSignedCurrency, pnlClass } from '../../utils/format.js';

export const Positions = () => {
  useDocumentTitle('Positions');

  const fetcher = useCallback(() => positionService.list(), []);
  const { data, loading, error, reload } = useApi(fetcher);

  const [tab, setTab] = useState('open');
  const [adding, setAdding] = useState(false);
  const [closing, setClosing] = useState(null);
  const [closeOpen, setCloseOpen] = useState(false);

  const remove = useConfirmAction({
    action: (position) => positionService.remove(position._id),
    successMessage: 'Position removed.',
    onDone: reload,
  });

  const open = data?.open || [];
  const closed = data?.closed || [];
  const rows = tab === 'open' ? open : closed;

  const openClose = useCallback((position) => {
    setClosing(position);
    setCloseOpen(true);
  }, []);

  const onClosed = useCallback(() => {
    setTab('closed');
    reload();
  }, [reload]);

  const columns = useMemo(
    () => createPositionColumns({ tab, onClose: openClose, onDelete: remove.request }),
    [tab, openClose, remove.request],
  );

  return (
    <QueryBoundary error={error} onRetry={reload} errorTitle="Could not load your positions">
      <div className="tn-fade-in">
        <PageHeader
          title="Positions"
          subtitle="Intraday and carry-forward positions, open and closed."
          action={
            <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
              <i className="fa-solid fa-plus me-2" aria-hidden="true" />
              New position
            </button>
          }
        />

        <StatGrid>
          <StatCard label="Open positions" value={open.length} icon="fa-layer-group" tone="primary" loading={loading} />
          <StatCard
            label="Open P&L"
            value={formatSignedCurrency(data?.openPnl ?? 0)}
            valueClass={pnlClass(data?.openPnl)}
            icon="fa-bolt"
            tone={Number(data?.openPnl) >= 0 ? 'profit' : 'loss'}
            loading={loading}
          />
          <StatCard label="Closed positions" value={closed.length} icon="fa-circle-check" tone="neutral" loading={loading} />
          <StatCard
            label="Booked P&L"
            value={formatSignedCurrency(data?.closedPnl ?? 0)}
            valueClass={pnlClass(data?.closedPnl)}
            icon="fa-sack-dollar"
            tone={Number(data?.closedPnl) >= 0 ? 'profit' : 'loss'}
            loading={loading}
          />
        </StatGrid>

        <Card>
          <div className="tn-card-header">
            <PositionTabs tab={tab} onChange={setTab} openCount={open.length} closedCount={closed.length} />
          </div>

          <DataTable
            columns={columns}
            rows={rows}
            loading={loading}
            empty={
              <EmptyState
                icon="fa-layer-group"
                title={tab === 'open' ? 'No open positions' : 'No closed positions'}
                message={
                  tab === 'open'
                    ? 'Open a position to track an intraday or carry-forward trade.'
                    : 'Positions you close will be listed here with their booked P&L.'
                }
                action={
                  tab === 'open' && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
                      Open a position
                    </button>
                  )
                }
              />
            }
          />
        </Card>

        <PositionFormModal open={adding} onClose={() => setAdding(false)} onSaved={reload} />

        <ClosePositionModal
          open={closeOpen}
          position={closing}
          onClose={() => setCloseOpen(false)}
          onClosed={onClosed}
        />

        <ConfirmModal
          open={Boolean(remove.target)}
          onClose={remove.cancel}
          onConfirm={remove.confirm}
          busy={remove.busy}
          title={`Delete ${remove.target?.symbol} position?`}
          message="This permanently removes the position record."
          confirmLabel="Delete"
        />
      </div>
    </QueryBoundary>
  );
};
