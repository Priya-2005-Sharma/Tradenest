import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useConfirmAction } from '../../hooks/useConfirmAction.js';
import { useToast } from '../../hooks/useToast.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card } from '../../components/ui/Card.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import { QueryBoundary } from '../../components/ui/QueryBoundary.jsx';
import { OrderEditModal } from '../../components/orders/OrderEditModal.jsx';
import { OrderFilterBar } from '../../components/orders/OrderFilterBar.jsx';
import { createOrderColumns } from '../../components/orders/orderColumns.jsx';

export const Orders = () => {
  useDocumentTitle('Orders');

  const toast = useToast();
  const [filter, setFilter] = useState('');

  // The fetcher must change identity when the filter does, so useApi refetches.
  const fetcher = useCallback(
    () => orderService.list(filter ? { status: filter } : undefined),
    [filter],
  );
  const { data: orders, loading, error, reload } = useApi(fetcher);

  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const cancel = useConfirmAction({
    action: (order) => orderService.cancel(order._id),
    successMessage: (order) =>
      order.status === 'PENDING' ? 'Order cancelled.' : 'Order removed from your book.',
    onDone: reload,
  });

  const counts = useMemo(() => {
    const list = orders || [];
    return {
      total: list.length,
      pending: list.filter((o) => o.status === 'PENDING').length,
    };
  }, [orders]);

  const openEdit = useCallback((order) => {
    setEditing(order);
    setEditOpen(true);
  }, []);

  const executeNow = useCallback(
    async (order) => {
      try {
        await orderService.update(order._id, { status: 'EXECUTED' });
        toast.success(`${order.symbol} order executed.`);
        reload();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [toast, reload],
  );

  const columns = useMemo(
    () => createOrderColumns({ onEdit: openEdit, onExecute: executeNow, onCancel: cancel.request }),
    [openEdit, executeNow, cancel.request],
  );

  return (
    <QueryBoundary error={error} onRetry={reload} errorTitle="Could not load your orders">
      <div className="tn-fade-in">
        <PageHeader
          title="Orders"
          subtitle="Every order you have placed, and what happened to it."
        />

        <Card>
          <div className="tn-card-header flex-wrap">
            <h2 className="tn-card-title">
              {counts.total} order{counts.total === 1 ? '' : 's'}
              {counts.pending > 0 && (
                <span className="tn-pill tn-pill-warning ms-2">{counts.pending} pending</span>
              )}
            </h2>
            <OrderFilterBar value={filter} onChange={setFilter} />
          </div>

          <DataTable
            columns={columns}
            rows={orders || []}
            loading={loading}
            empty={
              <EmptyState
                icon="fa-receipt"
                title={filter ? `No ${filter.toLowerCase()} orders` : 'No orders yet'}
                message={
                  filter
                    ? 'Try a different status filter.'
                    : 'Place your first order from the watchlist or a stock page.'
                }
                action={
                  !filter && (
                    <Link to="/watchlist" className="btn btn-primary btn-sm">
                      Go to watchlist
                    </Link>
                  )
                }
              />
            }
          />
        </Card>

        <OrderEditModal
          open={editOpen}
          order={editing}
          onClose={() => setEditOpen(false)}
          onSaved={reload}
        />

        <ConfirmModal
          open={Boolean(cancel.target)}
          onClose={cancel.cancel}
          onConfirm={cancel.confirm}
          busy={cancel.busy}
          title={cancel.target?.status === 'PENDING' ? 'Cancel this order?' : 'Remove this order?'}
          message={
            cancel.target?.status === 'PENDING'
              ? `Your pending ${cancel.target?.type} order for ${cancel.target?.quantity} × ${cancel.target?.symbol} will be cancelled.`
              : `This removes the ${cancel.target?.status?.toLowerCase()} ${cancel.target?.symbol} order from your book.`
          }
          confirmLabel={cancel.target?.status === 'PENDING' ? 'Cancel order' : 'Remove'}
        />
      </div>
    </QueryBoundary>
  );
};
