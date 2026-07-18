import { Holding } from '../models/Holding.js';
import { Position } from '../models/Position.js';
import { Order } from '../models/Order.js';
import { Fund } from '../models/Fund.js';
import { getQuote } from './market.service.js';

const round = (n) => Number(n.toFixed(2));

/**
 * Refreshes each holding's currentPrice from the market feed. Kept separate
 * from the summary math so the same priced list feeds every consumer.
 */
export const getPricedHoldings = async (userId) => {
  const holdings = await Holding.find({ user: userId }).sort({ createdAt: -1 });

  return holdings.map((holding) => {
    const quote = getQuote(holding.symbol);
    const currentPrice = quote?.lastPrice ?? holding.currentPrice;
    const invested = holding.quantity * holding.buyPrice;
    const currentValue = holding.quantity * currentPrice;

    return {
      ...holding.toJSON(),
      currentPrice,
      dayChangePercent: quote?.changePercent ?? 0,
      dayPnl: round(holding.quantity * (quote?.change ?? 0)),
      investedValue: round(invested),
      currentValue: round(currentValue),
      pnl: round(currentValue - invested),
      pnlPercent: invested === 0 ? 0 : round(((currentValue - invested) / invested) * 100),
    };
  });
};

export const getPortfolioSummary = async (userId) => {
  const holdings = await getPricedHoldings(userId);

  const invested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const dayPnl = holdings.reduce((sum, h) => sum + h.dayPnl, 0);
  const overallPnl = currentValue - invested;

  return {
    invested: round(invested),
    currentValue: round(currentValue),
    dayPnl: round(dayPnl),
    dayPnlPercent: currentValue === 0 ? 0 : round((dayPnl / currentValue) * 100),
    overallPnl: round(overallPnl),
    overallPnlPercent: invested === 0 ? 0 : round((overallPnl / invested) * 100),
    holdingsCount: holdings.length,
  };
};

export const getSectorAllocation = async (userId) => {
  const holdings = await getPricedHoldings(userId);
  const total = holdings.reduce((sum, h) => sum + h.currentValue, 0);

  const bySector = holdings.reduce((acc, h) => {
    const sector = h.sector || 'Other';
    acc[sector] = (acc[sector] || 0) + h.currentValue;
    return acc;
  }, {});

  return Object.entries(bySector)
    .map(([sector, value]) => ({
      sector,
      value: round(value),
      percent: total === 0 ? 0 : round((value / total) * 100),
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Reconstructs portfolio value day by day from current holdings and their
 * purchase dates. Holdings are the source of truth for invested capital
 * regardless of whether they arrived via an order or were entered directly,
 * so the chart stays correct for both paths.
 *
 * Each holding's return is eased in linearly from its purchase date to today,
 * which makes the final point equal the real current value while giving the
 * intermediate days a plausible shape.
 */
export const getPortfolioGrowth = async (userId, days = 30) => {
  const holdings = await getPricedHoldings(userId);
  if (holdings.length === 0) return [];

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const series = [];
  for (let i = days; i >= 0; i -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    day.setHours(23, 59, 59, 999);

    let invested = 0;
    let value = 0;

    for (const holding of holdings) {
      const purchased = new Date(holding.datePurchased);
      if (purchased > day) continue;

      const totalSpan = today - purchased;
      const elapsed = day - purchased;
      const progress = totalSpan <= 0 ? 1 : Math.min(elapsed / totalSpan, 1);

      // Interpolate the rupee P&L rather than the rounded pnlPercent, so the
      // final point lands exactly on the reported current value.
      invested += holding.investedValue;
      value += holding.investedValue + (holding.currentValue - holding.investedValue) * progress;
    }

    // Skip leading days before the first purchase — an empty chart head is
    // noise, not information.
    if (invested === 0 && series.length === 0) continue;

    series.push({
      date: day.toISOString().slice(0, 10),
      invested: round(invested),
      value: round(value),
    });
  }

  return series;
};

export const getPositionsSummary = async (userId) => {
  const positions = await Position.find({ user: userId });

  const priced = positions.map((position) => {
    const quote = getQuote(position.symbol);
    const currentPrice =
      position.status === 'OPEN' ? quote?.lastPrice ?? position.currentPrice : position.currentPrice;
    const exit = position.status === 'CLOSED' ? position.exitPrice : currentPrice;
    return {
      ...position.toJSON(),
      currentPrice,
      pnl: round(position.quantity * (exit - position.entryPrice)),
    };
  });

  const open = priced.filter((p) => p.status === 'OPEN');
  const closed = priced.filter((p) => p.status === 'CLOSED');

  return {
    open,
    closed,
    openPnl: round(open.reduce((sum, p) => sum + p.pnl, 0)),
    closedPnl: round(closed.reduce((sum, p) => sum + p.pnl, 0)),
  };
};

export const getAccountOverview = async (userId) => {
  const [summary, fund, allocation, recentOrders] = await Promise.all([
    getPortfolioSummary(userId),
    Fund.findOne({ user: userId }),
    getSectorAllocation(userId),
    Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
  ]);

  return {
    summary,
    allocation,
    recentOrders,
    funds: {
      availableBalance: round(fund?.availableBalance ?? 0),
      usedMargin: round(fund?.usedMargin ?? 0),
    },
  };
};
