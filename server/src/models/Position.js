import mongoose from 'mongoose';

export const POSITION_STATUSES = ['OPEN', 'CLOSED'];
export const PRODUCT_TYPES = ['MIS', 'CNC', 'NRML'];

const positionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    stockName: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, trim: true, uppercase: true },
    product: { type: String, enum: PRODUCT_TYPES, default: 'MIS' },
    status: { type: String, enum: POSITION_STATUSES, default: 'OPEN', index: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    entryPrice: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, required: true, min: 0 },
    exitPrice: { type: Number, default: null, min: 0 },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

positionSchema.index({ user: 1, status: 1 });

positionSchema.virtual('pnl').get(function pnl() {
  const exit = this.status === 'CLOSED' ? this.exitPrice : this.currentPrice;
  if (exit === null || exit === undefined) return 0;
  return this.quantity * (exit - this.entryPrice);
});

positionSchema.virtual('pnlPercent').get(function pnlPercent() {
  const exit = this.status === 'CLOSED' ? this.exitPrice : this.currentPrice;
  if (!this.entryPrice || exit === null || exit === undefined) return 0;
  return ((exit - this.entryPrice) / this.entryPrice) * 100;
});

export const Position = mongoose.model('Position', positionSchema);
