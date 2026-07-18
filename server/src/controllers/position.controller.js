import { Position } from '../models/Position.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPositionsSummary } from '../services/portfolio.service.js';
import { getQuote } from '../services/market.service.js';

export const listPositions = asyncHandler(async (req, res) => {
  const summary = await getPositionsSummary(req.user._id);
  res.json({ success: true, data: summary });
});

export const createPosition = asyncHandler(async (req, res) => {
  const quote = getQuote(req.body.symbol);

  const position = await Position.create({
    ...req.body,
    user: req.user._id,
    currentPrice: req.body.currentPrice ?? quote?.lastPrice ?? req.body.entryPrice,
    status: 'OPEN',
  });

  res.status(201).json({ success: true, message: 'Position opened', data: { position } });
});

export const updatePosition = asyncHandler(async (req, res) => {
  const position = await Position.findOne({ _id: req.params.id, user: req.user._id });
  if (!position) throw ApiError.notFound('Position not found');

  if (position.status === 'CLOSED') {
    throw ApiError.badRequest('This position is already closed');
  }

  const { status, exitPrice, quantity, currentPrice } = req.body;

  if (quantity !== undefined) position.quantity = quantity;
  if (currentPrice !== undefined) position.currentPrice = currentPrice;

  if (status === 'CLOSED') {
    position.status = 'CLOSED';
    position.exitPrice = exitPrice;
    position.currentPrice = exitPrice;
    position.closedAt = new Date();
  }

  await position.save();
  res.json({
    success: true,
    message: status === 'CLOSED' ? 'Position closed' : 'Position updated',
    data: { position },
  });
});

export const deletePosition = asyncHandler(async (req, res) => {
  const position = await Position.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!position) throw ApiError.notFound('Position not found');
  res.json({ success: true, message: 'Position removed' });
});
