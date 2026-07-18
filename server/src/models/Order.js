import mongoose from 'mongoose';

export const ORDER_TYPES = ['BUY', 'SELL'];
export const ORDER_MODES = ['MARKET', 'LIMIT'];
export const ORDER_STATUSES = ['PENDING', 'EXECUTED', 'CANCELLED', 'REJECTED'];

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    stockName: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, trim: true, uppercase: true },
    type: { type: String, enum: ORDER_TYPES, required: true },
    mode: { type: String, enum: ORDER_MODES, default: 'MARKET' },
    status: { type: String, enum: ORDER_STATUSES, default: 'PENDING', index: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
    executedAt: { type: Date, default: null },
    // Populated when an order is rejected so the UI can explain why.
    statusReason: { type: String, default: '' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

orderSchema.index({ user: 1, createdAt: -1 });

orderSchema.virtual('orderValue').get(function orderValue() {
  return this.quantity * this.price;
});

export const Order = mongoose.model('Order', orderSchema);
