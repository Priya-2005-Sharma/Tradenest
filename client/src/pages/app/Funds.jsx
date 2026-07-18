import { useCallback, useMemo, useState } from 'react';
import { fundService } from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { QueryBoundary } from '../../components/ui/QueryBoundary.jsx';
import { FundsSummary } from '../../components/funds/FundsSummary.jsx';
import { FundActionModal } from '../../components/funds/FundActionModal.jsx';
import { createTransactionColumns } from '../../components/funds/fundTransactionColumns.jsx';

export const Funds = () => {
  useDocumentTitle('Funds');

  const fetcher = useCallback(() => fundService.get(), []);
  const { data: funds, loading, error, reload } = useApi(fetcher);

  const [action, setAction] = useState(null); // 'deposit' | 'withdraw'

  const columns = useMemo(() => createTransactionColumns(), []);

  return (
    <QueryBoundary error={error} onRetry={reload} errorTitle="Could not load your funds">
      <div className="tn-fade-in">
        <PageHeader
          title="Funds"
          subtitle="Your trading balance and every movement in and out."
          action={
            <>
              <button type="button" className="btn btn-buy" onClick={() => setAction('deposit')}>
                <i className="fa-solid fa-plus me-2" aria-hidden="true" />
                Add funds
              </button>
              <button type="button" className="btn btn-outline-primary" onClick={() => setAction('withdraw')}>
                Withdraw
              </button>
            </>
          }
        />

        <div className="alert alert-primary d-flex align-items-start gap-2 py-2 px-3 small" role="note">
          <i className="fa-solid fa-circle-info mt-1" aria-hidden="true" />
          <span>
            This is virtual capital for a simulated market. No real money moves, and no payment
            details are ever collected.
          </span>
        </div>

        <FundsSummary funds={funds} loading={loading} />

        <Card>
          <CardHeader
            title="Transaction history"
            subtitle="Your 50 most recent movements"
            icon="fa-clock-rotate-left"
          />
          <DataTable
            columns={columns}
            rows={funds?.transactions || []}
            rowKey={(row) => row._id}
            loading={loading}
            empty={
              <EmptyState
                icon="fa-receipt"
                title="No transactions yet"
                message="Deposits and withdrawals will be listed here."
              />
            }
          />
        </Card>

        <FundActionModal
          open={Boolean(action)}
          action={action}
          funds={funds}
          onClose={() => setAction(null)}
          onDone={reload}
        />
      </div>
    </QueryBoundary>
  );
};
