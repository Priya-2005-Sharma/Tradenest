import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  settleOrder,
  shouldFillImmediately,
  resolveExecutionPrice,
} from '../services/trading.service.js';
import { getQuote } from '../services/market.service.js';

export const listOrders = asyncHandler(async (req, res) => {
  const { status, symbol, limit } = req.validated?.query || {};

  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (symbol) filter.symbol = symbol;

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit || 50);

  res.json({ success: true, data: { orders } });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');
  res.json({ success: true, data: { order } });
});

export const createOrder = asyncHandler(async (req, res) => {
  const quote = getQuote(req.body.symbol);
  if (!quote) throw ApiError.badRequest(`${req.body.symbol} is not a tradable instrument`);

  const order = await Order.create({
    ...req.body,
    user: req.user._id,
    price: req.body.mode === 'LIMIT' ? req.body.price : resolveExecutionPrice(req.body),
    status: 'PENDING',
  });

  if (shouldFillImmediately(order)) {
    try {
      await settleOrder(req.user._id, order);
    } catch (error) {
      // Keep the rejected order on record with its reason rather than dropping
      // it, so the user can see what happened in their order book.
      order.status = 'REJECTED';
      order.statusReason = error.message;
      await order.save();
      throw error;
    }
  }

  res.status(201).json({
    success: true,
    message: order.status === 'EXECUTED' ? 'Order executed' : 'Order placed and pending',
    data: { order },
  });
});

/**
 * Only PENDING orders are editable — an executed order has already moved cash
 * and holdings, so rewriting it would desync the portfolio.
 */
export const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');

  if (order.status !== 'PENDING') {
    throw ApiError.badRequest(`This order is ${order.status.toLowerCase()} and can no longer be modified`);
  }

  const { status, quantity, price } = req.body;

  if (quantity !== undefined) order.quantity = quantity;
  if (price !== undefined) order.price = price;

  if (status === 'CANCELLED') {
    order.status = 'CANCELLED';
  } else if (status === 'EXECUTED') {
    await settleOrder(req.user._id, order);
    return res.json({ success: true, message: 'Order executed', data: { order } });
  }

  await order.save();
  return res.json({ success: true, message: 'Order updated', data: { order } });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');

  // Executed orders stay in the book permanently as an audit trail.
  if (order.status === 'EXECUTED') {
    throw ApiError.badRequest('Executed orders cannot be cancelled or deleted');
  }

  if (order.status === 'PENDING') {
    order.status = 'CANCELLED';
    await order.save();
    return res.json({ success: true, message: 'Order cancelled', data: { order } });
  }

  await order.deleteOne();
  return res.json({ success: true, message: 'Order removed' });
});
