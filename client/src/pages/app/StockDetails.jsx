import { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  marketService,
  holdingService,
  watchlistService,
  fundService,
  orderService,
} from '../../services/trading.service.js';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../../hooks/useToast.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { QueryBoundary } from '../../components/ui/QueryBoundary.jsx';
import { PageLoader } from '../../components/ui/Loader.jsx';
import { OrderTicket } from '../../components/trading/OrderTicket.jsx';
import { StockHeader } from '../../components/stock/StockHeader.jsx';
import { MarketDataCard } from '../../components/stock/MarketDataCard.jsx';
import { YourPositionCard } from '../../components/stock/YourPositionCard.jsx';
import { SymbolOrdersCard } from '../../components/stock/SymbolOrdersCard.jsx';

export const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useDocumentTitle(symbol);

  const quoteFetcher = useCallback(() => marketService.quote(symbol), [symbol]);
  const { data: quote, loading, error, reload } = useApi(quoteFetcher);

  const holdingsFetcher = useCallback(() => holdingService.list(), []);
  const { data: holdingsData, reload: reloadHoldings } = useApi(holdingsFetcher);

  const fundsFetcher = useCallback(() => fundService.get(), []);
  const { data: funds, reload: reloadFunds } = useApi(fundsFetcher);

  const ordersFetcher = useCallback(() => orderService.list({ symbol, limit: 10 }), [symbol]);
  const { data: orders, reload: reloadOrders } = useApi(ordersFetcher);

  const watchlistFetcher = useCallback(() => watchlistService.list(), []);
  const { data: watchlist, reload: reloadWatchlist } = useApi(watchlistFetcher);

  const [ticket, setTicket] = useState({ open: false, type: 'BUY' });
  const [watching, setWatching] = useState(false);

  const holding = holdingsData?.holdings?.find((h) => h.symbol === symbol?.toUpperCase());
  const watched = watchlist?.find((w) => w.symbol === symbol?.toUpperCase());

  const toggleWatch = async () => {
    setWatching(true);
    try {
      if (watched) {
        await watchlistService.remove(watched._id);
        toast.success(`${symbol} removed from your watchlist.`);
      } else {
        await watchlistService.add({ stockName: quote.stockName, symbol: quote.symbol });
        toast.success(`${symbol} added to your watchlist.`);
      }
      reloadWatchlist();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWatching(false);
    }
  };

  if (loading) return <PageLoader label={`Loading ${symbol}…`} />;

  // Returned early rather than wrapping the page: JSX children are evaluated
  // eagerly, and everything below dereferences `quote`, which is null here.
  if (error) {
    return (
      <QueryBoundary
        error={error}
        onRetry={reload}
        errorTitle={
          error.status === 404 ? `We do not have data for ${symbol}` : 'Could not load this stock'
        }
        errorAction={
          <button type="button" className="btn btn-light btn-sm" onClick={() => navigate('/watchlist')}>
            Back to watchlist
          </button>
        }
      />
    );
  }

  return (
    <div className="tn-fade-in">
      <StockHeader
        quote={quote}
        holding={holding}
        watched={watched}
        watching={watching}
        onBuy={() => setTicket({ open: true, type: 'BUY' })}
        onSell={() => setTicket({ open: true, type: 'SELL' })}
        onToggleWatch={toggleWatch}
      />

      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <MarketDataCard quote={quote} />
        </div>

        <div className="col-12 col-lg-4">
          <YourPositionCard
            holding={holding}
            quote={quote}
            onBuy={() => setTicket({ open: true, type: 'BUY' })}
          />
        </div>

        <div className="col-12">
          <SymbolOrdersCard symbol={quote.symbol} orders={orders} />
        </div>
      </div>

      <OrderTicket
        open={ticket.open}
        stock={quote}
        defaultType={ticket.type}
        availableBalance={funds?.availableBalance}
        onClose={() => setTicket({ open: false, type: 'BUY' })}
        onPlaced={() => {
          reloadHoldings();
          reloadFunds();
          reloadOrders();
        }}
      />
    </div>
  );
};
