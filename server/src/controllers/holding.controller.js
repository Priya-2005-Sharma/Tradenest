import { Holding } from '../models/Holding.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getPricedHoldings,
  getPortfolioSummary,
  getSectorAllocation,
  getPortfolioGrowth,
} from '../services/portfolio.service.js';
import { getQuote } from '../services/market.service.js';

export const listHoldings = asyncHandler(async (req, res) => {
  const [holdings, summary] = await Promise.all([
    getPricedHoldings(req.user._id),
    getPortfolioSummary(req.user._id),
  ]);
  res.json({ success: true, data: { holdings, summary } });
});

export const getPortfolio = asyncHandler(async (req, res) => {
  const [summary, allocation, growth, holdings] = await Promise.all([
    getPortfolioSummary(req.user._id),
    getSectorAllocation(req.user._id),
    getPortfolioGrowth(req.user._id, 30),
    getPricedHoldings(req.user._id),
  ]);
  res.json({ success: true, data: { summary, allocation, growth, holdings } });
});

export const createHolding = asyncHandler(async (req, res) => {
  const { symbol } = req.body;

  const duplicate = await Holding.findOne({ user: req.user._id, symbol });
  if (duplicate) {
    throw ApiError.conflict(
      `You already hold ${symbol}. Edit that holding or place a buy order to add more.`,
    );
  }

  const quote = getQuote(symbol);
  const holding = await Holding.create({
    ...req.body,
    user: req.user._id,
    currentPrice: req.body.currentPrice ?? quote?.lastPrice ?? req.body.buyPrice,
    sector: req.body.sector ?? quote?.sector ?? 'Other',
  });

  res.status(201).json({ success: true, message: 'Holding added', data: { holding } });
});

export const updateHolding = asyncHandler(async (req, res) => {
  const holding = await Holding.findOne({ _id: req.params.id, user: req.user._id });
  if (!holding) throw ApiError.notFound('Holding not found');

  if (req.body.symbol && req.body.symbol !== holding.symbol) {
    const duplicate = await Holding.findOne({
      user: req.user._id,
      symbol: req.body.symbol,
      _id: { $ne: holding._id },
    });
    if (duplicate) throw ApiError.conflict(`You already hold ${req.body.symbol}`);
  }

  Object.assign(holding, req.body);
  await holding.save();

  res.json({ success: true, message: 'Holding updated', data: { holding } });
});

export const deleteHolding = asyncHandler(async (req, res) => {
  const holding = await Holding.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!holding) throw ApiError.notFound('Holding not found');
  res.json({ success: true, message: 'Holding removed' });
});
