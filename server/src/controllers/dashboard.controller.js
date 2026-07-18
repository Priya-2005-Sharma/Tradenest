import { asyncHandler } from '../utils/asyncHandler.js';
import { Watchlist } from '../models/Watchlist.js';
import {
  getAccountOverview,
  getPortfolioGrowth,
  getPricedHoldings,
} from '../services/portfolio.service.js';
import { getQuote, getMarketMovers, getIndices } from '../services/market.service.js';
import { getMarketNews } from '../data/news.js';

/**
 * Single aggregate call backing the dashboard so the page renders from one
 * round trip instead of a waterfall of eight.
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const [overview, growth, holdings, watchlist] = await Promise.all([
    getAccountOverview(req.user._id),
    getPortfolioGrowth(req.user._id, 30),
    getPricedHoldings(req.user._id),
    Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(6),
  ]);

  const movers = getMarketMovers(5);

  res.json({
    success: true,
    data: {
      summary: overview.summary,
      funds: overview.funds,
      allocation: overview.allocation,
      recentOrders: overview.recentOrders,
      growth,
      // The dashboard card shows a compact top-5 slice of the portfolio.
      holdings: holdings.slice(0, 5),
      watchlist: watchlist.map((item) => {
        const quote = getQuote(item.symbol);
        return {
          ...item.toJSON(),
          lastPrice: quote?.lastPrice ?? item.lastPrice,
          changePercent: quote?.changePercent ?? item.changePercent,
        };
      }),
      indices: getIndices(),
      gainers: movers.gainers,
      losers: movers.losers,
      news: getMarketNews(5),
    },
  });
});
