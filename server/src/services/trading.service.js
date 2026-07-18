import { Holding } from '../models/Holding.js';
import { Fund } from '../models/Fund.js';
import { getQuote } from './market.service.js';
import { notify } from './notification.service.js';
import { ApiError } from '../utils/ApiError.js';
import { NIFTY50 } from '../data/instruments.js';

const round = (n) => Number(n.toFixed(2));

export const getOrCreateFund = async (userId) => {
  const existing = await Fund.findOne({ user: userId });
  if (existing) return existing;
  return Fund.create({ user: userId, availableBalance: 0, transactions: [] });
};

const sectorFor = (symbol) =>
  NIFTY50.find((i) => i.symbol === symbol.toUpperCase())?.sector || 'Other';

/**
 * Settles an executed order: moves cash and adjusts the holding position.
 * Buying averages the cost basis; selling reduces quantity and closes the row
 * at zero. Validation happens before any write so a rejected order leaves no
 * partial state behind.
 */
export const settleOrder = async (userId, order) => {
  const fund = await getOrCreateFund(userId);
  const orderValue = round(order.quantity * order.price);
  const holding = await Holding.findOne({ user: userId, symbol: order.symbol });

  if (order.type === 'BUY') {
    if (fund.availableBalance < orderValue) {
      throw ApiError.badRequest(
        `Insufficient funds. This order needs ₹${orderValue.toLocaleString('en-IN')} but only ₹${fund.availableBalance.toLocaleString('en-IN')} is available.`,
      );
    }

    fund.availableBalance = round(fund.availableBalance - orderValue);
    await fund.save();

    if (holding) {
      const totalQty = holding.quantity + order.quantity;
      const totalCost = holding.quantity * holding.buyPrice + orderValue;
      holding.buyPrice = round(totalCost / totalQty);
      holding.quantity = totalQty;
      holding.currentPrice = order.price;
      await holding.save();
    } else {
      await Holding.create({
        user: userId,
        stockName: order.stockName,
        symbol: order.symbol,
        quantity: order.quantity,
        buyPrice: order.price,
        currentPrice: order.price,
        sector: sectorFor(order.symbol),
        datePurchased: new Date(),
      });
    }
  } else {
    if (!holding) {
      throw ApiError.badRequest(`You do not hold any ${order.symbol} to sell.`);
    }
    if (holding.quantity < order.quantity) {
      throw ApiError.badRequest(
        `You hold ${holding.quantity} ${order.symbol}, which is fewer than the ${order.quantity} in this order.`,
      );
    }

    fund.availableBalance = round(fund.availableBalance + orderValue);
    await fund.save();

    if (holding.quantity === order.quantity) {
      await holding.deleteOne();
    } else {
      holding.quantity -= order.quantity;
      holding.currentPrice = order.price;
      await holding.save();
    }
  }

  order.status = 'EXECUTED';
  order.executedAt = new Date();
  await order.save();

  await notify(userId, {
    type: 'ORDER',
    title: `${order.type} order executed`,
    message: `${order.quantity} × ${order.symbol} at ₹${order.price} (₹${orderValue.toLocaleString('en-IN')})`,
  });

  return order;
};

/**
 * A LIMIT order rests until the market reaches its price; a MARKET order fills
 * immediately at the live quote.
 */
export const shouldFillImmediately = (order) => {
  if (order.mode === 'MARKET') return true;

  const quote = getQuote(order.symbol);
  if (!quote) return false;

  return order.type === 'BUY' ? quote.lastPrice <= order.price : quote.lastPrice >= order.price;
};

export const resolveExecutionPrice = (order) => {
  if (order.mode === 'LIMIT') return order.price;
  const quote = getQuote(order.symbol);
  return quote?.lastPrice ?? order.price;
};
