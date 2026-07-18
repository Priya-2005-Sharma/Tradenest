/**
 * Seeds a demo account with holdings, watchlist, orders and positions.
 *
 * Requires MONGO_URI to point at a real database — seeding is pointless against
 * the in-memory server, which lives and dies with the API process.
 *
 * Usage: npm run seed
 */
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from './logger.js';
import { User } from '../models/User.js';
import { Holding } from '../models/Holding.js';
import { Watchlist } from '../models/Watchlist.js';
import { Order } from '../models/Order.js';
import { Position } from '../models/Position.js';
import { Fund } from '../models/Fund.js';
import { Notification } from '../models/Notification.js';
import { NIFTY50 } from '../data/instruments.js';

const DEMO_EMAIL = 'demo@tradenest.app';
const DEMO_PASSWORD = 'Demo12345';

const instrument = (symbol) => NIFTY50.find((i) => i.symbol === symbol);

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const HOLDINGS = [
  { symbol: 'RELIANCE', quantity: 12, discount: 0.94, days: 96 },
  { symbol: 'TCS', quantity: 6, discount: 0.91, days: 74 },
  { symbol: 'HDFCBANK', quantity: 20, discount: 1.05, days: 61 },
  { symbol: 'INFY', quantity: 15, discount: 0.88, days: 48 },
  { symbol: 'ITC', quantity: 60, discount: 0.97, days: 35 },
  { symbol: 'TATAMOTORS', quantity: 25, discount: 1.08, days: 22 },
  { symbol: 'SUNPHARMA', quantity: 8, discount: 0.93, days: 11 },
];

const WATCHLIST = ['ICICIBANK', 'BHARTIARTL', 'MARUTI', 'TITAN', 'WIPRO', 'LT'];

const seed = async () => {
  if (!env.mongoUri) {
    logger.error(
      'MONGO_URI is not set. Seeding needs a persistent database — point MONGO_URI at a local mongod or Atlas and retry.',
    );
    process.exit(1);
  }

  await mongoose.connect(env.mongoUri);
  logger.info(`Connected to ${mongoose.connection.name}`);

  const existing = await User.findOne({ email: DEMO_EMAIL });
  if (existing) {
    await Promise.all([
      Holding.deleteMany({ user: existing._id }),
      Watchlist.deleteMany({ user: existing._id }),
      Order.deleteMany({ user: existing._id }),
      Position.deleteMany({ user: existing._id }),
      Fund.deleteMany({ user: existing._id }),
      Notification.deleteMany({ user: existing._id }),
    ]);
    await existing.deleteOne();
    logger.info('Cleared the previous demo account.');
  }

  const user = await User.create({
    name: 'Demo Trader',
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    phone: '9876543210',
  });

  const holdings = HOLDINGS.map(({ symbol, quantity, discount, days }) => {
    const meta = instrument(symbol);
    const buyPrice = Number((meta.basePrice * discount).toFixed(2));
    return {
      user: user._id,
      stockName: meta.name,
      symbol,
      quantity,
      buyPrice,
      currentPrice: meta.basePrice,
      sector: meta.sector,
      datePurchased: daysAgo(days),
    };
  });
  await Holding.insertMany(holdings);

  await Watchlist.insertMany(
    WATCHLIST.map((symbol) => {
      const meta = instrument(symbol);
      return {
        user: user._id,
        stockName: meta.name,
        symbol,
        exchange: meta.exchange,
        lastPrice: meta.basePrice,
        changePercent: 0,
      };
    }),
  );

  // Every holding gets the executed BUY that created it, so the order book
  // reconciles with the portfolio.
  const orders = holdings.map((h) => ({
    user: user._id,
    stockName: h.stockName,
    symbol: h.symbol,
    type: 'BUY',
    mode: 'MARKET',
    status: 'EXECUTED',
    quantity: h.quantity,
    price: h.buyPrice,
    executedAt: h.datePurchased,
    createdAt: h.datePurchased,
  }));

  orders.push(
    {
      user: user._id,
      stockName: instrument('WIPRO').name,
      symbol: 'WIPRO',
      type: 'BUY',
      mode: 'LIMIT',
      status: 'PENDING',
      quantity: 30,
      price: 505,
    },
    {
      user: user._id,
      stockName: instrument('MARUTI').name,
      symbol: 'MARUTI',
      type: 'BUY',
      mode: 'LIMIT',
      status: 'CANCELLED',
      quantity: 2,
      price: 10_800,
    },
  );
  await Order.insertMany(orders);

  await Position.insertMany([
    {
      user: user._id,
      stockName: instrument('TATASTEEL').name,
      symbol: 'TATASTEEL',
      product: 'MIS',
      status: 'OPEN',
      quantity: 200,
      entryPrice: 138.4,
      currentPrice: instrument('TATASTEEL').basePrice,
    },
    {
      user: user._id,
      stockName: instrument('ONGC').name,
      symbol: 'ONGC',
      product: 'CNC',
      status: 'OPEN',
      quantity: 120,
      entryPrice: 252.1,
      currentPrice: instrument('ONGC').basePrice,
    },
    {
      user: user._id,
      stockName: instrument('NTPC').name,
      symbol: 'NTPC',
      product: 'MIS',
      status: 'CLOSED',
      quantity: 80,
      entryPrice: 342.2,
      currentPrice: 361.5,
      exitPrice: 361.5,
      closedAt: daysAgo(3),
    },
  ]);

  const invested = holdings.reduce((sum, h) => sum + h.quantity * h.buyPrice, 0);
  await Fund.create({
    user: user._id,
    availableBalance: 185_400.5,
    usedMargin: 27_680,
    transactions: [
      { type: 'DEPOSIT', amount: 500_000, note: 'Initial funding', createdAt: daysAgo(120) },
      { type: 'WITHDRAWAL', amount: 75_000, note: 'Profit booking', createdAt: daysAgo(40) },
      { type: 'DEPOSIT', amount: 60_000, note: 'Monthly top-up', createdAt: daysAgo(9) },
    ],
  });

  await Notification.insertMany([
    {
      user: user._id,
      type: 'SYSTEM',
      title: 'Welcome to TradeNest',
      message: 'Your demo account is preloaded with holdings, orders and positions.',
    },
    {
      user: user._id,
      type: 'ORDER',
      title: 'BUY order executed',
      message: '8 × SUNPHARMA at ₹1,663.91',
      read: true,
    },
    {
      user: user._id,
      type: 'ALERT',
      title: 'Price alert: INFY',
      message: 'INFY moved more than 2% today.',
    },
  ]);

  logger.info(`Seeded demo account — ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  logger.info(
    `${holdings.length} holdings (₹${invested.toLocaleString('en-IN')} invested), ${orders.length} orders, 3 positions.`,
  );

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(async (error) => {
  logger.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
