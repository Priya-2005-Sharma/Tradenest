import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {
  getQuote,
  getAllQuotes,
  getMarketMovers,
  getIndices,
  searchInstruments,
} from '../services/market.service.js';
import { getMarketNews } from '../data/news.js';

export const listInstruments = asyncHandler(async (req, res) => {
  const { q, limit } = req.query;
  const instruments = q ? searchInstruments(q, Number(limit) || 12) : getAllQuotes();
  res.json({ success: true, data: { instruments } });
});

export const getInstrumentQuote = asyncHandler(async (req, res) => {
  const quote = getQuote(req.params.symbol);
  if (!quote) throw ApiError.notFound(`No instrument found for symbol ${req.params.symbol}`);
  res.json({ success: true, data: { quote } });
});

export const getMovers = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: getMarketMovers(5) });
});

export const getOverview = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: { indices: getIndices(), ...getMarketMovers(5), news: getMarketNews(6) },
  });
});

export const getNews = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { news: getMarketNews(12) } });
});
