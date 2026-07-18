import { z } from 'zod';
import { ORDER_TYPES, ORDER_MODES, ORDER_STATUSES } from '../models/Order.js';
import { POSITION_STATUSES, PRODUCT_TYPES } from '../models/Position.js';

const symbol = z
  .string()
  .trim()
  .toUpperCase()
  .min(1, 'Symbol is required')
  .max(20, 'Symbol must be at most 20 characters')
  .regex(/^[A-Z0-9.\-&]+$/, 'Symbol may only contain letters, numbers, dot, dash and &');

const stockName = z.string().trim().min(1, 'Stock name is required').max(80);
const quantity = z.coerce.number().int('Quantity must be a whole number').positive('Quantity must be greater than 0');
const price = z.coerce.number().nonnegative('Price cannot be negative');

export const createHoldingSchema = z.object({
  stockName,
  symbol,
  quantity,
  buyPrice: price,
  currentPrice: price.optional(),
  sector: z.string().trim().max(40).optional(),
  datePurchased: z.coerce.date().optional(),
});

export const updateHoldingSchema = createHoldingSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Provide at least one field to update' },
);

export const createWatchlistSchema = z.object({
  stockName,
  symbol,
  exchange: z.enum(['NSE', 'BSE']).optional(),
  lastPrice: price.optional(),
  changePercent: z.coerce.number().optional(),
  notes: z.string().trim().max(240).optional(),
});

export const updateWatchlistSchema = createWatchlistSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Provide at least one field to update' },
);

export const createOrderSchema = z.object({
  stockName,
  symbol,
  type: z.enum(ORDER_TYPES),
  mode: z.enum(ORDER_MODES).optional(),
  quantity,
  price,
});

export const updateOrderSchema = z
  .object({
    quantity: quantity.optional(),
    price: price.optional(),
    status: z.enum(ORDER_STATUSES).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

export const orderQuerySchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  symbol: symbol.optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const createPositionSchema = z.object({
  stockName,
  symbol,
  product: z.enum(PRODUCT_TYPES).optional(),
  quantity,
  entryPrice: price,
  currentPrice: price.optional(),
});

export const updatePositionSchema = z
  .object({
    quantity: quantity.optional(),
    currentPrice: price.optional(),
    status: z.enum(POSITION_STATUSES).optional(),
    exitPrice: price.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  })
  .refine((data) => data.status !== 'CLOSED' || data.exitPrice !== undefined, {
    message: 'exitPrice is required when closing a position',
    path: ['exitPrice'],
  });

export const fundTransactionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0').max(10_000_000, 'Amount exceeds the per-transaction limit'),
  note: z.string().trim().max(160).optional(),
});
