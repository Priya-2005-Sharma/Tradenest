import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    stockName: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, trim: true, uppercase: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    buyPrice: { type: Number, required: true, min: [0, 'Buy price cannot be negative'] },
    currentPrice: { type: Number, required: true, min: [0, 'Current price cannot be negative'] },
    sector: { type: String, trim: true, default: 'Other' },
    datePurchased: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// One row per symbol per user; buying more updates quantity and average price.
holdingSchema.index({ user: 1, symbol: 1 }, { unique: true });

holdingSchema.virtual('investedValue').get(function investedValue() {
  return this.quantity * this.buyPrice;
});

holdingSchema.virtual('currentValue').get(function currentValue() {
  return this.quantity * this.currentPrice;
});

holdingSchema.virtual('pnl').get(function pnl() {
  return this.quantity * (this.currentPrice - this.buyPrice);
});

holdingSchema.virtual('pnlPercent').get(function pnlPercent() {
  const invested = this.quantity * this.buyPrice;
  if (invested === 0) return 0;
  return ((this.currentPrice - this.buyPrice) / this.buyPrice) * 100;
});

export const Holding = mongoose.model('Holding', holdingSchema);
