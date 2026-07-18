import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Card } from '../../components/ui/Card.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { StatGrid } from '../../components/ui/StatGrid.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { QueryBoundary } from '../../components/ui/QueryBoundary.jsx';
import { ChartCard } from '../../components/dashboard/ChartCard.jsx';
import { PortfolioChart } from '../../components/charts/PortfolioChart.jsx';
import { AllocationChart } from '../../components/charts/AllocationChart.jsx';
import { ProfitTrendChart } from '../../components/charts/ProfitTrendChart.jsx';
import {
  InvestedStat,
  CurrentValueStat,
  OverallPnlStat,
  DayPnlStat,
} from '../../components/portfolio/PortfolioStats.jsx';
import { PerformerCard } from '../../components/portfolio/PerformerCard.jsx';

export const Portfolio = () => {
  useDocumentTitle('Portfolio');

  const fetcher = useCallback(() => dashboardService.portfolio(), []);
  const { data, loading, error, reload } = useApi(fetcher);

  const holdings = useMemo(() => data?.holdings || [], [data]);

  // Rank by absolute impact so the biggest movers — winners or losers — lead.
  const pnlByHolding = useMemo(
    () =>
      [...holdings]
        .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
        .slice(0, 10)
        .map((holding) => ({ symbol: holding.symbol, pnl: holding.pnl })),
    [holdings],
  );

  const byReturn = useMemo(
    () => [...holdings].sort((a, b) => b.pnlPercent - a.pnlPercent),
    [holdings],
  );

  return (
    <QueryBoundary error={error} onRetry={reload} errorTitle="Could not load your portfolio">
      <div className="tn-fade-in">
        <PageHeader
          title="Portfolio"
          subtitle="A closer look at how your capital is allocated and performing."
          action={
            <Link to="/holdings" className="btn btn-outline-primary">
              Manage holdings
            </Link>
          }
        />

        <StatGrid>
          <InvestedStat summary={data?.summary} loading={loading} />
          <CurrentValueStat summary={data?.summary} loading={loading} />
          <OverallPnlStat summary={data?.summary} loading={loading} />
          <DayPnlStat summary={data?.summary} loading={loading} />
        </StatGrid>

        <div className="row g-3">
          <div className="col-12">
            <ChartCard
              title="Portfolio growth"
              subtitle="Value against invested capital, last 30 days"
              icon="fa-chart-line"
              loading={loading}
              height={300}
            >
              <PortfolioChart series={data?.growth || []} height={300} />
            </ChartCard>
          </div>

          <div className="col-12 col-lg-5">
            <ChartCard
              title="Sector allocation"
              subtitle="Where your money sits"
              icon="fa-chart-pie"
              loading={loading}
              height={240}
            >
              <AllocationChart data={data?.allocation || []} />
            </ChartCard>
          </div>

          <div className="col-12 col-lg-7">
            <ChartCard
              title="P&L by holding"
              subtitle="Your ten most impactful positions"
              icon="fa-chart-simple"
              loading={loading}
              height={240}
            >
              <ProfitTrendChart data={pnlByHolding} />
            </ChartCard>
          </div>

          {!loading && holdings.length > 0 && (
            <>
              <div className="col-12 col-md-6">
                <PerformerCard title="Best performer" icon="fa-trophy" holding={byReturn[0]} />
              </div>
              <div className="col-12 col-md-6">
                <PerformerCard
                  title="Weakest performer"
                  icon="fa-arrow-trend-down"
                  holding={byReturn[byReturn.length - 1]}
                />
              </div>
            </>
          )}

          {!loading && holdings.length === 0 && (
            <div className="col-12">
              <Card>
                <EmptyState
                  icon="fa-chart-pie"
                  title="Your portfolio is empty"
                  message="Once you own a stock, this page breaks down your allocation and performance."
                  action={<Link to="/watchlist" className="btn btn-primary btn-sm">Find stocks to buy</Link>}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </QueryBoundary>
  );
};
