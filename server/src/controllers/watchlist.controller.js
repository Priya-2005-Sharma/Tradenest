import { Watchlist } from '../models/Watchlist.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getQuote } from '../services/market.service.js';

/** Overlays live quotes so the stored row never goes stale in the UI. */
const withQuote = (item) => {
  const quote = getQuote(item.symbol);
  return {
    ...item.toJSON(),
    lastPrice: quote?.lastPrice ?? item.lastPrice,
    changePercent: quote?.changePercent ?? item.changePercent,
    change: quote?.change ?? 0,
  };
};

export const listWatchlist = asyncHandler(async (req, res) => {
  const items = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { watchlist: items.map(withQuote) } });
});

export const addToWatchlist = asyncHandler(async (req, res) => {
  const { symbol } = req.body;

  const duplicate = await Watchlist.findOne({ user: req.user._id, symbol });
  if (duplicate) throw ApiError.conflict(`${symbol} is already on your watchlist`);

  const quote = getQuote(symbol);
  const item = await Watchlist.create({
    ...req.body,
    user: req.user._id,
    lastPrice: req.body.lastPrice ?? quote?.lastPrice ?? 0,
    changePercent: req.body.changePercent ?? quote?.changePercent ?? 0,
    exchange: req.body.exchange ?? quote?.exchange ?? 'NSE',
  });

  res.status(201).json({ success: true, message: 'Added to watchlist', data: { item: withQuote(item) } });
});

export const updateWatchlistItem = asyncHandler(async (req, res) => {
  const item = await Watchlist.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) throw ApiError.notFound('Watchlist item not found');

  if (req.body.symbol && req.body.symbol !== item.symbol) {
    const duplicate = await Watchlist.findOne({
      user: req.user._id,
      symbol: req.body.symbol,
      _id: { $ne: item._id },
    });
    if (duplicate) throw ApiError.conflict(`${req.body.symbol} is already on your watchlist`);
  }

  Object.assign(item, req.body);
  await item.save();

  res.json({ success: true, message: 'Watchlist updated', data: { item: withQuote(item) } });
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
  const item = await Watchlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) throw ApiError.notFound('Watchlist item not found');
  res.json({ success: true, message: 'Removed from watchlist' });
});
