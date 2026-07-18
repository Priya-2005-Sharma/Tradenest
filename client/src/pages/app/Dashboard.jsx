import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useGreeting } from '../../hooks/useGreeting.js';
import { QueryBoundary } from '../../components/ui/QueryBoundary.jsx';
import { StatGrid } from '../../components/ui/StatGrid.jsx';
import { PortfolioChart } from '../../components/charts/PortfolioChart.jsx';
import { AllocationChart } from '../../components/charts/AllocationChart.jsx';
import {
  PortfolioValueStat,
  DayPnlStat,
  OverallPnlStat,
  InvestedStat,
} from '../../components/portfolio/PortfolioStats.jsx';
import { IndexStrip } from '../../components/dashboard/IndexStrip.jsx';
import { ChartCard } from '../../components/dashboard/ChartCard.jsx';
import { MoversCard } from '../../components/dashboard/MoversCard.jsx';
import { NewsCard } from '../../components/dashboard/NewsCard.jsx';
import { RecentOrdersCard } from '../../components/dashboard/RecentOrdersCard.jsx';
import { HoldingsPreviewCard } from '../../components/dashboard/HoldingsPreviewCard.jsx';
import { WatchlistPreviewCard } from '../../components/dashboard/WatchlistPreviewCard.jsx';
import { formatCurrency } from '../../utils/format.js';

const stockLink = (quote) => `/stocks/${quote.symbol}`;

export const Dashboard = () => {
  useDocumentTitle('Dashboard');

  const { user } = useAuth();
  const greeting = useGreeting();

  const fetcher = useCallback(() => dashboardService.get(), []);
  const { data, loading, error, reload } = useApi(fetcher);

  const summary = data?.summary;
  const funds = data?.funds;

  return (
    <QueryBoundary error={error} onRetry={reload} errorTitle="Could not load your dashboard">
      <div className="tn-fade-in">
        <header className="mb-4">
          <h1 className="h4 mb-1">
            {greeting}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted small mb-0">Here is how your portfolio is doing today.</p>
        </header>

        <StatGrid>
          <PortfolioValueStat
            summary={summary}
            loading={loading}
            hint={`${summary?.holdingsCount ?? 0} holding${summary?.holdingsCount === 1 ? '' : 's'}`}
          />
          <DayPnlStat summary={summary} loading={loading} />
          <OverallPnlStat summary={summary} loading={loading} />
          <InvestedStat
            summary={summary}
            loading={loading}
            hint={`${formatCurrency(funds?.availableBalance ?? 0)} available`}
          />
        </StatGrid>

        <IndexStrip indices={data?.indices} loading={loading} />

        <div className="row g-3">
          <div className="col-12 col-xl-8">
            <ChartCard
              title="Portfolio growth"
              subtitle="Value against invested capital, last 30 days"
              icon="fa-chart-line"
              loading={loading}
              action={<Link to="/portfolio" className="btn btn-outline-primary btn-sm">Details</Link>}
            >
              <PortfolioChart series={data?.growth || []} />
            </ChartCard>
          </div>

          <div className="col-12 col-xl-4">
            <ChartCard title="Sector allocation" icon="fa-chart-pie" loading={loading} height={240}>
              <AllocationChart data={data?.allocation || []} />
            </ChartCard>
          </div>

          <div className="col-12 col-xl-8">
            <HoldingsPreviewCard holdings={data?.holdings} loading={loading} />
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <WatchlistPreviewCard items={data?.watchlist} loading={loading} />
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <MoversCard
              title="Top gainers"
              icon="fa-arrow-trend-up"
              quotes={data?.gainers}
              loading={loading}
              linkTo={stockLink}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <MoversCard
              title="Top losers"
              icon="fa-arrow-trend-down"
              quotes={data?.losers}
              loading={loading}
              linkTo={stockLink}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <RecentOrdersCard orders={data?.recentOrders} loading={loading} />
          </div>

          <div className="col-12 col-xl-8">
            <NewsCard news={data?.news} loading={loading} />
          </div>
        </div>
      </div>
    </QueryBoundary>
  );
};
